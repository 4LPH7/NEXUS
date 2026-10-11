import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PRESETS, useSettingsStore } from '../../state/settingsStore'
import { isReducedMotion } from '../../hooks/useReducedMotion'

const RING_COUNT = 42
const SHARD_COUNT = 18

/**
 * The Section 02 corridor: a sequence of slowly rotating luminous rings the
 * camera flies through, with floating shards drifting past the walls.
 */
export function TunnelScene() {
  const rings = useRef<(THREE.Mesh | null)[]>([])
  const shards = useRef<(THREE.Mesh | null)[]>([])
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)

  const ringSpecs = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, (_, i) => ({
        z: -6 - i * 1.8,
        radius: 3.2 + Math.sin(i * 0.35) * 0.8,
        colorIndex: i % 5,
      })),
    [],
  )

  const shardSpecs = useMemo(
    () =>
      Array.from({ length: SHARD_COUNT }, (_, i) => {
        const angle = (i / SHARD_COUNT) * Math.PI * 2
        const radius = 4.5 + (i % 3) * 1.4
        return {
          position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.7, -8 - i * 3.9] as [number, number, number],
          scale: 0.18 + (i % 4) * 0.08,
        }
      }),
    [],
  )

  useFrame((state, delta) => {
    const reduced = isReducedMotion()
    const motion = reduced ? 0 : useSettingsStore.getState().motionIntensity
    const time = state.clock.elapsedTime

    rings.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.rotation.z += delta * (0.06 + (i % 4) * 0.02) * motion
      const material = mesh.material as THREE.MeshBasicMaterial
      material.opacity = (0.28 + Math.sin(time * 1.1 + i * 0.6) * 0.14) * (0.4 + 0.6 * motion)
    })

    shards.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.rotation.x += delta * 0.3 * motion
      mesh.rotation.y += delta * 0.2 * motion
      mesh.position.y += Math.sin(time * 0.5 + i) * 0.002 * motion
    })
  })

  const ringColor = (index: number) =>
    index === 4 ? colors.highlight : index % 2 === 0 ? colors.accent : colors.accent2

  return (
    <group>
      {ringSpecs.map((spec, i) => (
        <mesh
          key={i}
          ref={(el) => {
            rings.current[i] = el
          }}
          position={[0, 0, spec.z]}
          rotation={[Math.PI * 0.03 * (i % 3 - 1), Math.PI * 0.02 * (i % 5 - 2), 0]}
        >
          <torusGeometry args={[spec.radius, 0.022, 8, 96]} />
          <meshBasicMaterial color={ringColor(spec.colorIndex)} transparent opacity={0.3} />
        </mesh>
      ))}
      {shardSpecs.map((spec, i) => (
        <mesh
          key={`shard-${i}`}
          ref={(el) => {
            shards.current[i] = el
          }}
          position={spec.position}
          scale={spec.scale}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={colors.surface} metalness={0.7} roughness={0.3} emissive={colors.accent} emissiveIntensity={0.25} flatShading />
        </mesh>
      ))}
    </group>
  )
}
