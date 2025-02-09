import ImageGenerator from '@/components/ImageGenerator'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Social Media Image Generator</h1>
      <ImageGenerator />
    </main>
  )
}
