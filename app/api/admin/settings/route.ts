import { NextRequest, NextResponse } from 'next/server'
import { 
  loadSettings, 
  saveSettings, 
  updateStoreSettings,
  updateSEOSettings,
  updateEmailSettings,
  updateSecuritySettings,
  type AppSettings,
  type StoreSettings,
  type SEOSettings,
  type EmailSettings,
  type SecuritySettings
} from '@/lib/data/settings'

// GET - Load all settings
export async function GET() {
  try {
    const settings = await loadSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error loading settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load settings' },
      { status: 500 }
    )
  }
}

// POST - Save all settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'store':
        await updateStoreSettings(data as StoreSettings)
        break
      case 'seo':
        await updateSEOSettings(data as SEOSettings)
        break
      case 'email':
        await updateEmailSettings(data as EmailSettings)
        break
      case 'security':
        await updateSecuritySettings(data as SecuritySettings)
        break
      case 'all':
        await saveSettings(data as AppSettings)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid settings type' },
          { status: 400 }
        )
    }

    // Return updated settings
    const updatedSettings = await loadSettings()
    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully',
      data: updatedSettings 
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
