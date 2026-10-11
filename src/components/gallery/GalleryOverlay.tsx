import { useRef, useState } from 'react'
import { RotateCcw, X } from 'lucide-react'
import { GalleryScene } from './GalleryScene'
import { GravityExperiment } from '../experiments/GravityExperiment'

interface GalleryOverlayProps {
  experimentKey: 'orbit' | 'flux' | 'gravity' | 'prism'
  onClose: () => void
}

export function GalleryOverlay({ experimentKey, onClose }: GalleryOverlayProps) {
  const [resetKey, setResetKey] = useState(0)
  const [interacted, setInteracted] = useState(false)
  const interactionReported = useRef(false)
  const reportInteraction = () => {
    if (interactionReported.current) return
    interactionReported.current = true
    setInteracted(true)
  }
  const reset = () => {
    interactionReported.current = false
    setInteracted(false)
    setResetKey((n) => n + 1)
  }
  const descriptions = {
    orbit: 'Drag across the orbits to change their speed and direction.',
    flux: 'Move or click to reshape the pulsing sculpture.',
    gravity: 'Move to influence the particles, or switch between attract and repel.',
    prism: 'Move and click to turn the refracting prism through the light.',
  }

  return (
    <div className="flex h-[60vh] flex-col md:h-[70vh]">
      <div className="mb-6 flex items-start justify-between border-b border-line pb-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-ink">{experimentKey.toUpperCase()}</h3>
          <p className="text-muted">{descriptions[experimentKey]}</p>
        </div>
        <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center border border-line text-muted hover:border-accent hover:text-accent" aria-label="Close">
          <X size={18} aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-line bg-bg" onPointerMoveCapture={reportInteraction} onClickCapture={reportInteraction}>
          {experimentKey === 'gravity'
            ? <GravityExperiment key={resetKey} compact />
            : <GalleryScene key={resetKey} specimen={experimentKey} resetKey={resetKey} onInteract={reportInteraction} />}
      </div>
        <p className="sr-only" aria-live="polite">{interacted ? 'The specimen responded to your input.' : ''}</p>
        <button type="button" onClick={reset} className="mt-4 inline-flex min-h-11 items-center gap-2 border border-line px-4 font-display text-xs uppercase tracking-widest text-muted hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
    </div>
  )
}
