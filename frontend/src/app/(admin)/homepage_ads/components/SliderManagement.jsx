"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function SliderManagement() {
  const [slides, setSlides] = useState([
    { id: 1, image: '/1.jpg', title: 'Welcome to Bestwise', description: 'Your one-stop shop for gifts', isActive: true },
    { id: 2, image: '/2.jpg', title: 'Special Offers', description: 'Amazing deals on all products', isActive: true },
    { id: 3, image: '/3.jpg', title: 'New Arrivals', description: 'Check out our latest collection', isActive: false }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    isActive: true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSlide) {
      setSlides(prev => prev.map(slide => 
        slide.id === editingSlide.id ? { ...slide, ...formData } : slide
      ))
    } else {
      const newSlide = { id: Date.now(), ...formData }
      setSlides(prev => [...prev, newSlide])
    }
    setIsDialogOpen(false)
    setEditingSlide(null)
    setFormData({ title: '', description: '', image: '', isActive: true })
  }

  const handleEdit = (slide) => {
    setEditingSlide(slide)
    setFormData(slide)
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setSlides(prev => prev.filter(slide => slide.id !== id))
  }

  const toggleStatus = (id) => {
    setSlides(prev => prev.map(slide => 
      slide.id === id ? { ...slide, isActive: !slide.isActive } : slide
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Slider Management</h2>
          <p className="text-gray-600">Manage your homepage hero slider</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Slide Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter slide title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter slide description"
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Enter image URL"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editingSlide ? 'Update' : 'Add'} Slide
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <Card key={slide.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={slide.image || '/placeholder.svg'}
                alt={slide.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{slide.title}</h3>
                <Badge variant={slide.isActive ? "default" : "secondary"}>
                  {slide.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">{slide.description}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(slide)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={slide.isActive ? "secondary" : "default"}
                  onClick={() => toggleStatus(slide.id)}
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  {slide.isActive ? "Disable" : "Enable"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(slide.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}