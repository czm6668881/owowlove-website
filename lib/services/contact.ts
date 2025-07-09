import { supabase, supabaseAdmin } from '@/lib/supabase'

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

export class ContactService {
  // Submit contact message
  static async submitMessage(messageData: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          ...messageData,
          status: 'new'
        }])
        .select()
        .single()

      if (error) {
        console.error('Error submitting contact message:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('ContactService.submitMessage error:', error)
      throw error
    }
  }

  // Admin: Get all contact messages
  static async getAllMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all contact messages:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('ContactService.getAllMessages error:', error)
      throw error
    }
  }

  // Admin: Get contact message by ID
  static async getMessageById(id: string): Promise<ContactMessage | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        console.error('Error fetching contact message:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('ContactService.getMessageById error:', error)
      throw error
    }
  }

  // Admin: Update message status
  static async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
    try {
      const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating message status:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('ContactService.updateMessageStatus error:', error)
      throw error
    }
  }

  // Admin: Mark message as read
  static async markAsRead(id: string): Promise<ContactMessage> {
    try {
      return await this.updateMessageStatus(id, 'read')
    } catch (error) {
      console.error('ContactService.markAsRead error:', error)
      throw error
    }
  }

  // Admin: Mark message as replied
  static async markAsReplied(id: string): Promise<ContactMessage> {
    try {
      return await this.updateMessageStatus(id, 'replied')
    } catch (error) {
      console.error('ContactService.markAsReplied error:', error)
      throw error
    }
  }

  // Admin: Delete contact message
  static async deleteMessage(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting contact message:', error)
        throw error
      }
    } catch (error) {
      console.error('ContactService.deleteMessage error:', error)
      throw error
    }
  }

  // Admin: Get messages by status
  static async getMessagesByStatus(status: ContactMessage['status']): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching messages by status:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('ContactService.getMessagesByStatus error:', error)
      throw error
    }
  }

  // Admin: Get unread message count
  static async getUnreadCount(): Promise<number> {
    try {
      const { count, error } = await supabaseAdmin
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

      if (error) {
        console.error('Error getting unread count:', error)
        throw error
      }

      return count || 0
    } catch (error) {
      console.error('ContactService.getUnreadCount error:', error)
      return 0
    }
  }

  // Admin: Mark all messages as read
  static async markAllAsRead(): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('status', 'new')

      if (error) {
        console.error('Error marking all as read:', error)
        throw error
      }
    } catch (error) {
      console.error('ContactService.markAllAsRead error:', error)
      throw error
    }
  }
}
