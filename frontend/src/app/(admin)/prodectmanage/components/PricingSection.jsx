"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Badge } from "../../../../components/ui/badge"
import { Calculator, TrendingUp, Percent } from "lucide-react"

export default function PricingSection({ pricing, onChange }) {
  const [calculations, setCalculations] = useState({
    profitMargin: 0,
    profitAmount: 0,
    taxAmount: 0,
    finalPrice: 0,
  })

  const taxRates = {
    standard: 0.1,
    reduced: 0.05,
    zero: 0,
    exempt: 0,
  }

  useEffect(() => {
    calculatePricing()
  }, [pricing])

  const calculatePricing = () => {
    const { costPrice, retailPrice, salePrice, taxClass } = pricing
    const sellingPrice = salePrice > 0 ? salePrice : retailPrice
    const taxRate = taxRates[taxClass] || 0

    const profitAmount = sellingPrice - costPrice
    const profitMargin = costPrice > 0 ? (profitAmount / costPrice) * 100 : 0
    const taxAmount = sellingPrice * taxRate
    const finalPrice = sellingPrice + taxAmount

    setCalculations({
      profitMargin: Number(profitMargin.toFixed(2)),
      profitAmount: Number(profitAmount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      finalPrice: Number(finalPrice.toFixed(2)),
    })
  }

  const handlePricingChange = (field, value) => {
    if (field === "taxClass") {
      onChange({
        ...pricing,
        [field]: value,
      });
      return;
    }
    
    const numValue = Number.parseFloat(value) || 0
    onChange({
      ...pricing,
      [field]: numValue,
    })
  }

  const getProfitColor = (margin) => {
    if (margin < 10) return "destructive"
    if (margin < 25) return "secondary"
    return "default"
  }

  // Helper function to safely format numbers
  const formatNumber = (value) => {
    const num = Number(value) || 0
    return num.toFixed(2)
  }

  // Helper function to format display value (show empty if 0)
  const getDisplayValue = (value) => {
    return value === 0 ? "" : value.toString()
  }

  // Helper function to safely select input text
  const selectInputText = (e) => {
    if (e.target && e.target.tagName === 'INPUT') {
      e.target.select()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Pricing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="costPrice">Cost Price *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={getDisplayValue(pricing.costPrice)}
                onChange={(e) => handlePricingChange("costPrice", e.target.value)}
                onClick={selectInputText}
                onFocus={selectInputText}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Your cost to acquire/make this product</p>
            </div>

            <div>
              <Label htmlFor="retailPrice">Retail Price *</Label>
              <Input
                id="retailPrice"
                type="number"
                step="0.01"
                min="0"
                value={getDisplayValue(pricing.retailPrice)}
                onChange={(e) => handlePricingChange("retailPrice", e.target.value)}
                onClick={selectInputText}
                onFocus={selectInputText}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Regular selling price</p>
            </div>

            <div>
              <Label htmlFor="salePrice">Sale Price</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                value={getDisplayValue(pricing.salePrice)}
                onChange={(e) => handlePricingChange("salePrice", e.target.value)}
                onClick={selectInputText}
                onFocus={selectInputText}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Discounted price (optional)</p>
            </div>
          </div>

          <div>
            <Label htmlFor="taxClass">Tax Class</Label>
            <select
              id="taxClass"
              value={pricing.taxClass}
              onChange={(e) => handlePricingChange("taxClass", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="standard">Standard (10%)</option>
              <option value="reduced">Reduced (5%)</option>
              <option value="zero">Zero Rate (0%)</option>
              <option value="exempt">Tax Exempt</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Pricing Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Percent className="w-4 h-4" />
                <span className="text-sm font-medium">Profit Margin</span>
              </div>
              <Badge variant={getProfitColor(calculations.profitMargin)} className="text-lg">
                {formatNumber(calculations.profitMargin)}%
              </Badge>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium mb-2">Profit Amount</div>
              <div className="text-lg font-bold text-green-600">£{formatNumber(calculations.profitAmount)}</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium mb-2">Tax Amount</div>
              <div className="text-lg font-bold text-blue-600">£{formatNumber(calculations.taxAmount)}</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium mb-2">Final Price</div>
              <div className="text-lg font-bold text-purple-600">£{formatNumber(calculations.finalPrice)}</div>
            </div>
          </div>

          {pricing.salePrice > 0 && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Sale Active</Badge>
                <span className="text-sm">
                  Discount: £{(pricing.retailPrice - pricing.salePrice).toFixed(2)}(
                  {(((pricing.retailPrice - pricing.salePrice) / pricing.retailPrice) * 100).toFixed(1)}% off)
                </span>
              </div>
            </div>
          )}

          {calculations.profitMargin < 10 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                ⚠️ Low profit margin detected. Consider adjusting your pricing strategy.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
