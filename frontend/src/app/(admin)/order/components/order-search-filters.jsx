"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import React from "react"

export function OrderSearchFilters({ searchTerm, setSearchTerm, fromDate, setFromDate, toDate, setToDate }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders, customers, products, or SKUs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex flex-col">
          <label htmlFor="fromDate" className="text-sm text-muted-foreground mb-1">From Date</label>
          <Input
            type="date"
            id="fromDate"
            value={fromDate || ""}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="toDate" className="text-sm text-muted-foreground mb-1">To Date</label>
          <Input
            type="date"
            id="toDate"
            value={toDate || ""}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>
      </div>
    </div>
  )
}
