import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json')

interface UpdatePriceRequest {
  variantId: string
  price: number
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { variantId, price }: UpdatePriceRequest = await request.json()

    // Read current products
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8')
    const products = JSON.parse(data)

    // Find the product
    const productIndex = products.findIndex((p: any) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    // Find the variant
    const variantIndex = products[productIndex].variants.findIndex((v: any) => v.id === variantId)
    if (variantIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Variant not found'
      }, { status: 404 })
    }

    // Update the price
    products[productIndex].variants[variantIndex].price = parseFloat(price.toString())
    products[productIndex].updatedAt = new Date().toISOString()

    // Save back to file
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2))

    return NextResponse.json({
      success: true,
      data: {
        productId: id,
        variantId,
        newPrice: products[productIndex].variants[variantIndex].price
      }
    })
  } catch (error) {
    console.error('Error updating price:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update price'
    }, { status: 500 })
  }
}
