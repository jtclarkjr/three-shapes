import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type { Mesh } from 'three'

interface CubeProps {
  rotationDelta: { x: number; y: number }
  isDragging: boolean
}

function Cube({ rotationDelta, isDragging }: CubeProps) {
  const meshRef = useRef<Mesh>(null)
  const velocityRef = useRef({ x: 0, y: 0 })
  const autoRotateRef = useRef(true)

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    // Apply manual rotation from drag
    if (isDragging && (rotationDelta.x !== 0 || rotationDelta.y !== 0)) {
      meshRef.current.rotation.y += rotationDelta.x * 0.015
      meshRef.current.rotation.x += rotationDelta.y * 0.015

      // Track velocity for momentum
      velocityRef.current = {
        x: rotationDelta.x * 0.8,
        y: rotationDelta.y * 0.8
      }

      autoRotateRef.current = false
    } else if (
      !isDragging &&
      (velocityRef.current.x !== 0 || velocityRef.current.y !== 0)
    ) {
      // Apply momentum after flick
      meshRef.current.rotation.y += velocityRef.current.x * delta
      meshRef.current.rotation.x += velocityRef.current.y * delta

      // Apply friction to slow down momentum
      const friction = 0.95
      velocityRef.current.x *= friction
      velocityRef.current.y *= friction

      // If velocity is very small, switch back to auto-rotate
      if (
        Math.abs(velocityRef.current.x) < 0.01 &&
        Math.abs(velocityRef.current.y) < 0.01
      ) {
        velocityRef.current = { x: 0, y: 0 }
        autoRotateRef.current = true
      }
    } else if (autoRotateRef.current && !isDragging) {
      // Default auto-rotation
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef} castShadow position={[0, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  )
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <shadowMaterial opacity={0.3} />
    </mesh>
  )
}

export function RotatingCube() {
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

  return (
    <div
      className="w-full h-[28rem] md:h-[40rem] cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Cube rotationDelta={rotationDelta} isDragging={isDragging} />
        <Floor />
      </Canvas>
    </div>
  )
}
