import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

interface RotationDelta {
  x: number
  y: number
}

interface UseRotationOptions {
  rotationDelta: RotationDelta
  isDragging: boolean
  autoRotateSpeed?: number
  dragSensitivity?: number
  momentumFactor?: number
  friction?: number
}

export const useRotation = ({
  rotationDelta,
  isDragging,
  autoRotateSpeed = 0.5,
  dragSensitivity = 0.015,
  momentumFactor = 0.8,
  friction = 0.95
}: UseRotationOptions) => {
  const meshRef = useRef<Mesh>(null)
  const velocityRef = useRef({ x: 0, y: 0 })
  const autoRotateRef = useRef(true)

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    if (isDragging && (rotationDelta.x !== 0 || rotationDelta.y !== 0)) {
      meshRef.current.rotation.y += rotationDelta.x * dragSensitivity
      meshRef.current.rotation.x += rotationDelta.y * dragSensitivity

      velocityRef.current = {
        x: rotationDelta.x * momentumFactor,
        y: rotationDelta.y * momentumFactor
      }

      autoRotateRef.current = false
    } else if (
      !isDragging &&
      (velocityRef.current.x !== 0 || velocityRef.current.y !== 0)
    ) {
      meshRef.current.rotation.y += velocityRef.current.x * delta
      meshRef.current.rotation.x += velocityRef.current.y * delta

      velocityRef.current.x *= friction
      velocityRef.current.y *= friction

      if (
        Math.abs(velocityRef.current.x) < 0.01 &&
        Math.abs(velocityRef.current.y) < 0.01
      ) {
        velocityRef.current = { x: 0, y: 0 }
        autoRotateRef.current = true
      }
    } else if (autoRotateRef.current && !isDragging) {
      meshRef.current.rotation.x += delta * autoRotateSpeed
      meshRef.current.rotation.y += delta * autoRotateSpeed
    }
  })

  return meshRef
}
