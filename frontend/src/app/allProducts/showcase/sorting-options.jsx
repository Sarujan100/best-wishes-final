"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { sortProducts } from "./store"

export function SortingOptions() {
  const dispatch = useDispatch()
  const [sortOption, setSortOption] = useState("popularity-desc")

  const handleSortChange = (e) => {
    const value = e.target.value
    setSortOption(value)

    const [sortBy, direction] = value.split("-")
    dispatch(sortProducts({ sortBy, direction }))
  }

  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-4">
      <div className="text-sm text-gray-500">Sort by:</div>
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="border-0 bg-transparent focus:ring-0 text-sm font-medium"
      >
        <option value="popularity-desc">Most Popular</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Highest Rated</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    </div>
  )
}
