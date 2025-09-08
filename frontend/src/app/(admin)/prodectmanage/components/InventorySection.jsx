"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Alert, AlertDescription } from "../../../../components/ui/alert"
import { Package, Truck, Scale, AlertTriangle, Plus, Edit2, Trash2, Save, X } from "lucide-react"

export default function InventorySection({ inventory, onChange }) {
  const [volumetricWeight, setVolumetricWeight] = useState(0)
  const [reorderAlert, setReorderAlert] = useState(false)
  const [showAddShippingForm, setShowAddShippingForm] = useState(false)
  const [editingShippingClass, setEditingShippingClass] = useState(null)
  const [newShippingClass, setNewShippingClass] = useState({ name: "", cost: "" })

  const [shippingClasses, setShippingClasses] = useState({
    standard: { name: "Standard", cost: 5.99 },
    express: { name: "Express", cost: 12.99 },
    overnight: { name: "Overnight", cost: 24.99 },
    free: { name: "Free Shipping", cost: 0 },
    heavy: { name: "Heavy Item", cost: 19.99 },
  })

  useEffect(() => {
    calculateVolumetricWeight()
    checkReorderAlert()
  }, [inventory])

  const calculateVolumetricWeight = () => {
    const { dimensions } = inventory
    if (dimensions.length && dimensions.width && dimensions.height) {
      // Volumetric weight = (L × W × H) / 5000 (standard divisor)
      const volWeight = (dimensions.length * dimensions.width * dimensions.height) / 5000
      setVolumetricWeight(Number(volWeight.toFixed(2)))
    }
  }

  const checkReorderAlert = () => {
    setReorderAlert(inventory.stock <= 10 && inventory.stock > 0)
  }

  const handleInventoryChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      onChange({
        ...inventory,
        [parent]: {
          ...inventory[parent],
          [child]: Number.parseFloat(value) || 0,
        },
      })
    } else {
      const processedValue = ["stock", "weight"].includes(field) ? Number.parseFloat(value) || 0 : value
      
      // Auto-calculate stock status when stock quantity changes
      let updatedInventory = {
        ...inventory,
        [field]: processedValue,
      }
      
      if (field === "stock") {
        updatedInventory.stockStatus = getStockStatusFromQuantity(processedValue)
      }
      
      onChange(updatedInventory)
    }
  }

  const getStockStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return "default"
      case "low-stock":
        return "secondary"
      case "out-of-stock":
        return "destructive"
      case "backordered":
        return "outline"
      default:
        return "default"
    }
  }

  const getStockStatusFromQuantity = (stock) => {
    if (stock === 0) return "out-of-stock"
    if (stock <= 10) return "low-stock"
    return "in-stock"
  }

  // Helper function to safely select input text
  const selectInputText = (e) => {
    if (e.target && e.target.tagName === 'INPUT') {
      e.target.select()
    }
  }

  // Helper function to format display value (show empty if 0)
  const getDisplayValue = (value) => {
    return value === 0 ? "" : value.toString()
  }

  // Shipping class management functions
  const addShippingClass = () => {
    if (!newShippingClass.name || !newShippingClass.cost) {
      alert("Please fill in both name and cost")
      return
    }

    const key = newShippingClass.name.toLowerCase().replace(/\s+/g, "-")
    const cost = Number.parseFloat(newShippingClass.cost) || 0

    setShippingClasses(prev => ({
      ...prev,
      [key]: { name: newShippingClass.name, cost: cost }
    }))

    setNewShippingClass({ name: "", cost: "" })
    setShowAddShippingForm(false)
  }

  const editShippingClass = (key) => {
    setEditingShippingClass(key)
    setNewShippingClass({
      name: shippingClasses[key].name,
      cost: shippingClasses[key].cost.toString()
    })
  }

  const saveShippingClass = () => {
    if (!newShippingClass.name || !newShippingClass.cost) {
      alert("Please fill in both name and cost")
      return
    }

    const cost = Number.parseFloat(newShippingClass.cost) || 0
    const newKey = newShippingClass.name.toLowerCase().replace(/\s+/g, "-")

    setShippingClasses(prev => {
      const updated = { ...prev }
      if (editingShippingClass && editingShippingClass !== newKey) {
        delete updated[editingShippingClass]
      }
      updated[newKey] = { name: newShippingClass.name, cost: cost }
      return updated
    })

    setEditingShippingClass(null)
    setNewShippingClass({ name: "", cost: "" })
  }

  const deleteShippingClass = (key) => {
    if (confirm(`Delete shipping class "${shippingClasses[key].name}"?`)) {
      setShippingClasses(prev => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })

      // If the deleted class was selected, reset to standard
      if (inventory.shippingClass === key) {
        handleInventoryChange("shippingClass", "standard")
      }
    }
  }

  const cancelEdit = () => {
    setEditingShippingClass(null)
    setNewShippingClass({ name: "", cost: "" })
  }

  // Get current stock status (auto-calculated)
  const currentStockStatus = getStockStatusFromQuantity(inventory.stock)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={getDisplayValue(inventory.stock)}
                onChange={(e) => handleInventoryChange("stock", e.target.value)}
                onClick={selectInputText}
                onFocus={selectInputText}
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Current available quantity</p>
            </div>

            <div>
              <Label htmlFor="stockStatus">Stock Status (Auto-calculated)</Label>
              <div className="w-full px-3 py-2 border rounded-md bg-gray-50">
                <Badge variant={getStockStatusColor(currentStockStatus)} className="text-sm">
                  {currentStockStatus.replace("-", " ").toUpperCase()}
                </Badge>
                <span className="ml-2 text-sm text-gray-600">
                  {currentStockStatus === "out-of-stock" && "No stock available"}
                  {currentStockStatus === "low-stock" && "Stock running low"}
                  {currentStockStatus === "in-stock" && "Stock available"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Status automatically updates based on quantity
              </p>
            </div>
          </div>

          {/* Stock Status Rules Display */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Stock Status Rules:</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>0 units:</span>
                <Badge variant="destructive" className="text-xs">OUT OF STOCK</Badge>
              </div>
              <div className="flex justify-between">
                <span>1-10 units:</span>
                <Badge variant="secondary" className="text-xs">LOW STOCK</Badge>
              </div>
              <div className="flex justify-between">
                <span>11+ units:</span>
                <Badge variant="default" className="text-xs">IN STOCK</Badge>
              </div>
            </div>
          </div>

          {/* Reorder Alert */}
          {reorderAlert && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Low stock alert! Consider reordering soon. Current stock: {inventory.stock} units.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Physical Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Physical Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              value={getDisplayValue(inventory.weight)}
              onChange={(e) => handleInventoryChange("weight", e.target.value)}
              onClick={selectInputText}
              onFocus={selectInputText}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Dimensions (cm)</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                step="0.1"
                min="0"
                value={getDisplayValue(inventory.dimensions.length)}
                onChange={(e) => handleInventoryChange("dimensions.length", e.target.value)}
                onClick={selectInputText}
                onFocus={selectInputText}
                placeholder="Length"
              />
              <Input
                type="number"
                step="0.1"
                min="0"
                value={getDisplayValue(inventory.dimensions.width)}
                onChange={(e) => handleInventoryChange("dimensions.width", e.target.value)}
                onClick={selectInputText}
                onFocus={selectInputText}
                placeholder="Width"
              />
              <Input
                type="number"
                step="0.1"
                min="0"
                value={getDisplayValue(inventory.dimensions.height)}
                onChange={(e) => handleInventoryChange("dimensions.height", e.target.value)}
                onClick={selectInputText}
                onFocus={selectInputText}
                placeholder="Height"
              />
            </div>
          </div>

          {volumetricWeight > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm">
                <strong>Volumetric Weight:</strong> {volumetricWeight.toFixed(2)} kg
                {volumetricWeight > inventory.weight && (
                  <span className="text-blue-600 ml-2">(Higher than actual weight - will be used for shipping)</span>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping Configuration
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddShippingForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Shipping Class
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Shipping Class Form */}
          {showAddShippingForm && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium mb-3">Add New Shipping Class</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="newShippingName">Shipping Name</Label>
                  <Input
                    id="newShippingName"
                    value={newShippingClass.name}
                    onChange={(e) => setNewShippingClass(prev => ({ ...prev, name: e.target.value }))}
                    onClick={selectInputText}
                    onFocus={selectInputText}
                    placeholder="e.g., Premium Express"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="newShippingCost">Cost (£)</Label>
                  <Input
                    id="newShippingCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newShippingClass.cost}
                    onChange={(e) => setNewShippingClass(prev => ({ ...prev, cost: e.target.value }))}
                    onClick={selectInputText}
                    onFocus={selectInputText}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button type="button" size="sm" onClick={addShippingClass}>
                  <Save className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowAddShippingForm(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Edit Shipping Class Form */}
          {editingShippingClass && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-medium mb-3">Edit Shipping Class</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="editShippingName">Shipping Name</Label>
                  <Input
                    id="editShippingName"
                    value={newShippingClass.name}
                    onChange={(e) => setNewShippingClass(prev => ({ ...prev, name: e.target.value }))}
                    onClick={selectInputText}
                    onFocus={selectInputText}
                    placeholder="e.g., Premium Express"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="editShippingCost">Cost (£)</Label>
                  <Input
                    id="editShippingCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newShippingClass.cost}
                    onChange={(e) => setNewShippingClass(prev => ({ ...prev, cost: e.target.value }))}
                    onClick={selectInputText}
                    onFocus={selectInputText}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button type="button" size="sm" onClick={saveShippingClass}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={cancelEdit}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Shipping Classes List */}
          <div>
            <Label htmlFor="shippingClass">Available Shipping Classes</Label>
            <div className="space-y-2 mt-2">
              {Object.entries(shippingClasses).map(([key, { name, cost }]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="radio"
                      id={`shipping-${key}`}
                      name="shippingClass"
                      value={key}
                      checked={inventory.shippingClass === key}
                      onChange={(e) => handleInventoryChange("shippingClass", e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor={`shipping-${key}`} className="flex-1 cursor-pointer py-1">
                      <div className="font-medium">{name}</div>
                      <div className="text-sm text-gray-500">£{cost.toFixed(2)}</div>
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        editShippingClass(key)
                      }}
                      disabled={editingShippingClass !== null}
                      className="hover:bg-blue-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteShippingClass(key)
                      }}
                      disabled={editingShippingClass !== null}
                      className="hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Cost Breakdown */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Shipping Cost Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base shipping cost:</span>
                <span>£{shippingClasses[inventory.shippingClass]?.cost || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Weight-based adjustment:</span>
                <span>£{(inventory.weight * 0.5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Total estimated shipping:</span>
                <span>
                  £{((shippingClasses[inventory.shippingClass]?.cost || 0) + inventory.weight * 0.5).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
