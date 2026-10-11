import { motion, useTransform } from 'motion/react'
import { Section } from '../components/layout/Section'
import { useSectionProgress } from '../hooks/useSectionProgress'

const BEATS = ['01 / DEPTH', '02 / DRIFT', '03 / SIGNAL']

export function DescendSection() {
  const progress = useSectionProgress('descend')
  const opacities = [
    useTransform(progress, [0, 0.12, 0.34, 0.46], [0, 1, 1, 0]),
    useTransform(progress, [0.28, 0.42, 0.64, 0.76], [0, 1, 1, 0]),
    useTransform(progress, [0.58, 0.72, 0.94, 1], [0, 1, 1, 0]),
  ]

  return (
    <Section id="descend" className="relative flex min-h-[170vh] items-center justify-center px-5 md:min-h-[250vh] md:px-10" ariaLabel="Descend into the unknown">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center md:sticky md:top-24">
        <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.28em] text-accent">01 / The passage</span>
        <h2 className="font-display text-[clamp(2.4rem,8vw,5.5rem)] font-bold leading-[1.02] tracking-tight text-ink">
          DESCEND INTO<br /><span className="text-accent">THE UNKNOWN.</span>
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Rings of light recede into the dark. Keep scrolling to travel deeper.
        </p>
        <div className="relative grid min-h-14 place-items-center" aria-live="polite" aria-atomic="true">
          {BEATS.map((beat, index) => <motion.p key={beat} className="col-start-1 row-start-1 font-display text-sm font-semibold uppercase tracking-[0.3em] text-ink" style={{ opacity: opacities[index] }}>{beat}</motion.p>)}
        </div>
      </div>
    </Section>
  )
}
