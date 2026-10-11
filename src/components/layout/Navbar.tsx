import { useEffect, useState } from 'react'
import { scrollToSection, scrollToTop } from '../../lib/lenis'
import { SITE, SECTION_IDS, type SectionId } from '../../config/site'
import { scrollStore } from '../../state/scrollStore'
import { useSettingsStore } from '../../state/settingsStore'
import { Zap, ZapOff, Menu } from 'lucide-react'

/** Polls the scroll store's journey scalar; re-renders only when the active section changes. */
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('hero')
  useEffect(() => {
    const update = () => {
      const index = Math.min(Math.max(Math.round(scrollStore.journey), 0), SECTION_IDS.length - 1)
      const id = SECTION_IDS[index]!
      setActive((prev) => (prev === id ? prev : id))
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('nexus:lenis-scroll', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('nexus:lenis-scroll', update)
    }
  }, [])
  return active
}

interface NavbarProps {
  onOpenMenu: () => void
}

export function Navbar({ onOpenMenu }: NavbarProps) {
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled ? 'border-b border-line bg-bg/70 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex max-w-[110rem] items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <button
          type="button"
          onClick={() => scrollToTop()}
          className="font-display text-lg font-bold tracking-[0.28em] text-ink transition-colors hover:text-accent"
          aria-label="NEXUS — back to top"
        >
          {SITE.name}
          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-accent align-middle" aria-hidden />
        </button>

        <ul className="hidden items-center gap-9 md:flex">
          {SITE.nav.map((item) => {
            const isActive = active === item.sectionId
            return (
              <li key={item.sectionId}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.sectionId)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group relative font-display text-[0.72rem] font-semibold uppercase tracking-[0.26em] transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            aria-pressed={reducedMotion}
            aria-label={reducedMotion ? 'Enable full motion' : 'Reduce motion'}
            title={reducedMotion ? 'Motion reduced' : 'Full motion'}
            className="flex h-10 w-10 items-center justify-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {reducedMotion ? <ZapOff size={16} aria-hidden /> : <Zap size={16} aria-hidden />}
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            aria-haspopup="dialog"
            className="flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-accent hover:text-accent md:hidden"
          >
            <Menu size={18} aria-hidden />
          </button>
        </div>
      </nav>
    </header>
  )
}
