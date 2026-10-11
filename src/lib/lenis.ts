import Lenis from 'lenis'

/*
  Single Lenis instance owns smooth scrolling for the whole page.
  Destroyed entirely when reduced motion is requested — native scroll takes over.
*/

let lenis: Lenis | null = null
let rafId = 0

export function getLenis(): Lenis | null {
  return lenis
}

export function initLenis(): void {
  if (lenis) return
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    syncTouch: false, // keep native momentum on touch devices
  })
  const raf = (time: number) => {
    lenis?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
}

export function destroyLenis(): void {
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  lenis = null
}

export function stopPageScroll(): void {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function resumePageScroll(): void {
  document.documentElement.style.overflow = ''
  lenis?.start()
}

/** Smoothly scroll to a section id, falling back to native behaviour. */
export function scrollToSection(id: string, immediate = false): void {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = immediate
  if (lenis && !reduced) {
    lenis.scrollTo(el, { duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }
}

export function scrollToTop(immediate = false): void {
  if (lenis && !immediate) {
    lenis.scrollTo(0, { duration: 1.6 })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}
