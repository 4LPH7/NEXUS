/**
 * Non-WebGL / scene-failure fallback: an atmospheric CSS composition that
 * follows the theme via the shared CSS variables. No canvas required.
 */
export function SceneFallback() {
  return (
    <div data-testid="scene-fallback" aria-hidden className="fixed inset-0 z-0 overflow-hidden bg-bg">
      <div className="absolute -top-40 right-[-12%] h-[42rem] w-[42rem] rounded-full bg-accent opacity-30 blur-[130px]" />
      <div className="absolute bottom-[-22%] left-[-12%] h-[38rem] w-[38rem] rounded-full bg-accent2 opacity-20 blur-[130px]" />
      <div className="absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-highlight opacity-15 blur-[110px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--bg)_100%)]" />
    </div>
  )
}
