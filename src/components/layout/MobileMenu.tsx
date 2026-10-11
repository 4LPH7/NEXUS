import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { scrollToSection, scrollToTop, stopPageScroll, resumePageScroll } from '../../lib/lenis'
import { SITE } from '../../config/site'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled])'

/** Full-screen mobile navigation. Focus-trapped, Escape-closable, scroll-locked. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    stopPageScroll()
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      resumePageScroll()
      opener?.focus()
    }
  }, [open, onClose])

  const go = (id: string) => {
    onClose()
    // Defer until the menu has closed and scroll resumed.
    window.setTimeout(() => scrollToSection(id), 60)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="presentation">
          <motion.div
            className="absolute inset-0 bg-bg/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu" className="relative flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold tracking-[0.28em]">{SITE.name}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center border border-line text-ink"
              >
                <X size={20} aria-hidden />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2">
              <motion.button
                type="button"
                onClick={() => {
                  onClose()
                  window.setTimeout(() => scrollToTop(), 60)
                }}
                className="border-b border-line py-5 text-left font-display text-3xl font-semibold uppercase tracking-wide text-ink"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                Portal
              </motion.button>
              {SITE.nav.map((item, i) => (
                <motion.button
                  key={item.sectionId}
                  type="button"
                  onClick={() => go(item.sectionId)}
                  className="border-b border-line py-5 text-left font-display text-3xl font-semibold uppercase tracking-wide text-ink"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 + i * 0.06 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-muted">{SITE.tagline}</p>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
