import { useId } from 'react'

interface SliderProps {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  format?: (value: number) => string
}

/** Labelled range input that always displays its live value. */
export function Slider({ label, min, max, step, value, onChange, format }: SliderProps) {
  const id = useId()
  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between">
        <label htmlFor={id} className="font-display text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted">
          {label}
        </label>
        <span className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-accent" aria-hidden>
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={format ? format(value) : undefined}
      />
    </div>
  )
}
