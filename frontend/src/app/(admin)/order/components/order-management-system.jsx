"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Send,
  Filter,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  packing: "bg-orange-100 text-orange-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function OrderManagementSystem() {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("pending")
  const [expandedOrders, setExpandedOrders] = useState([])
  const [internalNotes, setInternalNotes] = useState({})
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  // Reports & Analytics state
  const [reportDateRange, setReportDateRange] = useState("last30days")
  const [reportFromDate, setReportFromDate] = useState("")
  const [reportToDate, setReportToDate] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    if (!order || !order.user || !order.items) return false

    const matchesSearch =
      (order.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))) ?? false

    const matchesTab =
      (activeTab === "pending" && order.status === "pending") ||
      (activeTab === "accepted" && order.status === "processing") ||
      (activeTab === "packed" && order.status === "packing") ||
      (activeTab === "delivery" && order.status === "shipped") ||
      (activeTab === "all") // Show ALL orders regardless of status in All tab

    // Apply date filtering only for "All" tab
    let matchesDateFilter = true;
    if (activeTab === "all" && (fromDate || toDate)) {
      const orderDate = new Date(order.orderDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (from && to) {
        matchesDateFilter = orderDate >= from && orderDate <= to;
      } else if (from) {
        matchesDateFilter = orderDate >= from;
      } else if (to) {
        matchesDateFilter = orderDate <= to;
      }
    }

    return matchesSearch && matchesTab && matchesDateFilter
  })

  // Debug logging
  console.log('Active tab:', activeTab);
  console.log('Total orders:', orders.length);
  console.log('Filtered orders:', filteredOrders.length);
  console.log('Orders by status:', orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {}));

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId],
    )
  }

  const confirmAction = (message, action) => {
    if (window.confirm(message)) {
      action();
    }
  };

  const testProductsEndpoint = async () => {
    try {
      console.log("Testing products endpoint...");
      const response = await axios.get(`${API_BASE_URL}/products/test`);
      console.log("Products test response:", response.data);
      alert(`Products test: ${response.data.message}\nTotal products: ${response.data.totalProducts}`);
    } catch (error) {
      console.error("Error testing products endpoint:", error);
      alert(`Error testing products: ${error.message}`);
    }
  };

  const reduceProductStock = async (orderItems) => {
    try {
      // console.log("Order items being processed:", orderItems);
      // console.log("API_BASE_URL value:", API_BASE_URL);
      
      // Filter out items without valid product IDs
      const validItems = orderItems.filter(item => {
        let productId = null;
        
        if (item.product) {
          // If product is an object, extract its _id
          if (typeof item.product === 'object' && item.product._id) {
            productId = item.product._id;
          } else if (typeof item.product === 'string') {
            productId = item.product;
          }
        } else if (item.productId) {
          productId = item.productId;
        } else if (item.id) {
          productId = item.id;
        }
        
        const isValidObjectId = productId && typeof productId === 'string' && productId.match(/^[0-9a-fA-F]{24}$/);
        
        if (!isValidObjectId) {
          // console.warn("Skipping item with invalid product ID:", item, "Extracted ID:", productId);
          return false;
        }
        return true;
      });

      if (validItems.length === 0) {
        // console.warn("No valid product IDs found in order items");
        alert("Warning: No valid product IDs found. Stock reduction skipped.");
        return;
      }

      const itemsToSend = validItems.map((item) => {
        let productId = null;
        
        if (item.product) {
          if (typeof item.product === 'object' && item.product._id) {
            productId = item.product._id;
          } else if (typeof item.product === 'string') {
            productId = item.product;
          }
        } else if (item.productId) {
          productId = item.productId;
        } else if (item.id) {
          productId = item.id;
        }
        
        // console.log("Valid item:", item, "ProductId extracted:", productId);
        return {
          productId: productId,
          quantity: item.quantity,
        };
      });

      // console.log("Items being sent to API:", itemsToSend);
      // console.log("API URL being used:", `${API_BASE_URL}/products/reduce-stock`);
      // console.log("Request payload:", JSON.stringify({ items: itemsToSend }, null, 2));

      const response = await axios.put(`${API_BASE_URL}/products/reduce-stock`, {
        items: itemsToSend,
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        // console.log("Product stock updated successfully:", response.data);
        // Removed alert for successful stock update
      } else {
        // console.error("Failed to update product stock:", response.data.message);
        alert(`Failed to update stock: ${response.data.message}`);
      }
    } catch (error) {
      // console.error("Error updating product stock:", error);
      // console.error("Error response:", error.response?.data);
      // console.error("Full error details:", {
      //   message: error.message,
      //   status: error.response?.status,
      //   statusText: error.response?.statusText,
      //   data: error.response?.data,
      //   errors: error.response?.data?.errors
      // });
      
      if (error.response?.data?.data?.insufficientStockItems) {
        const insufficientItems = error.response.data.data.insufficientStockItems;
        const itemsList = insufficientItems.map(item => 
          `${item.productName}: requested ${item.requestedQuantity}, available ${item.availableStock}`
        ).join('\n');
        alert(`Insufficient stock for:\n${itemsList}`);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg || err).join('\n');
        alert(`Validation errors:\n${errorMessages}`);
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Error updating product stock. Please try again.");
      }
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      console.log("Order ID being sent:", orderId); // Debugging log

      const button = document.querySelector(`#accept-order-button-${orderId}`);
      if (button) {
        button.disabled = true;
        button.textContent = "Processing...";
      }

      // Accept the order (Pending -> Processing)
      const acceptResponse = await axios.put(
        `${API_BASE_URL}/orders/accept`,
        {
          orderId: orderId,
        },
        {
          withCredentials: true
        }
      );

      if (acceptResponse.data.success) {
        console.log(`Order ${orderId} accepted successfully`);
        
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: "processing" }
              : order
          )
        );

        // Reduce product stock
        const order = orders.find((o) => o.id === orderId);
        if (order && order.items) {
          await reduceProductStock(order.items);
        }

        alert(`Order ${orderId} has been accepted and moved to processing!`);
      } else {
        console.error(`Failed to accept order: ${acceptResponse.data.message}`);
        alert(`Failed to accept order: ${acceptResponse.data.message}`);
      }
    } catch (error) {
      console.error("Error processing order:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Error processing order. Please try again.");
      }
    } finally {
      const button = document.querySelector(`#accept-order-button-${orderId}`);
      if (button) {
        button.disabled = false;
        button.textContent = "Accept Order";
      }
    }
  }

  const updateOrderToPacking = async (orderId) => {
    try {
      console.log("Moving order to packing:", orderId);

      const button = document.querySelector(`#move-to-packing-button-${orderId}`);
      if (button) {
        button.disabled = true;
        button.textContent = "Processing...";
      }

      const response = await axios.put(
        `${API_BASE_URL}/orders/update-to-packing`,
        {
          orderId: orderId,
        },
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        console.log(`Order ${orderId} status updated to Packing`);
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: "packing" }
              : order
          )
        );

        alert(`Order ${orderId} has been moved to packing!`);
      } else {
        console.error(`Failed to update order to packing: ${response.data.message}`);
        alert(`Failed to update order to packing: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating order to packing:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Error updating order to packing. Please try again.");
      }
    } finally {
      const button = document.querySelector(`#move-to-packing-button-${orderId}`);
      if (button) {
        button.disabled = false;
        button.textContent = "Move to Packing";
      }
    }
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
              ${order.user?.address ? `<p><span class="label">Address:</span> ${order.user.address}</p>` : ""}
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
                </tr>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
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
              <p><strong>⚖️ Total Weight:</strong> ${order.items.reduce((sum, item) => sum + Number.parseFloat(item.weight?.replace(' lbs', '') || '0'), 0).toFixed(1)} lbs</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const printAllOrdersSequentially = async (orders) => {
    if (!orders || orders.length === 0) {
      alert("No orders available to print.");
      return;
    }

    // Show confirmation with order count
    const confirmed = window.confirm(
      `Are you sure you want to print ${orders.length} orders? Each order will be printed separately.`
    );
    
    if (!confirmed) return;

    // Print orders one by one with delays
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      console.log(`Printing order ${i + 1} of ${orders.length}: ${order.referenceCode}`);
      
      // Print the order
      printOrderDetails(order);
      
      // Wait before printing the next order (except for the last one)
      if (i < orders.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
      }
    }
    
    // Show completion message
    setTimeout(() => {
      alert(`Successfully initiated printing for ${orders.length} orders. Please check your printer queue.`);
    }, 2000);
  };

  const printOrderDetails = (order) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
      const totalWeight = order.items.reduce((sum, item) => sum + parseFloat(item.weight?.replace(' lbs', '') || '0'), 0);
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Gift Commerce - Order Invoice #${order.referenceCode}</title>
            <style>
              @media print {
                @page { margin: 0.5in; size: A4; }
                body { margin: 0; }
              }
              body { 
                font-family: 'Arial', sans-serif; 
                margin: 0; 
                padding: 20px; 
                line-height: 1.4; 
                color: #333;
                background: white;
              }
              .invoice-container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: white; 
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
              }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px; 
                text-align: center; 
                margin-bottom: 0;
              }
              .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: bold; }
              .header h2 { margin: 0 0 5px 0; font-size: 20px; font-weight: normal; }
              .header p { margin: 0; font-size: 14px; opacity: 0.9; }
              
              .content { padding: 30px; }
              .section { 
                margin-bottom: 30px; 
                min-width: 120px;
              }
              .value { color: #333; }
              
              .items-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 15px 0;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .items-table th { 
                background: #f8f9fa; 
                padding: 15px 12px; 
                text-align: left; 
                font-weight: bold;
                color: #555;
                border-bottom: 2px solid #dee2e6;
              }
              .items-table td { 
                padding: 12px; 
                border-bottom: 1px solid #eee;
                vertical-align: top;
              }
              .items-table tr:hover { background: #f8f9fa; }
              .items-table tr:last-child td { border-bottom: none; }
              
              .payment-summary {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #28a745;
              }
              .payment-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px 0;
              }
              .payment-row.total {
                border-top: 2px solid #dee2e6;
                margin-top: 15px;
                padding-top: 15px;
                font-size: 18px;
                font-weight: bold;
                color: #28a745;
              }
              
              .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
              }
              .status-processing { background: #e3f2fd; color: #1976d2; }
              .status-packing { background: #fff3e0; color: #f57c00; }
              .status-shipped { background: #f3e5f5; color: #7b1fa2; }
              .status-delivered { background: #e8f5e8; color: #2e7d32; }
              
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #eee;
                text-align: center;
                color: #666;
                font-size: 12px;
              }
              
              .company-info {
                background: #667eea;
                color: white;
                padding: 15px;
                margin-top: 20px;
                border-radius: 6px;
                text-align: center;
              }
              
              @media print {
                .invoice-container { border: none; border-radius: 0; }
                .header { break-inside: avoid; }
                .section { break-inside: avoid; }
                .items-table { break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="header">
                <h1>🎁 GIFT COMMERCE</h1>
                <h2>INVOICE</h2>
                <p>Order Reference: ${order.referenceCode} | Invoice Date: ${new Date().toLocaleDateString()}</p>
              </div>

              <div class="content">
                <div class="section">
                  <div class="section-title">📋 Order Information</div>
                  <div class="info-grid">
                    <div>
                      <div class="info-item"><span class="label">Order ID:</span> <span class="value">${order.orderId}</span></div>
                      <div class="info-item"><span class="label">Order Date:</span> <span class="value">${new Date(order.orderDate).toLocaleDateString()} ${new Date(order.orderDate).toLocaleTimeString()}</span></div>
                      <div class="info-item"><span class="label">Order Source:</span> <span class="value">${order.orderSource.replace('_', ' ').toUpperCase()}</span></div>
                      <div class="info-item"><span class="label">Payment Method:</span> <span class="value">${order.paymentMethod.replace('_', ' ').toUpperCase()}</span></div>
                    </div>
                    <div>
                      <div class="info-item"><span class="label">Status:</span> <span class="status-badge status-${order.status}">${order.status.replace('_', ' ').toUpperCase()}</span></div>
                      <div class="info-item"><span class="label">Priority:</span> <span class="value">${order.priority.toUpperCase()}</span></div>
                      <div class="info-item"><span class="label">Estimated Delivery:</span> <span class="value">${order.estimatedTime}</span></div>
                      <div class="info-item"><span class="label">Shipping Method:</span> <span class="value">${order.shippingMethod.replace('_', ' ').toUpperCase()}</span></div>
                    </div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">� Customer Information</div>
                  <div class="info-grid">
                    <div>
                      <div class="info-item"><span class="label">Name:</span> <span class="value">${order.customerName}</span></div>
                      <div class="info-item"><span class="label">Phone:</span> <span class="value">${order.customerPhone}</span></div>
                      <div class="info-item"><span class="label">Email:</span> <span class="value">${order.customerEmail}</span></div>
                    </div>
                    <div>
                      <div class="info-item"><span class="label">Delivery Address:</span><br><span class="value">${order.address}</span></div>
                      <div class="info-item"><span class="label">Billing Address:</span><br><span class="value">${order.billingAddress}</span></div>
                    </div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">📦 Order Items (${order.items.length} Products, ${totalItems} Total Items)</div>
                  <table class="items-table">
                    <thead>
                      <tr>
                        <th style="width: 40%">Item Name</th>
                        <th style="width: 15%">SKU</th>
                        <th style="width: 15%">Category</th>
                        <th style="width: 10%">Qty</th>
                        <th style="width: 10%">Unit Price</th>
                        <th style="width: 10%">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.items.map((item) => `
                        <tr>
                          <td><strong>${item.name}</strong></td>
                          <td>${item.sku}</td>
                          <td>${item.category}</td>
                          <td style="text-align: center">${item.quantity}</td>
                          <td style="text-align: right">$${item.price.toFixed(2)}</td>
                          <td style="text-align: right"><strong>$${(item.price * item.quantity).toFixed(2)}</strong></td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>

                <div class="section">
                  <div class="section-title">💰 Payment Summary</div>
                  <div class="payment-summary">
                    <div class="payment-row">
                      <span>Subtotal (${totalItems} items):</span>
                      <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="payment-row">
                      <span>Shipping & Handling:</span>
                      <span>$0.00</span>
                    </div>
                    <div class="payment-row">
                      <span>Tax:</span>
                      <span>$0.00</span>
                    </div>
                    <div class="payment-row total">
                      <span>TOTAL AMOUNT:</span>
                      <span>$${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                      <div class="payment-row">
                        <span>Payment Status:</span>
                        <span style="color: #28a745; font-weight: bold;">✅ PAID ONLINE</span>
                      </div>
                    </div>
                  </div>
                </div>

                ${order.isGift ? `
                  <div class="section">
                    <div class="section-title">🎁 Gift Information</div>
                    <div class="info-item"><span class="label">Gift Order:</span> <span class="value">Yes ✅</span></div>
                    <div class="info-item"><span class="label">Gift Wrap:</span> <span class="value">${order.giftWrap ? 'Yes ✅' : 'No ❌'}</span></div>
                    ${order.giftMessage ? `<div class="info-item"><span class="label">Gift Message:</span><br><span class="value">"${order.giftMessage}"</span></div>` : ''}
                  </div>
                ` : ''}

                <div class="footer">
                  <div class="company-info">
                    <strong>🏢 Gift Commerce Admin System</strong><br>
                    Professional Order Management & Invoice Generation<br>
                    📊 Total Weight: ${totalWeight.toFixed(1)} lbs | 📅 Printed: ${new Date().toLocaleString()}
                  </div>
                  <p style="margin-top: 15px;">
                    This is a computer-generated invoice. No signature required.<br>
                    For any queries, please contact our customer service team.
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250); // Small delay to ensure content loads
    }
  };

  const updateButtonState = (buttonId, isProcessing, defaultText) => {
    const button = document.querySelector(buttonId);
    if (button) {
      button.disabled = isProcessing;
      button.textContent = isProcessing ? "Processing..." : defaultText;
    }
  };

  const confirmPacked = async (orderId) => {
    const buttonId = `#confirm-packed-button-${orderId}`;
    updateButtonState(buttonId, true, "Mark as Shipped");

    try {
      console.log("Marking order as shipped:", orderId);

      const response = await axios.put(
        `${API_BASE_URL}/orders/update-to-shipped`,
        {
          orderId,
        },
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        console.log(`Order ${orderId} status updated to Shipped`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "shipped" } : order
          )
        );

        alert(`Order ${orderId} has been marked as shipped and is ready for delivery!`);
      } else {
        console.error(`Failed to update order status: ${response.data.message}`);
        alert(`Failed to update order status: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Error updating order status. Please try again.");
      }
    } finally {
      updateButtonState(buttonId, false, "Mark as Shipped");
    }
  };

  const markAsDelivered = async (orderId) => {
    const buttonId = `#mark-as-delivered-button-${orderId}`;
    updateButtonState(buttonId, true, "Mark as Delivered");

    try {
      console.log("Marking order as delivered:", orderId);

      const response = await axios.put(
        `${API_BASE_URL}/orders/update-to-delivered`,
        {
          orderId,
        },
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        console.log(`Order ${orderId} status updated to Delivered`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "delivered" } : order
          )
        );

        alert(`Order ${orderId} has been marked as delivered!`);
      } else {
        console.error(`Failed to update order status: ${response.data.message}`);
        alert(`Failed to update order status: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Error updating order status. Please try again.");
      }
    } finally {
      updateButtonState(buttonId, false, "Mark as Delivered");
    }
  };

  // Updated Export CSV functionality to work only with filtered data on the 'All' tab
  const exportToCSV = () => {
    if (activeTab !== "all") {
      alert("Export CSV is only available on the 'All' tab.");
      return;
    }

    const headers = [
      "Order ID", "Customer Name", "Status", "Total Amount", "Order Date", "Tax Amount", "VAT (20%)", "Net Amount"
    ];

    const rows = filteredOrders.map((order) => {
      const vatRate = 0.2; // UK VAT rate
      const taxAmount = order.totalAmount * vatRate;
      const netAmount = order.totalAmount - taxAmount;

      return [
        order.orderId,
        order.customerName,
        order.status,
        order.totalAmount.toFixed(2),
        new Date(order.orderDate).toLocaleDateString(),
        taxAmount.toFixed(2),
        (vatRate * 100).toFixed(2) + "%",
        netAmount.toFixed(2),
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "filtered_orders_with_tax.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/all`, {
        withCredentials: true
      });
      const ordersData = response.data.orders.map((order) => ({
        id: order._id,
        ...order,
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching all orders:", error);
    }
  };

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/all`, {
          withCredentials: true
        })
        console.log('API Response:', response.data);
        console.log('Orders from API:', response.data.orders);

        if (!response.data.orders || response.data.orders.length === 0) {
          console.log('No orders found in API response');
          setOrders([]);
          return;
        }

        response.data.orders.forEach((order) => {
          console.log('Order status:', order.status);
          console.log('User Object:', order.user);
        });

        const ordersData = response.data.orders.map((order) => ({
          id: order._id,
          _id: order._id,
          createdAt: order.createdAt,
          orderedAt: order.orderedAt,
          orderDate: order.orderedAt,
          status: order.status.toLowerCase(), // Convert status to lowercase to match the UI expectations
          total: order.total,
          totalAmount: order.total,
          statusHistory: order.statusHistory || [],
          user: order.user || {},
          items: order.items?.map((item, index) => ({
            id: item.product || `item-${index}`,
            product: item.product || '',
            name: item.name || 'Unknown Product',
            price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.image || '/placeholder.svg',
            sku: `SKU-${typeof item.product === 'string' ? item.product.slice(-6) : `ITEM${index + 1}`}`,
            category: 'General',
            weight: '1.0 lbs',
            status: 'in_stock'
          })) || [],
          deliveryNotes: order.deliveryNotes || '',
          trackingNumber: order.trackingNumber || '',
          referenceCode: `REF-${order._id.slice(-6)}`,
          orderId: order._id,
          priority: 'normal',
          orderSource: 'web',
          customerName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'Unknown Customer',
          customerPhone: order.user?.phone || 'N/A',
          customerEmail: order.user?.email || 'N/A',
          customerNotes: '',
          packingStatus: 'not_packed',
          assignedStaff: '',
          codAmount: 0,
          paymentMethod: 'online_payment',
          isGift: false,
          giftWrap: false,
          giftMessage: '',
          address: order.user?.address || 'N/A',
          billingAddress: order.user?.address || 'N/A',
          estimatedTime: '2-3 days',
          shippingMethod: 'standard',
          specialInstructions: '',
          internalNotes: ''
        }))
        
        // Debug: Check what statuses we have
        const statusCounts = ordersData.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});
        console.log('Order status counts:', statusCounts);
        console.log('Total orders loaded:', ordersData.length);
        console.log('Sample order:', ordersData[0]);
        
        setOrders(ordersData)
      } catch (error) {
        console.error("Error fetching all orders:", error)
      }
    }

    fetchAllOrders()
  }, [])

  const printAllPackedOrders = () => {
    const packedOrders = orders.filter((order) => order.status === "packing");

    packedOrders.forEach((order) => {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Delivery Information - ${order.referenceCode}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .section { margin-bottom: 25px; }
                .label { font-weight: bold; color: #333; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Delivery Information</h1>
                <h2>Order: ${order.referenceCode}</h2>
              </div>

              <div class="section">
                <h3>Customer Information</h3>
                <p><span class="label">Name:</span> ${order.customerName}</p>
                <p><span class="label">Phone:</span> ${order.customerPhone}</p>
                <p><span class="label">Email:</span> ${order.customerEmail}</p>
              </div>

              <div class="section">
                <h3>Delivery Address</h3>
                <p>${order.address}</p>
              </div>

              <div class="section">
                <h3>Order Details</h3>
                <p><span class="label">Order Date:</span> ${new Date(order.orderDate).toLocaleDateString()}</p>
                <p><span class="label">Total Amount:</span> $${order.totalAmount}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    });
  };

  const handlePrintAll = () => {
    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        printOrderDetails(order);
      });
    } else {
      alert("No orders available to print.");
    }
  };

  // Analytics and Reports Functions
  const getAnalyticsData = () => {
    if (!orders || orders.length === 0) return null;

    const now = new Date();
    let startDate;

    // Calculate date range based on selection
    switch (reportDateRange) {
      case "last7days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "last30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "last90days":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "custom":
        startDate = reportFromDate ? new Date(reportFromDate) : new Date(0);
        const endDate = reportToDate ? new Date(reportToDate) : now;
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startDate && orderDate <= now;
    });

    // Basic metrics
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Status breakdown
    const statusBreakdown = filteredOrders.reduce((acc, order) => {
      const status = order.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Daily sales data for charts
    const dailySales = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.orderDate).toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = { date, orders: 0, revenue: 0 };
      }
      dailySales[date].orders += 1;
      dailySales[date].revenue += order.totalAmount;
    });

    const chartData = Object.values(dailySales).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Top products
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusBreakdown,
      chartData,
      topProducts,
      filteredOrders
    };
  };

  const generatePDFReport = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const analyticsData = getAnalyticsData();
      if (!analyticsData) {
        alert("No data available for the selected period");
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Header
      doc.setFillColor(102, 126, 234); // Purple color
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('🎁 GIFT COMMERCE', 20, 25);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Order Analytics & Performance Report', 20, 35);

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Report metadata
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 55);
      doc.text(`Report Period: ${reportDateRange.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`, 20, 65);
      
      // Summary metrics
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('📊 Key Performance Metrics', 20, 85);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Create metrics boxes
      const metrics = [
        { label: 'Total Orders', value: analyticsData.totalOrders.toString(), x: 20, y: 95 },
        { label: 'Total Revenue', value: `£${analyticsData.totalRevenue.toFixed(2)}`, x: 110, y: 95 },
        { label: 'Average Order Value', value: `£${analyticsData.averageOrderValue.toFixed(2)}`, x: 20, y: 115 },
        { label: 'Completion Rate', value: `${((analyticsData.statusBreakdown.delivered || 0) / analyticsData.totalOrders * 100).toFixed(1)}%`, x: 110, y: 115 }
      ];

      metrics.forEach(metric => {
        doc.setFillColor(248, 249, 250);
        doc.rect(metric.x, metric.y, 80, 15, 'F');
        doc.setFontSize(10);
        doc.text(metric.label, metric.x + 2, metric.y + 6);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(metric.value, metric.x + 2, metric.y + 12);
        doc.setFont('helvetica', 'normal');
      });

      // Status breakdown
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('📋 Order Status Breakdown', 20, 145);

      let yPos = 155;
      Object.entries(analyticsData.statusBreakdown).forEach(([status, count]) => {
        const percentage = (count / analyticsData.totalOrders * 100).toFixed(1);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`${status.toUpperCase()}:`, 25, yPos);
        doc.text(`${count} orders (${percentage}%)`, 80, yPos);
        yPos += 8;
      });

      // Top products table
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('🏆 Top Performing Products', 20, yPos + 10);

      const tableData = analyticsData.topProducts.slice(0, 10).map((product, index) => [
        index + 1,
        product.name,
        product.quantity,
        `£${product.revenue.toFixed(2)}`
      ]);

      doc.autoTable({
        startY: yPos + 20,
        head: [['Rank', 'Product Name', 'Qty Sold', 'Revenue']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [102, 126, 234], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          1: { cellWidth: 80 },
          2: { halign: 'center', cellWidth: 25 },
          3: { halign: 'right', cellWidth: 30 }
        }
      });

      // Add new page for detailed orders
      doc.addPage();
      
      // Detailed orders table
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('📝 Detailed Order History', 20, 30);

      const orderTableData = analyticsData.filteredOrders.slice(0, 50).map(order => [
        order.referenceCode,
        order.customerName,
        new Date(order.orderDate).toLocaleDateString(),
        order.status.toUpperCase(),
        `£${order.totalAmount.toFixed(2)}`
      ]);

      doc.autoTable({
        startY: 40,
        head: [['Order ID', 'Customer', 'Date', 'Status', 'Amount']],
        body: orderTableData,
        theme: 'grid',
        headStyles: { fillColor: [102, 126, 234], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { halign: 'right', cellWidth: 25 }
        }
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY || 200;
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('Generated by Gift Commerce Admin System', 20, finalY + 20);
      doc.text(`Page 1-2 | Total Orders Analyzed: ${analyticsData.totalOrders}`, 20, finalY + 30);

      // Save the PDF
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Gift_Commerce_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      alert('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sendReportEmail = async () => {
    if (!adminEmail) {
      alert('Please enter an email address');
      return;
    }

    setIsSendingEmail(true);
    
    try {
      const analyticsData = getAnalyticsData();
      if (!analyticsData) {
        alert("No data available for the selected period");
        return;
      }

      // Generate PDF as base64
      const doc = new jsPDF();
      // ... (same PDF generation code as above)
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Send email with PDF attachment
      const response = await axios.post(`${API_BASE_URL}/send-report-email`, {
        email: adminEmail,
        reportData: analyticsData,
        pdfData: pdfBase64,
        reportPeriod: reportDateRange
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        alert(`Report successfully sent to ${adminEmail}!`);
        setEmailDialogOpen(false);
        setAdminEmail('');
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        {/* Removed header content for brevity */}
      </header>

      <div className="p-6 space-y-6">
        <DashboardStats orders={orders} />

        {/* Enhanced Order Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-xl">Advanced Order Management System</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={testProductsEndpoint}>
                  Test Products API
                </Button>
                {activeTab === "packed" && (
                  <Button variant="outline" size="sm" onClick={printAllPackedOrders}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print All Packed
                  </Button>
                )}
                {activeTab === "all" && (
                  <Button variant="outline" size="sm" onClick={() => printAllOrdersSequentially(filteredOrders)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print All Filtered ({filteredOrders.length})
                  </Button>
                )}
                {activeTab === "all" && (
                  <Button variant="outline" size="sm" onClick={exportToCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {activeTab === "all" && (
              <OrderSearchFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
              />
            )}

            {/* Enhanced Order Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-6 gap-x-2 w-full px-2 py-1 bg-gray-50 rounded-md border-2 border-gray-400">
                <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">Pending Orders</TabsTrigger>
                <TabsTrigger value="accepted" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Processing</TabsTrigger>
                <TabsTrigger value="packed" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Packing</TabsTrigger>
                <TabsTrigger value="delivery" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Ready for Delivery</TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-gray-600 data-[state=active]:text-white">All Orders</TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">📊 Reports & Analytics</TabsTrigger>
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
                      {filteredOrders.map((order, index) => (
                        <React.Fragment key={order.id || index}>
                          <TableRow className="hover:bg-gray-50">
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
                                {order.user?.address && (
                                  <div className="text-xs text-muted-foreground">
                                    <strong>Address:</strong> {order.user.address}
                                  </div>
                                )}
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
                                <Badge className={statusColors[order.status]}>{order.status?.replace("_", " ") || "Unknown"}</Badge>
                                {order.packingStatus !== "not_packed" && (
                                  <Badge className={packingStatusColors[order.packingStatus]}>
                                    {order.packingStatus?.replace("_", " ") || "Unknown"}
                                  </Badge>
                                )}
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
                                  onRejectOrder={null} // Disable reject functionality
                                  onPackingComplete={null} // Disable packing complete functionality
                                  onPrintCustomerDetails={printCustomerDetails} // Keep print functionality
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

                                {/* Ensure `selectedOrder` is valid before rendering the dialog */}
                                {selectedOrder ? (
                                  <OrderDetailsDialog
                                    order={selectedOrder}
                                    isOpen={!!selectedOrder}
                                    onClose={() => setSelectedOrder(null)}
                                    onRejectOrder={null} // Disable reject functionality
                                    onPackingComplete={null} // Disable packing complete functionality
                                    onPrintCustomerDetails={printCustomerDetails} // Keep print functionality
                                    onUpdateQuantity={null} // Disable update quantity functionality
                                    onRemoveItem={null} // Disable remove item functionality
                                    onSaveInternalNotes={null} // Disable save internal notes functionality
                                    internalNotes={null} // Remove internal notes
                                    setInternalNotes={null} // Remove internal notes setter
                                  />
                                ) : null}
                              </Dialog>

                              {/* Show Accept Order button for pending orders */}
                              {order.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => confirmAction("Accept this order and start processing?", () => acceptOrder(order.id))}
                                  className="ml-2 bg-green-600 hover:bg-green-700"
                                  id={`accept-order-button-${order.id}`}
                                >
                                  Accept Order
                                </Button>
                              )}

                              {/* Show Move to Packing button for processing orders */}
                              {order.status === "processing" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => confirmAction("Move this order to packing?", () => updateOrderToPacking(order.id))}
                                  className="ml-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                                  id={`move-to-packing-button-${order.id}`}
                                >
                                  Start Packing
                                </Button>
                              )}

                              {/* Show Mark as Shipped button for packing orders */}
                              {order.status === "packing" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => confirmAction("Mark this order as shipped?", () => confirmPacked(order.id))}
                                  className="ml-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                                  id={`confirm-packed-button-${order.id}`}
                                >
                                  Mark as Shipped
                                </Button>
                              )}

                              {/* Show Mark as Delivered button for shipped orders */}
                              {order.status === "shipped" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => confirmAction("Mark this order as delivered?", () => markAsDelivered(order.id))}
                                  className="ml-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                                  id={`mark-as-delivered-button-${order.id}`}
                                >
                                  Mark as Delivered
                                </Button>
                              )}

                              {/* Show completion status for delivered orders */}
                              {order.status === "delivered" && (
                                <Badge className="ml-2 bg-green-100 text-green-800">
                                  ✅ Completed
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                          <ExpandableProductRow order={order} isExpanded={expandedOrders.includes(order.id)} />
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Reports & Analytics Tab */}
              <TabsContent value="reports" className="space-y-6">
                <div className="grid gap-6">
                  {/* Report Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Report Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <Label htmlFor="dateRange">Date Range</Label>
                          <Select value={reportDateRange} onValueChange={setReportDateRange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="last7days">Last 7 Days</SelectItem>
                              <SelectItem value="last30days">Last 30 Days</SelectItem>
                              <SelectItem value="last90days">Last 90 Days</SelectItem>
                              <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {reportDateRange === "custom" && (
                          <>
                            <div>
                              <Label htmlFor="fromDate">From Date</Label>
                              <Input
                                type="date"
                                value={reportFromDate}
                                onChange={(e) => setReportFromDate(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="toDate">To Date</Label>
                              <Input
                                type="date"
                                value={reportToDate}
                                onChange={(e) => setReportToDate(e.target.value)}
                              />
                            </div>
                          </>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={generatePDFReport}
                            disabled={isGeneratingPDF}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isGeneratingPDF ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Generate PDF
                              </>
                            )}
                          </Button>
                          
                          <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <Send className="h-4 w-4 mr-2" />
                                Email Report
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Send Report via Email</DialogTitle>
                                <DialogDescription>
                                  Enter the email address where you want to send the analytics report PDF.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="adminEmail">Email Address</Label>
                                  <Input
                                    id="adminEmail"
                                    type="email"
                                    placeholder="admin@company.com"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={sendReportEmail}
                                  disabled={isSendingEmail || !adminEmail}
                                >
                                  {isSendingEmail ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-2" />
                                      Send Report
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analytics Overview */}
                  {(() => {
                    const analyticsData = getAnalyticsData();
                    if (!analyticsData) {
                      return (
                        <Card>
                          <CardContent className="flex items-center justify-center h-32">
                            <p className="text-muted-foreground">No data available for the selected period</p>
                          </CardContent>
                        </Card>
                      );
                    }

                    return (
                      <>
                        {/* Key Metrics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                  <p className="text-2xl font-bold">{analyticsData.totalOrders}</p>
                                </div>
                                <ShoppingBag className="h-8 w-8 text-blue-600" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                  <p className="text-2xl font-bold">£{analyticsData.totalRevenue.toFixed(2)}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-600" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                                  <p className="text-2xl font-bold">£{analyticsData.averageOrderValue.toFixed(2)}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                                  <p className="text-2xl font-bold">
                                    {((analyticsData.statusBreakdown.delivered || 0) / analyticsData.totalOrders * 100).toFixed(1)}%
                                  </p>
                                </div>
                                <Activity className="h-8 w-8 text-orange-600" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Sales Trend Chart */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Sales Trend
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={analyticsData.chartData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                  />
                                  <YAxis />
                                  <Tooltip 
                                    labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                                    formatter={(value, name) => [
                                      name === 'revenue' ? `£${value.toFixed(2)}` : value,
                                      name === 'revenue' ? 'Revenue' : 'Orders'
                                    ]}
                                  />
                                  <Legend />
                                  <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#8884d8" 
                                    fill="#8884d8" 
                                    fillOpacity={0.6}
                                    name="Revenue"
                                  />
                                  <Area 
                                    type="monotone" 
                                    dataKey="orders" 
                                    stroke="#82ca9d" 
                                    fill="#82ca9d" 
                                    fillOpacity={0.6}
                                    name="Orders"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>

                          {/* Order Status Distribution */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <PieChartIcon className="h-5 w-5" />
                                Order Status Distribution
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                  <Pie
                                    data={Object.entries(analyticsData.statusBreakdown).map(([status, count]) => ({
                                      name: status.charAt(0).toUpperCase() + status.slice(1),
                                      value: count,
                                      percentage: ((count / analyticsData.totalOrders) * 100).toFixed(1)
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                  >
                                    {Object.entries(analyticsData.statusBreakdown).map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={[
                                        '#fbbf24', '#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#ef4444'
                                      ][index % 6]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Top Products Table */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              Top Performing Products
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-16">Rank</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead className="text-center">Qty Sold</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                    <TableHead className="text-right">Avg Price</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {analyticsData.topProducts.slice(0, 10).map((product, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium text-center">
                                        <Badge variant={index < 3 ? "default" : "secondary"}>
                                          #{index + 1}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="font-medium">{product.name}</TableCell>
                                      <TableCell className="text-center">{product.quantity}</TableCell>
                                      <TableCell className="text-right font-medium">
                                        £{product.revenue.toFixed(2)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        £{(product.revenue / product.quantity).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    );
                  })()}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
