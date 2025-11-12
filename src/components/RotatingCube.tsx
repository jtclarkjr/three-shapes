import { useRotation } from '@/hooks/useRotation'
import { Scene3D } from './_resuables/Scene3D'

interface CubeProps {
  rotationDelta: { x: number; y: number }
  isDragging: boolean
}

const Cube = ({ rotationDelta, isDragging }: CubeProps) => {
  const meshRef = useRotation({ rotationDelta, isDragging })

  return (
    <mesh ref={meshRef} castShadow position={[0, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  )
}

export const RotatingCube = () => {
  return (
    <Scene3D>
      {({ isDragging, rotationDelta }) => (
        <Cube rotationDelta={rotationDelta} isDragging={isDragging} />
      )}
    </Scene3D>
  )
}
