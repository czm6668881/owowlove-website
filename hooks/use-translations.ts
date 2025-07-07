import { useParams } from 'next/navigation'
import { translations, type Locale } from '@/lib/translations'

export function useTranslations() {
  const params = useParams()
  const locale = (params?.lang as string || 'en') as Locale

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return { t, locale }
}

export function getStaticTranslations(locale: Locale) {
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }
  
  return { t, locale }
}
