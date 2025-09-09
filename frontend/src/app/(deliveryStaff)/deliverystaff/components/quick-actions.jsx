"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, Truck, CheckCircle, AlertCircle, Clock, MapPin } from "lucide-react"

export default function QuickActions({ onSearch, onFilter, onRefresh, loading }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleFilter = (status) => {
    setFilterStatus(status)
    onFilter(status)
  }

  const quickStats = [
    { label: "Today's Deliveries", value: "12", icon: Package, color: "text-blue-600" },
    { label: "Pending Pickups", value: "5", icon: Clock, color: "text-yellow-600" },
    { label: "In Transit", value: "8", icon: Truck, color: "text-blue-600" },
    { label: "Completed Today", value: "15", icon: CheckCircle, color: "text-green-600" }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Filter */}
            <Select value={filterStatus} onValueChange={handleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button onClick={handleSearch} variant="outline" className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Button>
              <Button 
                onClick={onRefresh} 
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
