import { motion } from 'motion/react'

interface SplitTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
  stagger?: number
  /** Animate immediately on mount (hero) instead of on scroll into view. */
  immediate?: boolean
}

/**
 * Word-by-word reveal. A visually-hidden copy of the full text is provided for
 * screen readers while the animated word spans are aria-hidden, so assistive
 * technology always gets the whole sentence exactly once.
 */
export function SplitText({ text, as = 'span', className, delay = 0, stagger = 0.055, immediate = false }: SplitTextProps) {
  const words = text.split(' ')
  const Tag = as
  const animationProps = immediate
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' } }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: '0.6em' }}
          {...animationProps}
          transition={{ duration: 0.8, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}
