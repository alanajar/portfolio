import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'

import Cursor from './components/Cursor'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Associations from './components/Associations'
import Languages from './components/Languages'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  const handleLoadComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      <Cursor />

      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
      </AnimatePresence>

      {loaded && (
        <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Associations />
            <Languages />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}
