import fs from 'fs'
import path from 'path'
import React from 'react'
import { parse } from 'node-html-parser'

export const getPaths = ({ folderName, filename }: { folderName: string; filename: string }) => {
  const baseDir = process.cwd()

  if (!filename.endsWith('.svg')) {
    filename += '.svg'
  }

  try {
    const fileContent = fs.readFileSync(
      path.join(baseDir, `/public/assets/peeps/${folderName}/${filename}`),
      'utf-8',
    )

    const root = parse(fileContent)
    const pathTags = root.querySelectorAll('path')

    if (!pathTags || (pathTags && pathTags.length === 0)) {
      throw new Error('No path tags found in the file')
    }

    const jsxPathTags = pathTags.map((tag) => {
      const attributes = tag.attributes
      const props = Object.keys(attributes).reduce(
        (acc, key) => {
          const newKey =
            key === 'class' ? 'className' : key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          acc[newKey] = attributes[key]
          return acc
        },
        {} as Record<string, string>,
      )

      return React.createElement('path', { ...props, key: props.id || Math.random().toString() })
    })

    return jsxPathTags
  } catch (e) {
    console.error(e)
  }
  return null
}

// getPath({ folderName: 'body', filename: 'Coffee' })

const heads = [
  'Shaved 2.svg',
  'Cornrows 2.svg',
  'Bun 2.svg',
  'Medium Straight.svg',
  'Buns.svg',
  'Bangs 2.svg',
  'Cornrows.svg',
  'Medium Bangs 3.svg',
  'Short 1.svg',
  'Short 4.svg',
  'Long Afro.svg',
  'Medium Bangs 2.svg',
  'No Hair 2.svg',
  'Twists.svg',
  'Mohawk.svg',
  'Gray Bun.svg',
  'Gray Short.svg',
  'No Hair 1.svg',
  'Short 2.svg',
  'Long Curly.svg',
  'Shaved 1.svg',
  'Medium 3.svg',
  'Short 5.svg',
  'Long.svg',
  'Flat Top.svg',
  'No Hair 3.svg',
  'Afro.svg',
  'Medium 2.svg',
  'hat-hip.svg',
  'Gray Medium.svg',
  'Shaved 3.svg',
  'Bantu Knots.svg',
  'Bear.svg',
  'Turban.svg',
  'Bangs.svg',
  'Medium Bangs.svg',
  'Hijab.svg',
  'Pomp.svg',
  'hat-beanie.svg',
  'Bun.svg',
  'Medium 1.svg',
  'Short 3.svg',
  'Flat Top Long.svg',
  'Long Bangs.svg',
  'Mohawk 2.svg',
  'Twists 2.svg',
]

export const getRandomHead = () => {
  const randomIndex = Math.floor(Math.random() * heads.length)
  const randomHead = heads[randomIndex]
  return randomHead
}

const accessories = [
  'Glasses.svg',
  'Eyepatch.svg',
  'Glasses 4.svg',
  'Sunglasses 2.svg',
  'Glasses 2.svg',
  'Glasses 5.svg',
  'Glasses 3.svg',
  'Sunglasses.svg',
]

export const getRandomAccessory = () => {
  const randomIndex = Math.floor(Math.random() * accessories.length)
  const randomAccessory = accessories[randomIndex]
  return randomAccessory
}

const bodies = [
  'Polo and Sweater.svg',
  'Macbook.svg',
  'Killer.svg',
  'Gaming.svg',
  'Button Shirt 2.svg',
  'Tee 2.svg',
  'Tee 1.svg',
  'Shirt and Coat.svg',
  'Hoodie.svg',
  'Explaining.svg',
  'Dress.svg',
  'Fur Jacket.svg',
  'Paper.svg',
  'Sweater.svg',
  'Turtleneck.svg',
  'Sweater Dots.svg',
  'Device.svg',
  'Polka Dot Jacket.svg',
  'Pointing Up.svg',
  'Coffee.svg',
  'Thunder T-Shirt.svg',
  'Striped Tee.svg',
  'Gym Shirt.svg',
  'Sporty Tee.svg',
  'Button Shirt 1.svg',
  'Striped Pocket Tee.svg',
  'Whatever.svg',
  'Blazer Black Tee.svg',
  'Tee Arms Crossed.svg',
  'Tee Selena.svg',
]

export const getRandomBody = () => {
  const randomIndex = Math.floor(Math.random() * bodies.length)
  const randomBody = bodies[randomIndex]
  return randomBody
}

const faces = [
  'Cyclops.svg',
  'Loving Grin 1.svg',
  'Angry with Fang.svg',
  'Eyes Closed.svg',
  'Smile.svg',
  'Old.svg',
  'Concerned Fear.svg',
  'Contempt.svg',
  'Cheeky.svg',
  'Explaining.svg',
  'Smile Big.svg',
  'Solemn.svg',
  'Tired.svg',
  'Smile Teeth Gap.svg',
  'Smile LOL.svg',
  'Awe.svg',
  'Blank.svg',
  'Serious.svg',
  'Rage.svg',
  'Cute.svg',
  'Hectic.svg',
  'Eating Happy.svg',
  'Monster.svg',
  'Suspicious.svg',
  'Loving Grin 2.svg',
  'Calm.svg',
  'Concerned.svg',
  'Very Angry.svg',
  'Driven.svg',
  'Fear.svg',
]

export const getRandomFace = () => {
  const randomIndex = Math.floor(Math.random() * faces.length)
  const randomFace = faces[randomIndex]
  return randomFace
}
