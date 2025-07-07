import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { FavoritesProvider } from '@/contexts/favorites-context'

export const metadata: Metadata = {
  title: 'Sexy Cosplay Costumes for Women & Girls | OWOWLOVE.COM - Animal & Bunny Outfits',
  description: 'Shop premium sexy cosplay costumes for women and girls at OWOWLOVE.COM. Discover our exclusive collection of animal costumes, bunny outfits, and fantasy cosplay designs with worldwide shipping.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FavoritesProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  )
}
