import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OWOWLOVE - Premium Sexy Cosplay Costumes',
  description: 'Premium sexy cosplay costumes for women and girls. Discover our exclusive collection of animal costumes, bunny outfits, and fantasy cosplay designs with worldwide shipping.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}
