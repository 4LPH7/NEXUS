import { useState } from 'react'
import { Section } from '../components/layout/Section'
import { NexusButton } from '../components/ui/NexusButton'
import { Reveal } from '../components/ui/Reveal'
import { Modal } from '../components/ui/Modal'
import { GalleryOverlay } from '../components/gallery/GalleryOverlay'
import { Orbit, Activity } from 'lucide-react'

type ExperimentKey = 'orbit' | 'flux' | 'gravity' | 'prism'

interface Experiment {
  key: ExperimentKey
  title: string
  description: string
  icon: React.FC<{ size?: number; className?: string }>
}

const EXPERIMENTS: Experiment[] = [
  { key: 'orbit', title: 'Orbit', description: 'Objects circling a central field — drag to influence the orbit radius.', icon: Orbit },
  { key: 'flux', title: 'Flux', description: 'A procedural sculpture that evolves its form over time.', icon: Activity },
  { key: 'gravity', title: 'Gravity', description: 'Particles react to your pointer with an attractive or repulsive field.', icon: Activity },
  { key: 'prism', title: 'Prism', description: 'A transparent structure whose light play shifts with rotation.', icon: Orbit },
]

export function ObjectsSection() {
  const [selected, setSelected] = useState<ExperimentKey | null>(null)

  return (
    <Section
      id="objects"
      className="relative px-5 md:px-10"
      ariaLabel="Objects in motion — an interactive collection of digital experiments"
    >
      <div className="mx-auto max-w-5xl py-24">
        <Reveal>
          <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.28em] text-accent">02. Gallery</span>
              <h2 className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">
                Interactive experiments
              </h2>
            </div>
            <p className="max-w-md text-muted md:text-right">
              Four distinct digital objects — each with its own physical behavior and interaction language.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
          {EXPERIMENTS.map((exp, i) => (
            <Reveal key={exp.key} delay={i * 0.08} y={24}>
              <button
                type="button"
                onClick={() => setSelected(exp.key)}
                className="group flex flex-col rounded-2xl border border-line bg-surface/50 p-8 transition-all duration-300 hover:border-accent hover:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent/40"
                aria-label={`Open ${exp.title} details`}
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <exp.icon size={22} aria-hidden />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{exp.title}</h3>
                <p className="mt-2 text-muted">{exp.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted opacity-0 transition-opacity group-hover:opacity-100">
                  Interact
                  <span aria-hidden className="inline-block h-3 w-0.5 bg-accent" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-16 text-center">
          <NexusButton variant="ghost" onClick={() => setSelected('orbit')}>
            View all experiments
          </NexusButton>
        </Reveal>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} label={selected ? EXPERIMENTS.find((e) => e.key === selected)?.title || 'Experiment' : 'Experiment'}>
        {selected && <GalleryOverlay experimentKey={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </Section>
  )
}
