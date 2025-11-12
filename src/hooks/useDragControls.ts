import { useState } from 'react'

export const useDragControls = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [previousMousePosition, setPreviousMousePosition] = useState({
    x: 0,
    y: 0
  })
  const [rotationDelta, setRotationDelta] = useState({ x: 0, y: 0 })

  const handlePointerDown = (event: React.PointerEvent) => {
    setIsDragging(true)
    setPreviousMousePosition({
      x: event.clientX,
      y: event.clientY
    })
    setRotationDelta({ x: 0, y: 0 })
  }

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isDragging) return

    const deltaX = event.clientX - previousMousePosition.x
    const deltaY = event.clientY - previousMousePosition.y

    setRotationDelta({ x: deltaX, y: deltaY })

    setPreviousMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    setRotationDelta({ x: 0, y: 0 })
  }

  return {
    isDragging,
    rotationDelta,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  }
}
