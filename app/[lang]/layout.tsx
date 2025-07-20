import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { translations } from '@/lib/translations'
import { CartProvider } from '@/contexts/cart-context'
import { FavoritesProvider } from '@/contexts/favorites-context'
import { SettingsProvider } from '@/contexts/settings-context'
import { UserAuthProvider } from '@/contexts/user-auth-context'
import { PaymentProvider } from '@/contexts/payment-context'
import { StripeProvider } from '@/contexts/stripe-context'

type Props = {
  params: Promise<{ lang: string }>
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.lang as keyof typeof translations
  const t = translations[lang] || translations.en
  
  return {
    title: `Sexy Cosplay Costumes for Women & Girls | OWOWLOVE.COM - Animal & Bunny Outfits`,
    description: `Shop premium sexy cosplay costumes for women and girls at OWOWLOVE.COM. Discover our exclusive collection of animal costumes, bunny outfits, and fantasy cosplay designs with worldwide shipping.`,
    keywords: 'sexy cosplay, women cosplay, girls costume, animal costume, bunny costume, cosplay outfits, fantasy costumes, women costume, girls outfits, animal outfits',
    robots: 'index, follow',
    openGraph: {
      title: `Sexy Cosplay Costumes for Women & Girls | OWOWLOVE.COM - Animal & Bunny Outfits`,
      description: `Shop premium sexy cosplay costumes for women and girls. Exclusive collection of animal costumes and bunny outfits with worldwide shipping.`,
      type: 'website',
      locale: 'en_US',
      siteName: 'OWOWLOVE.COM',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Sexy Cosplay Costumes for Women & Girls | OWOWLOVE.COM`,
      description: `Premium sexy cosplay costumes and animal outfits for women and girls at OWOWLOVE.COM.`,
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  return (
    <html lang={resolvedParams.lang}>
      <body>
        <FavoritesProvider>
          <SettingsProvider>
            <UserAuthProvider>
              <CartProvider>
                <PaymentProvider>
                  <StripeProvider>
                    {children}
                  </StripeProvider>
                </PaymentProvider>
              </CartProvider>
            </UserAuthProvider>
          </SettingsProvider>
        </FavoritesProvider>
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}
