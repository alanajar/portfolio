import { useRef, useState, useEffect, lazy, Suspense } from 'react'
import { motion, useInView } from 'framer-motion'
import { HAS_WEBGL } from '../utils/performance'
import { CODE_LINES } from '../utils/devCode'

const DevScene = lazy(() => import('./DevScene'))

const skillCategories = [
  {
    title: 'Langages',
    color: '#4f46e5',
    icon: '⚡',
    skills: [
      { name: 'Python', level: 75, icon: '🐍' },
      { name: 'C / C++', level: 70, icon: '⚙️' },
      { name: 'JavaScript', level: 65, icon: '🟡' },
      { name: 'PHP', level: 55, icon: '🐘' },
      { name: 'Flutter ', level: 20, icon: '💙' },
    ],
  },
  {
    title: 'Conception',
    color: '#06b6d4',
    icon: '🏗️',
    skills: [
      { name: 'POO', level: 80, icon: '🔷' },
      { name: 'UML', level: 70, icon: '📐' },
      { name: 'Merise', level: 65, icon: '📊' },
      { name: 'Algorithmique', level: 75, icon: '🧠' },
    ],
  },
  {
    title: 'Bases de données',
    color: '#7c3aed',
    icon: '🗄️',
    skills: [
      { name: 'PostgreSQL', level: 70, icon: '🐘' },
      { name: 'MySQL', level: 65, icon: '🐬' },
      { name: 'SQL avancé', level: 70, icon: '📋' },
    ],
  },
  {
    title: 'Outils & DevOps',
    color: '#059669',
    icon: '🛠️',
    skills: [
      { name: 'Git / GitHub', level: 75, icon: '🔀' },
      { name: 'Linux / Shell', level: 65, icon: '🐧' },
      { name: 'Docker', level: 20, icon: '🐳' },
      { name: 'Postman', level: 20, icon: '📮' },
      { name: 'Trello', level: 20, icon: '📌' },
    ],
  },
  {
    title: 'Méthodologies',
    color: '#d97706',
    icon: '📋',
    skills: [
      { name: 'Scrum / Agile', level: 70, icon: '🔄' },
      { name: 'CRISP-DM', level: 55, icon: '📈' },
    ],
  },
]

function SkillBar({ level, color, animated }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
        initial={{ width: 0 }}
        animate={{ width: animated ? `${level}%` : 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  )
}

function SkillCard({ category, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className="skill-card-container h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="skill-card-inner h-full">
        {/* Front */}
        <div
          className="skill-card-front glass-card rounded-2xl p-6 h-full"
          style={{ borderColor: category.color + '33' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: category.color + '22', border: '1px solid ' + category.color + '44' }}
            >
              {category.icon}
            </div>
            <h3 className="font-semibold text-white">{category.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.skills.map(skill => (
              <span
                key={skill.name}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: category.color + '15',
                  color: category.color,
                  border: '1px solid ' + category.color + '33',
                }}
              >
                {skill.icon} {skill.name}
              </span>
            ))}
          </div>
          <p
            className="text-xs mt-4"
            style={{ color: category.color + 'aa' }}
          >
            Retournez pour voir les niveaux →
          </p>
        </div>

        {/* Back */}
        <div
          className="skill-card-back glass-card rounded-2xl p-6"
          style={{ borderColor: category.color + '44', background: category.color + '08' }}
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span>{category.icon}</span> {category.title}
          </h3>
          <div className="flex flex-col gap-3">
            {category.skills.map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <span>{skill.icon}</span> {skill.name}
                  </span>
                  <span className="text-xs font-mono" style={{ color: category.color }}>
                    {skill.level}%
                  </span>
                </div>
                <SkillBar level={skill.level} color={category.color} animated={inView} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Sphère filaire en SVG (remplace un 2e contexte WebGL, bien trop coûteux pour un décor)
function WireframeSphere() {
  return (
    <svg viewBox="-50 -50 100 100" className="w-full h-full wireframe-spin" fill="none" stroke="#6366f1" strokeWidth="1.2">
      <circle r="45" />
      <ellipse rx="45" ry="15" />
      <ellipse rx="45" ry="32" />
      <ellipse rx="15" ry="45" />
      <ellipse rx="32" ry="45" />
      <line x1="-45" y1="0" x2="45" y2="0" />
      <line x1="0" y1="-45" x2="0" y2="45" />
    </svg>
  )
}

// Version statique de la scène 3D (machines lentes ou pendant le chargement)
function CodeWindow() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div
        className="w-full max-w-lg rounded-xl overflow-hidden text-left"
        style={{ background: '#0d1117', border: '1px solid rgba(79,70,229,0.3)', boxShadow: '0 0 60px rgba(6,182,212,0.15)' }}
      >
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#161b22' }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
          <span className="ml-3 text-xs font-mono text-slate-400">developpeur.js</span>
        </div>
        <pre className="p-4 text-[11px] sm:text-xs leading-relaxed font-mono overflow-x-auto">
          {CODE_LINES.map((line, i) => (
            <div key={i}>
              <span className="inline-block w-6 text-right mr-4 select-none" style={{ color: '#475569' }}>{i + 1}</span>
              {line.map(([text, color], j) => (
                <span key={j} style={{ color }}>{text}</span>
              ))}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}

// Scène 3D chargée seulement à l'approche de la section, mise en pause hors écran
function DevShowcase() {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [use3D, setUse3D] = useState(HAS_WEBGL)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin: '200px' },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative h-[340px] sm:h-[420px] mb-14"
      role="img"
      aria-label="Ordinateur portable en 3D sur lequel du code s'écrit, entouré de mes technologies"
    >
      {use3D && near ? (
        <Suspense fallback={<CodeWindow />}>
          <DevScene active={visible} onFallback={() => setUse3D(false)} />
        </Suspense>
      ) : (
        <CodeWindow />
      )}
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

export default function Skills() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <section id="skills" className="relative z-10 py-28" style={{ background: 'rgba(79,70,229,0.03)' }}>
      {/* Floating 3D wireframe */}
      <div className="absolute right-10 top-20 w-40 h-40 opacity-20 hidden lg:block float-animation">
        <WireframeSphere />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Compétences</SectionLabel>

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stack <span className="gradient-text">technique</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Survolez les cartes pour découvrir mes niveaux de maîtrise.
          </p>
        </motion.div>

        <DevShowcase />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {skillCategories.map((cat, i) => (
            <SkillCard key={cat.title} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
