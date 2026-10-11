import { Section } from '../components/layout/Section'
import { Reveal } from '../components/ui/Reveal'
import { SplitText } from '../components/ui/SplitText'
import { NexusButton } from '../components/ui/NexusButton'
import { scrollToSection } from '../lib/lenis'

export function ManifestoSection() {
  return (
    <Section
      id="manifesto"
      className="relative px-5 md:px-10"
      ariaLabel="Manifesto — the web doesn't have to be flat"
    >
      <div className="mx-auto max-w-5xl py-28">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.28em] text-accent">06. Manifesto</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="text-center">
            <h2 className="font-display text-5xl font-bold leading-[1.08] tracking-tight text-ink md:text-7xl lg:text-8xl">
              <SplitText text="THE WEB DOESN'T" immediate />
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent2">
                <SplitText text="HAVE TO BE FLAT." immediate />
              </span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mx-auto mt-16 max-w-3xl space-y-8 text-lg leading-relaxed text-muted">
            <p>
              What happens when interfaces become places instead of pages? When an object invites exploration instead of waiting for a click? When motion communicates an idea rather than simply decorating a screen?
            </p>
            <p>
              NEXUS is an ongoing experiment in making digital experiences more tactile, expressive, and alive. We believe the browser is a canvas as much as it is a document viewer — a stage for spatial storytelling, physical metaphor, and playful interaction.
            </p>
            <p>
              This is not a website in the traditional sense. It is a destination — a digital playground designed to be felt, not just seen.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4} className="mt-20 text-center">
          <NexusButton variant="ghost" onClick={() => scrollToSection('objects')}>
            Explore the experiments
          </NexusButton>
        </Reveal>
      </div>
    </Section>
  )
}
