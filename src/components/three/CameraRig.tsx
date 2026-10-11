import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { scrollStore } from '../../state/scrollStore'
import { useSettingsStore } from '../../state/settingsStore'
import { isReducedMotion } from '../../hooks/useReducedMotion'

interface Keyframe {
  pos: [number, number, number]
  look: [number, number, number]
}

/*
  One keyframe per section (journey 0..6). The camera travels along -z as the
  visitor scrolls: hero object → tunnel → gallery void → playground void →
  customization void → manifesto void → final portal.
  Positions are damped every frame, so scrolling backwards is smooth and
  section boundaries never produce jumps.
*/
const KEYFRAMES: Keyframe[] = [
  { pos: [0, 0.1, 7.2], look: [0.4, 0.1, 0] },
  { pos: [0, 0.2, -14], look: [0, 0, -36] },
  { pos: [0.6, 0.3, -86], look: [-0.4, 0, -102] },
  { pos: [-1.2, 0, -120], look: [0.3, 0, -140] },
  { pos: [1.2, 0.2, -152], look: [-0.3, 0, -168] },
  { pos: [0, 0.5, -180], look: [0, 0, -198] },
  { pos: [0, 0, -212], look: [0, 0, -228] },
]

const POSITION_PATH = new THREE.CatmullRomCurve3(KEYFRAMES.map(({ pos }) => new THREE.Vector3(...pos)))
const LOOK_PATH = new THREE.CatmullRomCurve3(KEYFRAMES.map(({ look }) => new THREE.Vector3(...look)))

export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const targetPos = useRef(new THREE.Vector3(...KEYFRAMES[0].pos))
  const targetLook = useRef(new THREE.Vector3(...KEYFRAMES[0].look))
  const lookCur = useRef(new THREE.Vector3(...KEYFRAMES[0].look))

  useEffect(() => {
    camera.position.set(...KEYFRAMES[0].pos)
    camera.lookAt(...KEYFRAMES[0].look)
  }, [camera])

  useFrame((state, delta) => {
    const reduced = isReducedMotion()
    const progress = reduced ? 0 : THREE.MathUtils.clamp(scrollStore.journey / (KEYFRAMES.length - 1), 0, 1)
    targetPos.current.copy(POSITION_PATH.getPoint(progress))
    targetLook.current.copy(LOOK_PATH.getPoint(progress))

    const motion = useSettingsStore.getState().motionIntensity

    // Pointer parallax plus a slow idle drift, both disabled under reduced motion.
    if (!reduced) {
      const time = state.clock.elapsedTime
      const p = scrollStore.pointer
      targetPos.current.x += p.x * 0.35 * motion + Math.sin(time * 0.23) * 0.12 * motion
      targetPos.current.y += p.y * 0.22 * motion + Math.cos(time * 0.19) * 0.08 * motion
      targetLook.current.x += p.x * 0.5 * motion
      targetLook.current.y += p.y * 0.35 * motion
    }

    const lambda = reduced ? 60 : 5
    const pos = camera.position
    pos.x = THREE.MathUtils.damp(pos.x, targetPos.current.x, lambda, delta)
    pos.y = THREE.MathUtils.damp(pos.y, targetPos.current.y, lambda, delta)
    pos.z = THREE.MathUtils.damp(pos.z, targetPos.current.z, lambda, delta)

    const look = lookCur.current
    look.x = THREE.MathUtils.damp(look.x, targetLook.current.x, lambda, delta)
    look.y = THREE.MathUtils.damp(look.y, targetLook.current.y, lambda, delta)
    look.z = THREE.MathUtils.damp(look.z, targetLook.current.z, lambda, delta)
    camera.lookAt(look)
  })

  return null
}
