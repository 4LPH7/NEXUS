import { useEffect } from 'react'
import { Section } from '../components/layout/Section'
import { Reveal } from '../components/ui/Reveal'
import { Slider } from '../components/ui/Slider'
import { useSettingsStore, PRESETS, type PresetId } from '../state/settingsStore'
import { applyPresetToDOM } from '../state/settingsStore'

export function CustomizationSection() {
  const { preset, particleIntensity, motionIntensity, reducedMotion, setPreset, setParticleIntensity, setMotionIntensity, setReducedMotion, reset } =
    useSettingsStore()

  useEffect(() => {
    applyPresetToDOM(preset)
  }, [preset])

  const presetButton = (id: PresetId, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setPreset(id)}
      aria-pressed={preset === id}
      className={`flex-1 rounded-lg border px-4 py-3 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-all ${
        preset === id ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-accent hover:text-ink'
      }`}
    >
      {label}
    </button>
  )

  return (
    <Section
      id="customization"
      className="relative px-5 md:px-10"
      ariaLabel="Change your reality — color themes, particle intensity, and motion settings"
    >
      <div className="mx-auto max-w-4xl py-24">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.28em] text-accent">04. Reality Lab</span>
            <h2 className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">Change your reality</h2>
          </div>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-line bg-surface/50 p-8">
              <h3 className="mb-6 font-display text-lg font-semibold tracking-tight text-ink">Theme presets</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(PRESETS).map(([id, { label }]) => presetButton(id as PresetId, label))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-2xl border border-line bg-surface/50 p-8">
              <h3 className="mb-6 font-display text-lg font-semibold tracking-tight text-ink">Controls</h3>
              <div className="space-y-6">
                <Slider
                  label="Particle density"
                  min={0}
                  max={1}
                  step={0.05}
                  value={particleIntensity}
                  onChange={setParticleIntensity}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
                <Slider
                  label="Motion intensity"
                  min={0}
                  max={1.5}
                  step={0.1}
                  value={motionIntensity}
                  onChange={setMotionIntensity}
                  format={(v) => v.toFixed(1)}
                />
                <div className="flex items-center justify-between">
                  <span className="font-display text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted">Reduced motion</span>
                  <button
                    type="button"
                    onClick={() => setReducedMotion(!reducedMotion)}
                    role="switch"
                    aria-checked={reducedMotion}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      reducedMotion ? 'bg-accent' : 'bg-line'
                    }`}
                  >
                    <span
            className={`inline-block h-5 w-5 transform rounded-full bg-bg transition-transform ${
                        reducedMotion ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line px-4 py-3 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Reset to default
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
