'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import GeneratedImage from './GeneratedImage'

const platforms = [
  { name: 'Instagram', size: { width: 1080, height: 1080 } },
  { name: 'Facebook', size: { width: 1200, height: 630 } },
  { name: 'Twitter', size: { width: 1200, height: 675 } },
]

export default function ImageGenerator() {
  const [images, setImages] = useState<string[]>([])
  const [text, setText] = useState('')
  const [platform, setPlatform] = useState(platforms[0].name)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateImage = async () => {
    const selectedPlatform = platforms.find((p) => p.name === platform)
    if (!selectedPlatform) return

    setIsGenerating(true)

    try {
      console.log('Sending request to generate image')
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, size: selectedPlatform.size }),
      })

      console.log('Received response', { status: response.status, statusText: response.statusText })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error('Failed to parse error response', e)
        }
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get('content-type')
      console.log('Content-Type:', contentType)

      if (contentType?.includes('application/json')) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Unexpected JSON response')
      }

      const blob = await response.blob()
      console.log('Received blob', { size: blob.size, type: blob.type })

      const imageUrl = URL.createObjectURL(blob)
      setImages((prev) => [imageUrl, ...prev])
    } catch (error) {
      console.error('Error generating image:', error)
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: `Failed to generate image: ${error.message}`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to generate image due to an unknown error',
          variant: 'destructive',
        })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="text">Image Text</Label>
          <Input
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text for the image max 160 characters"
            maxLength={160}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generateImage} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <GeneratedImage key={index} imageUrl={imageUrl} />
        ))}
      </div>
    </div>
  )
}
