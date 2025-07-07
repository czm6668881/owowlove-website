'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Download, 
  Copy,
  Eye,
  Grid,
  List,
  Filter
} from 'lucide-react'

interface MediaFile {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  type: string
  alt?: string
  uploadedAt: string
  usedIn: string[]
}

const mockMediaFiles: MediaFile[] = [
  {
    id: '1',
    filename: 'product-1751126775583.jpg',
    originalName: 'sexy-lingerie-1.jpg',
    url: '/api/image/product-1751126775583.jpg',
    size: 245760,
    type: 'image/jpeg',
    alt: 'Sexy crotchless net lingerie',
    uploadedAt: '2025-01-01T10:30:00Z',
    usedIn: ['Product: Sexy Crotchless net']
  },
  {
    id: '2',
    filename: 'placeholder.jpg',
    originalName: 'placeholder.jpg',
    url: '/placeholder.jpg',
    size: 15420,
    type: 'image/jpeg',
    uploadedAt: '2024-12-01T00:00:00Z',
    usedIn: []
  },
  {
    id: '3',
    filename: 'placeholder-user.jpg',
    originalName: 'user-avatar.jpg',
    url: '/placeholder-user.jpg',
    size: 8960,
    type: 'image/jpeg',
    uploadedAt: '2024-12-01T00:00:00Z',
    usedIn: []
  }
]

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockMediaFiles)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [uploading, setUploading] = useState(false)

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = 
      file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.alt && file.alt.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === 'all' || file.type.startsWith(typeFilter)
    
    return matchesSearch && matchesType
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('image', file)
      
      try {
        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData
        })
        
        const result = await response.json()
        
        if (result.success) {
          const newFile: MediaFile = {
            id: Date.now().toString(),
            filename: result.filename,
            originalName: file.name,
            url: result.url,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            usedIn: []
          }
          
          setMediaFiles(prev => [newFile, ...prev])
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
    
    setUploading(false)
    event.target.value = ''
  }

  const deleteFile = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setMediaFiles(prev => prev.filter(file => file.id !== fileId))
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url)
    alert('URL copied to clipboard!')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalFiles = mediaFiles.length
  const totalSize = mediaFiles.reduce((sum, file) => sum + file.size, 0)
  const imageFiles = mediaFiles.filter(file => file.type.startsWith('image')).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-2">Manage your uploaded files and images</p>
        </div>
        <div className="flex space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            multiple
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button disabled={uploading} asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Files'}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{totalFiles}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Images</p>
                <p className="text-2xl font-bold text-gray-900">{imageFiles}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="application">Documents</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {file.type.startsWith('image') ? (
                  <img
                    src={file.url}
                    alt={file.alt || file.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm truncate" title={file.originalName}>
                  {file.originalName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                </p>
                {file.usedIn.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    Used in {file.usedIn.length} place(s)
                  </p>
                )}
                <div className="flex space-x-1 mt-3">
                  <Button variant="outline" size="sm" onClick={() => copyUrl(file.url)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-3 h-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr key={file.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                            {file.type.startsWith('image') ? (
                              <img
                                src={file.url}
                                alt={file.alt || file.originalName}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {file.originalName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {file.filename}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(file.uploadedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.usedIn.length > 0 ? (
                          <span className="text-green-600">
                            {file.usedIn.length} place(s)
                          </span>
                        ) : (
                          <span className="text-gray-400">Unused</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => copyUrl(file.url)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-3 h-3" />
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Upload some files to get started.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
