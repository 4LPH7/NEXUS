import { useEffect, useState } from 'react'
import { useSettingsStore } from '../state/settingsStore'

/**
 * Module-level mirror of the OS-level `prefers-reduced-motion` media query.
 * Frame loops (useFrame) read this directly to avoid subscribing to React state.
 */
export const reducedMotionEnvironment = { reduced: false }

/** Start listening to the media query. Returns a cleanup function. */
export function initReducedMotionWatcher(): () => void {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  const update = () => {
    reducedMotionEnvironment.reduced = mq.matches
  }
  update()
  mq.addEventListener('change', update)
  return () => mq.removeEventListener('change', update)
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/** True when either the user toggle or the OS setting asks for reduced motion. */
export function useEffectiveReducedMotion(): boolean {
  const userPref = useSettingsStore((s) => s.reducedMotion)
  const osPref = usePrefersReducedMotion()
  return userPref || osPref
}

/** Frame-loop friendly check combining store + media query without re-rendering. */
export function isReducedMotion(): boolean {
  return useSettingsStore.getState().reducedMotion || reducedMotionEnvironment.reduced
}
