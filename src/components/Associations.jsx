import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Globe, Award } from 'lucide-react'

const associations = [
  {
    name: 'IEEE',
    fullName: 'Institute of Electrical and Electronics Engineers',
    role: 'Membre actif',
    description:
      "Membre de la section IEEE — l'organisation professionnelle la plus grande du monde dédiée aux technologies. Participation aux événements techniques, conférences, et promotion de l'ingénierie et de l'innovation.",
    icon: '⚡',
    color: '#4f46e5',
    tags: ['Networking', 'Innovation', 'Tech', 'International'],
    highlight: 'Organisation mondiale',
  },
  {
    name: 'TSYP',
    fullName: 'Tunisian Students and Young Professionals',
    role: 'Participant au Congrès International',
    description:
      "Participation au Congrès International TSYP — échanges et networking avec des professionnels du secteur tech en Tunisie et à l'international. Conférences, ateliers et discussions autour des nouvelles technologies.",
    icon: '🌍',
    color: '#06b6d4',
    tags: ['Congrès', 'Networking', 'Leadership', 'Jeunes Pro'],
    highlight: 'Congrès international',
  },
  {
    name: 'Arbitre Tennis',
    fullName: 'Fédération de Tennis — Licence officielle',
    role: 'Arbitre licencié',
    description:
      "Titulaire d'une licence officielle d'arbitre de tennis. Application rigoureuse des règles, gestion des situations de match sous pression, impartialité et sens de la justice. Compétences transposables : rigueur, sang-froid et décision rapide.",
    icon: '🎾',
    color: '#d97706',
    tags: ['Rigueur', 'Sport', 'Règles', 'Gestion de conflit'],
    highlight: 'Licence officielle',
  },
  {
    name: 'La Nuit de l\'Info',
    fullName: 'Hackathon National',
    role: 'Participant',
    description:
      "Participation au hackathon national La Nuit de l'Info — une nuit entière de développement en équipe pour relever des défis informatiques.",
    icon: '💻',
    color: '#7c3aed',
    tags: ['Hackathon', 'Développement', 'Équipe', 'Défis'],
    highlight: 'Hackathon national',
  },
]

function AssociationCard({ item, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.15 }}
      className="glass-card rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300"
      style={{ borderColor: item.color + '22' }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{
            background: item.color + '18',
            border: '2px solid ' + item.color + '33',
            boxShadow: '0 0 20px ' + item.color + '20',
          }}
        >
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold text-lg">{item.name}</h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: item.color + '20', color: item.color }}
            >
              {item.highlight}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">{item.fullName}</p>
          <p className="text-xs font-medium mt-1" style={{ color: item.color }}>
            {item.role}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed mb-5">{item.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: item.color + '12',
              color: item.color + 'cc',
              border: '1px solid ' + item.color + '25',
            }}
          >
            {tag}
          </span>
        ))}
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

export default function Associations() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <section
      id="associations"
      className="relative z-10 py-28"
      style={{ background: 'rgba(6,182,212,0.02)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Vie associative</SectionLabel>

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Engagement & <span className="gradient-text">associations</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Au-delà du code — des expériences qui forgent le caractère et ouvrent des horizons.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {associations.map((item, i) => (
            <AssociationCard key={item.name} item={item} index={i} />
          ))}
        </div>

        {/* Soft skills banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 glass-card rounded-2xl p-8 text-center"
          style={{ borderColor: 'rgba(79,70,229,0.2)' }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award size={20} className="text-indigo-400" />
            <h3 className="text-white font-semibold text-lg">Soft skills acquises</h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              '🤝 Travail en équipe', '🎯 Rigueur', '⚡ Réactivité',
              '🌍 Ouverture internationale', '🧠 Esprit critique', '📋 Organisation',
              '🗣️ Communication', '💡 Adaptabilité',
            ].map(skill => (
              <span
                key={skill}
                className="text-sm px-4 py-2 rounded-full text-slate-300"
                style={{ background: 'rgba(79,70,229,0.12)', border: '1px solid rgba(79,70,229,0.2)' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
