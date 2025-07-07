'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  type AppSettings,
  type StoreSettings,
  type SEOSettings,
  type EmailSettings,
  type SecuritySettings
} from '@/lib/data/settings'

interface SettingsContextType {
  settings: AppSettings | null
  loading: boolean
  error: string | null
  updateStoreSettings: (storeSettings: StoreSettings) => Promise<boolean>
  updateSEOSettings: (seoSettings: SEOSettings) => Promise<boolean>
  updateEmailSettings: (emailSettings: EmailSettings) => Promise<boolean>
  updateSecuritySettings: (securitySettings: SecuritySettings) => Promise<boolean>
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings from API
  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/settings')
      const result = await response.json()
      
      if (result.success) {
        setSettings(result.data)
      } else {
        setError(result.error || 'Failed to load settings')
      }
    } catch (err) {
      setError('Failed to load settings')
      console.error('Error loading settings:', err)
    } finally {
      setLoading(false)
    }
  }

  // Save settings to API
  const saveSettingsToAPI = async (type: string, data: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSettings(result.data)
        return true
      } else {
        setError(result.error || 'Failed to save settings')
        return false
      }
    } catch (err) {
      setError('Failed to save settings')
      console.error('Error saving settings:', err)
      return false
    }
  }

  // Update specific settings sections
  const updateStoreSettings = async (storeSettings: StoreSettings): Promise<boolean> => {
    return await saveSettingsToAPI('store', storeSettings)
  }

  const updateSEOSettings = async (seoSettings: SEOSettings): Promise<boolean> => {
    return await saveSettingsToAPI('seo', seoSettings)
  }

  const updateEmailSettings = async (emailSettings: EmailSettings): Promise<boolean> => {
    return await saveSettingsToAPI('email', emailSettings)
  }

  const updateSecuritySettings = async (securitySettings: SecuritySettings): Promise<boolean> => {
    return await saveSettingsToAPI('security', securitySettings)
  }

  const refreshSettings = async () => {
    await loadSettings()
  }

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const value: SettingsContextType = {
    settings,
    loading,
    error,
    updateStoreSettings,
    updateSEOSettings,
    updateEmailSettings,
    updateSecuritySettings,
    refreshSettings,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
