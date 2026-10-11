import { lazy, Suspense, useEffect, useState } from 'react'
import { initReducedMotionWatcher } from './hooks/useReducedMotion'
import { destroyLenis, initLenis } from './lib/lenis'
import { useEffectiveReducedMotion } from './hooks/useReducedMotion'
import { applyPresetToDOM, useSettingsStore } from './state/settingsStore'
import { scrollToTop } from './lib/lenis'
import { useWebGL } from './hooks/useWebGL'
import { Navbar } from './components/layout/Navbar'
import { MobileMenu } from './components/layout/MobileMenu'
import { Footer } from './components/layout/Footer'
import { ScrollObserver } from './components/ScrollObserver'
import { HeroSection } from './sections/HeroSection'
import { DescendSection } from './sections/DescendSection'
import { ObjectsSection } from './sections/ObjectsSection'
import { PlaygroundSection } from './sections/PlaygroundSection'
import { CustomizationSection } from './sections/CustomizationSection'
import { ManifestoSection } from './sections/ManifestoSection'
import { FinalSection } from './sections/FinalSection'

const BackgroundCanvas = lazy(() => import('./components/three/BackgroundCanvas').then((m) => ({ default: m.BackgroundCanvas })))

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sceneKey, setSceneKey] = useState(0)
  const reduced = useEffectiveReducedMotion()
  const webgl = useWebGL()

  useEffect(() => {
    const unwatchReducedMotion = initReducedMotionWatcher()
    return () => {
      destroyLenis()
      unwatchReducedMotion()
    }
  }, [])

  useEffect(() => {
    if (reduced || !webgl) destroyLenis()
    else initLenis()
    return () => destroyLenis()
  }, [reduced, webgl])

  useEffect(() => {
    applyPresetToDOM(useSettingsStore.getState().preset)
  }, [])

  const handleOpenMenu = () => setMenuOpen(true)
  const handleCloseMenu = () => setMenuOpen(false)
  const replay = () => {
    setSceneKey((key) => key + 1)
    scrollToTop(reduced)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ScrollObserver />
      <Suspense fallback={null}><BackgroundCanvas key={sceneKey} /></Suspense>
      <Navbar onOpenMenu={handleOpenMenu} />
      <MobileMenu open={menuOpen} onClose={handleCloseMenu} />
      <main id="main-content" data-replay-count={sceneKey} tabIndex={-1}>
        <HeroSection />
        <DescendSection />
        <ObjectsSection />
        <PlaygroundSection key={sceneKey} />
        <CustomizationSection />
        <ManifestoSection />
        <FinalSection onReplay={replay} />
      </main>
      <Footer />
    </>
  )
}
