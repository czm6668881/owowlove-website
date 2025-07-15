'use client'

import { useState, useEffect } from 'react'
import { useFavorites } from '@/contexts/favorites-context'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

interface FavoritesIconProps {
  onClick?: () => void
}

export function FavoritesIcon({ onClick }: FavoritesIconProps) {
  const { favoriteCount } = useFavorites()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="relative h-8 w-8 md:h-10 md:w-10">
      <Heart className="h-4 w-4 md:h-5 md:w-5" />
      {mounted && favoriteCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
          {favoriteCount > 99 ? '99+' : favoriteCount}
        </span>
      )}
    </Button>
  )
}
