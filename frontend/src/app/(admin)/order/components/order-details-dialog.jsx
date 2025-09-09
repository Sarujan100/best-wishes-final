"use client"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Gift,
  Users,
  MapPin,
  CreditCard,
  Package,
  DollarSign,
  MessageSquare,
  Printer,
  Check,
  X,
  Edit,
  Plus,
  Minus,
  Phone,
  Mail,
  Clock,
} from "lucide-react"
import React from "react"

export function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
  onAcceptOrder,
  onRejectOrder,
  onPackingComplete,
  onPrintCustomerDetails,
  onUpdateQuantity,
  onRemoveItem,
  onSaveInternalNotes,
  internalNotes,
  setInternalNotes,
}) {
  return (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-pink-500" />
          Complete Order Details - {order?.referenceCode}
        </DialogTitle>
      </DialogHeader>

      {order && (
        <div className="space-y-6">
          {/* Enhanced Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <div className="font-medium">{order.customerName}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.customerPhone}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.customerEmail}</span>
                  </div>
                </div>
                {order.customerNotes && (
                  <div className="p-2 bg-blue-50 rounded text-sm">
                    <strong>Customer Notes:</strong>
                    <br />
                    {order.customerNotes}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Delivery Address</Label>
                  <div className="text-sm">{order.address}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Billing Address</Label>
                  <div className="text-sm">{order.billingAddress}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Estimated Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.estimatedTime}</span>
                  </div>
                </div>
                {order.specialInstructions && (
                  <div className="p-3 bg-yellow-50 rounded text-sm">
                    <strong>📝 Special Instructions:</strong>
                    <br />
                    {order.specialInstructions}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Order Source</Label>
                  <div className="text-sm capitalize">{order.orderSource.replace("_", " ")}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Payment Method</Label>
                  <div className="text-sm capitalize">{order.paymentMethod.replace("_", " ")}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Shipping Method</Label>
                  <div className="text-sm capitalize">{order.shippingMethod.replace("_", " ")}</div>
                </div>
                {order.trackingNumber && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Tracking Number</Label>
                    <div className="text-sm font-mono bg-gray-100 p-1 rounded">{order.trackingNumber}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Order Items with Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Items Management ({order.items.length} products)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {item.sku} | Category: {item.category}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Weight: {item.weight} | Status: {item.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Quantity:</Label>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                              onClick={() => onUpdateQuantity(order.id, item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                              onClick={() => onUpdateQuantity(order.id, item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Unit: </span>
                          <span className="font-medium">${item.price}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-bold text-green-600">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => onRemoveItem(order.id, item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal:</span>
                    <span className="text-sm">
                      ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Shipping:</span>
                    <span className="text-sm">$15.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax:</span>
                    <span className="text-sm">$12.50</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">${order.totalAmount}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">COD Amount</Label>
                  <div className="text-lg font-bold">
                    {order.codAmount > 0 ? (
                      <span className="text-orange-600">${order.codAmount}</span>
                    ) : (
                      <span className="text-green-600">Paid Online ✅</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gift Details */}
          {order.isGift && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Gift className="h-4 w-4 text-pink-500" />
                  Gift Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Gift Wrap:</Label>
                  <Badge variant={order.giftWrap ? "default" : "secondary"}>
                    {order.giftWrap ? "🎁 Yes" : "❌ No"}
                  </Badge>
                </div>
                {order.giftMessage && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Gift Message:</Label>
                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="text-pink-800 whitespace-pre-wrap">{order.giftMessage}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Internal Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add internal notes for staff..."
                value={internalNotes[order.id] || order.internalNotes || ""}
                onChange={(e) => setInternalNotes((prev) => ({ ...prev, [order.id]: e.target.value }))}
                rows={3}
              />
              <Button size="sm" onClick={() => onSaveInternalNotes(order.id)}>
                Save Notes
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={() => onPrintCustomerDetails(order)} className="flex-1" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Complete Details
            </Button>
            {order.status === "pending_acceptance" && (
              <>
                <Button onClick={() => onAcceptOrder(order.orderId)} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Accept Order
                </Button>
                <Button variant="destructive" onClick={() => onRejectOrder(order.orderId)} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Reject Order
                </Button>
              </>
            )}
            {order.status === "accepted" && order.packingStatus !== "packed" && (
              <Button onClick={() => onPackingComplete(order.orderId)} className="flex-1">
                <Package className="h-4 w-4 mr-2" />
                Mark as Packed
              </Button>
            )}
          </div>
        </div>
      )}
    </DialogContent>
  )
}
