'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface StripeContextType {
  stripePublicKey: string | null
  isLoading: boolean
  error: string | null
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const [stripePublicKey, setStripePublicKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Get Stripe public key from environment or API
        const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
        
        if (publicKey) {
          setStripePublicKey(publicKey)
        } else {
          // Fallback: fetch from API
          const response = await fetch('/api/payment/stripe/config')
          const result = await response.json()
          
          if (result.success && result.data.public_key) {
            setStripePublicKey(result.data.public_key)
          } else {
            setError('Failed to load Stripe configuration')
          }
        }
      } catch (error) {
        console.error('Error initializing Stripe:', error)
        setError('Failed to initialize Stripe')
      } finally {
        setIsLoading(false)
      }
    }

    initializeStripe()
  }, [])

  const value: StripeContextType = {
    stripePublicKey,
    isLoading,
    error
  }

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  )
}

export function useStripe() {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}
