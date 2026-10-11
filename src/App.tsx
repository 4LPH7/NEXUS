import { useEffect, useState } from 'react'
import { initReducedMotionWatcher } from './hooks/useReducedMotion'
import { initLenis } from './lib/lenis'
import { BackgroundCanvas } from './components/three/BackgroundCanvas'
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

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const unwatchReducedMotion = initReducedMotionWatcher()
    initLenis()
    return () => {
      unwatchReducedMotion()
    }
  }, [])

  const handleOpenMenu = () => setMenuOpen(true)
  const handleCloseMenu = () => setMenuOpen(false)

  return (
    <>
      <ScrollObserver />
      <BackgroundCanvas />
      <Navbar onOpenMenu={handleOpenMenu} />
      <MobileMenu open={menuOpen} onClose={handleCloseMenu} />
      <main>
        <HeroSection />
        <DescendSection />
        <ObjectsSection />
        <PlaygroundSection />
        <CustomizationSection />
        <ManifestoSection />
        <FinalSection />
      </main>
      <Footer />
    </>
  )
}
