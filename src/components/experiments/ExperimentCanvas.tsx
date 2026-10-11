import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useState, type ReactNode } from 'react'
import { useNearViewport } from '../../hooks/useNearViewport'
import { useEffectiveReducedMotion } from '../../hooks/useReducedMotion'
import { dprCap } from '../../utils/performance'
import { detectWebGL } from '../../hooks/useWebGL'
import { ErrorBoundary } from '../three/ErrorBoundary'

function ContextEvents({ onLost, onRestored }: { onLost: () => void; onRestored: () => void }) {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const canvas = gl.domElement
    const lost = (event: Event) => { event.preventDefault(); onLost() }
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', lost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }, [gl, onLost, onRestored])
  return null
}

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
  const [failed, setFailed] = useState(!detectWebGL())
  const [contextLost, setContextLost] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const showFailure = () => <div role="status" className="absolute inset-0 grid place-content-center gap-3 bg-bg p-6 text-center text-muted">
    <p>3D preview is unavailable.</p>
    <button type="button" className="mx-auto min-h-11 border border-line px-4 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" onClick={() => { setFailed(false); setContextLost(false); setAttempt((n) => n + 1) }}>Retry</button>
  </div>

  return (
    <div ref={ref} className={`relative ${className}`} role="img" aria-label={label}>
      {inView && !failed && <ErrorBoundary key={attempt} fallback={showFailure()}>
        <Canvas dpr={dprCap()} camera={{ position: [0, 0, cameraZ], fov }} gl={{ antialias: true, alpha: true }} frameloop={reduced ? 'demand' : 'always'}>
          <ContextEvents onLost={() => setContextLost(true)} onRestored={() => setContextLost(false)} />
          {children}
        </Canvas>
      </ErrorBoundary>}
      {contextLost && showFailure()}
      {failed && showFailure()}
    </div>
  )
}
