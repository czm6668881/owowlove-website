'use client'

import { useSettings } from '@/contexts/settings-context'

// Hook to get site-wide settings for use in components
export function useSiteSettings() {
  const { settings, loading, error } = useSettings()
  
  return {
    // Store settings
    storeName: settings?.store?.storeName || 'OWOWLOVE',
    storeDescription: settings?.store?.storeDescription || 'Premium sexy cosplay and lingerie collection',
    storeEmail: settings?.store?.storeEmail || 'info@owowlove.com',
    storePhone: settings?.store?.storePhone || '+1 (555) 123-4567',
    storeAddress: settings?.store?.storeAddress || '123 Fashion Street, New York, NY 10001',
    currency: settings?.store?.currency || 'USD',
    timezone: settings?.store?.timezone || 'America/New_York',
    language: settings?.store?.language || 'en',
    logo: settings?.store?.logo || '/placeholder-logo.png',
    favicon: settings?.store?.favicon || '/favicon.ico',
    
    // SEO settings
    metaTitle: settings?.seo?.metaTitle || 'OWOWLOVE - Premium Sexy Cosplay & Lingerie',
    metaDescription: settings?.seo?.metaDescription || 'Discover premium sexy cosplay costumes and lingerie. High-quality, comfortable designs for confident women.',
    metaKeywords: settings?.seo?.metaKeywords || 'sexy cosplay, lingerie, crotchless panties, women fashion, intimate wear',
    googleAnalyticsId: settings?.seo?.googleAnalyticsId || '',
    facebookPixelId: settings?.seo?.facebookPixelId || '',
    enableSitemap: settings?.seo?.enableSitemap ?? true,
    enableRobots: settings?.seo?.enableRobots ?? true,
    
    // Email settings
    fromEmail: settings?.email?.fromEmail || 'noreply@owowlove.com',
    fromName: settings?.email?.fromName || 'OWOWLOVE',
    enableEmailNotifications: settings?.email?.enableEmailNotifications ?? true,
    
    // Security settings
    allowGuestCheckout: settings?.security?.allowGuestCheckout ?? true,
    
    // Loading and error states
    loading,
    error,
    
    // Raw settings object
    settings
  }
}
