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
    const refresh = () => {
      measureAllSections()
      updateScrollState()
      scrollStore.invalidate()
    }
    refresh()
    const onResize = () => refresh()
    window.addEventListener('resize', onResize)

    // Re-measure when document height changes (fonts loading, lazy canvases mounting).
    const observer = new ResizeObserver(refresh)
    observer.observe(document.body)

    const onPointer = (e: PointerEvent) => {
      scrollStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      scrollStore.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      scrollStore.invalidate()
    }
    const onScroll = () => {
      updateScrollState()
      scrollStore.invalidate()
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.fonts?.ready.then(refresh)
    const onLenisScroll = onScroll
    window.addEventListener('nexus:lenis-scroll', onLenisScroll)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('nexus:lenis-scroll', onLenisScroll)
      observer.disconnect()
    }
  }, [])

  return null
}
