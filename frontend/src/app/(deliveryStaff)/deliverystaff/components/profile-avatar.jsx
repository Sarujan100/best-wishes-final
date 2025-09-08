"use client"

import Image from "next/image"
import { useState } from "react"

export default function ProfileAvatar({ src, alt, name, size = 32, className = "" }) {
  const [imageError, setImageError] = useState(false)

  // Generate initials from name
  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate a consistent color based on name
  const getAvatarColor = (fullName) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-gray-500",
    ]
    const index = fullName.length % colors.length
    return colors[index]
  }

  if (imageError || !src) {
    return (
      <div
        className={`
          ${getAvatarColor(name)} 
          rounded-full flex items-center justify-center text-white font-semibold
          ${className}
        `}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  )
}
