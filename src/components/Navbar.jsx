import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import photo from '../assets/photo.jpg'

const links = [
  { label: 'Accueil', href: '#hero' },
  { label: 'À propos', href: '#about' },
  { label: 'Compétences', href: '#skills' },
  { label: 'Projets', href: '#projects' },
  { label: 'Associatif', href: '#associations' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      // Active section detection
      const sections = links.map(l => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo('#hero')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-lg overflow-hidden"
          style={{ boxShadow: '0 0 0 2px #4f46e5' }}
          data-hover
        >
          <img src={photo} alt="Ala NAJAR" className="w-full h-full object-cover object-top" />
        </motion.button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <li key={href}>
              <button
                onClick={() => scrollTo(href)}
                className={`nav-link text-sm font-medium transition-colors duration-200 ${
                  active === href.slice(1) ? 'text-white active' : 'text-slate-400 hover:text-white'
                }`}
                data-hover
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="mailto:alanajar9@gmail.com"
          className="hidden md:flex btn-primary text-sm py-2 px-5"
          data-hover
        >
          Me contacter
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(o => !o)}
          data-hover
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
            className="block w-6 h-0.5 bg-white rounded-full"
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1 }}
            className="block w-6 h-0.5 bg-white rounded-full"
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
            className="block w-6 h-0.5 bg-white rounded-full"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => scrollTo(href)}
                  className="text-left text-slate-300 hover:text-white py-2 border-b border-white/5 text-sm font-medium"
                >
                  {label}
                </button>
              ))}
              <a href="mailto:alanajar9@gmail.com" className="btn-primary justify-center mt-2">
                Me contacter
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
