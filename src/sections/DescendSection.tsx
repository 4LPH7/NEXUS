import { Section } from '../components/layout/Section'
import { Reveal } from '../components/ui/Reveal'
import { NexusButton } from '../components/ui/NexusButton'
import { scrollToSection } from '../lib/lenis'

export function DescendSection() {
  return (
    <Section
      id="descend"
      className="relative flex min-h-[250vh] items-center justify-center px-5 md:px-10"
      ariaLabel="Descend into the unknown — a cinematic journey through the tunnel"
    >
      <div className="sticky top-24 w-full max-w-4xl">
        <div className="space-y-12 pb-32">
          <Reveal delay={0}>
            <div className="flex flex-col items-center gap-3">
              <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.28em] text-accent">01. The Tunnel</span>
              <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-6xl">
                The camera flies forward, the walls of light close in, and
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent2">
                  reality begins to warp.
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              As you descend, the space transforms into a corridor of luminous
              rings — each one a doorway to another state, another rhythm, another
              tempo of being.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { label: 'Speed', value: 'Smooth interpolation' },
                { label: 'Light', value: 'Color interpolation' },
                { label: 'Depth', value: 'Camera rig follow' },
              ].map((item, i) => (
                <div key={i} className="border border-line p-6">
                  <div className="font-display text-[0.68rem] uppercase tracking-[0.2em] text-muted">{item.label}</div>
                  <div className="mt-2 font-display text-lg font-semibold text-ink">{item.value}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-6">
              <p className="max-w-lg text-center text-muted">
                The scroll continues, and with each pixel, the experience becomes
                more tangible, more physical.
              </p>
              <NexusButton onClick={() => scrollToSection('objects')}>
                <span className="uppercase tracking-[0.18em]">Enter the gallery</span>
              </NexusButton>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
