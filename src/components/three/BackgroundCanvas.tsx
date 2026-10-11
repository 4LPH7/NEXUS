import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useEffect } from 'react'
import { useSettingsStore, PRESETS } from '../../state/settingsStore'
import { useWebGL } from '../../hooks/useWebGL'
import { useEffectiveReducedMotion } from '../../hooks/useReducedMotion'
import { dprCap } from '../../utils/performance'
import { ErrorBoundary } from './ErrorBoundary'
import { SceneFallback } from './SceneFallback'
import { CameraRig } from './CameraRig'
import { SceneLights } from './SceneLights'
import { HeroObject } from './HeroObject'
import { ParticleField } from './ParticleField'
import { TunnelScene } from './TunnelScene'
import { AmbientZones } from './AmbientZones'
import { FinalPortal } from './FinalPortal'

/** In reduced-motion (demand) mode, keep the frame in sync with settings changes. */
function InvalidateOnChange() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    invalidate()
    return useSettingsStore.subscribe(() => invalidate())
  }, [invalidate])
  return null
}

/**
 * The persistent fixed background canvas: one continuous 3D world the camera
 * travels through as the visitor scrolls. It sits behind all DOM content and
 * never captures pointer events — hero parallax reads a window-level listener.
 */
export function BackgroundCanvas() {
  const webgl = useWebGL()
  const reduced = useEffectiveReducedMotion()
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)

  if (!webgl) return <SceneFallback />

  return (
    <ErrorBoundary fallback={<SceneFallback />}>
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0.1, 7.2], fov: 55, near: 0.1, far: 320 }}
          dpr={dprCap()}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          frameloop={reduced ? 'demand' : 'always'}
        >
          <fogExp2 attach="fog" args={[colors.bg, 0.014]} />
          <SceneLights />
          <CameraRig />
          <HeroObject />
          <ParticleField />
          <TunnelScene />
          <AmbientZones />
          <FinalPortal />
          <Environment resolution={256} frames={1}>
            <color attach="background" args={['#050507']} />
            <Lightformer form="rect" intensity={4} position={[0, 5, -9]} scale={[10, 4, 1]} color={colors.accent} />
            <Lightformer form="rect" intensity={3} position={[-8, -2, 4]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color={colors.accent2} />
            <Lightformer form="circle" intensity={2.5} position={[8, 3, 2]} scale={5} color={colors.highlight} />
          </Environment>
          <InvalidateOnChange />
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
