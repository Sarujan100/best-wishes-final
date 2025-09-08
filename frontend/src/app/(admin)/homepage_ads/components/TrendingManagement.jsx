"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function TrendingManagement() {
  const [trendingServices, setTrendingServices] = useState({
    id: 1,
    title: 'Trending Services',
    description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.',
    images: ['/decoration1.jpg', '/decoration2.jpg', '/decoration3.jpg', '/decoration4.jpg'],
    features: ['All Decoration Items', 'Party Table', 'Other Elegant Items']
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    features: []
  })
  const [newFeature, setNewFeature] = useState('')
  const [newImage, setNewImage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setTrendingServices({ ...trendingServices, ...formData })
    setIsDialogOpen(false)
  }

  const handleEdit = () => {
    setFormData(trendingServices)
    setIsDialogOpen(true)
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()]
      })
      setNewFeature('')
    }
  }

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    })
  }

  const addImage = () => {
    if (newImage.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), newImage.trim()]
      })
      setNewImage('')
    }
  }

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trending Services Management</h2>
          <p className="text-gray-600">Manage your trending services section</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Trending Services Section</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter section title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter section description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label>Features</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add new feature"
                    />
                    <Button type="button" onClick={addFeature}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.features || []).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Images</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Add image URL"
                    />
                    <Button type="button" onClick={addImage}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(formData.images || []).map((image, index) => (
                      <div key={index} className="relative">
                        <div className="relative h-24 rounded border overflow-hidden">
                          <Image
                            src={image}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Update Section
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">💖</div>
            {trendingServices.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {trendingServices.images.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image src={image} alt={`Decoration ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">{trendingServices.description}</p>
              <div className="space-y-2">
                {trendingServices.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="w-2 bg-purple-600 rounded-full h-2"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Explore
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}