import { useCallback, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

/**
 * Pointer/touch drag rotation with restrained inertia.
 * Returns rotation + velocity refs (mutated in useFrame by the caller),
 * event handlers to spread on the draggable object, and a reset function.
 */
export interface DragRotation {
  rotation: { x: number; y: number }
  velocity: { x: number; y: number }
  dragging: React.RefObject<boolean>
  handlers: {
    onPointerDown: (e: ReactPointerEvent<Element>) => void
    onPointerMove: (e: ReactPointerEvent<Element>) => void
    onPointerUp: (e: ReactPointerEvent<Element>) => void
    onPointerCancel: (e: ReactPointerEvent<Element>) => void
  }
  reset: () => void
}

export function useDragRotation(): DragRotation {
  const rotation = useRef({ x: 0, y: 0 }).current
  const velocity = useRef({ x: 0, y: 0 }).current
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  const onPointerDown = useCallback((e: ReactPointerEvent<Element>) => {
    e.stopPropagation()
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<Element>) => {
      if (!dragging.current) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      const rx = dy * 0.006
      const ry = dx * 0.006
      rotation.x += rx
      rotation.y += ry
      velocity.x = rx
      velocity.y = ry
    },
    [rotation, velocity],
  )

  const endDrag = useCallback((e: ReactPointerEvent<Element>) => {
    if (!dragging.current) return
    dragging.current = false
    ;(e.currentTarget as Element).releasePointerCapture?.(e.pointerId)
  }, [])

  const reset = useCallback(() => {
    rotation.x = 0
    rotation.y = 0
    velocity.x = 0
    velocity.y = 0
  }, [rotation, velocity])

  return {
    rotation,
    velocity,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
    reset,
  }
}
