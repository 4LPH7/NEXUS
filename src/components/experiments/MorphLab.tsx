import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { PRESETS, useSettingsStore } from '../../state/settingsStore'
import { ExperimentCanvas } from './ExperimentCanvas'
import { Slider } from '../ui/Slider'
import { RotateCcw } from 'lucide-react'

const DETAIL = 4
const RADIUS = 1.6

type MaterialMode = 'solid' | 'glass'
type LightMode = 'accent' | 'coral' | 'cyan'

interface Params {
  shape: number // 0 = sphere, 1 = torus
  spikes: number // 0 = smooth, 1 = spiky
}

/**
 * Morph Lab: real per-vertex morphing of one high-resolution icosphere.
 * The "shape" parameter blends sphere vertex positions toward a torus mapping;
 * "spikes" displaces vertices along their radial direction with a smooth
 * deterministic noise field. Targets are damped every frame, so transitions
 * are continuous vertex transformations — never a mesh swap.
 */
export function MorphLab() {
  const mesh = useRef<THREE.Mesh>(null)
  const positionsRef = useRef<THREE.BufferAttribute>(null)
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)

  const [target, setTarget] = useState<Params>({ shape: 0, spikes: 0 })
  const [materialMode, setMaterialMode] = useState<MaterialMode>('solid')
  const [lightMode, setLightMode] = useState<LightMode>('accent')

  const lightColor = lightMode === 'accent' ? colors.accent : lightMode === 'coral' ? colors.accent2 : colors.highlight

  const { geometry, base } = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(RADIUS, DETAIL)
    const position = geometry.attributes.position as THREE.BufferAttribute
    const count = position.count
    const base = {
      dirs: new Float32Array(count * 3),
      theta: new Float32Array(count),
      phi: new Float32Array(count),
      noise: new Float32Array(count),
    }
    for (let i = 0; i < count; i++) {
      const x = position.getX(i)
      const y = position.getY(i)
      const z = position.getZ(i)
      const len = Math.sqrt(x * x + y * y + z * z) || 1
      const nx = x / len
      const ny = y / len
      const nz = z / len
      base.dirs[i * 3] = nx
      base.dirs[i * 3 + 1] = ny
      base.dirs[i * 3 + 2] = nz
      // Torus mapping coordinates: longitude + tube angle.
      base.theta[i] = Math.atan2(nz, nx)
      base.phi[i] = Math.acos(THREE.MathUtils.clamp(ny, -1, 1))
      // Layered deterministic pseudo-noise in roughly [-1, 1].
      base.noise[i] =
        Math.sin(nx * 4.1 + 1.7) * 0.45 +
        Math.sin(ny * 3.7 + 4.2) * 0.3 +
        Math.sin(nz * 4.7 + 2.1) * 0.25
    }
    return { geometry, base }
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  const current = useRef<Params>({ shape: 0, spikes: 0 })
  const applied = useRef<Params>({ shape: -1, spikes: -1 })

  useFrame((_, delta) => {
    const cur = current.current
    cur.shape = THREE.MathUtils.damp(cur.shape, target.shape, 4, delta)
    cur.spikes = THREE.MathUtils.damp(cur.spikes, target.spikes, 4, delta)
    const app = applied.current
    if (Math.abs(cur.shape - app.shape) < 0.0004 && Math.abs(cur.spikes - app.spikes) < 0.0004) return
    app.shape = cur.shape
    app.spikes = cur.spikes

    const attr = positionsRef.current
    if (!attr) return
    const arr = attr.array as Float32Array
    const count = attr.count

    // Torus parameters.
    const ringR = 1.05
    const tubeR = 0.62
    for (let i = 0; i < count; i++) {
      const nx = base.dirs[i * 3]
      const ny = base.dirs[i * 3 + 1]
      const nz = base.dirs[i * 3 + 2]

      // Sphere position.
      const sx = nx * RADIUS
      const sy = ny * RADIUS
      const sz = nz * RADIUS

      // Torus position from the vertex's spherical coordinates.
      const tubeAngle = base.phi[i]
      const rr = ringR + tubeR * Math.cos(tubeAngle)
      let tx = rr * Math.cos(base.theta[i])
      const ty = tubeR * Math.sin(tubeAngle)
      let tz = rr * Math.sin(base.theta[i])

      // Twist the torus as it forms.
      const twist = cur.shape * tubeAngle * 0.6
      const cosT = Math.cos(twist)
      const sinT = Math.sin(twist)
      const txx = tx * cosT - tz * sinT
      tz = tx * sinT + tz * cosT
      tx = txx

      const shape = cur.shape
      const ease = shape * shape * (3 - 2 * shape)
      let x = sx + (tx - sx) * ease
      let y = sy + (ty - sy) * ease
      let z = sz + (tz - sz) * ease

      // Spike displacement along the radial direction.
      if (cur.spikes > 0.001) {
        const len = Math.sqrt(x * x + y * y + z * z) || 1
        const d = base.noise[i] * cur.spikes * 0.55
        x += (x / len) * d
        y += (y / len) * d
        z += (z / len) * d
      }

      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    attr.needsUpdate = true
    geometry.computeVertexNormals()
  })

  const reset = () => {
    setTarget({ shape: 0, spikes: 0 })
    setMaterialMode('solid')
    setLightMode('accent')
  }

  const segButton = <T extends string>(value: T, label: string, active: boolean, onClick: () => void) => (
    <button
      key={value}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-4 py-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors ${
        active ? 'border-accent text-accent' : 'border-line text-muted hover:text-ink'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <ExperimentCanvas className="absolute inset-0" cameraZ={6.8} fov={50} label="Morph lab — a form that reshapes between a sphere and a twisted torus">
          <ambientLight intensity={0.35} />
          <pointLight position={[3.5, 3, 4]} intensity={70} distance={20} decay={2} color={lightColor} />
          <directionalLight position={[-4, 2, 3]} intensity={0.5} color={colors.highlight} />
          <Environment resolution={64} frames={1}>
            <color attach="background" args={['#0a0a10']} />
            <Lightformer form="rect" intensity={2.5} position={[0, 4, -6]} scale={[8, 3, 1]} color={colors.accent} />
          </Environment>
          <mesh ref={mesh} geometry={geometry}>
            {materialMode === 'solid' ? (
              <meshStandardMaterial color={colors.surface} metalness={0.85} roughness={0.28} envMapIntensity={1.1} />
            ) : (
              <meshPhysicalMaterial
                transmission={0.92}
                thickness={1.4}
                roughness={0.12}
                ior={1.45}
                color="#ffffff"
                attenuationColor={colors.accent}
                attenuationDistance={2.5}
                envMapIntensity={1.2}
              />
            )}
          </mesh>
        </ExperimentCanvas>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Slider
          label="Shape"
          min={0}
          max={1}
          step={0.01}
          value={target.shape}
          onChange={(v) => setTarget((p) => ({ ...p, shape: v }))}
          format={(v) => `${Math.round(v * 100)}%`}
        />
        <Slider
          label="Spikes"
          min={0}
          max={1}
          step={0.01}
          value={target.spikes}
          onChange={(v) => setTarget((p) => ({ ...p, spikes: v }))}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {segButton('solid', 'Solid', materialMode === 'solid', () => setMaterialMode('solid'))}
        {segButton('glass', 'Glass', materialMode === 'glass', () => setMaterialMode('glass'))}
        <span className="ml-2 font-display text-[0.62rem] uppercase tracking-[0.24em] text-muted">Light</span>
        {(['accent', 'coral', 'cyan'] as LightMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setLightMode(mode)}
            aria-pressed={lightMode === mode}
            aria-label={`${mode} light`}
            className={`h-7 w-7 rounded-full border-2 transition-transform ${lightMode === mode ? 'scale-110 border-ink' : 'border-line'}`}
            style={{ background: mode === 'accent' ? colors.accent : mode === 'coral' ? colors.accent2 : colors.highlight }}
          />
        ))}
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
