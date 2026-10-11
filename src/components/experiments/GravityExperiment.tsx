import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useSettingsStore } from '../../state/settingsStore'
import { PRESETS } from '../../state/settingsStore'
import { isReducedMotion } from '../../hooks/useReducedMotion'
import { particleBudget } from '../../utils/performance'
import { ExperimentCanvas } from './ExperimentCanvas'
import { RotateCcw } from 'lucide-react'

interface GravityExperimentProps {
  compact?: boolean
  className?: string
}

type Mode = 'attract' | 'repel'

function GravityScene({ count, mode, sim, keyboardPointer, colors }: {
  count: number
  mode: Mode
  sim: { positions: Float32Array; home: Float32Array; velocities: Float32Array }
  keyboardPointer: React.MutableRefObject<{ x: number; y: number; enabled: boolean }>
  colors: (typeof PRESETS)[keyof typeof PRESETS]['colors']
}) {
  const positionsRef = useRef<THREE.BufferAttribute>(null)
  const cursorRing = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const { positions, home, velocities } = sim
    const d = Math.min(delta, 0.05)
    const strength = (isReducedMotion() ? 3 : 6) * (mode === 'attract' ? 1 : -1)
    const cameraZ = 8
    const halfH = Math.tan(THREE.MathUtils.degToRad(25)) * cameraZ
    const halfW = halfH * (state.size.width / Math.max(state.size.height, 1))
    const px = (keyboardPointer.current.enabled ? keyboardPointer.current.x : state.pointer.x) * halfW
    const py = (keyboardPointer.current.enabled ? keyboardPointer.current.y : state.pointer.y) * halfH

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const iv = i * 2
      const x = positions[ix]
      const y = positions[ix + 1]
      let vx = velocities[iv]
      let vy = velocities[iv + 1]
      const dx = px - x
      const dy = py - y
      const dist2 = dx * dx + dy * dy
      if (dist2 > 0.001) {
        const dist = Math.sqrt(dist2)
        const f = strength / Math.max(dist2, 0.45)
        vx += (dx / dist) * f * d
        vy += (dy / dist) * f * d
      }
      const hx = home[ix] - x
      const hy = home[ix + 1] - y
      const dh = Math.sqrt(hx * hx + hy * hy)
      if (dh > 1.8) {
        const k = Math.min((dh - 1.8) * 1.4, 6)
        vx += (hx / dh) * k * d
        vy += (hy / dh) * k * d
      }
      const damping = Math.exp(-1.7 * d)
      vx *= damping
      vy *= damping
      const speed = Math.sqrt(vx * vx + vy * vy)
      if (speed > 7) { vx = (vx / speed) * 7; vy = (vy / speed) * 7 }
      positions[ix] = x + vx * d
      positions[ix + 1] = y + vy * d
      velocities[iv] = vx
      velocities[iv + 1] = vy
    }
    if (positionsRef.current) positionsRef.current.needsUpdate = true
    if (cursorRing.current) {
      cursorRing.current.position.set(px, py, 0)
      const material = cursorRing.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 4) * 0.1
    }
  })

  return <>
    <ambientLight intensity={0.6} />
    <points frustumCulled={false}>
      <bufferGeometry><bufferAttribute ref={positionsRef} attach="attributes-position" args={[sim.positions, 3]} /></bufferGeometry>
      <pointsMaterial color={colors.accent} size={0.055} sizeAttenuation transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
    <mesh ref={cursorRing}>
      <ringGeometry args={[0.16, 0.19, 48]} />
      <meshBasicMaterial color={colors.highlight} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  </>
}

export function GravityExperiment({ compact = false, className = '' }: GravityExperimentProps) {
  const count = particleBudget(compact ? 300 : 520)
  const [mode, setMode] = useState<Mode>('repel')
  const [keyboardStatus, setKeyboardStatus] = useState('')

  // Get colors from store - this is fine since we're inside a Canvas
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)
  const sim = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const home = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.sqrt(Math.random()) * 3
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius * 0.75
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      home[i * 3] = x
      home[i * 3 + 1] = y
    }
    return { positions, home, velocities }
  }, [count])

  const keyboardPointer = useRef({ x: 0, y: 0, enabled: false })

  const reset = () => {
    for (let i = 0; i < count; i++) {
      sim.positions[i * 3] = sim.home[i * 3]
      sim.positions[i * 3 + 1] = sim.home[i * 3 + 1]
      sim.velocities[i * 2] = 0
      sim.velocities[i * 2 + 1] = 0
    }
  }

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div
        className="relative min-h-0 flex-1 cursor-crosshair touch-pan-y"
        role="group"
        tabIndex={0}
        aria-label="Magnetic field. Use arrow keys to move the field or R to reset."
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          const point = keyboardPointer.current
          const step = event.shiftKey ? 0.2 : 0.08
          if (event.key === 'ArrowLeft') point.x -= step
          else if (event.key === 'ArrowRight') point.x += step
          else if (event.key === 'ArrowUp') point.y += step
          else if (event.key === 'ArrowDown') point.y -= step
          else if (event.key.toLowerCase() === 'r') { point.x = 0; point.y = 0; reset(); setKeyboardStatus('Field reset.') }
          else return
          if (event.key.startsWith('Arrow')) setKeyboardStatus('Field moved.')
          point.enabled = true
          point.x = THREE.MathUtils.clamp(point.x, -1, 1)
          point.y = THREE.MathUtils.clamp(point.y, -1, 1)
          event.preventDefault()
        }}
      >
        <span className="sr-only" aria-live="polite">{keyboardStatus}</span>
        <ExperimentCanvas className="absolute inset-0" cameraZ={8} fov={50} label={`Magnetic field experiment — particles ${mode === 'attract' ? 'attracted to' : 'repelled from'} the pointer`}>
          <GravityScene count={count} mode={mode} sim={sim} keyboardPointer={keyboardPointer} colors={colors} />
        </ExperimentCanvas>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setMode('repel')}
          aria-pressed={mode === 'repel'}
          className={`px-4 py-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors border ${
            mode === 'repel' ? 'border-accent text-accent' : 'border-line text-muted hover:text-ink'
          }`}
        >
          Repel
        </button>
        <button
          type="button"
          onClick={() => setMode('attract')}
          aria-pressed={mode === 'attract'}
          className={`px-4 py-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors border ${
            mode === 'attract' ? 'border-accent text-accent' : 'border-line text-muted hover:text-ink'
          }`}
        >
          Attract
        </button>
        <button
          type="button"
          onClick={reset}
          className="ml-auto inline-flex items-center gap-2 border border-line px-4 py-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <RotateCcw size={13} aria-hidden />
          Reset
        </button>
      </div>
    </div>
  )
}
