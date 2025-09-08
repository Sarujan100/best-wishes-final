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
import { Plus, Edit, Trash2, Upload, Folder, Tag } from "lucide-react"
import Image from "next/image"

export default function CategoryManagement() {
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "Party Supplies",
      description: "Everything you need for amazing parties",
      image: "/placeholder.svg?height=200&width=200",
      isActive: true,
      productCount: 156,
      slug: "party-supplies",
      metaTitle: "Party Supplies - Best Selection",
      metaDescription: "Find the best party supplies for any celebration",
    },
    {
      id: "2",
      name: "Birthday",
      description: "Birthday party essentials and decorations",
      image: "/placeholder.svg?height=200&width=200",
      isActive: true,
      parentId: "1",
      productCount: 89,
      slug: "birthday",
      metaTitle: "Birthday Party Supplies",
      metaDescription: "Make birthdays special with our party supplies",
    },
    {
      id: "3",
      name: "Wedding",
      description: "Elegant wedding decorations and accessories",
      image: "/placeholder.svg?height=200&width=200",
      isActive: true,
      parentId: "1",
      productCount: 67,
      slug: "wedding",
      metaTitle: "Wedding Decorations & Supplies",
      metaDescription: "Beautiful wedding decorations for your special day",
    },
    {
      id: "4",
      name: "Custom Gifts",
      description: "Personalized gifts for every occasion",
      image: "/placeholder.svg?height=200&width=200",
      isActive: false,
      productCount: 34,
      slug: "custom-gifts",
      metaTitle: "Custom Personalized Gifts",
      metaDescription: "Unique personalized gifts for special moments",
    },
    {
      id: "5",
      name: "Mugs",
      description: "Custom mugs and drinkware",
      image: "/placeholder.svg?height=200&width=200",
      isActive: true,
      parentId: "4",
      productCount: 23,
      slug: "mugs",
      metaTitle: "Custom Mugs & Drinkware",
      metaDescription: "Personalized mugs for gifts and events",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showInactive, setShowInactive] = useState(false)

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = showInactive || category.isActive
    return matchesSearch && matchesStatus
  })

  const getParentCategories = () => categories.filter((cat) => !cat.parentId)
  const getSubCategories = (parentId) => categories.filter((cat) => cat.parentId === parentId)

  const toggleCategoryStatus = (id) => {
    setCategories(
      categories.map((category) => (category.id === id ? { ...category, isActive: !category.isActive } : category)),
    )
  }

  const deleteCategory = (id) => {
    // Also delete subcategories
    setCategories(categories.filter((category) => category.id !== id && category.parentId !== id))
  }

  const CategoryForm = ({ category, onSave, onCancel }) => {
    const [formData, setFormData] = useState(
      category || {
        name: "",
        description: "",
        image: "",
        isActive: true,
        parentId: "",
        productCount: 0,
        slug: "",
        metaTitle: "",
        metaDescription: "",
      },
    )

    const handleSubmit = (e) => {
      e.preventDefault()
      const newCategory = {
        id: category?.id || Date.now().toString(),
        ...formData,
        slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, "-") || "",
      }
      onSave(newCategory)
    }

    const parentOptions = getParentCategories().filter((cat) => cat.id !== category?.id)

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated from name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="parentId">Parent Category (optional)</Label>
          <select
            id="parentId"
            value={formData.parentId || ""}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">No Parent (Top Level)</option>
            {parentOptions.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="image">Category Image</Label>
          <div className="flex items-center gap-4">
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Image URL"
            />
            <Button type="button" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">SEO Settings</h4>
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="SEO title for search engines"
            />
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              rows={2}
              placeholder="SEO description for search engines"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="active">Active Category</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            {category ? "Update" : "Add"} Category
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
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5" />
              Category Management
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                  onSave={(category) => {
                    setCategories([...categories, category])
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="showInactive" checked={showInactive} onCheckedChange={setShowInactive} />
              <Label htmlFor="showInactive">Show Inactive</Label>
            </div>
          </div>

          {/* Category Tree View */}
          <div className="space-y-4">
            {getParentCategories()
              .filter((parent) => filteredCategories.some((cat) => cat.id === parent.id))
              .map((parentCategory) => (
                <div key={parentCategory.id} className="space-y-2">
                  {/* Parent Category */}
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={parentCategory.image || "/placeholder.svg"}
                            alt={parentCategory.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Folder className="w-4 h-4" />
                                {parentCategory.name}
                              </h3>
                              <p className="text-sm text-gray-600">{parentCategory.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">{parentCategory.productCount} products</Badge>
                                <Badge variant={parentCategory.isActive ? "default" : "secondary"}>
                                  {parentCategory.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant="outline">/{parentCategory.slug}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={parentCategory.isActive}
                                onCheckedChange={() => toggleCategoryStatus(parentCategory.id)}
                              />
                              <span className="text-sm">Active</span>
                            </div>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Edit Category</DialogTitle>
                                  </DialogHeader>
                                  <CategoryForm
                                    category={parentCategory}
                                    onSave={(updatedCategory) => {
                                      setCategories(
                                        categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)),
                                      )
                                    }}
                                    onCancel={() => {}}
                                  />
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                                onClick={() => deleteCategory(parentCategory.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subcategories */}
                  {getSubCategories(parentCategory.id)
                    .filter((sub) => filteredCategories.some((cat) => cat.id === sub.id))
                    .map((subCategory) => (
                      <Card key={subCategory.id} className="ml-8 border-l-4 border-l-blue-300">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={subCategory.image || "/placeholder.svg"}
                                alt={subCategory.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    {subCategory.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">{subCategory.description}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {subCategory.productCount} products
                                    </Badge>
                                    <Badge variant={subCategory.isActive ? "default" : "secondary"} className="text-xs">
                                      {subCategory.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      /{subCategory.slug}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={subCategory.isActive}
                                    onCheckedChange={() => toggleCategoryStatus(subCategory.id)}
                                  />
                                  <span className="text-sm">Active</span>
                                </div>
                                <div className="flex gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>Edit Subcategory</DialogTitle>
                                      </DialogHeader>
                                      <CategoryForm
                                        category={subCategory}
                                        onSave={(updatedCategory) => {
                                          setCategories(
                                            categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)),
                                          )
                                        }}
                                        onCancel={() => {}}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 bg-transparent"
                                    onClick={() => deleteCategory(subCategory.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ))}

            {/* Orphaned categories (no parent) */}
            {categories
              .filter((cat) => cat.parentId && !categories.find((parent) => parent.id === cat.parentId))
              .filter((cat) => filteredCategories.some((filtered) => filtered.id === cat.id))
              .map((orphanCategory) => (
                <Card key={orphanCategory.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={orphanCategory.image || "/placeholder.svg"}
                          alt={orphanCategory.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              {orphanCategory.name}
                              <Badge variant="destructive" className="text-xs">
                                Orphaned
                              </Badge>
                            </h3>
                            <p className="text-sm text-gray-600">{orphanCategory.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{orphanCategory.productCount} products</Badge>
                              <Badge variant={orphanCategory.isActive ? "default" : "secondary"}>
                                {orphanCategory.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="outline">/{orphanCategory.slug}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={orphanCategory.isActive}
                              onCheckedChange={() => toggleCategoryStatus(orphanCategory.id)}
                            />
                            <span className="text-sm">Active</span>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Category</DialogTitle>
                                </DialogHeader>
                                <CategoryForm
                                  category={orphanCategory}
                                  onSave={(updatedCategory) => {
                                    setCategories(
                                      categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)),
                                    )
                                  }}
                                  onCancel={() => {}}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => deleteCategory(orphanCategory.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
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
