"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle, AlertCircle, Truck } from "lucide-react"

export default function StatusUpdateModal({ order, isOpen, onClose, onUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || '')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const statusOptions = [
    { value: 'Pending', label: 'Pending', icon: Clock, color: 'yellow' },
    { value: 'Processing', label: 'Processing', icon: Package, color: 'blue' },
    { value: 'Shipped', label: 'Shipped', icon: Truck, color: 'blue' },
    { value: 'Delivered', label: 'Delivered', icon: CheckCircle, color: 'green' },
    { value: 'Cancelled', label: 'Cancelled', icon: AlertCircle, color: 'red' }
  ]

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleUpdate = async () => {
    if (!selectedStatus || selectedStatus === order?.status) {
      return
    }

    setLoading(true)
    try {
      await onUpdate(order._id || order.id, selectedStatus, notes)
      setNotes('')
      onClose()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Update Order Status</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Order Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Order ID</div>
            <div className="font-medium">#{order._id?.slice(-8) || order.id}</div>
            <div className="text-sm text-gray-600 mt-1">Customer: {order.user?.firstName} {order.user?.lastName}</div>
          </div>

          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
            <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
          </div>

          {/* New Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this status update..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleUpdate}
              disabled={loading || !selectedStatus || selectedStatus === order.status}
              className="flex-1"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
