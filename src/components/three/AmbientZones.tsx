import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { PRESETS, useSettingsStore } from '../../state/settingsStore'
import { isReducedMotion } from '../../hooks/useReducedMotion'
import { useEffectiveReducedMotion } from '../../hooks/useReducedMotion'

/*
  Ambient sculpture clusters placed along the camera path, one per section so
  every dimension has its own backdrop. Float wrappers pause entirely under
  reduced motion.
*/

function FloatingOrReduced({ children }: { children: React.ReactNode }) {
  const reduced = useEffectiveReducedMotion()
  if (reduced) return <>{children}</>
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.7}>
      {children}
    </Float>
  )
}

/** Section 03 backdrop — the "gallery void". */
function GalleryZone() {
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)
  const knot = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    const motion = isReducedMotion() ? 0 : useSettingsStore.getState().motionIntensity
    if (knot.current) {
      knot.current.rotation.x += delta * 0.1 * motion
      knot.current.rotation.y += delta * 0.14 * motion
    }
  })
  return (
    <group>
      <FloatingOrReduced>
        <mesh ref={knot} position={[0, 0.3, -100]}>
          <torusKnotGeometry args={[1.5, 0.42, 160, 24]} />
          <meshPhysicalMaterial color="#151220" metalness={1} roughness={0.18} clearcoat={1} envMapIntensity={1.3} />
        </mesh>
      </FloatingOrReduced>
      <FloatingOrReduced>
        <mesh position={[3.4, 1.3, -104]} rotation={[0.4, 0.2, 0]}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color={colors.accent} metalness={0.6} roughness={0.35} flatShading />
        </mesh>
      </FloatingOrReduced>
      <FloatingOrReduced>
        <mesh position={[-3.2, -0.9, -103]} rotation={[1.1, 0, 0.4]}>
          <torusGeometry args={[1.1, 0.05, 8, 96]} />
          <meshBasicMaterial color={colors.accent2} transparent opacity={0.55} />
        </mesh>
      </FloatingOrReduced>
    </group>
  )
}

/** Section 04 backdrop — sparse primitives drifting in the dark. */
function PlaygroundZone() {
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)
  return (
    <group>
      <FloatingOrReduced>
        <mesh position={[-2.8, 0.9, -140]} rotation={[0.5, 0.7, 0]}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color={colors.surface} metalness={0.85} roughness={0.25} flatShading />
        </mesh>
      </FloatingOrReduced>
      <FloatingOrReduced>
        <mesh position={[2.7, -0.7, -142]}>
          <sphereGeometry args={[0.85, 48, 48]} />
          <meshPhysicalMaterial color="#f0ecff" metalness={0.1} roughness={0.3} clearcoat={1} envMapIntensity={1.1} />
        </mesh>
      </FloatingOrReduced>
      <FloatingOrReduced>
        <mesh position={[0.6, 1.7, -144]} rotation={[0.2, 0, 0.5]}>
          <coneGeometry args={[0.7, 1.6, 4]} />
          <meshStandardMaterial color={colors.accent2} metalness={0.5} roughness={0.4} flatShading />
        </mesh>
      </FloatingOrReduced>
    </group>
  )
}

/** Section 05 backdrop — pearl spheres that visibly take the theme light. */
function CustomizationZone() {
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)
  return (
    <group>
      <FloatingOrReduced>
        <mesh position={[-3, 0.4, -166]}>
          <sphereGeometry args={[1.6, 48, 48]} />
          <meshStandardMaterial color={colors.accent} metalness={0.4} roughness={0.22} />
        </mesh>
      </FloatingOrReduced>
      <FloatingOrReduced>
        <mesh position={[0, 1.2, -170]}>
          <sphereGeometry args={[1.1, 48, 48]} />
          <meshStandardMaterial color={colors.highlight} metalness={0.4} roughness={0.22} />
        </mesh>
      </FloatingOrReduced>
      <FloatingOrReduced>
        <mesh position={[3.1, -0.3, -163]}>
          <sphereGeometry args={[1.3, 48, 48]} />
          <meshStandardMaterial color={colors.accent2} metalness={0.4} roughness={0.22} />
        </mesh>
      </FloatingOrReduced>
    </group>
  )
}

/** Section 06 backdrop — a minimal rotating wireframe form. */
function ManifestoZone() {
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)
  const torus = useRef<THREE.Mesh>(null)
  const ico = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    const motion = isReducedMotion() ? 0 : useSettingsStore.getState().motionIntensity
    if (torus.current) torus.current.rotation.z += delta * 0.05 * motion
    if (ico.current) {
      ico.current.rotation.y += delta * 0.08 * motion
      ico.current.rotation.x += delta * 0.04 * motion
    }
  })
  return (
    <group>
      <mesh ref={torus} position={[0, 0, -198]}>
        <torusGeometry args={[4.2, 0.05, 8, 128]} />
        <meshBasicMaterial color={colors.accent} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={ico} position={[0, 0, -198]}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color={colors.highlight} wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

export function AmbientZones() {
  return (
    <group>
      <GalleryZone />
      <PlaygroundZone />
      <CustomizationZone />
      <ManifestoZone />
    </group>
  )
}
