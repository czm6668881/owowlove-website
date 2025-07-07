'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useSettings } from '@/contexts/settings-context'
import {
  Settings as SettingsIcon,
  Store,
  Mail,
  Globe,
  Shield,
  Palette,
  Save,
  Upload,
  Loader2
} from 'lucide-react'

interface StoreSettings {
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

interface SEOSettings {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  googleAnalyticsId: string
  facebookPixelId: string
  enableSitemap: boolean
  enableRobots: boolean
}

interface EmailSettings {
  smtpHost: string
  smtpPort: string
  smtpUsername: string
  smtpPassword: string
  fromEmail: string
  fromName: string
  enableEmailNotifications: boolean
}

interface SecuritySettings {
  enableTwoFactor: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  enableCaptcha: boolean
  allowGuestCheckout: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('store')
  const [saving, setSaving] = useState(false)
  const {
    settings,
    loading,
    error,
    updateStoreSettings,
    updateSEOSettings,
    updateEmailSettings,
    updateSecuritySettings
  } = useSettings()

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    logo: '/placeholder-logo.png',
    favicon: '/favicon.ico'
  })

  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    enableSitemap: true,
    enableRobots: true
  })

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
    enableEmailNotifications: true
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableCaptcha: true,
    allowGuestCheckout: true
  })

  // Load settings when they become available
  useEffect(() => {
    if (settings) {
      setStoreSettings(settings.store)
      setSeoSettings(settings.seo)
      setEmailSettings(settings.email)
      setSecuritySettings(settings.security)
    }
  }, [settings])

  const handleSave = async () => {
    setSaving(true)

    try {
      let success = false

      switch (activeTab) {
        case 'store':
          success = await updateStoreSettings(storeSettings)
          break
        case 'seo':
          success = await updateSEOSettings(seoSettings)
          break
        case 'email':
          success = await updateEmailSettings(emailSettings)
          break
        case 'security':
          success = await updateSecuritySettings(securitySettings)
          break
      }

      if (success) {
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings. Please try again.')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'seo', label: 'SEO & Analytics', icon: Globe },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading settings: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your store configuration and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-pink-100 text-pink-700 font-medium'
                          : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'store' && (
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeEmail">Store Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => setStoreSettings({...storeSettings, storeEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={storeSettings.storeDescription}
                    onChange={(e) => setStoreSettings({...storeSettings, storeDescription: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="storePhone">Phone Number</Label>
                    <Input
                      id="storePhone"
                      value={storeSettings.storePhone}
                      onChange={(e) => setStoreSettings({...storeSettings, storePhone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={storeSettings.currency}
                      onChange={(e) => setStoreSettings({...storeSettings, currency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    value={storeSettings.storeAddress}
                    onChange={(e) => setStoreSettings({...storeSettings, storeAddress: e.target.value})}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'seo' && (
            <Card>
              <CardHeader>
                <CardTitle>SEO & Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={seoSettings.metaTitle}
                    onChange={(e) => setSeoSettings({...seoSettings, metaTitle: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={seoSettings.metaDescription}
                    onChange={(e) => setSeoSettings({...seoSettings, metaDescription: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={seoSettings.metaKeywords}
                    onChange={(e) => setSeoSettings({...seoSettings, metaKeywords: e.target.value})}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      value={seoSettings.googleAnalyticsId}
                      onChange={(e) => setSeoSettings({...seoSettings, googleAnalyticsId: e.target.value})}
                      placeholder="GA-XXXXXXXXX-X"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixelId"
                      value={seoSettings.facebookPixelId}
                      onChange={(e) => setSeoSettings({...seoSettings, facebookPixelId: e.target.value})}
                      placeholder="123456789012345"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Sitemap</Label>
                      <p className="text-sm text-gray-500">Generate XML sitemap for search engines</p>
                    </div>
                    <Switch
                      checked={seoSettings.enableSitemap}
                      onCheckedChange={(checked) => setSeoSettings({...seoSettings, enableSitemap: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Robots.txt</Label>
                      <p className="text-sm text-gray-500">Control search engine crawling</p>
                    </div>
                    <Switch
                      checked={seoSettings.enableRobots}
                      onCheckedChange={(checked) => setSeoSettings({...seoSettings, enableRobots: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send order confirmations and updates</p>
                  </div>
                  <Switch
                    checked={emailSettings.enableEmailNotifications}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableEmailNotifications: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <Switch
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableTwoFactor: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable CAPTCHA</Label>
                      <p className="text-sm text-gray-500">Protect forms from spam and bots</p>
                    </div>
                    <Switch
                      checked={securitySettings.enableCaptcha}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableCaptcha: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Guest Checkout</Label>
                      <p className="text-sm text-gray-500">Let customers checkout without creating an account</p>
                    </div>
                    <Switch
                      checked={securitySettings.allowGuestCheckout}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, allowGuestCheckout: checked})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Store Logo</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <img
                      src={storeSettings.logo}
                      alt="Store Logo"
                      className="w-16 h-16 object-contain border rounded"
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Logo
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Favicon</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <img
                      src={storeSettings.favicon}
                      alt="Favicon"
                      className="w-8 h-8 object-contain border rounded"
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Favicon
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="language">Default Language</Label>
                  <select
                    id="language"
                    value={storeSettings.language}
                    onChange={(e) => setStoreSettings({...storeSettings, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={storeSettings.timezone}
                    onChange={(e) => setStoreSettings({...storeSettings, timezone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
