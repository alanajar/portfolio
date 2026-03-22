import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const languages = [
  {
    name: 'Arabe',
    level: 100,
    label: 'Langue maternelle',
    flag: '🇹🇳',
    cert: 'Natif',
    color: '#06b6d4',
  },
  {
    name: 'Français',
    level: 75,
    label: 'Niveau B2',
    flag: '🇫🇷',
    cert: 'TCF',
    color: '#4f46e5',
  },
  {
    name: 'Anglais',
    level: 78,
    label: 'Niveau C1',
    flag: 'EN',
    cert: 'EF SET',
    color: '#7c3aed',
  },
]

const R = 54
const CIRC = 2 * Math.PI * R

function DonutChart({ language, animate }) {
  const offset = CIRC - (language.level / 100) * CIRC

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-36 h-36">
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="72"
            cy="72"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Progress ring */}
          <motion.circle
            cx="72"
            cy="72"
            r={R}
            fill="none"
            stroke={language.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: animate ? offset : CIRC }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px ${language.color}88)` }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{language.flag}</span>
          <span className="text-white font-bold text-lg leading-none mt-1">
            {language.level}%
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        <p className="text-white font-semibold text-lg">{language.name}</p>
        <p className="text-slate-400 text-sm">{language.label}</p>
        <span
          className="inline-block text-xs px-3 py-1 rounded-full mt-2 font-medium"
          style={{
            background: language.color + '18',
            color: language.color,
            border: '1px solid ' + language.color + '33',
          }}
        >
          {language.cert}
        </span>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(79,70,229,0.4), transparent)' }} />
      <span className="text-xs font-medium tracking-widest uppercase text-slate-500">{children}</span>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(79,70,229,0.4), transparent)' }} />
    </div>
  )
}

export default function Languages() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="languages" className="relative z-10 py-28">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Langues</SectionLabel>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Compétences <span className="gradient-text">linguistiques</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Multilinguisme — un atout majeur dans un environnement professionnel international.
          </p>
        </motion.div>

        {/* Donut charts */}
        <div className="flex flex-wrap items-center justify-center gap-14 mb-14">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <DonutChart language={lang} animate={inView} />
            </motion.div>
          ))}
        </div>

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="glass-card rounded-xl p-4"
              style={{ borderColor: lang.color + '22' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <p className="text-white font-medium text-sm">{lang.name}</p>
                  <p className="text-xs" style={{ color: lang.color }}>{lang.cert}</p>
                </div>
              </div>
              {/* Mini bar */}
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: lang.color }}
                  initial={{ width: 0 }}
                  animate={{ width: inView ? `${lang.level}%` : 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 + i * 0.1 }}
                />
              </div>
              <p className="text-slate-500 text-xs mt-2">{lang.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
