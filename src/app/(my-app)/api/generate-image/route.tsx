import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { fontsLibrary } from '@/lib/fonts'
import {
  getPaths,
  getRandomAccessory,
  getRandomBody,
  getRandomFace,
  getRandomHead,
} from '@/lib/peeps'

// export const runtime = 'edge'

// Helper function to generate a random color
const randomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  const saturation = Math.floor(Math.random() * 30) + 70 // 70-100%
  const lightness = Math.floor(Math.random() * 30) + 35 // 35-65%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// Helper function to get a random position
const randomPosition = () => {
  // const positions = ['flex-start', 'center', 'flex-end']
  // const selectedPosition = positions[Math.floor(Math.random() * positions.length)]
  const selectedPosition = 'flex-start'
  return {
    justifyContent: selectedPosition,
    alignItems: selectedPosition,
  }
}

// Helper function to determine text color based on background
const getTextColor = (bgColor: string) => {
  const rgb = bgColor.match(/\d+/g)
  if (rgb) {
    const [r, g, b] = rgb.map(Number)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? 'black' : 'white'
  }
  return 'white' // Default to white if parsing fails
}

// Helper function to generate random abstract shapes
const generateAbstractShapes = (width: number, height: number, count = 5) => {
  const shapes = []
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * (Math.min(width, height) / 2) + 20
    const opacity = Math.random() * 0.5 + 0.1 // 0.1 to 0.6
    const fill = randomColor()

    const shapeType = Math.random()
    const shapeRanges = [
      { type: 'circle', range: 0.2 },
      { type: 'star', range: 0.4 },
      { type: 'moon', range: 0.6 },
      { type: 'hexagon', range: 0.8 },
    ]

    for (const shape of shapeRanges) {
      if (shapeType < shape.range) {
        if (shape.type === 'circle') {
          shapes.push({
            type: 'circle',
            props: {
              cx: x,
              cy: y,
              r: size / 2,
              fill,
              opacity,
            },
          })
        } else if (shape.type === 'star') {
          const starPoints = []
          const numPoints = 5
          const angleStep = (Math.PI * 2) / (numPoints * 2)
          for (let j = 0; j < numPoints * 2; j++) {
            const angle = j * angleStep
            const radius = j % 2 === 0 ? size / 2 : size / 4
            const px = x + Math.cos(angle) * radius
            const py = y + Math.sin(angle) * radius
            starPoints.push(`${px},${py}`)
          }
          shapes.push({
            type: 'star',
            props: {
              points: starPoints.join(' '),
              fill,
              opacity,
            },
          })
        } else if (shape.type === 'hexagon') {
          const hexagonPoints = []
          for (let j = 0; j < 6; j++) {
            const angle = (Math.PI / 3) * j
            const px = x + (Math.cos(angle) * size) / 2
            const py = y + (Math.sin(angle) * size) / 2
            hexagonPoints.push(`${px},${py}`)
          }
          shapes.push({
            type: 'hexagon',
            props: {
              points: hexagonPoints.join(' '),
              fill,
              opacity,
            },
          })
        }
        break
      }
    }
  }
  return shapes
}

export async function POST(req: NextRequest) {
  try {
    console.log('API route: Received request')
    const { text, size } = await req.json()
    console.log('API route: Parsed request body', { text, size })

    if (!text || !size?.width || !size?.height) {
      console.log('API route: Invalid input parameters')
      return new Response(JSON.stringify({ error: 'Invalid input parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Calculate font size based on image size
    const baseFontSize = Math.min(size.width, size.height) * 0.05
    const titleFontSize = Math.max(64, baseFontSize * (Math.random() * 0.6 + 0.75)) // Randomize between 75% and 125% of base
    const textFontSize = 68 // Math.max(64, baseFontSize * (Math.random() * 0.5 + 0.75)) // Randomize between 60% and 100% of base

    // Get random position
    const { justifyContent, alignItems } = randomPosition()

    // Select random font family
    const selectedFont = fontsLibrary[Math.floor(Math.random() * fontsLibrary.length)]

    console.log('API route: Generating image')
    const fonts = await (async () => {
      try {
        const baseUrl = process.env.BASE_API_URL ?? 'http://localhost:3000'

        const fontUrl = new URL(
          `${baseUrl}/fonts/${selectedFont.possiblePairs[0].heading}.ttf`,
          import.meta.url,
        )

        const response = await fetch(fontUrl)
        if (!response.ok) {
          console.error(`Failed to fetch font from ${fontUrl}: ${response.statusText}`)
          throw new Error('Font fetch failed')
        }
        const fontData = await response.arrayBuffer()
        return [
          {
            name: selectedFont.possiblePairs[0].heading,
            data: fontData,
            // weight: 400,
            // style: 'normal',
          },
        ]
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching font, falling back to default font:', error.message)
        } else {
          console.error('Unknown error fetching font, falling back to default font')
        }
        if (error instanceof Error) {
          throw new Error(error.message)
        } else {
          throw new Error('Unknown error occurred while fetching font')
        }
      }
    })()

    const askAI = await fetch('https://n8n.sololeveling.quest/webhook/mood-detection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: text }),
    })
    const askAIJson = await askAI.json()

    console.log(askAIJson)

    // Generate random gradient
    const selectedGradientColor =
      selectedFont.gradientColors[Math.floor(Math.random() * selectedFont.gradientColors.length)]
    const color1 =
      askAIJson?.output?.gradientColorOptions[Math.floor(Math.random() * 3)]?.pair[0] ??
      selectedGradientColor[0] //randomColor()
    const color2 =
      askAIJson?.output?.gradientColorOptions[Math.floor(Math.random() * 3)]?.pair[1] ??
      selectedGradientColor[1] // randomColor()
    // const color1 = randomColor()
    // const color2 = randomColor()
    const gradient = `linear-gradient(45deg, ${color1}, ${color2})`

    console.log(selectedFont)

    // Determine text color based on the first color of the gradient
    const textColor = getTextColor(color1)

    // Generate abstract shapes
    const abstractShapes = generateAbstractShapes(size.width, size.height)

    const svgPathBody = getPaths({
      folderName: 'body',
      filename: askAIJson?.output?.characterExpression?.body ?? getRandomBody(),
    })

    const svgPathHead = getPaths({
      folderName: 'head',
      filename: askAIJson?.output?.characterExpression?.head ?? getRandomHead(),
    })

    const svgPathFace = getPaths({
      folderName: 'face',
      filename: askAIJson?.output?.characterExpression?.face ?? getRandomFace(),
    })

    const svgPathAccessories = getPaths({
      folderName: 'accessories',
      filename: askAIJson?.output?.characterExpression?.accessories ?? getRandomAccessory(),
    })

    const image = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            backgroundImage: gradient,
            // padding: '40px',
            boxSizing: 'border-box',
            fontFamily: selectedFont.possiblePairs[0].heading,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <svg
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width} ${size.height}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            {abstractShapes.map((shape, index) => {
              if (shape.type === 'circle') {
                return <circle key={index} {...shape.props} />
              } else if (shape.type === 'star') {
                return <polygon key={index} {...shape.props} />
              } else if (shape.type === 'hexagon') {
                return <polygon key={index} {...shape.props} />
              }
              return null
            })}
          </svg>

          <svg
            width="440px"
            height="524px"
            // viewBox="0 0 440 524"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              transform: 'scaleX(-1)',
            }}
          >
            <g id="Introduction" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="variations" transform="translate(-126.000000, -434.000000)">
                <g id="images" transform="translate(126.000000, 110.000000)">
                  <g id="a-person/bust" transform="translate(0.000000, 324.000000)">
                    <g
                      id="body/*"
                      transform="translate(31.056338, 135.052838),scale(0.21)"
                      fillRule="evenodd"
                    >
                      {svgPathBody}
                    </g>
                    <g
                      id="head/*"
                      transform="translate(78.591549, 38.043053),scale(0.21)"
                      fillRule="evenodd"
                    >
                      {svgPathHead}
                    </g>
                    <g
                      id="face/*"
                      transform="translate(112.183099, 77.354207),scale(0.21)"
                      fill="#000000"
                      fillRule="evenodd"
                    >
                      {svgPathFace}
                    </g>
                    <g
                      id="facial-hair/*-None"
                      transform="translate(104.577451, 109.479380),scale(0.21)"
                    ></g>
                    <g
                      id="accessories/*-None"
                      transform="translate(88.521127, 88.978474), scale(0.21)"
                    >
                      {svgPathAccessories}
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>

          <div
            style={{
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent,
              alignItems,
            }}
          >
            <div
              style={{
                fontSize: `${textFontSize}px`,
                color: textColor,
                // textAlign: ['center', 'left', 'right'][Math.floor(Math.random() * 3)] as
                //   | 'center'
                //   | 'left'
                //   | 'right',
                marginTop: '20px',
                textShadow:
                  textColor === 'white'
                    ? '1px 1px 2px rgba(0,0,0,0.5)'
                    : '1px 1px 2px rgba(255,255,255,0.5)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {text}
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts,
      },
    )

    console.log('API route: Image generated successfully')
    return image
  } catch (error) {
    if (error instanceof Error) {
      console.error('API route: Error generating image', error.message)
    } else {
      console.error('API route: Unknown error generating image')
    }
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: (error as Error).message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
