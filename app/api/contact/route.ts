import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  status: 'new' | 'read' | 'replied'
}

const MESSAGES_FILE = path.join(process.cwd(), 'data', 'contact-messages.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load messages from file
async function loadMessages(): Promise<ContactMessage[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(MESSAGES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

// Save messages to file
async function saveMessages(messages: ContactMessage[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2))
}

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Load existing messages
    const messages = await loadMessages()

    // Create new message
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'new'
    }

    // Add to messages array
    messages.unshift(newMessage) // Add to beginning

    // Keep only last 1000 messages to prevent file from growing too large
    if (messages.length > 1000) {
      messages.splice(1000)
    }

    // Save messages
    await saveMessages(messages)

    // TODO: Send email notification to admin
    // You can integrate with your email service here
    console.log('New contact message received:', {
      id: newMessage.id,
      name: newMessage.name,
      email: newMessage.email,
      subject: newMessage.subject
    })

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: newMessage.id,
        createdAt: newMessage.createdAt
      }
    })

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Retrieve contact messages (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Load messages
    let messages = await loadMessages()

    // Filter by status if provided
    if (status && status !== 'all') {
      messages = messages.filter(msg => msg.status === status)
    }

    // Apply pagination
    const total = messages.length
    const paginatedMessages = messages.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: {
        messages: paginatedMessages,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    })

  } catch (error) {
    console.error('Error retrieving contact messages:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
