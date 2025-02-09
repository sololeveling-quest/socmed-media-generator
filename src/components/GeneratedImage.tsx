import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download } from "lucide-react"

interface GeneratedImageProps {
  imageUrl: string
}

export default function GeneratedImage({ imageUrl }: GeneratedImageProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = "generated-image.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative aspect-square">
          <Image src={imageUrl || "/placeholder.svg"} alt="Generated image" fill className="object-cover rounded-md" />
        </div>
        <Button onClick={handleDownload} className="w-full mt-4">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </CardContent>
    </Card>
  )
}

