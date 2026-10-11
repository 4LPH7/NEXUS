import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { useNearViewport } from '../../hooks/useNearViewport'
import { useEffectiveReducedMotion } from '../../hooks/useReducedMotion'
import { dprCap } from '../../utils/performance'

interface ExperimentCanvasProps {
  children: ReactNode
  className?: string
  cameraZ?: number
  fov?: number
  label?: string
}

/**
 * Lazily-mounted, visibility-gated canvas for interactive experiments.
 * Mounts only when scrolled near; the frame loop pauses when offscreen.
 */
export function ExperimentCanvas({ children, className = '', cameraZ = 8, fov = 50, label }: ExperimentCanvasProps) {
  const [ref, inView] = useNearViewport<HTMLDivElement>('250px')
  const reduced = useEffectiveReducedMotion()

  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      {inView && (
        <Canvas
          dpr={dprCap()}
          camera={{ position: [0, 0, cameraZ], fov }}
          gl={{ antialias: true, alpha: true }}
          frameloop={reduced ? 'demand' : inView ? 'always' : 'never'}
        >
          {children}
        </Canvas>
      )}
    </div>
  )
}
