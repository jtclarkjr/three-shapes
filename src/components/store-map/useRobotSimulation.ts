import { useEffect, useRef, useState } from 'react'
import type { Product, Robot } from './types'
import { STORE_BOUNDS } from './mockData'

const UPDATE_INTERVAL = 100 // 10 times per second

// Aisle configuration matching mockData.ts
const NUM_AISLES = 6 // Fewer aisles to fit in store
const AISLE_SPACING = 30 // Double width - matches mockData
const AISLE_WIDTH = 6 // Match mockData.ts aisle width exactly

function isInAisleWalkway(x: number, y: number): boolean {
  // Cross-aisle walkways at top and bottom (perpendicular to aisles)
  const WALKWAY_WIDTH = 10
  const topWalkwayY = STORE_BOUNDS.height / 2 - 10
  const bottomWalkwayY = -STORE_BOUNDS.height / 2 + 10

  // Wide cross-aisles between shelf pairs (perpendicular walkways)
  for (let aisle = 0; aisle < NUM_AISLES - 1; aisle++) {
    const aisleX = -STORE_BOUNDS.width / 2 + 20 + aisle * AISLE_SPACING
    const nextAisleX =
      -STORE_BOUNDS.width / 2 + 20 + (aisle + 1) * AISLE_SPACING
    const midX = (aisleX + nextAisleX) / 2
    const crossAisleWidth = AISLE_SPACING - AISLE_WIDTH - 4 // Width between shelf pairs

    if (Math.abs(x - midX) < crossAisleWidth / 2) {
      const yInBounds = Math.abs(y) < STORE_BOUNDS.height / 2 - 5
      if (yInBounds) return true
    }
  }

  // Top and bottom walkways connecting all aisles
  if (
    (Math.abs(y - topWalkwayY) < WALKWAY_WIDTH / 2 ||
      Math.abs(y - bottomWalkwayY) < WALKWAY_WIDTH / 2) &&
    Math.abs(x) < STORE_BOUNDS.width / 2 - 10
  ) {
    return true
  }

  // BLOCK narrow shelf aisles - robots should NOT go here
  return false
}

function findNearestValidPosition(
  x: number,
  y: number
): { x: number; y: number } {
  // Find the nearest aisle center
  let nearestAisleX = -STORE_BOUNDS.width / 2 + 20
  let minDist = Math.abs(x - nearestAisleX)

  for (let aisle = 1; aisle < NUM_AISLES; aisle++) {
    const aisleX = -STORE_BOUNDS.width / 2 + 20 + aisle * AISLE_SPACING
    const dist = Math.abs(x - aisleX)
    if (dist < minDist) {
      minDist = dist
      nearestAisleX = aisleX
    }
  }

  // Clamp y to valid bounds
  const clampedY = Math.max(
    -STORE_BOUNDS.height / 2 + 10,
    Math.min(STORE_BOUNDS.height / 2 - 10, y)
  )

  return { x: nearestAisleX, y: clampedY }
}

function getValidDestination(): { x: number; y: number } {
  // Generate destination in aisles or walkways
  for (let attempts = 0; attempts < 50; attempts++) {
    const useAisle = Math.random() > 0.2

    if (useAisle) {
      const aisleNum = Math.floor(Math.random() * NUM_AISLES)
      const aisleX = -STORE_BOUNDS.width / 2 + 20 + aisleNum * AISLE_SPACING
      const y =
        Math.random() * (STORE_BOUNDS.height - 30) -
        (STORE_BOUNDS.height - 30) / 2

      return { x: aisleX, y }
    } else {
      const x = Math.random() * STORE_BOUNDS.width - STORE_BOUNDS.width / 2
      const y = Math.random() * STORE_BOUNDS.height - STORE_BOUNDS.height / 2

      if (isInAisleWalkway(x, y)) {
        return { x, y }
      }
    }
  }

  // Fallback: center of a random aisle
  const aisleNum = Math.floor(Math.random() * NUM_AISLES)
  const aisleX = -STORE_BOUNDS.width / 2 + 20 + aisleNum * AISLE_SPACING
  return { x: aisleX, y: 0 }
}

const ROBOT_RADIUS = 2
const PRODUCT_RADIUS = 0.5
const COLLISION_BUFFER = 0.5

function _checkRobotCollision(
  x: number,
  y: number,
  currentRobotId: string,
  allRobots: Robot[]
): boolean {
  return allRobots.some((robot) => {
    if (robot.id === currentRobotId) return false
    const dx = x - robot.x
    const dy = y - robot.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < ROBOT_RADIUS * 2 + COLLISION_BUFFER
  })
}

function checkProductCollision(
  x: number,
  y: number,
  products: Product[]
): boolean {
  return products.some((product) => {
    const dx = x - product.x
    const dy = y - product.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < ROBOT_RADIUS + PRODUCT_RADIUS + COLLISION_BUFFER
  })
}

export function useRobotSimulation(
  initialRobots: Robot[],
  products: Product[]
) {
  const [robots, setRobots] = useState<Robot[]>(initialRobots)
  const robotsRef = useRef<Robot[]>(initialRobots)

  useEffect(() => {
    robotsRef.current = robots
  }, [robots])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRobots((currentRobots) => {
        return currentRobots.map((robot) => {
          const dx = robot.destX - robot.x
          const dy = robot.destY - robot.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 2) {
            const newDest = getValidDestination()

            return {
              ...robot,
              destX: newDest.x,
              destY: newDest.y
            }
          }

          const moveAmount = robot.speed * (UPDATE_INTERVAL / 1000)
          const moveX = (dx / distance) * moveAmount
          const moveY = (dy / distance) * moveAmount

          let newX = robot.x + moveX
          let newY = robot.y + moveY

          // Check if current position is invalid (robot is stuck on shelf)
          if (!isInAisleWalkway(robot.x, robot.y)) {
            // Robot is stuck, teleport to nearest valid position
            const validPos = findNearestValidPosition(robot.x, robot.y)
            const newDest = getValidDestination()
            return {
              ...robot,
              x: validPos.x,
              y: validPos.y,
              destX: newDest.x,
              destY: newDest.y
            }
          }

          // Check if new position is valid (not in shelf area)
          if (!isInAisleWalkway(newX, newY)) {
            // Try moving along one axis at a time
            if (isInAisleWalkway(newX, robot.y)) {
              newY = robot.y // Only move in X
            } else if (isInAisleWalkway(robot.x, newY)) {
              newX = robot.x // Only move in Y
            } else {
              // Still can't move, stay in place but pick new destination
              const newDest = getValidDestination()
              return {
                ...robot,
                destX: newDest.x,
                destY: newDest.y
              }
            }
          }

          // Check for collisions with products
          if (checkProductCollision(newX, newY, products)) {
            // Random avoidance angle for more spontaneous movement
            const avoidAngle = (Math.random() - 0.5) * Math.PI
            const avoidX = robot.x + Math.cos(avoidAngle) * moveAmount
            const avoidY = robot.y + Math.sin(avoidAngle) * moveAmount

            if (
              isInAisleWalkway(avoidX, avoidY) &&
              !checkProductCollision(avoidX, avoidY, products)
            ) {
              newX = avoidX
              newY = avoidY
            } else {
              // Try perpendicular movements as fallback
              const perpX1 = robot.x + moveY
              const perpY1 = robot.y - moveX
              const perpX2 = robot.x - moveY
              const perpY2 = robot.y + moveX

              if (
                isInAisleWalkway(perpX1, perpY1) &&
                !checkProductCollision(perpX1, perpY1, products)
              ) {
                newX = perpX1
                newY = perpY1
              } else if (
                isInAisleWalkway(perpX2, perpY2) &&
                !checkProductCollision(perpX2, perpY2, products)
              ) {
                newX = perpX2
                newY = perpY2
              } else {
                // Stay in place
                newX = robot.x
                newY = robot.y
              }
            }
          }

          const newOrientation = Math.atan2(newX - robot.x, newY - robot.y)

          return {
            ...robot,
            x: newX,
            y: newY,
            orientation: newOrientation
          }
        })
      })
    }, UPDATE_INTERVAL)

    return () => clearInterval(intervalId)
  }, [products])

  return robots
}
