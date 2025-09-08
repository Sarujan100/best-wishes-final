"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Upload, Star, Heart, Flame } from "lucide-react"
import Image from "next/image"

export default function ProductManagement() {
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Birthday Mug",
      price: 25.75,
      rating: 5,
      category: "Mugs",
      image: "/placeholder.svg?height=200&width=200",
      isActive: true,
      isHotSale: true,
      description: "Perfect birthday gift mug with custom design",
    },
    {
      id: "2",
      name: "Party Decorations",
      price: 45.99,
      rating: 4.5,
      category: "Decorations",
      image: "/placeholder.svg?height=200&width=200",
      isActive: true,
      isHotSale: false,
      description: "Complete party decoration set",
    },
    {
      id: "3",
      name: "Custom T-Shirt",
      price: 19.99,
      rating: 4,
      category: "Apparel",
      image: "/placeholder.svg?height=200&width=200",
      isActive: false,
      isHotSale: false,
      description: "Personalized t-shirt with custom print",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const categories = ["all", "Mugs", "Decorations", "Apparel", "Accessories"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const toggleProductStatus = (id) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, isActive: !product.isActive } : product)))
  }

  const toggleHotSale = (id) => {
    setProducts(
      products.map((product) => (product.id === id ? { ...product, isHotSale: !product.isHotSale } : product)),
    )
  }

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState(
      product || {
        name: "",
        price: 0,
        rating: 5,
        category: "Mugs",
        image: "",
        isActive: true,
        isHotSale: false,
        description: "",
      },
    )

    const handleSubmit = (e) => {
      e.preventDefault()
      const newProduct = {
        id: product?.id || Date.now().toString(),
        ...formData,
      }
      onSave(newProduct)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Select
              value={formData.rating?.toString()}
              onValueChange={(value) => setFormData({ ...formData, rating: Number.parseFloat(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="image">Product Image</Label>
          <div className="flex items-center gap-4">
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Image URL or upload"
            />
            <Button type="button" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="hotSale"
              checked={formData.isHotSale}
              onCheckedChange={(checked) => setFormData({ ...formData, isHotSale: checked })}
            />
            <Label htmlFor="hotSale">Hot Sale</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            {product ? "Update" : "Add"} Product
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Product Management</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <ProductForm
                  onSave={(product) => {
                    setProducts([...products, product])
                    setIsAddDialogOpen(false)
                  }}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {product.isHotSale && (
                        <div className="bg-red-100 rounded-full p-1">
                          <Flame className="text-red-500 w-4 h-4" />
                        </div>
                      )}
                      <div className="bg-purple-100 rounded-full p-1">
                        <Heart className="text-purple-500 w-4 h-4" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="font-bold text-purple-600">${product.price}</p>
                    </div>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < product.rating ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Switch checked={product.isActive} onCheckedChange={() => toggleProductStatus(product.id)} />
                        <span className="text-sm">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={product.isHotSale} onCheckedChange={() => toggleHotSale(product.id)} />
                        <span className="text-sm">Hot Sale</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <ProductForm
                            product={product}
                            onSave={(updatedProduct) => {
                              setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
                            }}
                            onCancel={() => {}}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
