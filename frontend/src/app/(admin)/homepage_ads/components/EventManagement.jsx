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
import { Plus, Edit, Trash2, Calendar, Upload } from "lucide-react"
import Image from "next/image"

export default function EventManagement() {
  const [events, setEvents] = useState([
    {
      id: "1",
      name: "Summer Sale",
      description: "Amazing summer discounts on all products",
      date: "2024-07-15",
      image: "/placeholder.svg?height=300&width=400",
      isActive: true,
      category: "Sale",
      featured: true,
    },
    {
      id: "2",
      name: "Birthday Party Package",
      description: "Complete birthday celebration package",
      date: "2024-08-01",
      image: "/placeholder.svg?height=300&width=400",
      isActive: true,
      category: "Party",
      featured: false,
    },
    {
      id: "3",
      name: "Wedding Showcase",
      description: "Elegant wedding decoration showcase",
      date: "2024-09-10",
      image: "/placeholder.svg?height=300&width=400",
      isActive: false,
      category: "Wedding",
      featured: false,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleEventStatus = (id) => {
    setEvents(events.map((event) => (event.id === id ? { ...event, isActive: !event.isActive } : event)))
  }

  const toggleFeatured = (id) => {
    setEvents(events.map((event) => (event.id === id ? { ...event, featured: !event.featured } : event)))
  }

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  const EventForm = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState(
      event || {
        name: "",
        description: "",
        date: "",
        image: "",
        isActive: true,
        category: "Sale",
        featured: false,
      },
    )

    const handleSubmit = (e) => {
      e.preventDefault()
      const newEvent = {
        id: event?.id || Date.now().toString(),
        ...formData,
      }
      onSave(newEvent)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
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
          <Label htmlFor="date">Event Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Event Image</Label>
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
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            {event ? "Update" : "Add"} Event
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
              <Calendar className="w-5 h-5" />
              Event Management
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <EventForm
                  onSave={(event) => {
                    setEvents([...events, event])
                    setIsAddDialogOpen(false)
                  }}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {event.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                      <Badge variant={event.isActive ? "default" : "secondary"}>
                        {event.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{event.name}</h3>
                      <Badge variant="outline">{event.category}</Badge>
                      <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      <p className="text-sm font-medium text-purple-600">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked={event.isActive} onCheckedChange={() => toggleEventStatus(event.id)} />
                          <span className="text-sm">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={event.featured} onCheckedChange={() => toggleFeatured(event.id)} />
                          <span className="text-sm">Featured</span>
                        </div>
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
                            <DialogTitle>Edit Event</DialogTitle>
                          </DialogHeader>
                          <EventForm
                            event={event}
                            onSave={(updatedEvent) => {
                              setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
                            }}
                            onCancel={() => {}}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => deleteEvent(event.id)}
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
