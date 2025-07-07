'use client'

import { useSiteSettings } from '@/hooks/use-site-settings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Globe, Mail, Shield } from 'lucide-react'

export function SettingsDisplay() {
  const {
    storeName,
    storeDescription,
    storeEmail,
    metaTitle,
    metaDescription,
    fromEmail,
    allowGuestCheckout,
    loading,
    error
  } = useSiteSettings()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading settings...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">Error loading settings: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="w-5 h-5 mr-2" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Store Name</label>
            <p className="text-lg font-semibold">{storeName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-sm text-gray-700">{storeDescription}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-sm text-gray-700">{storeEmail}</p>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Meta Title</label>
            <p className="text-sm text-gray-700">{metaTitle}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Meta Description</label>
            <p className="text-sm text-gray-700 line-clamp-2">{metaDescription}</p>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">From Email</label>
            <p className="text-sm text-gray-700">{fromEmail}</p>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Guest Checkout</label>
            <div>
              <Badge variant={allowGuestCheckout ? "default" : "secondary"}>
                {allowGuestCheckout ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
