import { create } from 'zustand'

/*
  User-facing appearance settings. Changes propagate to CSS variables
  (applyPresetToDOM) and to 3D materials/lights via subscriptions.
  Persisted to localStorage defensively — a failed read/write is never fatal.
*/

export type PresetId = 'void' | 'ember' | 'ice' | 'cosmos'

export interface PresetColors {
  bg: string
  surface: string
  ink: string
  muted: string
  accent: string
  accent2: string
  highlight: string
  /** Extra tints for 3D lighting per zone. */
  lightA: string
  lightB: string
}

export const PRESETS: Record<PresetId, { label: string; colors: PresetColors }> = {
  void: {
    label: 'Void',
    colors: {
      bg: '#07070a',
      surface: '#101016',
      ink: '#f5f3fa', muted: '#92909f',
      accent: '#9b5cff',
      accent2: '#ff4567',
      highlight: '#68e1ff',
      lightA: '#9b5cff',
      lightB: '#ff4567',
    },
  },
  ember: {
    label: 'Ember',
    colors: {
      bg: '#0a0706',
      surface: '#171010',
      ink: '#f5f3fa', muted: '#a39b99',
      accent: '#ff4567',
      accent2: '#ff9a5c',
      highlight: '#ffc46b',
      lightA: '#ff6a45',
      lightB: '#ffb347',
    },
  },
  ice: {
    label: 'Ice',
    colors: {
      bg: '#05080c',
      surface: '#0d141d',
      ink: '#f5f3fa', muted: '#929eac',
      accent: '#68e1ff',
      accent2: '#8fb8ff',
      highlight: '#c9f0ff',
      lightA: '#5cc8ff',
      lightB: '#8fb8ff',
    },
  },
  cosmos: {
    label: 'Cosmos',
    colors: {
      bg: '#080611',
      surface: '#140f22',
      ink: '#f5f3fa', muted: '#9a91aa',
      accent: '#b36bff',
      accent2: '#ff5ce1',
      highlight: '#5c8dff',
      lightA: '#b36bff',
      lightB: '#ff5ce1',
    },
  },
}

interface SettingsState {
  preset: PresetId
  particleIntensity: number // 0..1
  motionIntensity: number // 0..1.5
  reducedMotion: boolean
  setPreset: (p: PresetId) => void
  setParticleIntensity: (v: number) => void
  setMotionIntensity: (v: number) => void
  setReducedMotion: (v: boolean) => void
  reset: () => void
}

export const DEFAULT_SETTINGS = {
  preset: 'void' as PresetId,
  particleIntensity: 0.7,
  motionIntensity: 1,
  reducedMotion: false,
}

const STORAGE_KEY = 'nexus-settings-v1'

function loadPersisted(): typeof DEFAULT_SETTINGS {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<typeof DEFAULT_SETTINGS>
    return {
      preset: typeof parsed.preset === 'string' && Object.hasOwn(PRESETS, parsed.preset) ? parsed.preset as PresetId : DEFAULT_SETTINGS.preset,
      particleIntensity: typeof parsed.particleIntensity === 'number' && Number.isFinite(parsed.particleIntensity) ? Math.min(1, Math.max(0, parsed.particleIntensity)) : DEFAULT_SETTINGS.particleIntensity,
      motionIntensity: typeof parsed.motionIntensity === 'number' && Number.isFinite(parsed.motionIntensity) ? Math.min(1.5, Math.max(0, parsed.motionIntensity)) : DEFAULT_SETTINGS.motionIntensity,
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : DEFAULT_SETTINGS.reducedMotion,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function persist(state: SettingsState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        preset: state.preset,
        particleIntensity: state.particleIntensity,
        motionIntensity: state.motionIntensity,
        reducedMotion: state.reducedMotion,
      }),
    )
  } catch {
    /* storage unavailable (private mode etc.) — settings stay in-memory */
  }
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  ...loadPersisted(),
  setPreset: (preset) => {
    set({ preset })
    persist(get())
    applyPresetToDOM(preset)
  },
  setParticleIntensity: (particleIntensity) => {
    set({ particleIntensity: Number.isFinite(particleIntensity) ? Math.min(1, Math.max(0, particleIntensity)) : DEFAULT_SETTINGS.particleIntensity })
    persist(get())
  },
  setMotionIntensity: (motionIntensity) => {
    set({ motionIntensity: Number.isFinite(motionIntensity) ? Math.min(1.5, Math.max(0, motionIntensity)) : DEFAULT_SETTINGS.motionIntensity })
    persist(get())
  },
  setReducedMotion: (reducedMotion) => {
    set({ reducedMotion })
    persist(get())
  },
  reset: () => {
    set({ ...DEFAULT_SETTINGS })
    persist(get())
    applyPresetToDOM(DEFAULT_SETTINGS.preset)
  },
}))

/** Push preset colours into the CSS custom properties used across the UI. */
export function applyPresetToDOM(preset: PresetId): void {
  const c = PRESETS[preset].colors
  const element = document.documentElement
  element.dataset.preset = preset
  const root = element.style
  root.setProperty('--bg', c.bg)
  root.setProperty('--surface', c.surface)
  root.setProperty('--ink', c.ink)
  root.setProperty('--muted', c.muted)
  root.setProperty('--accent', c.accent)
  root.setProperty('--accent-2', c.accent2)
  root.setProperty('--highlight', c.highlight)
}
