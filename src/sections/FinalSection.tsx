import { NexusButton } from '../components/ui/NexusButton'
import { Section } from '../components/layout/Section'
import { Reveal } from '../components/ui/Reveal'
import { scrollToSection, scrollToTop } from '../lib/lenis'

export function FinalSection() {
  return (
    <Section
      id="final"
      className="relative flex min-h-screen items-center justify-center px-5 md:px-10"
      ariaLabel="Final portal — the edge of the experience"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-10 blur-[100px]" />
      </div>

      <div className="text-center">
        <Reveal>
          <div className="mb-6">
            <h2 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-ink md:text-7xl lg:text-8xl">
              YOU'VE REACHED
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent2">THE EDGE.</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">
            What will you create next? The tools are in your hands. The dimension is waiting.
          </p>
        </Reveal>

        <Reveal delay={0.35} className="mt-16 flex flex-wrap items-center justify-center gap-6">
          <NexusButton onClick={() => scrollToTop()}>
            Replay
          </NexusButton>
          <NexusButton variant="ghost" onClick={() => scrollToSection('objects')}>
            Explore
          </NexusButton>
        </Reveal>

        <Reveal delay={0.5} className="mt-24 opacity-50">
          <p className="font-display text-[0.7rem] uppercase tracking-[0.24em] text-muted">End of journey</p>
        </Reveal>
      </div>
    </Section>
  )
}
