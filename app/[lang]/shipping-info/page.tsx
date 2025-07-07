"use client"

import React from 'react'
import { useTranslations } from "@/hooks/use-translations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  Clock,
  Shield,
  AlertTriangle,
  Package,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function ShippingInfoPage() {
  const { t } = useTranslations()

  const shippingZones = [
    {
      area: "Europe",
      standard: { time: "7-12 days", insurance: false }
    },
    {
      area: "North America (USA/Canada)",
      standard: { time: "10-20 days", insurance: false }
    },
    {
      area: "Australia & New Zealand",
      standard: { time: "10-15 days", insurance: false }
    },
    {
      area: "Asia",
      standard: { time: "5-14 days", insurance: false }
    },
    {
      area: "Other Countries",
      standard: { time: "20-40 days", insurance: false }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link 
            href="/en" 
            className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('shipping.title')}</h1>
          <p className="text-xl text-gray-600 mb-2">{t('shipping.subtitle')}</p>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('shipping.description')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Shipping Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* International Shipping Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-pink-600" />
                  {t('shipping.international.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">{t('shipping.table.area')}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t('shipping.table.method')}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t('shipping.table.time')}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t('shipping.table.insurance')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shippingZones.map((zone, index) => (
                        <tr key={zone.area} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{zone.area}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{t('shipping.methods.standard')}</Badge>
                          </td>
                          <td className="py-3 px-4">{zone.standard.time}</td>
                          <td className="py-3 px-4">
                            <span className="text-red-600">{t('shipping.insurance.no')}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Processing & Shipping Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-pink-600" />
                  {t('shipping.processing.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{t('shipping.processing.note')}:</strong> {t('shipping.processing.description')}
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {t('shipping.notes.processing')}</li>
                  <li>• {t('shipping.notes.businessDays')}</li>
                  <li>• {t('shipping.notes.carriers')}</li>
                  <li>• {t('shipping.notes.origin')}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-pink-600" />
                  {t('shipping.delivery.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-600">
                  <p>{t('shipping.delivery.marked')}</p>
                  <p>{t('shipping.delivery.incorrect')}</p>
                  <p>{t('shipping.delivery.destroyed')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Important Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {t('shipping.notice.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-orange-800 font-medium">{t('shipping.notice.address')}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-red-800 font-medium">{t('shipping.notice.delivered')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>{t('shipping.support.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{t('shipping.support.description')}</p>
                <Link 
                  href="/en/contact" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  {t('shipping.support.contact')}
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
