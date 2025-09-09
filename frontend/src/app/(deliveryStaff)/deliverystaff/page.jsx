"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Package, Truck, CheckCircle, AlertCircle, Clock, Eye, MapPin, Phone, Mail, Calendar, BarChart3, Route } from "lucide-react"
import NavigationBar from "./components/navigation-bar"
import ProductImage from "./components/product-image"
import DeliveryRoute from "./components/delivery-route"
import DeliveryAnalytics from "./components/delivery-analytics"
import { authenticatedFetch, checkAuthentication } from "./utils/auth"

export default function DeliveryDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("delivery")
  const [orders, setOrders] = useState([])
  const [complaints, setComplaints] = useState([])
  const [deliveryHistory, setDeliveryHistory] = useState([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inTransitOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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

  // API functions
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  const fetchOrders = async (page = 1, status = filterStatus, search = searchQuery) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(status !== 'all' && { status }),
        ...(search && { query: search })
      })

      const response = await authenticatedFetch(`/delivery/orders?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      if (data.success) {
        // Ensure orders is an array and has the expected structure
        const orders = Array.isArray(data.orders) ? data.orders : []
        setOrders(orders)
        setCurrentPage(data.pagination?.currentPage || 1)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      // Set empty array instead of mock data to avoid structure mismatch
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await authenticatedFetch('/delivery/stats')

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.stats) {
          setStats(data.stats)
        }
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      // For now, use mock data - implement when complaint system is ready
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
      // For now, use mock data - implement when history system is ready
      await new Promise((resolve) => setTimeout(resolve, 500))
      setDeliveryHistory(mockDeliveryHistory)
    } catch (error) {
      console.error("Error fetching delivery history:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus, notes = '') => {
    setStatusUpdateLoading(true)
    try {
      const response = await authenticatedFetch(`/delivery/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, notes })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const data = await response.json()
      if (data.success) {
        // Refresh orders list
        await fetchOrders(currentPage, filterStatus, searchQuery)
        await fetchStats()
        alert('Order status updated successfully!')
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert('Failed to update order status')
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  const handleSubmit = async (orderId) => {
    await updateOrderStatus(orderId, 'Delivered')
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
    setCurrentPage(1)
    fetchOrders(1, value, searchQuery)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = () => {
    setCurrentPage(1)
    // For real API data, we don't need to filter locally since the API handles search
    // But we can still call fetchOrders to refresh the data
    fetchOrders(1, filterStatus, searchQuery)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchOrders(page, filterStatus, searchQuery)
  }

  // Note: Filtering and searching is handled by the API, so we use orders directly

  // Load initial data
  useEffect(() => {
    // Check if user is authenticated before making API calls
    const checkAuthAndFetch = async () => {
      try {
        const isAuthenticated = await checkAuthentication()
        
        if (isAuthenticated) {
          // User is authenticated, fetch dashboard data
          await Promise.all([
            fetchOrders(),
            fetchStats(),
            fetchComplaints(),
            fetchDeliveryHistory()
          ])
        } else {
          console.log('User not authenticated, redirecting to login...')
          // Redirect to login if not authenticated
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        // Fallback to mock data for development
        fetchComplaints()
        fetchDeliveryHistory()
      }
    }
    
    checkAuthAndFetch()
  }, [])

  // Order Details Modal Component
  const OrderDetailsModal = ({ order, isOpen, onClose }) => {
    const [statusNotes, setStatusNotes] = useState('')
    const [selectedStatus, setSelectedStatus] = useState(order?.status || '')

    if (!order) return null

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Order Details - #{order._id || order.id}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Current Status</h3>
                <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => updateOrderStatus(order._id || order.id, selectedStatus, statusNotes)}
                  disabled={statusUpdateLoading || selectedStatus === order.status}
                  size="sm"
                >
                  Update
                </Button>
              </div>
            </div>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{order.user?.firstName} {order.user?.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{order.user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{order.user?.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">{order.user?.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Order Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <ProductImage
                        src={item.product?.images?.[0] || item.image || ""}
                        alt={item.product?.name || item.name}
                        productName={item.product?.name || item.name}
                        width={60}
                        height={60}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product?.name || item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: ${item.price || item.product?.salePrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-lg font-bold text-purple-600">${order.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Update Notes
              </label>
              <Textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Add notes about the status update..."
                rows={3}
              />
            </div>

            {/* Order Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Status History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusBadgeColor(history.status)}>{history.status}</Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(history.updatedAt).toLocaleString()}
                            </span>
                          </div>
                          {history.notes && (
                            <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

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
          <div className="space-y-6">
            {/* Dashboard Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">In Transit</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.inTransitOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Delivered</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cancelled</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.cancelledOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Management */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <Select value={filterStatus} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 text-[#822BE2]" />
                      <Input
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-10 w-full sm:w-64 border focus-visible:ring-0 focus-visible:border-[#822BE2] focus:outline-none"
                      />
                    </div>
                    <Button onClick={handleSearchSubmit} variant="outline">
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id || order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id?.slice(-8) || order.id || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.user?.firstName || 'N/A'} {order.user?.lastName || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{order.user?.phone || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {order.items && order.items.length > 0 ? (
                                <>
                                  <ProductImage
                                    src={order.items[0].product?.images?.[0] || order.items[0].image || ""}
                                    alt={order.items[0].product?.name || order.items[0].name}
                                    productName={order.items[0].product?.name || order.items[0].name}
                                    width={40}
                                    height={40}
                                  />
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">
                                      {order.items[0].product?.name || order.items[0].name || 'Unknown Product'}
                                    </div>
                                    {order.items.length > 1 && (
                                      <div className="text-sm text-gray-500">
                                        +{order.items.length - 1} more items
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div className="text-sm text-gray-500">No items</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.total?.toFixed(2) || order.amount?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusBadgeColor(order.status)}>{order.status || 'Unknown'}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.orderedAt || order.createdAt ? 
                              new Date(order.orderedAt || order.createdAt).toLocaleDateString() : 
                              'N/A'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowOrderDetails(true)
                              }}
                              size="sm"
                              variant="outline"
                              className="flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </Button>
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                              <Button
                                onClick={() => handleSubmit(order._id || order.id)}
                                disabled={statusUpdateLoading}
                                size="sm"
                                className="rounded-[8px] bg-purple-600 hover:bg-purple-700 text-white font-medium"
                              >
                                {statusUpdateLoading ? 'Updating...' : 'Mark Delivered'}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
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
      case "route":
        return (
          <div className="space-y-6">
            <DeliveryRoute orders={orders} />
          </div>
        )
      case "analytics":
        return (
          <div className="space-y-6">
            <DeliveryAnalytics stats={stats} orders={orders} />
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

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={showOrderDetails} 
        onClose={() => {
          setShowOrderDetails(false)
          setSelectedOrder(null)
        }} 
      />
    </div>
  )
}
