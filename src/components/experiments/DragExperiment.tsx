import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PRESETS, useSettingsStore } from '../../state/settingsStore'
import { isReducedMotion } from '../../hooks/useReducedMotion'
import { useDragRotation } from '../../hooks/useDragRotation'
import { ExperimentCanvas } from './ExperimentCanvas'
import { RotateCcw } from 'lucide-react'

interface DragExperimentProps {
  className?: string
}

export function DragExperiment({ className = '' }: DragExperimentProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const drag = useDragRotation()
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)

  const geometry = useMemo(() => new THREE.TorusKnotGeometry(1.05, 0.34, 220, 36), [])
  useMemo(() => geometry, [geometry])

  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return
    const reduced = isReducedMotion()
    const motion = reduced ? 0 : useSettingsStore.getState().motionIntensity
    const v = drag.velocity

    if (!drag.dragging.current) {
      drag.rotation.y += v.y + delta * 0.08 * motion
      drag.rotation.x += v.x
      v.x *= Math.exp(-2.4 * delta)
      v.y *= Math.exp(-2.4 * delta)
    }

    const lambda = 14
    m.rotation.x = THREE.MathUtils.damp(m.rotation.x, drag.rotation.x, lambda, delta)
    m.rotation.y = THREE.MathUtils.damp(m.rotation.y, drag.rotation.y, lambda, delta)

    const targetScale = drag.dragging.current ? 1.07 : 1
    m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, targetScale, 10, delta))

    const material = m.material as THREE.MeshPhysicalMaterial
    const targetEmissive = drag.dragging.current ? 0.5 : 0.12
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, targetEmissive, 8, delta)
  })

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className="group relative min-h-0 flex-1 cursor-grab active:cursor-grabbing">
        <ExperimentCanvas className="absolute inset-0" cameraZ={6.5} fov={50} label="Grab and rotate experiment — a chrome torus knot that spins when dragged">
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 6, 5]} intensity={1.4} color={colors.lightA} />
          <directionalLight position={[-5, -3, 4]} intensity={0.6} color={colors.accent2} />
          <Environment resolution={64} frames={1}>
            <color attach="background" args={['#0a0a10']} />
            <Lightformer form="rect" intensity={3} position={[0, 4, -6]} scale={[8, 3, 1]} color={colors.accent} />
            <Lightformer form="circle" intensity={2} position={[-5, 0, 3]} scale={4} color={colors.highlight} />
          </Environment>
          <mesh
            ref={mesh}
            geometry={geometry}
            {...drag.handlers}
          >
            <meshPhysicalMaterial
              color="#c9c4de"
              metalness={1}
              roughness={0.14}
              clearcoat={1}
              envMapIntensity={1.4}
              emissive={colors.accent}
              emissiveIntensity={0.12}
            />
          </mesh>
        </ExperimentCanvas>
        <p aria-hidden className="pointer-events-none absolute bottom-4 left-4 font-display text-[0.62rem] uppercase tracking-[0.24em] text-muted">
          Drag to rotate
        </p>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={drag.reset}
          className="ml-auto inline-flex items-center gap-2 border border-line px-4 py-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <RotateCcw size={13} aria-hidden />
          Reset
        </button>
      </div>
    </div>
  )
}
