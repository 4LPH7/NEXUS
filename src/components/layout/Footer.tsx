import { scrollToSection, scrollToTop } from '../../lib/lenis'
import { SITE } from '../../config/site'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-[110rem] flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <button
            type="button"
            onClick={() => scrollToTop()}
            className="font-display text-xl font-bold tracking-[0.28em] text-ink transition-colors hover:text-accent"
            aria-label="NEXUS — back to top"
          >
            {SITE.name}
            <span className="ml-1 inline-block h-2 w-2 rounded-full bg-accent align-middle" aria-hidden />
          </button>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{SITE.footerNote}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {SITE.nav.map((item) => (
              <li key={item.sectionId}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.sectionId)}
                  className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted transition-colors hover:text-accent"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted/60">
                © {SITE.year}
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
