"use client"

import { useState, useRef } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Upload, X, ImageIcon, Video, Move } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function MediaUpload({ images = [], videos = [], onImagesChange, onVideosChange }) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = async (files) => {
    setUploading(true)
    const newImages = []
    const newVideos = []

    for (const file of files) {
      try {
        if (file.type.startsWith("image/")) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`Image ${file.name} is too large. Maximum size is 5MB.`)
            continue
          }
          const url = await uploadFile(file)
          if (url) {
            newImages.push({
              id: Date.now() + Math.random(),
              url,
              name: file.name,
              size: file.size,
            })
            toast.success(`Image ${file.name} uploaded successfully!`)
          }
        } else if (file.type.startsWith("video/")) {
          if (file.size > 50 * 1024 * 1024) {
            toast.error(`Video ${file.name} is too large. Maximum size is 50MB.`)
            continue
          }
          const url = await uploadFile(file)
          if (url) {
            newVideos.push({
              id: Date.now() + Math.random(),
              url,
              name: file.name,
              size: file.size,
            })
            toast.success(`Video ${file.name} uploaded successfully!`)
          }
        } else {
          toast.error(`Unsupported file type: ${file.name}`)
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages])
    }
    if (newVideos.length > 0) {
      onVideosChange([...videos, ...newVideos])
    }
    setUploading(false)
  }

  const uploadFile = async (file) => {
    try {
      console.log('Uploading file:', file.name, 'Size:', file.size)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/single`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      console.log('Upload response:', response.data)

      if (response.data && response.data.data && response.data.data.url) {
        return response.data.data.url
      } else {
        throw new Error('No URL received from upload')
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const removeImage = (id) => {
    onImagesChange(images.filter((img) => img.id !== id))
    toast.success('Image removed')
  }

  const removeVideo = (id) => {
    onVideosChange(videos.filter((vid) => vid.id !== id))
    toast.success('Video removed')
  }

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
    toast.success('Image order updated')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Media Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drag and drop files here, or click to select</p>
            <p className="text-sm text-gray-500 mb-4">Supports: JPG, PNG, GIF, WebP (max 5MB) | MP4, WebM (max 50MB)</p>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading..." : "Select Files"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Images Section */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Images ({images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg'
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      {index > 0 && (
                        <Button size="sm" variant="secondary" onClick={() => moveImage(index, index - 1)}>
                          <Move className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => removeImage(image.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p className="truncate">{image.name}</p>
                    <p>{formatFileSize(image.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Videos ({videos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div key={video.id} className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video src={video.url} className="w-full h-full object-cover" controls />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeVideo(video.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="mt-2 text-xs text-gray-500">
                    <p className="truncate">{video.name}</p>
                    <p>{formatFileSize(video.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
