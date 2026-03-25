import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Github, ChevronDown, ChevronUp, Image, X, ZoomIn } from 'lucide-react'
import imgBiblio from '../assets/biblio.png'
import imgS104 from '../assets/s1.04_manipulation_de_base_de_donn-e.png'
import imgSiteAmu from '../assets/site_amu.png'
import imgTodo from '../assets/mon_to_do_list.png'
import pdfReport from '../assets/report.pdf'

const LANGUAGE_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  C: '#555555',
  'C++': '#f34b7d',
  PHP: '#777bb4',
  HTML: '#e34c26',
  CSS: '#264de4',
  Java: '#b07219',
  Shell: '#89e051',
  SQL: '#e38c00',
  Makefile: '#427819',
  'Jupyter Notebook': '#DA5B0B',
  Sage: '#6a9a4d',
  Bootstrap: '#7952b3',
  React: '#61dafb',
  Default: '#6b7280',
}

const PROJECTS = [
  {
    id: 'bibliotheque-cpp',
    name: 'SAÉ S1.01 — Gestion de Bibliothèque',
    languages: ['C++', 'Makefile'],
    description:
      "Application console de gestion de bibliothèque en C++. Structure avec dossiers séparés pour les fichiers source (.cpp) et les headers (.hpp).",
    github: 'https://github.com/alanajar/biblioth-quec-',
    image: imgBiblio,
    expandType: 'image',
    gradient: 'from-rose-600 to-indigo-600',
    emoji: '📚',
  },
  {
    id: 'algorithmes-tri',
    name: 'SAÉ S1.02 — Démonstration d\'Algorithmes de Tri',
    languages: ['C++', 'Python', 'Jupyter Notebook', 'Sage', 'Shell'],
    description:
      "Comparaison de six algorithmes de tri (bulle, insertion, sélection, quicksort, quicksort aléatoire, std::sort) sur des tableaux de 1 000 à 100 000 éléments. Mesure du temps et du nombre de comparaisons.",
    github: 'https://github.com/alanajar/S1.02-D-monstration-d-algorithmes',
    pdfUrl: pdfReport,
    expandType: 'pdf',
    gradient: 'from-violet-600 to-cyan-500',
    emoji: '📊',
  },
  {
    id: 'base-de-donnees',
    name: 'SAÉ S1.04 — Manipulation de Base de Données',
    languages: ['SQL'],
    description:
      "Travaux pratiques de base de données relationnelle PostgreSQL. Modélisation, normalisation et requêtes avancées sur une base commerciale (clients, articles, commandes, livraisons).",
    github: 'https://github.com/alanajar/s1.04_manipulation_de_base_de_donn-e',
    image: imgS104,
    expandType: 'image',
    gradient: 'from-cyan-600 to-teal-500',
    emoji: '🗄️',
  },
  {
    id: 'site-amu',
    name: 'SAÉ S1.06 — Site Vitrine BUT Informatique IUT Arles',
    languages: ['HTML', 'CSS', 'Bootstrap'],
    description:
      "Site vitrine présentant le BUT Informatique du site d'Arles (IUT Aix-Marseille). Présentation de la formation, compétences, parcours, métiers et SAÉ.",
    github: 'https://github.com/alanajar/site_pour_amu',
    image: imgSiteAmu,
    expandType: 'image',
    gradient: 'from-indigo-600 to-violet-500',
    emoji: '🌐',
  },
  {
    id: 'todo-list',
    name: 'Application To-Do List',
    languages: ['TypeScript', 'React', 'JavaScript', 'CSS'],
    description:
      "Application de gestion de tâches développée avec React et TypeScript. Interface moderne avec Vite comme bundler.",
    github: 'https://github.com/alanajar/mon_to_do_list',
    image: imgTodo,
    expandType: 'image',
    gradient: 'from-amber-500 to-orange-600',
    emoji: '✅',
  },
]

function ImagePlaceholder() {
  return (
    <div
      className="w-full h-64 rounded-xl flex flex-col items-center justify-center gap-3"
      style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.15))',
        border: '1px dashed rgba(79,70,229,0.3)',
      }}
    >
      <Image size={40} className="text-indigo-400 opacity-50" />
      <span className="text-slate-400 text-sm">Image à venir</span>
    </div>
  )
}

function PdfViewer({ url }) {
  return (
    <div className="w-full rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <embed
        src={url}
        type="application/pdf"
        className="w-full"
        style={{ height: '500px' }}
      />
    </div>
  )
}

function Lightbox({ src, alt, onClose }) {
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <button
          className="absolute top-5 right-5 z-[9999] w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <motion.img
          src={src}
          alt={alt}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
          onClick={e => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

function LanguageBadge({ lang }) {
  const color = LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Default
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5"
      style={{
        background: color + '20',
        color: color,
        border: '1px solid ' + color + '44',
      }}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {lang}
    </span>
  )
}

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-2xl overflow-hidden group"
      style={{ borderColor: 'rgba(79,70,229,0.15)' }}
    >
      {/* Gradient header */}
      <div
        className={`relative h-32 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <span className="text-5xl select-none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>
          {project.emoji}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-indigo-300 transition-colors">
          {project.name}
        </h3>

        {/* Language badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.languages.map(lang => (
            <LanguageBadge key={lang} lang={lang} />
          ))}
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              background: expanded ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.12)',
              color: '#a5b4fc',
              border: '1px solid rgba(79,70,229,0.3)',
            }}
            data-hover
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Fermer' : 'Voir le projet'}
          </button>

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            data-hover
          >
            <Github size={14} />
            Code source
          </a>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-5 mt-5 border-t border-white/5">
                {project.expandType === 'pdf' ? (
                  <PdfViewer url={project.pdfUrl} />
                ) : project.image ? (
                  <div className="relative group/img cursor-zoom-in" onClick={() => setLightbox(true)}>
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full rounded-xl object-cover"
                      style={{ maxHeight: '400px' }}
                    />
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <ZoomIn size={36} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {lightbox && project.image && (
        <Lightbox src={project.image} alt={project.name} onClose={() => setLightbox(false)} />
      )}
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

export default function Projects() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <section id="projects" className="relative z-10 py-28">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Projets</SectionLabel>

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mes <span className="gradient-text">projets</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Projets académiques et personnels — cliquez sur "Voir le projet" pour découvrir les détails.
          </p>
        </motion.div>

        {/* Project cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* GitHub link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="https://github.com/alanajar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            data-hover
          >
            <Github size={16} />
            Voir tous les projets sur GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
