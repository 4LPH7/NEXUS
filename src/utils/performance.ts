/** Coarse pointer or narrow viewport — used for 3D quality scaling only. */
export function isCompactDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
}

export function dprCap(): [number, number] {
  return isCompactDevice() ? [1, 1.5] : [1, 2]
}

export function particleBudget(base: number): number {
  return isCompactDevice() ? Math.round(base * 0.5) : base
}
