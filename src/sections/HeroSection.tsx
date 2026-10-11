import { NexusButton } from '../components/ui/NexusButton'
import { SplitText } from '../components/ui/SplitText'
import { Section } from '../components/layout/Section'
import { scrollToSection } from '../lib/lenis'
import { SITE } from '../config/site'

export function HeroSection() {
  return (
    <Section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 pt-24 md:pt-28"
      ariaLabel="Portal section — the beginning of the experience"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent opacity-10 blur-[90px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[32rem] w-[32rem] rounded-full bg-accent2 opacity-10 blur-[100px]" />
      </div>

      <div className="mb-2 text-center font-display text-[0.64rem] font-bold uppercase tracking-[0.32em] text-muted">
        DIGITAL EXPERIMENTS / {SITE.version}
      </div>

      <h1 className="mt-6 mb-10 text-center">
        <SplitText
          text="ENTER A"
          className="font-display mb-2 block text-[clamp(2.5rem,10.5vw,8rem)] font-bold tracking-tighter text-ink"
          immediate
          delay={0}
          stagger={0.05}
        />
        <SplitText
          text="DIFFERENT"
          className="font-display mb-2 block text-[clamp(2.5rem,10.5vw,8rem)] font-bold tracking-tighter text-ink"
          immediate
          delay={0.35}
          stagger={0.05}
        />
        <SplitText
          text="DIMENSION."
          className="font-display block text-[clamp(2.5rem,10.5vw,8rem)] font-bold tracking-tighter text-ink"
          immediate
          delay={0.65}
          stagger={0.05}
        />
      </h1>

      <p className="mx-auto max-w-lg text-center text-base leading-relaxed text-muted md:text-lg">
        An interactive universe shaped by motion, curiosity, and code.
      </p>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-5">
        <NexusButton onClick={() => scrollToSection('descend')}>
          <span className="uppercase tracking-[0.18em]">Explore the universe</span>
        </NexusButton>
        <NexusButton variant="ghost" onClick={() => scrollToSection('objects')}>
          <span className="uppercase tracking-[0.18em]">Discover the experiments</span>
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
