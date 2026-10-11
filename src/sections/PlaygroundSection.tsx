import { lazy, Suspense } from 'react'
import { Section } from '../components/layout/Section'
import { Reveal } from '../components/ui/Reveal'

const GravityExperiment = lazy(() => import('../components/experiments/GravityExperiment').then((m) => ({ default: m.GravityExperiment })))
const DragExperiment = lazy(() => import('../components/experiments/DragExperiment').then((m) => ({ default: m.DragExperiment })))
const MorphLab = lazy(() => import('../components/experiments/MorphLab').then((m) => ({ default: m.MorphLab })))

export function PlaygroundSection() {
  return (
    <Section
      id="playground"
      className="relative px-5 md:px-10"
      ariaLabel="Playground — interactive laboratory with magnetic, drag, and morph experiments"
    >
      <div className="mx-auto max-w-6xl py-24">
        <Reveal>
          <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.28em] text-accent">03. Playground</span>
              <h2 className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">
                The laboratory
              </h2>
            </div>
            <p className="max-w-md text-muted md:text-right">
              Hands-on experiments where you become the director of physical behavior.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-3">
          <Reveal delay={0.1} y={24}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">A. Magnetic Field</h3>
              </div>
              <div className="flex-1">
                <Suspense fallback={<div className="min-h-64" aria-label="Loading magnetic field" />}><GravityExperiment /></Suspense>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} y={24}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">B. Grab & Rotate</h3>
              </div>
              <div className="flex-1">
                <Suspense fallback={<div className="min-h-64" aria-label="Loading grab and rotate" />}><DragExperiment /></Suspense>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3} y={24}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">C. Morph Lab</h3>
              </div>
              <div className="flex-1">
                <Suspense fallback={<div className="min-h-64" aria-label="Loading morph lab" />}><MorphLab /></Suspense>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
