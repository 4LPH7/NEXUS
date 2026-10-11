import { useEffect } from 'react'
import {
  measureAllSections,
  scrollStore,
  updateScrollState,
} from '../state/scrollStore'

/**
 * Single per-frame writer for scroll-derived state (journey scalar, per-section
 * progress, pointer position). Everything in the 3D layer reads this store —
 * scrolling never triggers React re-renders.
 */
export function ScrollObserver() {
  useEffect(() => {
    measureAllSections()

    const onResize = () => measureAllSections()
    window.addEventListener('resize', onResize)

    // Re-measure when document height changes (fonts loading, lazy canvases mounting).
    const observer = new ResizeObserver(() => measureAllSections())
    observer.observe(document.body)

    const onPointer = (e: PointerEvent) => {
      scrollStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      scrollStore.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    let raf = 0
    const loop = () => {
      updateScrollState()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      observer.disconnect()
    }
  }, [])

  return null
}
