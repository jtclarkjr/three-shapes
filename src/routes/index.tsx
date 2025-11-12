import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { RotatingCone } from '../components/RotatingCone'
import { RotatingCube } from '../components/RotatingCube'
import { RotatingSphere } from '../components/RotatingSphere'
import { RotatingTorus } from '../components/RotatingTorus'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [selectedWord, setSelectedWord] = useState('CUBE')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="py-20 px-6 vh-100 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 pointer-events-none" />

        <h1 className="text-6xl md:text-7xl font-black text-white [letter-spacing:-0.08em] mb-12">
          <span className="text-gray-300">Three</span>{' '}
          <select
            value={selectedWord}
            onChange={(e) => setSelectedWord(e.target.value)}
            className="bg-transparent border-2 border-cyan-400/50 rounded-lg px-4 py-2 text-cyan-400 font-black text-6xl md:text-7xl cursor-pointer hover:border-cyan-400 transition-colors [letter-spacing:-0.08em] w-auto"
          >
            <option value="CUBE" className="bg-slate-800 text-cyan-400">
              CUBE
            </option>
            <option value="SPHERE" className="bg-slate-800 text-cyan-400">
              SPHERE
            </option>
            <option value="TORUS" className="bg-slate-800 text-cyan-400">
              TORUS
            </option>
            <option value="CONE" className="bg-slate-800 text-cyan-400">
              CONE
            </option>
          </select>
        </h1>

        {selectedWord === 'CUBE' && <RotatingCube />}
        {selectedWord === 'SPHERE' && <RotatingSphere />}
        {selectedWord === 'TORUS' && <RotatingTorus />}
        {selectedWord === 'CONE' && <RotatingCone />}
      </section>
    </div>
  )
}
