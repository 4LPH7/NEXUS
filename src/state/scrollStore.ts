import type { SectionId } from '../config/site'

/*
  Mutable scroll state shared between the DOM world and R3F frame loops.
  Written once per frame by <ScrollObserver />, read inside useFrame —
  deliberately NOT React state, so scrolling never re-renders the tree.
*/

interface Measured {
  el: HTMLElement
  top: number
  height: number
}

const measured = new Map<SectionId, Measured>()

export const scrollStore = {
  /** Continuous journey scalar: integer part = section index, fraction = position inside it. */
  journey: 0,
  scrollY: 0,
  viewportH: 800,
  /** Per-section normalized progress (0..1). */
  progress: {
    hero: 0,
    descend: 0,
    objects: 0,
    playground: 0,
    customization: 0,
    manifesto: 0,
    final: 0,
  } as Record<SectionId, number>,
  /** Raw pointer position normalized to -1..1 (screen space, y up). */
  pointer: { x: 0, y: 0 },
}

const STICKY_SECTIONS: SectionId[] = ['hero', 'descend']
const FLOWING_SECTIONS: SectionId[] = [
  'objects',
  'playground',
  'customization',
  'manifesto',
  'final',
]

export function registerSection(id: SectionId, el: HTMLElement): void {
  measured.set(id, { el, top: 0, height: 0 })
  measureSection(id)
}

export function unregisterSection(id: SectionId): void {
  measured.delete(id)
}

function measureSection(id: SectionId): void {
  const m = measured.get(id)
  if (!m) return
  const rect = m.el.getBoundingClientRect()
  m.top = rect.top + window.scrollY
  m.height = rect.height
}

/** Re-measure every registered section (call on resize / layout changes). */
export function measureAllSections(): void {
  for (const id of measured.keys()) measureSection(id)
}

/** Advance scroll-derived state. Called once per animation frame. */
export function updateScrollState(): void {
  const sy = window.scrollY
  const vh = window.innerHeight
  scrollStore.scrollY = sy
  scrollStore.viewportH = vh

  // Journey scalar from the viewport centre sweeping through section bands.
  const center = sy + vh / 2
  let journey = 0
  let inside = false
  const ids = [...measured.keys()]
  for (let i = 0; i < ids.length; i++) {
    const m = measured.get(ids[i]!)
    if (!m || m.height === 0) continue
    if (center >= m.top && center < m.top + m.height) {
      journey = i + (center - m.top) / m.height
      inside = true
      break
    }
  }
  if (!inside) {
    const first = measured.get(ids[0]!)
    journey = first && center < first.top ? 0 : Math.max(ids.length - 1, 0)
  }
  scrollStore.journey = journey

  // Sticky wrappers: progress = distance scrolled while pinned.
  for (const id of STICKY_SECTIONS) {
    const m = measured.get(id)
    if (m) {
      scrollStore.progress[id] = clamp((sy - m.top) / Math.max(m.height - vh, 1), 0, 1)
    }
  }
  // Flowing sections: how far the block has travelled through the viewport.
  for (const id of FLOWING_SECTIONS) {
    const m = measured.get(id)
    if (m) {
      const topInViewport = m.top - sy
      scrollStore.progress[id] = clamp((vh - topInViewport) / Math.max(m.height + vh, 1), 0, 1)
    }
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
