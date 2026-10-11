import { useMemo } from 'react'

let cached: boolean | null = null

export function detectWebGL(): boolean {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    cached = !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    cached = false
  }
  return cached
}

export function useWebGL(): boolean {
  return useMemo(detectWebGL, [])
}
