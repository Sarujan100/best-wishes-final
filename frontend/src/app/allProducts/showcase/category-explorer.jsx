"use client"

import { useDispatch } from "react-redux"
import Image from "next/image"
import { setCategory } from "./store"

// Category data with more detailed descriptions
const categories = [
  {
    id: "cards",
    name: "Cards",
    description: "Handcrafted greeting cards for birthdays, weddings, anniversaries, and every special occasion",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-pink-100",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
        />
      </svg>
    ),
  },
  {
    id: "home-living",
    name: "Home & Living",
    description: "Beautiful home decor including frames, clocks, candles, and stylish garden accessories",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-blue-100",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    id: "kitchen-dining",
    name: "Kitchen & Dining",
    description: "Premium kitchenware including ceramic mugs, elegant plates, and essential cooking tools",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-yellow-100",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    id: "toys-novelties",
    name: "Toys, Novelties & Collectibles",
    description: "Fun toys, unique collectibles, and novelty gifts for all ages and special occasions",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-green-100",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
]

export function CategoryExplorer() {
  const dispatch = useDispatch()

  const handleCategoryClick = (categoryName) => {
    dispatch(setCategory(categoryName))
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer"
          onClick={() => handleCategoryClick(category.name)}
        >
          <div className={`${category.color} p-6 flex justify-center items-center`}>
            <div className="text-3xl text-gray-700">{category.icon}</div>
          </div>
          <div className="relative h-40">
            <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10">{category.description}</p>
            <button className="mt-3 w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center">
              <span>Shop {category.name}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
