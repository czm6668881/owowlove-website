'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadedImage(result.data.url)
        console.log('Upload successful:', result.data)
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>图片上传测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
          </div>

          {uploading && (
            <div className="text-center py-4">
              <div className="text-gray-600">上传中...</div>
            </div>
          )}

          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded">
              错误: {error}
            </div>
          )}

          {uploadedImage && (
            <div className="space-y-4">
              <div className="text-green-600 bg-green-50 p-3 rounded">
                上传成功！图片URL: {uploadedImage}
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">上传的图片:</h3>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="max-w-full h-auto rounded border"
                  onLoad={() => console.log('Image loaded successfully')}
                  onError={(e) => {
                    console.error('Image failed to load:', e)
                    setError('图片加载失败')
                  }}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">调试信息:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>图片URL: <code className="bg-gray-100 px-1 rounded">{uploadedImage}</code></div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(uploadedImage, '_blank')}
                    >
                      在新窗口打开图片
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>现有图片测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Placeholder SVG:</h4>
              <img
                src="/placeholder.svg"
                alt="Placeholder"
                className="w-full h-32 object-cover border rounded"
                onError={() => console.error('Placeholder failed to load')}
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">产品图片 (内联SVG):</h4>
              <img
                src="data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='%23F3F4F6'/%3E%3Ctext x='100' y='100' text-anchor='middle' fill='%23374151' font-family='Arial' font-size='14'%3ETest Image%3C/text%3E%3C/svg%3E"
                alt="Test SVG"
                className="w-full h-32 object-cover border rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
