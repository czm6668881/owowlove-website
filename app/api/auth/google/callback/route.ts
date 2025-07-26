import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { sign } from 'jsonwebtoken'
import { UserService } from '@/lib/data/users'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
)

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/login?error=oauth_error`)
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/login?error=missing_code`)
    }

    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code)
    client.setCredentials(tokens)

    // Get user info from Google
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      throw new Error('Failed to get user payload from Google')
    }

    const googleUser = {
      id: payload.sub,
      email: payload.email!,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      picture: payload.picture || '',
      emailVerified: payload.email_verified || false
    }

    // Check if user exists in our database
    let user = await UserService.findUserByEmail(googleUser.email)

    if (!user) {
      // Create new user with Google OAuth data
      const newUserData = {
        email: googleUser.email,
        password: '', // No password for OAuth users
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        acceptTerms: true, // Assume terms accepted for OAuth
        googleId: googleUser.id,
        picture: googleUser.picture,
        isEmailVerified: googleUser.emailVerified
      }

      const { user: createdUser, error: createError } = await UserService.registerUser(newUserData)
      
      if (createError || !createdUser) {
        console.error('Failed to create Google OAuth user:', createError)
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/login?error=registration_failed`)
      }

      user = createdUser
    } else {
      // Update existing user with Google data if needed
      if (!user.googleId) {
        await UserService.updateUser(user.id, {
          googleId: googleUser.id,
          picture: googleUser.picture,
          isEmailVerified: googleUser.emailVerified
        })
      }
    }

    // Generate JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      },
      JWT_SECRET
    )

    // Redirect to success page with token
    const redirectUrl = new URL(`${process.env.NEXTAUTH_URL}/en/login/success`)
    redirectUrl.searchParams.set('token', token)
    
    return NextResponse.redirect(redirectUrl.toString())

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/login?error=oauth_callback_failed`)
  }
}
