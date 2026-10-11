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
    const loop = () => {
      progress.set(scrollStore.progress[id])
    }
    window.addEventListener('scroll', loop, { passive: true })
    window.addEventListener('nexus:lenis-scroll', loop)
    loop()
    return () => {
      window.removeEventListener('scroll', loop)
      window.removeEventListener('nexus:lenis-scroll', loop)
    }
  }, [id, progress])

  return progress
}
