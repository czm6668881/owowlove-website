// Product images as URL encoded SVGs for reliable display
export const productImages = {
  crotchlessLacePanties: "data:image/svg+xml," + encodeURIComponent(`
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#FDF2F8"/>
      <rect x="50" y="50" width="200" height="300" rx="12" fill="#FFFFFF" stroke="#F3E8FF" stroke-width="2"/>
      <circle cx="100" cy="100" r="3" fill="#EC4899" opacity="0.3"/>
      <circle cx="120" cy="110" r="3" fill="#EC4899" opacity="0.3"/>
      <circle cx="140" cy="100" r="3" fill="#EC4899" opacity="0.3"/>
      <circle cx="160" cy="110" r="3" fill="#EC4899" opacity="0.3"/>
      <circle cx="180" cy="100" r="3" fill="#EC4899" opacity="0.3"/>
      <circle cx="200" cy="110" r="3" fill="#EC4899" opacity="0.3"/>
      <path d="M80 150 Q150 130 220 150 Q210 200 200 250 Q150 270 100 250 Q90 200 80 150 Z" 
            fill="#000000" opacity="0.1" stroke="#EC4899" stroke-width="2"/>
      <rect x="120" y="180" width="60" height="4" rx="2" fill="#EC4899"/>
      <rect x="110" y="200" width="80" height="4" rx="2" fill="#EC4899"/>
      <rect x="130" y="220" width="40" height="4" rx="2" fill="#EC4899"/>
      <text x="150" y="320" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="16" font-weight="600">Crotchless Panties</text>
      <text x="150" y="340" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="12">Lace Design</text>
      <text x="150" y="360" text-anchor="middle" fill="#EC4899" font-family="Arial, sans-serif" font-size="14" font-weight="600">$29.99</text>
    </svg>
  `),

  silkBodysuit: "data:image/svg+xml," + encodeURIComponent(`
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#F8FAFC"/>
      <rect x="50" y="50" width="200" height="300" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
      <defs>
        <linearGradient id="silk" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1F2937;stop-opacity:0.1" />
          <stop offset="50%" style="stop-color:#1F2937;stop-opacity:0.05" />
          <stop offset="100%" style="stop-color:#1F2937;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <path d="M120 80 Q150 70 180 80 L185 120 Q180 180 175 240 Q150 280 125 240 Q120 180 115 120 Z" 
            fill="url(#silk)" stroke="#1F2937" stroke-width="2"/>
      <rect x="135" y="70" width="8" height="20" rx="4" fill="#1F2937" opacity="0.3"/>
      <rect x="157" y="70" width="8" height="20" rx="4" fill="#1F2937" opacity="0.3"/>
      <line x1="130" y1="120" x2="170" y2="120" stroke="#1F2937" stroke-width="1" opacity="0.3"/>
      <line x1="125" y1="160" x2="175" y2="160" stroke="#1F2937" stroke-width="1" opacity="0.3"/>
      <line x1="130" y1="200" x2="170" y2="200" stroke="#1F2937" stroke-width="1" opacity="0.3"/>
      <text x="150" y="320" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="16" font-weight="600">Silk Bodysuit</text>
      <text x="150" y="340" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="12">Luxury Silk</text>
      <text x="150" y="360" text-anchor="middle" fill="#059669" font-family="Arial, sans-serif" font-size="14" font-weight="600">$89.99</text>
    </svg>
  `),

  meshBabydoll: "data:image/svg+xml," + encodeURIComponent(`
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#FEF7FF"/>
      <rect x="50" y="50" width="200" height="300" rx="12" fill="#FFFFFF" stroke="#F3E8FF" stroke-width="2"/>
      <defs>
        <pattern id="mesh" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1" fill="#A855F7" opacity="0.2"/>
        </pattern>
      </defs>
      <path d="M110 90 Q150 80 190 90 L195 130 Q190 200 185 270 Q150 290 115 270 Q110 200 105 130 Z" 
            fill="url(#mesh)" stroke="#A855F7" stroke-width="2"/>
      <path d="M110 90 Q150 85 190 90" stroke="#A855F7" stroke-width="3" fill="none"/>
      <path d="M115 270 Q150 275 185 270" stroke="#A855F7" stroke-width="3" fill="none"/>
      <circle cx="150" cy="100" r="4" fill="#A855F7"/>
      <path d="M145 100 Q150 95 155 100 Q150 105 145 100" fill="#A855F7"/>
      <text x="150" y="320" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="16" font-weight="600">Mesh Babydoll</text>
      <text x="150" y="340" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="12">Sheer Mesh</text>
      <text x="150" y="360" text-anchor="middle" fill="#DC2626" font-family="Arial, sans-serif" font-size="14" font-weight="600">$55.99</text>
    </svg>
  `),

  satinChemise: "data:image/svg+xml," + encodeURIComponent(`
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#FFFBEB"/>
      <rect x="50" y="50" width="200" height="300" rx="12" fill="#FFFFFF" stroke="#FEF3C7" stroke-width="2"/>
      <defs>
        <linearGradient id="satin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#DC2626;stop-opacity:0.2" />
          <stop offset="50%" style="stop-color:#DC2626;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#DC2626;stop-opacity:0.2" />
        </linearGradient>
      </defs>
      <path d="M115 85 Q150 75 185 85 L190 140 Q185 220 180 280 Q150 300 120 280 Q115 220 110 140 Z" 
            fill="url(#satin)" stroke="#DC2626" stroke-width="2"/>
      <path d="M115 85 Q150 80 185 85" stroke="#DC2626" stroke-width="2" fill="none"/>
      <circle cx="130" cy="95" r="2" fill="#DC2626" opacity="0.5"/>
      <circle cx="150" cy="90" r="2" fill="#DC2626" opacity="0.5"/>
      <circle cx="170" cy="95" r="2" fill="#DC2626" opacity="0.5"/>
      <line x1="115" y1="140" x2="115" y2="260" stroke="#DC2626" stroke-width="1" opacity="0.3"/>
      <line x1="185" y1="140" x2="185" y2="260" stroke="#DC2626" stroke-width="1" opacity="0.3"/>
      <text x="150" y="320" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="16" font-weight="600">Satin Chemise</text>
      <text x="150" y="340" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="12">Smooth Satin</text>
      <text x="150" y="360" text-anchor="middle" fill="#059669" font-family="Arial, sans-serif" font-size="14" font-weight="600">$39.99</text>
    </svg>
  `),

  laceBraletteSet: "data:image/svg+xml," + encodeURIComponent(`
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#FDF2F8"/>
      <rect x="50" y="50" width="200" height="300" rx="12" fill="#FFFFFF" stroke="#FCE7F3" stroke-width="2"/>
      <defs>
        <pattern id="lace" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
          <circle cx="7.5" cy="7.5" r="2" fill="#EC4899" opacity="0.2"/>
          <circle cx="7.5" cy="7.5" r="1" fill="#EC4899" opacity="0.4"/>
        </pattern>
      </defs>
      <circle cx="130" cy="140" r="25" fill="url(#lace)" stroke="#EC4899" stroke-width="2"/>
      <circle cx="170" cy="140" r="25" fill="url(#lace)" stroke="#EC4899" stroke-width="2"/>
      <rect x="148" y="130" width="4" height="20" rx="2" fill="#EC4899"/>
      <path d="M115 120 Q130 110 145 120" stroke="#EC4899" stroke-width="2" fill="none"/>
      <path d="M155 120 Q170 110 185 120" stroke="#EC4899" stroke-width="2" fill="none"/>
      <rect x="105" y="160" width="90" height="8" rx="4" fill="#EC4899" opacity="0.3"/>
      <path d="M120 200 Q150 190 180 200 Q175 230 170 250 Q150 260 130 250 Q125 230 120 200 Z" 
            fill="url(#lace)" stroke="#EC4899" stroke-width="2"/>
      <text x="150" y="320" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="16" font-weight="600">Lace Bralette Set</text>
      <text x="150" y="340" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="12">Delicate Lace</text>
      <text x="150" y="360" text-anchor="middle" fill="#059669" font-family="Arial, sans-serif" font-size="14" font-weight="600">$69.99</text>
    </svg>
  `),

  openCrotchMeshPanties: "data:image/svg+xml," + encodeURIComponent(`
    <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#FEF2F2"/>
      <rect x="50" y="50" width="200" height="300" rx="12" fill="#FFFFFF" stroke="#FECACA" stroke-width="2"/>
      <defs>
        <pattern id="meshPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="none" stroke="#EF4444" stroke-width="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      <path d="M100 150 Q150 140 200 150 Q195 180 190 210 L180 220 Q150 230 120 220 L110 210 Q105 180 100 150 Z" 
            fill="url(#meshPattern)" stroke="#EF4444" stroke-width="2"/>
      <ellipse cx="150" cy="190" rx="15" ry="10" fill="none" stroke="#EF4444" stroke-width="2" stroke-dasharray="3,2"/>
      <line x1="110" y1="160" x2="190" y2="160" stroke="#EF4444" stroke-width="0.5" opacity="0.4"/>
      <line x1="115" y1="170" x2="185" y2="170" stroke="#EF4444" stroke-width="0.5" opacity="0.4"/>
      <line x1="120" y1="180" x2="180" y2="180" stroke="#EF4444" stroke-width="0.5" opacity="0.4"/>
      <line x1="125" y1="200" x2="175" y2="200" stroke="#EF4444" stroke-width="0.5" opacity="0.4"/>
      <circle cx="105" cy="170" r="2" fill="#EF4444" opacity="0.6"/>
      <circle cx="195" cy="170" r="2" fill="#EF4444" opacity="0.6"/>
      <rect x="100" y="145" width="100" height="6" rx="3" fill="#EF4444" opacity="0.4"/>
      <text x="150" y="320" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="16" font-weight="600">Open Crotch Mesh</text>
      <text x="150" y="340" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="12">Sheer Mesh</text>
      <text x="150" y="360" text-anchor="middle" fill="#DC2626" font-family="Arial, sans-serif" font-size="14" font-weight="600">$35.99</text>
    </svg>
  `)
}

// Helper function to get product image
export function getProductImage(productKey: string): string {
  const imageMap: { [key: string]: string } = {
    'productNames.crotchlessLacePanties': productImages.crotchlessLacePanties,
    'productNames.silkBodysuit': productImages.silkBodysuit,
    'productNames.meshBabydoll': productImages.meshBabydoll,
    'productNames.satinChemise': productImages.satinChemise,
    'productNames.laceBraletteSet': productImages.laceBraletteSet,
    'productNames.openCrotchMeshPanties': productImages.openCrotchMeshPanties
  }
  
  return imageMap[productKey] || '/placeholder.svg'
}
