"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Settings } from "lucide-react"

export default function ServiceManagement() {
  const [services, setServices] = useState([
    {
      id: 1,
      icon: '✏️',
      title: 'Customizable Gift',
      description: 'Design gifts your way — choose packaging, add notes, select colors or themes.',
      isActive: true
    },
    {
      id: 2,
      icon: '⏰',
      title: 'Reminder Gift Notify',
      description: 'Never miss special moments. Set reminders for birthdays, anniversaries, and holidays.',
      isActive: true
    },
    {
      id: 3,
      icon: '👨‍👩‍👦',
      title: 'Collaborative Gift',
      description: 'Team up with friends and family to create the perfect group gift.',
      isActive: true
    },
    {
      id: 4,
      icon: '🎁',
      title: 'Gift Wrapping',
      description: 'Professional gift wrapping service for all occasions.',
      isActive: false
    }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    description: '',
    isActive: true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingService) {
      setServices(prev => prev.map(service => 
        service.id === editingService.id ? { ...service, ...formData } : service
      ))
    } else {
      const newService = { id: Date.now(), ...formData }
      setServices(prev => [...prev, newService])
    }
    setIsDialogOpen(false)
    setEditingService(null)
    setFormData({ icon: '', title: '', description: '', isActive: true })
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData(service)
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setServices(prev => prev.filter(service => service.id !== id))
  }

  const toggleStatus = (id) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
          <p className="text-gray-600">Manage your platform services</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Enter emoji icon"
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter service title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter service description"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editingService ? 'Update' : 'Add'} Service
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
        {services.map((service) => (
          <Card key={service.id} className="border-2 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(service)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={service.isActive ? "secondary" : "default"}
                  onClick={() => toggleStatus(service.id)}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {service.isActive ? "Disable" : "Enable"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(service.id)}
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