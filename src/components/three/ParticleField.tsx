import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PRESETS, useSettingsStore } from '../../state/settingsStore'
import { isReducedMotion } from '../../hooks/useReducedMotion'
import { particleBudget } from '../../utils/performance'

/**
 * Sparse additive-blended particle dust spanning the whole camera path.
 * Draw range and opacity follow the particle-intensity setting; the whole
 * field drifts with the motion-intensity setting.
 */
export function ParticleField() {
  const count = particleBudget(4000)
  const intensity = useSettingsStore((s) => s.particleIntensity)
  const highlight = useSettingsStore((s) => PRESETS[s.preset].colors.highlight)
  const group = useRef<THREE.Group>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 56
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = 14 - Math.random() * 252
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [count])

  useEffect(() => () => geometry.dispose(), [geometry])

  useEffect(() => {
    geometry.setDrawRange(0, Math.floor(count * (0.25 + 0.75 * intensity)))
  }, [geometry, count, intensity])

  useFrame((state) => {
    const reduced = isReducedMotion()
    const motion = reduced ? 0 : useSettingsStore.getState().motionIntensity
    const g = group.current
    if (!g) return
    const time = state.clock.elapsedTime
    g.rotation.z = time * 0.006 * motion
    g.position.y = Math.sin(time * 0.1) * 0.4 * motion
  })

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <pointsMaterial
          color={highlight}
          size={0.075}
          sizeAttenuation
          transparent
          opacity={0.2 + 0.5 * intensity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
