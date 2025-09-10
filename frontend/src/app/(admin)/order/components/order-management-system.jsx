"use client"

import React, { useEffect } from "react"
import axios from "axios"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { DashboardStats } from "./dashboard-stats"
import { OrderSearchFilters } from "./order-search-filters"
import { ExpandableProductRow } from "./expandable-product-row"
import { OrderActions } from "./order-actions"
import { OrderDetailsDialog } from "./order-details-dialog"

import {
  Phone,
  Package,
  Mail,
  Eye,
  Gift,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
  Download,
  Printer,
} from "lucide-react"

// Enhanced mock data with multiple products per order
const mockOrders = [
  {
    id: "DEL-001",
    orderId: "ORD-2025-001",
    referenceCode: "GC001",
    customerName: "Sarah Johnson",
    customerPhone: "+1 234-567-8900",
    customerEmail: "sarah.j@email.com",
    address: "456 Oak Avenue, Apt 2B, New York, NY 10002",
    billingAddress: "123 Main Street, New York, NY 10001",
    status: "pending_acceptance",
    assignedStaff: null,
    staffPhone: null,
    estimatedTime: "2:00 PM - 4:00 PM",
    codAmount: 0,
    totalAmount: 289.97,
    isGift: true,
    giftWrap: true,
    giftMessage: "🎉 Happy Birthday Sarah! Hope you love this special gift! 💝",
    specialInstructions: "Ring doorbell twice, leave with concierge if no answer",
    priority: "high",
    orderDate: "2025-01-22T10:30:00Z",
    items: [
      {
        id: "ITEM-001",
        name: "Premium Gift Box - Luxury Collection",
        sku: "PGB-LUX-001",
        quantity: 1,
        price: 129.99,
        category: "Gift Boxes",
        image: "/placeholder.svg?height=60&width=60&text=Gift+Box",
        status: "in_stock",
        weight: "2.5 lbs",
      },
      {
        id: "ITEM-002",
        name: "Artisan Chocolate Truffles",
        sku: "ACT-DEL-002",
        quantity: 2,
        price: 49.99,
        category: "Chocolates",
        image: "/placeholder.svg?height=60&width=60&text=Chocolate",
        status: "in_stock",
        weight: "1.2 lbs",
      },
      {
        id: "ITEM-003",
        name: "Silk Ribbon Set",
        sku: "SRS-PNK-003",
        quantity: 1,
        price: 59.99,
        category: "Accessories",
        image: "/placeholder.svg?height=60&width=60&text=Ribbon",
        status: "in_stock",
        weight: "0.3 lbs",
      },
    ],
    packingStatus: "not_packed",
    customerNotes: "First time customer, please handle with extra care",
    internalNotes: "",
    orderSource: "website",
    paymentMethod: "credit_card",
    shippingMethod: "express",
    trackingNumber: "",
  },
  {
    id: "DEL-002",
    orderId: "ORD-2025-002",
    referenceCode: "GC002",
    customerName: "Michael Chen",
    customerPhone: "+1 234-567-8901",
    customerEmail: "michael.c@email.com",
    address: "789 Pine Street, Brooklyn, NY 11201",
    billingAddress: "789 Pine Street, Brooklyn, NY 11201",
    status: "accepted",
    assignedStaff: "John Delivery",
    staffPhone: "+1 234-567-9000",
    estimatedTime: "10:00 AM - 12:00 PM",
    codAmount: 89.5,
    totalAmount: 89.5,
    isGift: false,
    giftWrap: false,
    giftMessage: null,
    specialInstructions: "Call before delivery",
    priority: "normal",
    orderDate: "2025-01-22T09:15:00Z",
    items: [
      {
        id: "ITEM-004",
        name: "Artisan Candle Set",
        sku: "ACS-VAN-004",
        quantity: 2,
        price: 44.75,
        category: "Candles",
        image: "/placeholder.svg?height=60&width=60&text=Candle",
        status: "in_stock",
        weight: "3.0 lbs",
      },
    ],
    packingStatus: "packing_in_progress",
    customerNotes: "Regular customer, prefers morning delivery",
    internalNotes: "Customer requested vanilla scent",
    orderSource: "mobile_app",
    paymentMethod: "paypal",
    shippingMethod: "standard",
    trackingNumber: "TRK123456789",
  },
  {
    id: "DEL-003",
    orderId: "ORD-2025-003",
    referenceCode: "GC003",
    customerName: "Emma Wilson",
    customerPhone: "+1 234-567-8902",
    customerEmail: "emma.w@email.com",
    address: "321 Elm Street, Queens, NY 11375",
    billingAddress: "321 Elm Street, Queens, NY 11375",
    status: "packed_ready",
    assignedStaff: "Maria Rodriguez",
    staffPhone: "+1 234-567-9001",
    estimatedTime: "3:00 PM - 5:00 PM",
    codAmount: 0,
    totalAmount: 449.96,
    isGift: true,
    giftWrap: true,
    giftMessage: "Congratulations on your promotion! 🎊",
    specialInstructions: "Fragile items - handle with care",
    priority: "high",
    orderDate: "2025-01-22T08:45:00Z",
    items: [
      {
        id: "ITEM-005",
        name: "Luxury Jewelry Box",
        sku: "LJB-ROG-005",
        quantity: 1,
        price: 299.99,
        category: "Jewelry",
        image: "/placeholder.svg?height=60&width=60&text=Jewelry",
        status: "in_stock",
        weight: "4.2 lbs",
      },
      {
        id: "ITEM-006",
        name: "Pearl Necklace",
        sku: "PN-WHT-006",
        quantity: 1,
        price: 149.97,
        category: "Jewelry",
        image: "/placeholder.svg?height=60&width=60&text=Necklace",
        status: "in_stock",
        weight: "0.5 lbs",
      },
    ],
    packingStatus: "packed",
    customerNotes: "VIP customer, premium packaging required",
    internalNotes: "Include care instructions for jewelry",
    orderSource: "phone",
    paymentMethod: "credit_card",
    shippingMethod: "express",
    trackingNumber: "TRK987654321",
  },
]

const statusColors = {
  pending_acceptance: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  packed_ready: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  failed_attempt: "bg-red-100 text-red-800",
}

const packingStatusColors = {
  not_packed: "bg-gray-100 text-gray-800",
  packing_in_progress: "bg-yellow-100 text-yellow-800",
  packed: "bg-green-100 text-green-800",
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  normal: "bg-gray-100 text-gray-800",
  low: "bg-green-100 text-green-800",
}

export function OrderManagementSystem() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("pending")
  const [expandedOrders, setExpandedOrders] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [internalNotes, setInternalNotes] = useState({})
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    const matchesTab =
      (activeTab === "pending" && order.status === "pending_acceptance") ||
      (activeTab === "accepted" && order.status === "accepted") ||
      (activeTab === "packed" && order.status === "packed_ready") ||
      (activeTab === "delivery" && (order.status === "out_for_delivery" || order.status === "delivered")) ||
      activeTab === "all"

    return matchesSearch && matchesStatus && matchesTab
  })

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const acceptOrder = (orderId) => {
    console.log(`Accepting order: ${orderId}`)
  }

  const rejectOrder = (orderId) => {
    console.log(`Rejecting order: ${orderId}`)
  }

  const packingComplete = (orderId) => {
    console.log(`Marking packing complete for order: ${orderId}`)
  }

  const updateQuantity = (orderId, itemId, newQuantity) => {
    console.log(`Updating quantity for order ${orderId}, item ${itemId} to ${newQuantity}`)
  }

  const removeItem = (orderId, itemId) => {
    console.log(`Removing item ${itemId} from order ${orderId}`)
  }

  const saveInternalNotes = (orderId) => {
    console.log(`Saving notes for order ${orderId}: ${internalNotes[orderId]}`)
  }

  const printCustomerDetails = (order) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Customer Details - ${order.referenceCode}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .section { margin-bottom: 25px; }
              .label { font-weight: bold; color: #333; }
              .gift-message { background: #fef7f7; padding: 15px; border-left: 4px solid #ec4899; margin: 15px 0; border-radius: 5px; }
              .items { border-collapse: collapse; width: 100%; margin-top: 10px; }
              .items th, .items td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              .items th { background-color: #f8f9fa; font-weight: bold; }
              .priority-high { color: #dc3545; font-weight: bold; }
              .priority-normal { color: #6c757d; }
              .priority-low { color: #28a745; }
              .cod-amount { background: #fff3cd; padding: 10px; border: 1px solid #ffeaa7; border-radius: 5px; margin: 10px 0; }
              .instructions { background: #e7f3ff; padding: 10px; border-left: 4px solid #007bff; margin: 10px 0; }
              .total-summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎁 Gift Commerce - Customer Details</h1>
              <h2>Order: ${order.referenceCode}</h2>
              <p>Order ID: ${order.orderId}</p>
            </div>
            
            <div class="section">
              <h3>📋 Order Information</h3>
              <p><span class="label">Order Date:</span> ${new Date(order.orderDate).toLocaleString()}</p>
              <p><span class="label">Status:</span> ${order.status.replace("_", " ").toUpperCase()}</p>
              <p><span class="label">Priority:</span> <span class="priority-${order.priority}">${order.priority.toUpperCase()}</span></p>
              <p><span class="label">Packing Status:</span> ${order.packingStatus.replace("_", " ").toUpperCase()}</p>
              <p><span class="label">Order Source:</span> ${order.orderSource.replace("_", " ").toUpperCase()}</p>
              <p><span class="label">Payment Method:</span> ${order.paymentMethod.replace("_", " ").toUpperCase()}</p>
              ${order.assignedStaff ? `<p><span class="label">Assigned Staff:</span> ${order.assignedStaff}</p>` : ""}
              ${order.trackingNumber ? `<p><span class="label">Tracking Number:</span> ${order.trackingNumber}</p>` : ""}
            </div>
            
            <div class="section">
              <h3>👤 Customer Information</h3>
              <p><span class="label">Name:</span> ${order.customerName}</p>
              <p><span class="label">Phone:</span> ${order.customerPhone}</p>
              <p><span class="label">Email:</span> ${order.customerEmail}</p>
              ${order.customerNotes ? `<p><span class="label">Customer Notes:</span> ${order.customerNotes}</p>` : ""}
            </div>
            
            <div class="section">
              <h3>📍 Delivery Information</h3>
              <p><span class="label">Delivery Address:</span><br>${order.address}</p>
              <p><span class="label">Billing Address:</span><br>${order.billingAddress}</p>
              <p><span class="label">Estimated Time:</span> ${order.estimatedTime}</p>
              <p><span class="label">Shipping Method:</span> ${order.shippingMethod.replace("_", " ").toUpperCase()}</p>
              ${order.specialInstructions ? `<div class="instructions"><strong>⚠️ Special Instructions:</strong><br>${order.specialInstructions}</div>` : ""}
            </div>
            
            <div class="section">
              <h3>📦 Order Items (${order.items.length} items)</h3>
              <table class="items">
                <tr>
                  <th>Item Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Weight</th>
                </tr>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price}</td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    <td>${item.weight}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </table>
            </div>
            
            <div class="section">
              <h3>💰 Payment Summary</h3>
              <div class="total-summary">
                <p><span class="label">Subtotal:</span> $${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
                <p><span class="label">Total Amount:</span> <strong>$${order.totalAmount}</strong></p>
                ${order.codAmount > 0 ? `<div class="cod-amount"><strong>💵 COD Amount:</strong> $${order.codAmount}<br><em>Collect cash on delivery</em></div>` : "<p><span class='label'>Payment Status:</span> Paid Online ✅</p>"}
              </div>
            </div>
            
            ${
              order.isGift
                ? `
              <div class="section">
                <h3>🎁 Gift Details</h3>
                <p><span class="label">Gift Order:</span> Yes ✅</p>
                <p><span class="label">Gift Wrap:</span> ${order.giftWrap ? "Yes ✅" : "No ❌"}</p>
                ${order.giftMessage ? `<div class="gift-message"><strong>💌 Gift Message:</strong><br>${order.giftMessage}</div>` : ""}
              </div>
            `
                : `
              <div class="section">
                <h3>📦 Regular Order</h3>
                <p>This is a regular order (not a gift)</p>
              </div>
            `
            }
            
            ${
              order.internalNotes
                ? `
            <div class="section">
              <h3>📝 Internal Notes</h3>
              <div class="instructions">${order.internalNotes}</div>
            </div>
            `
                : ""
            }
            
            <div class="section" style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
              <p><strong>📅 Printed on:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>🏢 Gift Commerce Admin System</strong></p>
              <p><strong>📊 Total Items:</strong> ${order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</p>
              <p><strong>⚖️ Total Weight:</strong> ${order.items.reduce((sum, item) => sum + Number.parseFloat(item.weight), 0).toFixed(1)} lbs</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/all")
        console.log("All Orders:", response.data.orders)
      } catch (error) {
        console.error("Error fetching all orders:", error)
      }
    }

    fetchAllOrders()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        {/* <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gift Commerce</h1>
                <p className="text-sm text-gray-600">Advanced Order Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bell className="h-4 w-4" />
                <span>5 notifications</span>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div> */}
      </header>

      <div className="p-6 space-y-6">
        <DashboardStats orders={mockOrders} />

        {/* Enhanced Order Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-xl">Advanced Order Management System</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print All
                </Button>
                <Button size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <OrderSearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            {/* Enhanced Order Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
  <TabsList className="flex justify-between gap-x-4 w-full px-2 py-1 bg-gray-50 rounded-md border-2 border-gray-400">
  <TabsTrigger value="accepted" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Accepted</TabsTrigger>
  <TabsTrigger value="packed" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Packed</TabsTrigger>
  <TabsTrigger value="delivery" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Delivery</TabsTrigger>
  <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">All</TabsTrigger>
      </TabsList>
              <TabsContent value={activeTab}>
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Order Details</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Gift</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <React.Fragment key={order.id}>
                          <TableRow key={order.id} className="hover:bg-gray-50">
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="p-1"
                              >
                                {expandedOrders.includes(order.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-blue-600">{order.referenceCode}</div>
                                <div className="text-sm text-muted-foreground">{order.orderId}</div>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className={priorityColors[order.priority]}>
                                    {order.priority}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {order.orderSource}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(order.orderDate).toLocaleDateString()}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{order.customerName}</div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {order.customerPhone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {order.customerEmail}
                                </div>
                                {order.customerNotes && (
                                  <div className="text-xs text-blue-600 bg-blue-50 p-1 rounded">
                                    💡 {order.customerNotes}
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{order.items.length} products</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} total items
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleOrderExpansion(order.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                                >
                                  {expandedOrders.includes(order.id) ? "Hide Products" : "View Products"}
                                </Button>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-2">
                                <Badge className={statusColors[order.status]}>{order.status.replace("_", " ")}</Badge>
                                <Badge className={packingStatusColors[order.packingStatus]}>
                                  {order.packingStatus.replace("_", " ")}
                                </Badge>
                                {order.assignedStaff && (
                                  <div className="text-xs text-muted-foreground">👤 {order.assignedStaff}</div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-lg">${order.totalAmount}</div>
                                {order.codAmount > 0 && (
                                  <div className="text-xs text-orange-600 font-medium">💵 COD: ${order.codAmount}</div>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  {order.paymentMethod.replace("_", " ")}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                {order.isGift && <Gift className="h-4 w-4 text-pink-500" />}
                                {order.giftWrap && (
                                  <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-800">
                                    🎁 Wrapped
                                  </Badge>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="text-right">
                              <Dialog>
                                <OrderActions
                                  order={order}
                                  onAcceptOrder={acceptOrder}
                                  onRejectOrder={rejectOrder}
                                  onPackingComplete={packingComplete}
                                  onPrintCustomerDetails={printCustomerDetails}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="hover:bg-gray-50"
                                      onClick={() => setSelectedOrder(order)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                </OrderActions>

                                {selectedOrder && (
                                  <OrderDetailsDialog
                                    order={selectedOrder}
                                    isOpen={!!selectedOrder}
                                    onClose={() => setSelectedOrder(null)}
                                    onAcceptOrder={acceptOrder}
                                    onRejectOrder={rejectOrder}
                                    onPackingComplete={packingComplete}
                                    onPrintCustomerDetails={printCustomerDetails}
                                    onUpdateQuantity={updateQuantity}
                                    onRemoveItem={removeItem}
                                    onSaveInternalNotes={saveInternalNotes}
                                    internalNotes={internalNotes}
                                    setInternalNotes={setInternalNotes}
                                  />
                                )}
                              </Dialog>
                            </TableCell>
                          </TableRow>

                          <ExpandableProductRow order={order} isExpanded={expandedOrders.includes(order.id)} />
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
