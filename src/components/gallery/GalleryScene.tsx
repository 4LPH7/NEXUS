import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { useSettingsStore, PRESETS, type PresetColors } from '../../state/settingsStore'
import { isReducedMotion } from '../../hooks/useReducedMotion'
import { ExperimentCanvas } from '../experiments/ExperimentCanvas'

type Specimen = 'orbit' | 'flux' | 'prism'

function Orbit({ colors, onInteract }: { colors: PresetColors; onInteract: () => void }) {
  const rig = useRef<THREE.Group>(null)
  const speed = useRef(0.65)
  useFrame((_, delta) => { if (rig.current && !isReducedMotion()) rig.current.rotation.y += delta * speed.current })
  return <group ref={rig} onPointerMove={(e) => { speed.current = THREE.MathUtils.clamp(e.point.x * 0.7, -1.8, 1.8); onInteract() }} onClick={() => { speed.current *= -1; onInteract() }}>
    <mesh><icosahedronGeometry args={[0.55, 2]} /><meshPhysicalMaterial color={colors.highlight} metalness={0.75} roughness={0.16} clearcoat={1} /></mesh>
    {[0, 1, 2].map((i) => <group key={i} rotation={[0, i * 2.1, i * 0.7]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.15 + i * 0.22, 0.012, 8, 96]} /><meshBasicMaterial color={i === 1 ? colors.accent2 : colors.accent} /></mesh>
      <mesh position={[1.15 + i * 0.22, 0, 0]}><sphereGeometry args={[0.09 + i * 0.025, 20, 20]} /><meshStandardMaterial color={i === 1 ? colors.accent2 : colors.highlight} metalness={0.7} roughness={0.2} /></mesh>
    </group>)}
  </group>
}

function Flux({ colors, onInteract }: { colors: PresetColors; onInteract: () => void }) {
  const mesh = useRef<THREE.Mesh>(null)
  const target = useRef(1)
  useFrame((state, delta) => {
    if (!mesh.current) return
    if (!isReducedMotion()) mesh.current.rotation.y += delta * 0.22
    mesh.current.scale.setScalar(THREE.MathUtils.damp(mesh.current.scale.x, target.current, 5, delta))
    const material = mesh.current.material as THREE.MeshPhysicalMaterial
    material.emissiveIntensity = isReducedMotion() ? 0.08 : 0.08 + Math.sin(state.clock.elapsedTime * 1.4) * 0.08
  })
  return <mesh ref={mesh} onPointerMove={(e) => { target.current = 0.78 + Math.abs(e.point.x) * 0.28; onInteract() }} onClick={() => { target.current = target.current > 1 ? 0.78 : 1.24; onInteract() }}>
    <torusKnotGeometry args={[0.9, 0.28, 180, 32, 2, 5]} />
    <meshPhysicalMaterial color={colors.surface} emissive={colors.accent} metalness={0.82} roughness={0.18} clearcoat={1} />
  </mesh>
}

function Prism({ color, onInteract }: { color: string; onInteract: () => void }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => { if (mesh.current && !isReducedMotion()) mesh.current.rotation.y += delta * 0.18 })
  return <mesh ref={mesh} onPointerMove={(e) => { if (mesh.current) mesh.current.rotation.x = e.point.y * 0.35; onInteract() }} onClick={() => { if (mesh.current) mesh.current.rotation.z += Math.PI / 4; onInteract() }}>
    <octahedronGeometry args={[1.2, 2]} />
    <meshPhysicalMaterial color={color} transmission={0.82} thickness={1.4} roughness={0.12} ior={1.45} clearcoat={1} />
  </mesh>
}

export function GalleryScene({ specimen, resetKey, onInteract }: { specimen: Specimen; resetKey: number; onInteract: () => void }) {
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)
  return <ExperimentCanvas key={resetKey} className="h-full min-h-64 touch-pan-y" cameraZ={5.5} label={`${specimen} specimen — pointer interaction changes its movement`}>
    <ambientLight intensity={0.45} />
    <pointLight position={[2, 3, 4]} intensity={24} distance={18} color={colors.accent} />
    <Environment resolution={64} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 4, -5]} scale={[8, 3, 1]} color={colors.accent} />
      <Lightformer form="circle" intensity={2} position={[-4, 0, 3]} scale={3} color={colors.highlight} />
    </Environment>
    {specimen === 'orbit' ? <Orbit colors={colors} onInteract={onInteract} /> : specimen === 'flux' ? <Flux colors={colors} onInteract={onInteract} /> : <Prism color={colors.highlight} onInteract={onInteract} />}
  </ExperimentCanvas>
}
