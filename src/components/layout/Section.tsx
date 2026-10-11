import { useEffect, useRef, type ReactNode } from 'react'
import { registerSection, unregisterSection } from '../../state/scrollStore'
import type { SectionId } from '../../config/site'

interface SectionProps {
  id: SectionId
  children: ReactNode
  className?: string
  /** Label shown to assistive tech (visually hidden) if the section has no heading text. */
  ariaLabel?: string
}

/**
 * Page section that registers itself with the scroll store so the 3D camera
 * rig and progress hooks can map scroll position to scene state.
 */
export function Section({ id, children, className = '', ariaLabel }: SectionProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    registerSection(id, el)
    return () => unregisterSection(id)
  }, [id])

  return (
    <section ref={ref} id={id} aria-label={ariaLabel} className={`relative ${className}`}>
      {children}
    </section>
  )
}
