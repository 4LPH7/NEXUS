import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffectiveReducedMotion } from '../../hooks/useReducedMotion'
import type { PointerEvent, ReactNode } from 'react'

interface NexusButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  className?: string
  ariaLabel?: string
  type?: 'button' | 'submit'
}

/**
 * Tactile button with a gentle magnetic pull toward the cursor.
 * The magnetic effect is skipped entirely under reduced motion.
 */
export function NexusButton({ children, onClick, variant = 'primary', className = '', ariaLabel, type = 'button' }: NexusButtonProps) {
  const reduced = useEffectiveReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 22 })
  const sy = useSpring(y, { stiffness: 260, damping: 22 })

  const handleMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.18)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.28)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const base =
    'group relative inline-flex items-center gap-3 px-7 py-4 font-display text-[0.8rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 active:scale-[0.97] select-none'
  const styles =
    variant === 'primary'
      ? 'bg-accent text-[#0a0a10] hover:bg-highlight hover:text-[#0a0a10]'
      : 'border border-line text-ink hover:border-accent hover:text-accent'

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={reduced ? undefined : { x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${styles} ${className}`}
    >
      <span className="pointer-events-none inline-flex items-center gap-3">{children}</span>
    </motion.button>
  )
}
