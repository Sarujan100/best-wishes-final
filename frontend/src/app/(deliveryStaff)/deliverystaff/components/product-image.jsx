"use client"

import Image from "next/image"
import { useState } from "react"

export default function ProductImage({ src, alt, productName, width = 60, height = 60, className = "" }) {
  const [imageError, setImageError] = useState(false)

  // Generate a color based on product name for consistent placeholder colors
  const getProductColor = (name) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-red-100 text-red-600",
      "bg-yellow-100 text-yellow-600",
      "bg-indigo-100 text-indigo-600",
      "bg-pink-100 text-pink-600",
      "bg-gray-100 text-gray-600",
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  // Get product icon based on product type
  const getProductIcon = (name) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("lipstick") || lowerName.includes("lip")) return "💄"
    if (lowerName.includes("serum") || lowerName.includes("treatment")) return "🧴"
    if (lowerName.includes("eyeshadow") || lowerName.includes("eye")) return "👁️"
    if (lowerName.includes("moisturizer") || lowerName.includes("cream")) return "🧴"
    if (lowerName.includes("foundation") || lowerName.includes("base")) return "💄"
    if (lowerName.includes("mask") || lowerName.includes("facial")) return "🧴"
    if (lowerName.includes("mascara") || lowerName.includes("lash")) return "👁️"
    if (lowerName.includes("sunscreen") || lowerName.includes("spf")) return "☀️"
    if (lowerName.includes("contour") || lowerName.includes("highlight")) return "💄"
    if (lowerName.includes("cleanser") || lowerName.includes("wash")) return "🧴"
    return "💅"
  }

  if (imageError || !src) {
    return (
      <div
        className={`
          ${getProductColor(productName)} 
          rounded-lg flex items-center justify-center text-2xl font-semibold
          ${className}
        `}
        style={{ width, height }}
      >
        {getProductIcon(productName)}
      </div>
    )
  }

  const getImageSrc = () => {
    if (!src || typeof src !== 'string') return "/placeholder.svg"
    if (src.startsWith('http')) return src
    if (src.startsWith('/')) return src
    return `/images/${src}`
  }

  return (
    <Image
      src={getImageSrc()}
      alt={alt || "Product Image"}
      width={width}
      height={height}
      className={`rounded-lg object-cover ${className}`}
      onError={() => setImageError(true)}
      unoptimized
    />
  )
}
