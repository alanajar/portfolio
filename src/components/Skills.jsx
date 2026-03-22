import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'

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
      { name: 'Flutter / Dart', level: 50, icon: '💙' },
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
      { name: 'Docker', level: 50, icon: '🐳' },
      { name: 'Postman', level: 60, icon: '📮' },
      { name: 'Trello', level: 70, icon: '📌' },
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

function WireframeSphere() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * 0.2
    ref.current.rotation.y = state.clock.elapsedTime * 0.3
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial
        color="#4f46e5"
        emissive="#4f46e5"
        emissiveIntensity={0.4}
        wireframe
      />
    </mesh>
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
        <Canvas camera={{ position: [0, 0, 4] }} gl={{ alpha: true }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 3, 3]} intensity={1} color="#4f46e5" />
          <WireframeSphere />
        </Canvas>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {skillCategories.map((cat, i) => (
            <SkillCard key={cat.title} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
