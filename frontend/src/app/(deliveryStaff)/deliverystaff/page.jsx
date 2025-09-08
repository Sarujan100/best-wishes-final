"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import NavigationBar from "./components/navigation-bar"
import ProductImage from "./components/product-image"

export default function DeliveryDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("delivery")
  const [orders, setOrders] = useState([])
  const [complaints, setComplaints] = useState([])
  const [deliveryHistory, setDeliveryHistory] = useState([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  // Simulated data - replace with actual API calls
  const mockOrders = [
    {
      id: "1",
      productName: "Matte Liquid Lipstick Set",
      productImage: "/images/lipstick.png",
      amount: 24.99,
      address: "No 28 2nd Street Main road State City",
      phone: "+44 6475 8890",
      status: "Pending",
    },
    {
      id: "2",
      productName: "Anti-Aging Serum with Vitamin C",
      productImage: "/images/serum.png",
      amount: 45.99,
      address: "No 15 Oak Avenue Downtown",
      phone: "+44 7123 4567",
      status: "In Transit",
    },
    {
      id: "3",
      productName: "Eyeshadow Palette - Neutral Tones",
      productImage: "/images/eyeshadow.png",
      amount: 32.5,
      address: "No 42 Pine Street Uptown",
      phone: "+44 8901 2345",
      status: "Completed",
    },
    {
      id: "4",
      productName: "Hydrating Face Moisturizer",
      productImage: "/images/moisturizer.png",
      amount: 28.75,
      address: "No 156 Elm Street Central District",
      phone: "+44 9012 3456",
      status: "Pending",
    },
    {
      id: "5",
      productName: "Foundation Makeup Base",
      productImage: "/images/foundation.png",
      amount: 38.99,
      address: "No 89 Maple Avenue Westside",
      phone: "+44 3456 7890",
      status: "In Transit",
    },
  ]

  const mockComplaints = [
    {
      id: "1",
      productName: "Matte Liquid Lipstick Set",
      issue: "Wrong shade delivered - ordered Ruby Red, received Pink Rose",
      submittedDate: "2024-01-15",
      status: "Open",
    },
    {
      id: "2",
      productName: "Anti-Aging Serum with Vitamin C",
      issue: "Product leaked during delivery - bottle was damaged",
      submittedDate: "2024-01-14",
      status: "In Progress",
    },
    {
      id: "3",
      productName: "Eyeshadow Palette - Neutral Tones",
      issue: "Missing mirror and applicator brush from the palette",
      submittedDate: "2024-01-13",
      status: "Resolved",
    },
  ]

  const mockDeliveryHistory = [
    {
      id: "1",
      productName: "Cleansing Face Mask",
      deliveryDate: "2024-01-10",
      status: "Completed",
    },
    {
      id: "2",
      productName: "Waterproof Mascara",
      deliveryDate: "2024-01-09",
      status: "Completed",
    },
    {
      id: "3",
      productName: "Night Repair Cream",
      deliveryDate: "2024-01-08",
      status: "Failed",
    },
    {
      id: "4",
      productName: "Contouring Kit",
      deliveryDate: "2024-01-07",
      status: "Completed",
    },
    {
      id: "5",
      productName: "Sunscreen SPF 50",
      deliveryDate: "2024-01-06",
      status: "Completed",
    },
  ]

  // API placeholder functions - replace with actual API calls
  const fetchOrders = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOrders(mockOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setComplaints(mockComplaints)
    } catch (error) {
      console.error("Error fetching complaints:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeliveryHistory = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setDeliveryHistory(mockDeliveryHistory)
    } catch (error) {
      console.error("Error fetching delivery history:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (orderId) => {
    try {
      // Simulate API call to update order status
      console.log("Submitting order:", orderId)
      // Update local state
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "Completed" } : order)))
    } catch (error) {
      console.error("Error submitting order:", error)
    }
  }

  const resolveComplaint = async (complaintId) => {
    try {
      console.log("Resolving complaint:", complaintId)
      setComplaints((prev) =>
        prev.map((complaint) => (complaint.id === complaintId ? { ...complaint, status: "Resolved" } : complaint)),
      )
    } catch (error) {
      console.error("Error resolving complaint:", error)
    }
  }

  const handleFilterChange = (value) => {
    setFilterStatus(value)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Filter and search logic
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch =
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Load initial data
  useEffect(() => {
    fetchOrders()
    fetchComplaints()
    fetchDeliveryHistory()
  }, [])

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in transit":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "delivery":
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold text-gray-900">Delivery Status</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Select value={filterStatus} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in transit">In Transit</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 text-[#822BE2]" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 w-full sm:w-64 border focus-visible:ring-0 focus-visible:border-[#822BE2] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ProductImage
                              src={order.productImage || ""}
                              alt={order.productName}
                              productName={order.productName}
                              width={60}
                              height={60}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          US ${order.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">{order.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            onClick={() => handleSubmit(order.id)}
                            disabled={order.status === "Completed"}
                            size="sm"
                            className="rounded-[8px] btn-color text-white font-medium"
                          >
                            Submit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      case "complains":
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Complaints Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {complaint.productName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">{complaint.issue}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{complaint.submittedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusBadgeColor(complaint.status)}>{complaint.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          onClick={() => resolveComplaint(complaint.id)}
                          disabled={complaint.status === "Resolved"}
                          size="sm"
                          variant="outline"
                        >
                          Resolve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case "history":
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">History List</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deliveryHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.deliveryDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusBadgeColor(item.status)}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content with proper spacing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>
    </div>
  )
}
