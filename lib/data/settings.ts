import { writeFile, readFile, existsSync } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

const writeFileAsync = promisify(writeFile)
const readFileAsync = promisify(readFile)

const DATA_DIR = join(process.cwd(), 'data')
const SETTINGS_FILE = join(DATA_DIR, 'settings.json')

export interface StoreSettings {
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  currency: string
  timezone: string
  language: string
  logo: string
  favicon: string
}

export interface SEOSettings {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  googleAnalyticsId: string
  facebookPixelId: string
  enableSitemap: boolean
  enableRobots: boolean
}

export interface EmailSettings {
  smtpHost: string
  smtpPort: string
  smtpUsername: string
  smtpPassword: string
  fromEmail: string
  fromName: string
  enableEmailNotifications: boolean
}

export interface SecuritySettings {
  enableTwoFactor: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  enableCaptcha: boolean
  allowGuestCheckout: boolean
}

export interface AppSettings {
  store: StoreSettings
  seo: SEOSettings
  email: EmailSettings
  security: SecuritySettings
  updatedAt: string
}

// Default settings
const defaultSettings: AppSettings = {
  store: {
    storeName: 'OWOWLOVE',
    storeDescription: 'Premium sexy cosplay and lingerie collection',
    storeEmail: 'info@owowlove.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Fashion Street, New York, NY 10001',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    logo: '/placeholder-logo.png',
    favicon: '/favicon.ico'
  },
  seo: {
    metaTitle: 'OWOWLOVE - Premium Sexy Cosplay & Lingerie',
    metaDescription: 'Discover premium sexy cosplay costumes and lingerie. High-quality, comfortable designs for confident women.',
    metaKeywords: 'sexy cosplay, lingerie, crotchless panties, women fashion, intimate wear',
    googleAnalyticsId: '',
    facebookPixelId: '',
    enableSitemap: true,
    enableRobots: true
  },
  email: {
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@owowlove.com',
    fromName: 'OWOWLOVE',
    enableEmailNotifications: true
  },
  security: {
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableCaptcha: true,
    allowGuestCheckout: true
  },
  updatedAt: new Date().toISOString()
}

// Settings cache
let settingsCache: AppSettings | null = null

// Ensure data directory exists
async function ensureDataDir() {
  const fs = await import('fs')
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load settings from file
export async function loadSettings(): Promise<AppSettings> {
  try {
    await ensureDataDir()
    
    if (!existsSync(SETTINGS_FILE)) {
      // If file doesn't exist, create default settings
      await saveSettings(defaultSettings)
      return defaultSettings
    }
    
    const data = await readFileAsync(SETTINGS_FILE, 'utf-8')
    const settings = JSON.parse(data)
    
    // Merge with defaults to ensure all properties exist
    const mergedSettings = {
      ...defaultSettings,
      ...settings,
      store: { ...defaultSettings.store, ...settings.store },
      seo: { ...defaultSettings.seo, ...settings.seo },
      email: { ...defaultSettings.email, ...settings.email },
      security: { ...defaultSettings.security, ...settings.security }
    }
    
    settingsCache = mergedSettings
    return mergedSettings
  } catch (error) {
    console.error('Error loading settings:', error)
    return defaultSettings
  }
}

// Save settings to file
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await ensureDataDir()
    settings.updatedAt = new Date().toISOString()
    await writeFileAsync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8')
    settingsCache = settings
  } catch (error) {
    console.error('Error saving settings:', error)
    throw error
  }
}

// Get cached settings (for client-side use)
export function getCachedSettings(): AppSettings | null {
  return settingsCache
}

// Update specific settings section
export async function updateStoreSettings(storeSettings: StoreSettings): Promise<void> {
  const currentSettings = await loadSettings()
  const updatedSettings = {
    ...currentSettings,
    store: storeSettings,
    updatedAt: new Date().toISOString()
  }
  await saveSettings(updatedSettings)
}

export async function updateSEOSettings(seoSettings: SEOSettings): Promise<void> {
  const currentSettings = await loadSettings()
  const updatedSettings = {
    ...currentSettings,
    seo: seoSettings,
    updatedAt: new Date().toISOString()
  }
  await saveSettings(updatedSettings)
}

export async function updateEmailSettings(emailSettings: EmailSettings): Promise<void> {
  const currentSettings = await loadSettings()
  const updatedSettings = {
    ...currentSettings,
    email: emailSettings,
    updatedAt: new Date().toISOString()
  }
  await saveSettings(updatedSettings)
}

export async function updateSecuritySettings(securitySettings: SecuritySettings): Promise<void> {
  const currentSettings = await loadSettings()
  const updatedSettings = {
    ...currentSettings,
    security: securitySettings,
    updatedAt: new Date().toISOString()
  }
  await saveSettings(updatedSettings)
}
