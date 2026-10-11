/** Coarse pointer or narrow viewport — used for 3D quality scaling only. */
export function isCompactDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
}

export function qualityTier(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'medium'
  const nav = navigator as Navigator & { deviceMemory?: number }
  if (window.innerWidth < 600 || window.devicePixelRatio > 2.5 || (nav.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4) return 'low'
  if (isCompactDevice() || window.devicePixelRatio > 1.75 || (nav.deviceMemory ?? 8) <= 8 || navigator.hardwareConcurrency <= 8) return 'medium'
  return 'high'
}

export function dprCap(): [number, number] {
  const tier = qualityTier()
  return tier === 'low' ? [1, 1.25] : tier === 'medium' ? [1, 1.5] : [1, 2]
}

export function particleBudget(base: number): number {
  const tier = qualityTier()
  return tier === 'low' ? Math.min(base, 400) : tier === 'medium' ? Math.min(base, 1500) : base
}
