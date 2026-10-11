import { GravityExperiment } from '../experiments/GravityExperiment'
import { DragExperiment } from '../experiments/DragExperiment'
import { MorphLab } from '../experiments/MorphLab'
import { RotateCcw } from 'lucide-react'

interface GalleryOverlayProps {
  experimentKey: 'orbit' | 'flux' | 'gravity' | 'prism'
  onClose: () => void
}

export function GalleryOverlay({ experimentKey, onClose }: GalleryOverlayProps) {
  const Experiment = {
    gravity: GravityExperiment,
    flux: DragExperiment,
    prism: MorphLab,
    orbit: DragExperiment,
  }[experimentKey]

  return (
    <div className="flex h-[60vh] flex-col md:h-[70vh]">
      <div className="mb-6 flex items-start justify-between border-b border-line pb-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-ink">{experimentKey.toUpperCase()}</h3>
          <p className="text-muted">Interactive 3D experiment</p>
        </div>
        <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center border border-line text-muted hover:border-accent hover:text-accent" aria-label="Close">
          <RotateCcw size={18} aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-line bg-bg">
        <Experiment compact={experimentKey === 'gravity'} />
      </div>
    </div>
  )
}
