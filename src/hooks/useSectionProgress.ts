import { useEffect } from 'react'
import { useMotionValue, type MotionValue } from 'motion/react'
import { scrollStore } from '../state/scrollStore'
import type { SectionId } from '../config/site'

/**
 * Live section progress as a MotionValue (updated per frame, never re-renders).
 * Drives DOM effects tied to scroll progress, e.g. copy fading inside the
 * pinned Descend viewport.
 */
export function useSectionProgress(id: SectionId): MotionValue<number> {
  const progress = useMotionValue(0)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      progress.set(scrollStore.progress[id])
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [id, progress])

  return progress
}
