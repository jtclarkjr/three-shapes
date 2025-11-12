import { CanvasTexture } from 'three'

export const createAceOfSpadesTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 712
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('Could not get canvas context')

  // White background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Black border
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 8
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

  // Top left "A"
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 80px Arial'
  ctx.fillText('A', 60, 110)

  // Top left spade symbol
  ctx.font = '60px Arial'
  ctx.fillText('\u2660', 70, 180)

  // Bottom right "A" (upside down)
  ctx.save()
  ctx.translate(canvas.width - 60, canvas.height - 110)
  ctx.rotate(Math.PI)
  ctx.font = 'bold 80px Arial'
  ctx.fillText('A', 0, 0)
  ctx.restore()

  // Bottom right spade (upside down)
  ctx.save()
  ctx.translate(canvas.width - 70, canvas.height - 180)
  ctx.rotate(Math.PI)
  ctx.font = '60px Arial'
  ctx.fillText('\u2660', 0, 0)
  ctx.restore()

  // Center large spade
  ctx.font = 'bold 200px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('\u2660', canvas.width / 2, canvas.height / 2 + 70)

  return new CanvasTexture(canvas)
}

export const createCardBackTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 712
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('Could not get canvas context')

  // Red background
  ctx.fillStyle = '#c41e3a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // White border
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 8
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

  // Pattern
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 15; j++) {
      ctx.strokeRect(60 + i * 40, 60 + j * 40, 30, 30)
    }
  }

  return new CanvasTexture(canvas)
}
