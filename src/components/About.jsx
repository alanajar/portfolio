import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GraduationCap, MapPin, Phone, Mail, Github, Calendar } from 'lucide-react'
import photo from '../assets/photo.jpg'

const timeline = [
  {
    year: '2024',
    title: 'Baccalauréat Informatique',
    place: 'Tunisie',
    detail: 'Moyenne 16.49/20 — Mention Très Bien',
    color: '#06b6d4',
    icon: '🎓',
  },
  {
    year: '2024 – 2025',
    title: 'Licence 1 Génie Logiciel',
    place: 'Horizon School of Digital Technologies, Tunisie',
    detail: 'Cursus anglais · Boursier excellence · Moyenne 15.5/20',
    color: '#7c3aed',
    icon: '💻',
  },
  {
    year: '2025 – 2026',
    title: 'BUT Informatique 1ère année',
    place: "IUT d'Arles — Aix-Marseille Université",
    detail: 'Parcours : Réalisation et Conception d\'Applications (RCDA)',
    color: '#4f46e5',
    icon: '🚀',
    current: true,
  },
]

function TimelineItem({ item, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      className="relative flex items-start gap-6 group"
    >
      {/* Connector line */}
      {index < timeline.length - 1 && (
        <div
          className="absolute left-[21px] top-12 w-0.5 h-full"
          style={{ background: 'linear-gradient(to bottom, ' + item.color + '44, transparent)' }}
        />
      )}

      {/* Dot */}
      <div className="relative flex-shrink-0 mt-1">
        {item.current && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: item.color, opacity: 0.4 }}
          />
        )}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-lg z-10 relative"
          style={{
            background: item.color + '22',
            border: '2px solid ' + item.color + '66',
          }}
        >
          {item.icon}
        </div>
      </div>

      {/* Content */}
      <div
        className="glass-card rounded-xl p-5 flex-1 group-hover:border-opacity-30 transition-all duration-300"
        style={{ borderColor: item.color + '33' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={13} className="text-slate-500" />
          <span className="text-xs font-medium" style={{ color: item.color }}>
            {item.year}
          </span>
          {item.current && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: item.color + '22', color: item.color }}
            >
              En cours
            </span>
          )}
        </div>
        <h3 className="text-white font-semibold text-base mb-1">{item.title}</h3>
        <p className="text-slate-400 text-sm mb-2">{item.place}</p>
        <p className="text-slate-500 text-xs">{item.detail}</p>
      </div>
    </motion.div>
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

export default function About() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <section id="about" className="relative z-10 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <SectionLabel>À propos</SectionLabel>

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Qui suis-<span className="gradient-text">je</span> ?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
             Étudiant passionné par l'informatique, curieux et rigoureux, je m'efforce de développer mes compétences en concevant des programmes et des applications
          </p>
        </motion.div>

        {/* Profile photo centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div
            className="w-28 h-28 rounded-2xl overflow-hidden mb-5"
            style={{ boxShadow: '0 0 40px rgba(79,70,229,0.4), 0 0 0 3px #4f46e5' }}
          >
            <img src={photo} alt="Ala NAJAR" className="w-full h-full object-cover object-top" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Ala NAJAR</h3>
          <p className="text-slate-400 text-sm mb-2">Étudiant BUT Informatique · RCDA</p>
          <div className="flex items-center justify-center gap-1">
            <MapPin size={13} className="text-cyan-400" />
            <span className="text-xs text-slate-500">Avignon · Mobilité Aix-en-Provence</span>
          </div>
        </motion.div>

        {/* Description centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-xl p-6 mb-10 max-w-3xl mx-auto text-center"
        >
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Passionné par l'informatique depuis mes années lycée en Tunisie, j'ai développé
            une solide base algorithmique et une vraie appétence pour la création de logiciels
            utiles et bien conçus.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            j'ai choisi le parcours RCDA du BUT Informatique pour
            me spécialiser dans la conception et le développement d'applications. Je recherche
            une alternance pour mettre en pratique mes compétences dans un contexte professionnel.
          </p>
        </motion.div>

        {/* Contact info centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16 max-w-3xl mx-auto"
        >
          {[
            { icon: Phone, label: '07 43 57 16 40', href: 'tel:+33743571640' },
            { icon: Mail, label: 'alanajar9@gmail.com', href: 'mailto:alanajar9@gmail.com' },
            { icon: Github, label: 'github.com/alanajar', href: 'https://github.com/alanajar' },
            { icon: MapPin, label: 'Avignon, France', href: null },
          ].map(({ icon: Icon, label, href }) => (
            <div
              key={label}
              className="glass-card rounded-lg p-3 flex flex-col items-center gap-2 text-center"
            >
              <Icon size={16} className="text-indigo-400" />
              {href ? (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white truncate transition-colors max-w-full"
                >
                  {label}
                </a>
              ) : (
                <span className="text-xs text-slate-400 truncate max-w-full">{label}</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Timeline centered */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-8 flex items-center justify-center gap-2">
            <GraduationCap size={18} className="text-indigo-400" />
            Parcours de formation
          </h3>
          <div className="flex flex-col gap-8">
            {timeline.map((item, i) => (
              <TimelineItem key={item.year} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
