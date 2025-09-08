"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, Settings, Users, BarChart3, Plus } from "lucide-react"
import ProductManagement from "../components/ProductManagement"
import ServiceManagement from "../components/ServiceManagement"
import EventManagement from "../components/EventManagement"
import TrendingManagement from "../components/TrendingManagement"
import SliderManagement from "../components/SliderManagement"
import CategoryManagement from "../components/CategoryManagement"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    { title: "Total Products", value: "2,543", icon: Package, color: "bg-blue-500" },
    { title: "Active Services", value: "12", icon: Settings, color: "bg-green-500" },
    { title: "Upcoming Events", value: "8", icon: Calendar, color: "bg-purple-500" },
    { title: "Total Users", value: "2,500+", icon: Users, color: "bg-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your platform services and content</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="slider">Slider</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New product added", item: "Birthday Mug", time: "2 hours ago", status: "success" },
                    { action: "Service updated", item: "Party Planning", time: "4 hours ago", status: "info" },
                    { action: "Event created", item: "Summer Sale", time: "6 hours ago", status: "success" },
                    { action: "Category disabled", item: "Winter Items", time: "1 day ago", status: "warning" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            activity.status === "success"
                              ? "default"
                              : activity.status === "warning"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {activity.status}
                        </Badge>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.item}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="services">
            <ServiceManagement />
          </TabsContent>

          <TabsContent value="events">
            <EventManagement />
          </TabsContent>

          <TabsContent value="trending">
            <TrendingManagement />
          </TabsContent>

          <TabsContent value="slider">
            <SliderManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
