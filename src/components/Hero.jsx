import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Github, Mail, ChevronDown, ExternalLink } from 'lucide-react'
import { lazy, Suspense } from 'react'

const HeroScene = lazy(() => import('./HeroScene'))

const WORDS = [
  'Développeur Fullstack',
  'Étudiant BUT Informatique',
  'Passionné par la programation et la développement',
  'Futur Alternant RCDA',
]

function TypewriterText() {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    const word = WORDS[wordIndex]
    let timeout

    if (!deleting && charIndex <= word.length) {
      setText(word.slice(0, charIndex))
      timeout = setTimeout(() => setCharIndex(c => c + 1), 80)
    } else if (!deleting && charIndex > word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && charIndex >= 0) {
      setText(word.slice(0, charIndex))
      timeout = setTimeout(() => setCharIndex(c => c - 1), 40)
    } else {
      setDeleting(false)
      setWordIndex(i => (i + 1) % WORDS.length)
      setCharIndex(0)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, wordIndex])

  return (
    <span className="gradient-text-blue">
      {text}
      <span className="typewriter-cursor" />
    </span>
  )
}

function GlitchTitle({ text }) {
  return (
    <div className="relative inline-block">
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
        {text}
      </h1>
    </div>
  )
}

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0a0a0f' }}
    >
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(79,70,229,0.12) 0%, rgba(10,10,15,0.6) 60%, rgba(10,10,15,0.95) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
          style={{
            background: 'rgba(79,70,229,0.15)',
            border: '1px solid rgba(79,70,229,0.3)',
            color: '#a5b4fc',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Disponible pour une alternance —  Aix-en-Provence
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          className="mb-4"
        >
          <GlitchTitle text="Ala NAJAR" />
        </motion.div>

        {/* Typewriter subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-300 mb-6 h-10"
        >
          <TypewriterText />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-slate-400 max-w-xl mx-auto mb-10 text-base leading-relaxed"
        >
          Étudiant en BUT Informatique à l'IUT d'Arles, passionné par le développement
          d'applications et les technologies modernes. Boursier d'excellence en Licence Genie Logicile, bac 16.49/20.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <button onClick={scrollToProjects} className="btn-primary" data-hover>
            Voir mes projets
            <ExternalLink size={15} />
          </button>
          <button onClick={scrollToContact} className="btn-outline" data-hover>
            Me contacter
            <Mail size={15} />
          </button>
          <a
            href="https://github.com/alanajar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            data-hover
          >
            <Github size={15} />
            GitHub
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center gap-10 text-center"
        >
          {[
            { value: '16.49', label: 'Moyenne Bac' },
            { value: '15.5', label: 'Moyenne L1' },
            { value: '5+', label: 'Projets' },
            { value: '4', label: 'Langues' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold gradient-text">{value}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 scroll-indicator cursor-pointer"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-slate-500 text-xs tracking-widest uppercase">Défiler</span>
        <ChevronDown size={20} className="text-slate-400" />
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[2]"
        style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0f)' }}
      />
    </section>
  )
}
