import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { scrollStore } from '../../state/scrollStore'
import { PRESETS, useSettingsStore } from '../../state/settingsStore'
import { isReducedMotion } from '../../hooks/useReducedMotion'

const damp = THREE.MathUtils.damp

/**
 * The hero sculpture: a faceted iridescent core, a wireframe shell, and a thin
 * orbital ring. Floats, tilts toward the pointer, and recedes as the visitor
 * scrolls out of the hero.
 */
export function HeroObject() {
  const group = useRef<THREE.Group>(null)
  const wire = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Mesh>(null)

  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)

  const geometries = useMemo(
    () => ({
      core: new THREE.IcosahedronGeometry(1.35, 1),
      shell: new THREE.IcosahedronGeometry(1.9, 1),
      orbit: new THREE.TorusGeometry(2.6, 0.015, 8, 128),
    }),
    [],
  )
  useEffect(
    () => () => {
      geometries.core.dispose()
      geometries.shell.dispose()
      geometries.orbit.dispose()
    },
    [geometries],
  )

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const { progress, pointer } = scrollStore
    const reduced = isReducedMotion()
    const h = reduced ? 0 : progress.hero
    const motion = reduced ? 0 : useSettingsStore.getState().motionIntensity
    const time = state.clock.elapsedTime
    const mobile = state.size.width < 768
    const baseX = mobile ? 0 : 1.55
    const baseY = mobile ? 0.55 : 0.1

    const targetX = baseX + (reduced ? 0 : Math.cos(time * 0.4) * 0.08 * motion) + pointer.x * 0.25 * motion
    const targetY = baseY + (reduced ? 0 : Math.sin(time * 0.5) * 0.16 * motion) + h * 2.6 + pointer.y * 0.18 * motion
    g.position.x = damp(g.position.x, targetX, 3, delta)
    g.position.y = damp(g.position.y, targetY, 3, delta)
    g.position.z = damp(g.position.z, -h * 2.5, 3, delta)

    g.rotation.y += delta * 0.16 * motion
    g.rotation.x = damp(g.rotation.x, pointer.y * 0.22 * motion + h * 0.5, 2.5, delta)
    g.rotation.z = damp(g.rotation.z, pointer.x * -0.12 * motion, 2.5, delta)
    g.scale.setScalar(damp(g.scale.x, 1 - h * 0.3, 3, delta))

    if (wire.current) {
      wire.current.rotation.y -= delta * 0.1 * motion
      wire.current.rotation.x += delta * 0.06 * motion
    }
    if (ring.current) {
      ring.current.rotation.z += delta * 0.12 * motion
    }
  })

  return (
    <group ref={group}>
      <mesh geometry={geometries.core}>
        <meshPhysicalMaterial
          color={colors.surface}
          metalness={0.85}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.25}
          iridescence={1}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[120, 480]}
          envMapIntensity={1.2}
          flatShading
        />
      </mesh>
      <mesh ref={wire} geometry={geometries.shell}>
        <meshBasicMaterial color={colors.accent} wireframe transparent opacity={0.22} />
      </mesh>
      <mesh ref={ring} geometry={geometries.orbit} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <meshBasicMaterial color={colors.accent2} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}
