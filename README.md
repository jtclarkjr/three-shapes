# Three React

A Three.js demo application built with React, showcasing interactive 3D
geometries with a modern UI.

## Overview

This project demonstrates the integration of Three.js with React using
`@react-three/fiber`, featuring animated 3D shapes including cubes, spheres,
toruses, and cones. Users can dynamically switch between different geometries
through an interactive UI.

## Tech Stack

- **React 19** - UI framework
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **TanStack Router** - Type-safe routing
- **TanStack Start** - Full-stack React framework
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Biome** - Linting and formatting
- **Vitest** - Testing

## Getting Started

### Installation

```bash
bun install
```

### Development

Run the development server:

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

### Build

Build for production:

```bash
bun build
```

### Preview

Preview the production build:

```bash
bun serve
```

## Project Structure

```
src/
├── components/          # Three.js React components
│   ├── RotatingCube.tsx
│   ├── RotatingSphere.tsx
│   ├── RotatingTorus.tsx
│   └── RotatingCone.tsx
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx      # Root layout
│   └── index.tsx       # Home page
├── router.tsx          # Router configuration
├── routeTree.gen.ts    # Generated route tree
└── styles.css          # Global styles
```

## Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun serve        # Preview production build
bun test         # Run tests
bun lint         # Lint code
bun format       # Format code
bun check        # Run Biome checks (lint + format)
```

## Development

### Adding New 3D Components

Create a new component in `src/components/` following the pattern of existing
components:

```tsx
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'

export function RotatingShape() {
  const meshRef = useRef<Mesh>(null)

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
    </Canvas>
  )
}
```

### Routing

This project uses TanStack Router with file-based routing. Add new routes by
creating files in `src/routes/`.

## Code Quality

- **Biome** handles both linting and formatting
- **TypeScript** ensures type safety throughout the codebase
- **Vitest** provides fast unit testing

## License

MIT
