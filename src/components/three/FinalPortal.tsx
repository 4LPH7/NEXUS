import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { scrollStore } from '../../state/scrollStore'
import { PRESETS, useSettingsStore } from '../../state/settingsStore'
import { isReducedMotion } from '../../hooks/useReducedMotion'

const damp = THREE.MathUtils.damp
const ORBITERS = 6

/**
 * Section 07 centrepiece: a luminous ring portal with an inner glow disc and
 * small orbiting bodies. Tilts gently toward the pointer.
 */
export function FinalPortal() {
  const group = useRef<THREE.Group>(null)
  const orbiters = useRef<(THREE.Mesh | null)[]>([])
  const disc = useRef<THREE.Mesh>(null)
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)

  const orbiterSpecs = useMemo(
    () =>
      Array.from({ length: ORBITERS }, (_, i) => ({
        angle: (i / ORBITERS) * Math.PI * 2,
        radius: 4.7,
        speed: 0.25 + (i % 3) * 0.08,
        scale: 0.1 + (i % 2) * 0.05,
      })),
    [],
  )

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const reduced = isReducedMotion()
    const motion = reduced ? 0 : useSettingsStore.getState().motionIntensity
    const time = state.clock.elapsedTime

    g.rotation.z += delta * 0.04 * motion
    g.rotation.x = damp(g.rotation.x, scrollStore.pointer.y * 0.08 * motion, 2, delta)
    g.rotation.y = damp(g.rotation.y, scrollStore.pointer.x * 0.12 * motion, 2, delta)

    orbiters.current.forEach((mesh, i) => {
      if (!mesh) return
      const spec = orbiterSpecs[i]
      const a = spec.angle + time * spec.speed * motion
      mesh.position.set(Math.cos(a) * spec.radius, Math.sin(a) * spec.radius, 0)
    })

    if (disc.current) {
      const material = disc.current.material as THREE.MeshBasicMaterial
      material.opacity = (0.1 + Math.sin(time * 0.8) * 0.04) * (0.5 + 0.5 * motion) + 0.05
    }
  })

  return (
    <group ref={group} position={[0, 0, -228]}>
      <mesh>
        <torusGeometry args={[4, 0.1, 16, 128]} />
        <meshBasicMaterial color={colors.accent} />
      </mesh>
      <mesh rotation={[0.12, 0, 0]}>
        <torusGeometry args={[3.1, 0.035, 8, 96]} />
        <meshBasicMaterial color={colors.highlight} transparent opacity={0.6} />
      </mesh>
      <mesh ref={disc}>
        <circleGeometry args={[2.6, 64]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.12} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {orbiterSpecs.map((spec, i) => (
        <mesh
          key={i}
          ref={(el) => {
            orbiters.current[i] = el
          }}
          scale={spec.scale}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color={i % 2 === 0 ? colors.highlight : colors.accent2} />
        </mesh>
      ))}
    </group>
  )
}
