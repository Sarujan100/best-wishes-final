export async function GET() {
  // Mock data with category-based filtering
  const products = [
    {
      id: "1",
      name: "Wedding Confetti Balloons",
      sku: "WCB-001",
      shortDescription: "Beautiful confetti balloons perfect for weddings",
      detailedDescription: "<p>Premium confetti balloons with elegant design for wedding celebrations.</p>",
      mainCategory: "balloons",
      filters: {
        subcategories: ["Wedding Balloons"],
        occasions: ["Wedding", "Anniversary"],
        types: ["Confetti", "Helium-filled"],
        colors: ["Gold", "White"],
        finishes: ["Confetti", "Pearlescent"],
        sizes: ['Large (18")'],
      },
      images: ["/placeholder.svg?height=300&width=300"],
      videos: [],
      costPrice: 2.5,
      retailPrice: 8.99,
      salePrice: 6.99,
      taxClass: "standard",
      stock: 50,
      stockStatus: "in-stock",
      weight: 0.1,
      dimensions: { length: 18, width: 18, height: 18 },
      shippingClass: "standard",
      variants: [],
      status: "active",
      price: 6.99,
    },
    {
      id: "2",
      name: "Birthday LED Balloons",
      sku: "BLB-002",
      shortDescription: "LED balloons that light up for birthday parties",
      detailedDescription: "<p>Amazing LED balloons that create magical lighting for birthday celebrations.</p>",
      mainCategory: "balloons",
      filters: {
        subcategories: ["Birthday Balloons", "Party Balloons"],
        occasions: ["Birthday"],
        types: ["LED", "Air-filled"],
        colors: ["Multi-color", "Blue", "Pink"],
        finishes: ["Transparent"],
        sizes: ['Standard (11")'],
      },
      images: ["/placeholder.svg?height=300&width=300"],
      videos: [],
      costPrice: 3.0,
      retailPrice: 12.99,
      salePrice: 0,
      taxClass: "standard",
      stock: 30,
      stockStatus: "in-stock",
      weight: 0.15,
      dimensions: { length: 11, width: 11, height: 11 },
      shippingClass: "standard",
      variants: [],
      status: "active",
      price: 12.99,
    },
    {
      id: "3",
      name: "Anniversary Greeting Card",
      sku: "AGC-003",
      shortDescription: "Elegant anniversary card with heartfelt message",
      detailedDescription: "<p>Beautiful anniversary greeting card with premium paper and elegant design.</p>",
      mainCategory: "cards",
      filters: {
        subcategories: ["Greeting Cards"],
        occasions: ["Anniversary", "Wedding"],
        recipients: ["Partner", "Family"],
        styles: ["Elegant", "Vintage"],
        colors: ["Gold", "White"],
        formats: ["Folded", "A5"],
      },
      images: ["/placeholder.svg?height=300&width=300"],
      videos: [],
      costPrice: 1.5,
      retailPrice: 4.99,
      salePrice: 0,
      taxClass: "standard",
      stock: 100,
      stockStatus: "in-stock",
      weight: 0.05,
      dimensions: { length: 15, width: 10, height: 0.5 },
      shippingClass: "standard",
      variants: [],
      status: "active",
      price: 4.99,
    },
    {
      id: "4",
      name: "Modern Picture Frame",
      sku: "MPF-004",
      shortDescription: "Sleek modern picture frame for home decor",
      detailedDescription: "<p>Contemporary picture frame perfect for modern home decoration.</p>",
      mainCategory: "home-living",
      filters: {
        subcategories: ["Wall Decor"],
        productTypes: ["Frames"],
        colors: ["Black", "White"],
        sizes: ["Medium"],
        materials: ["Metal", "Glass"],
        rooms: ["Living Room", "Bedroom"],
        styles: ["Modern", "Minimalist"],
      },
      images: ["/placeholder.svg?height=300&width=300"],
      videos: [],
      costPrice: 8.0,
      retailPrice: 24.99,
      salePrice: 19.99,
      taxClass: "standard",
      stock: 25,
      stockStatus: "in-stock",
      weight: 0.8,
      dimensions: { length: 25, width: 20, height: 3 },
      shippingClass: "standard",
      variants: [],
      status: "active",
      price: 19.99,
    },
    {
      id: "5",
      name: "Scented Candle Set",
      sku: "SCS-005",
      shortDescription: "Luxury scented candles for home ambiance",
      detailedDescription: "<p>Premium scented candle set with natural wax and essential oils.</p>",
      mainCategory: "home-living",
      filters: {
        subcategories: ["Table Decor"],
        productTypes: ["Candles"],
        colors: ["White", "Beige"],
        sizes: ["Small", "Medium"],
        materials: ["Wax", "Glass"],
        rooms: ["Living Room", "Bedroom", "Bathroom"],
        styles: ["Modern", "Scandinavian"],
      },
      images: ["/placeholder.svg?height=300&width=300"],
      videos: [],
      costPrice: 12.0,
      retailPrice: 34.99,
      salePrice: 0,
      taxClass: "standard",
      stock: 40,
      stockStatus: "in-stock",
      weight: 1.2,
      dimensions: { length: 10, width: 10, height: 12 },
      shippingClass: "standard",
      variants: [],
      status: "active",
      price: 34.99,
    },
  ]

  return Response.json(products)
}

export async function POST(request) {
  try {
    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.sku || !productData.mainCategory) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate ID and set creation date
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Ensure price is set correctly
      price: productData.salePrice > 0 ? productData.salePrice : productData.retailPrice,
    }

    // Here you would save to your database
    console.log("Creating product:", newProduct)

    return Response.json(
      {
        success: true,
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return Response.json({ error: "Failed to create product" }, { status: 500 })
  }
}
