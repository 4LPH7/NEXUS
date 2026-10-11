import { NexusButton } from '../components/ui/NexusButton'
import { SplitText } from '../components/ui/SplitText'
import { Section } from '../components/layout/Section'
import { scrollToSection } from '../lib/lenis'
import { SITE } from '../config/site'

export function HeroSection() {
  return (
    <Section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-5 pt-24 md:pt-28"
      ariaLabel="Portal section — the beginning of the experience"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent opacity-10 blur-[90px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[32rem] w-[32rem] rounded-full bg-accent2 opacity-10 blur-[100px]" />
      </div>

      <div className="mb-2 text-center font-display text-[0.64rem] font-bold uppercase tracking-[0.32em] text-muted">
        {SITE.version}
      </div>

      <div className="mt-6 mb-10 text-center">
        <SplitText
          text="ENTER A"
          className="font-display mb-2 text-6xl font-bold tracking-tighter text-ink md:text-8xl lg:text-9xl"
          immediate
          delay={0}
          stagger={0.05}
        />
        <SplitText
          text="DIFFERENT"
          className="font-display mb-2 text-6xl font-bold tracking-tighter text-ink md:text-8xl lg:text-9xl"
          immediate
          delay={0.35}
          stagger={0.05}
        />
        <SplitText
          text="DIMENSION"
          className="font-display text-6xl font-bold tracking-tighter text-ink md:text-8xl lg:text-9xl"
          immediate
          delay={0.65}
          stagger={0.05}
        />
      </div>

      <p className="mx-auto max-w-lg text-center text-base leading-relaxed text-muted md:text-lg">
        An interactive universe shaped by motion, curiosity, and code.
      </p>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-5">
        <NexusButton onClick={() => scrollToSection('descend')}>
          <span className="uppercase tracking-[0.18em]">Explore</span>
        </NexusButton>
        <NexusButton variant="ghost" onClick={() => scrollToSection('objects')}>
          <span className="uppercase tracking-[0.18em]">Experiments</span>
        </NexusButton>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60 transition-opacity hover:opacity-100">
        <span className="font-display text-[0.64rem] uppercase tracking-[0.24em] text-muted">Scroll</span>
        <span aria-hidden className="h-6 w-px bg-ink" />
        <span aria-hidden className="h-6 w-px bg-ink" />
      </div>
    </Section>
  )
}
