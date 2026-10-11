import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Returns a ref callback and whether the element is near/at the viewport.
 * Used to lazily mount 3D canvases only when they matter.
 */
export function useNearViewport<T extends HTMLElement>(rootMargin = '300px'): [(node: T | null) => void, boolean] {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [inView, setInView] = useState(false)

  const ref = useCallback(
    (node: T | null) => {
      observerRef.current?.disconnect()
      if (!node) return
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) setInView(entry.isIntersecting)
        },
        { rootMargin },
      )
      observerRef.current.observe(node)
    },
    [rootMargin],
  )

  useEffect(() => () => observerRef.current?.disconnect(), [])

  return [ref, inView]
}
