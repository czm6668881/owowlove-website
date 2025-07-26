'use client'

interface SearchHighlightProps {
  text: string
  searchTerm: string
  className?: string
}

export function SearchHighlight({ text, searchTerm, className = '' }: SearchHighlightProps) {
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>
  }

  // Create a regex to find all instances of the search term (case insensitive)
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}
