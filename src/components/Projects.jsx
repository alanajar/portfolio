import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Github, X, Play, Image as ImageIcon, FileText, ArrowUpRight, Film } from 'lucide-react'
import { LOW_PERF } from '../utils/performance'
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

// ─── Ajouter une vidéo à un projet ───────────────────────────────────────────
// Remplir le champ `video` du projet, au choix :
//   • une vidéo YouTube :   video: 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
//   • un fichier local  :   mettre le .mp4 dans src/assets/videos/, l'importer en haut
//                           (import videoBiblio from '../assets/videos/biblio.mp4')
//                           puis  video: videoBiblio
// Tant que `video` vaut null, la carte affiche « Démo vidéo bientôt disponible ».
// ─────────────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'bibliotheque-cpp',
    tag: 'SAÉ S1.01',
    title: 'Gestion de Bibliothèque',
    languages: ['C++', 'Makefile'],
    description:
      "Application console de gestion de bibliothèque en C++. Structure avec dossiers séparés pour les fichiers source (.cpp) et les headers (.hpp).",
    github: 'https://github.com/alanajar/biblioth-quec-',
    image: imgBiblio,
    video: null,
    accent: '#f43f5e',
    emoji: '📚',
  },
  {
    id: 'algorithmes-tri',
    tag: 'SAÉ S1.02',
    title: "Démonstration d'Algorithmes de Tri",
    languages: ['C++', 'Python', 'Jupyter Notebook', 'Sage', 'Shell'],
    description:
      "Comparaison de six algorithmes de tri (bulle, insertion, sélection, quicksort, quicksort aléatoire, std::sort) sur des tableaux de 1 000 à 100 000 éléments. Mesure du temps et du nombre de comparaisons.",
    github: 'https://github.com/alanajar/S1.02-D-monstration-d-algorithmes',
    pdf: pdfReport,
    video: null,
    accent: '#8b5cf6',
    emoji: '📊',
  },
  {
    id: 'base-de-donnees',
    tag: 'SAÉ S1.04',
    title: 'Manipulation de Base de Données',
    languages: ['SQL'],
    description:
      "Travaux pratiques de base de données relationnelle PostgreSQL. Modélisation, normalisation et requêtes avancées sur une base commerciale (clients, articles, commandes, livraisons).",
    github: 'https://github.com/alanajar/s1.04_manipulation_de_base_de_donn-e',
    image: imgS104,
    video: null,
    accent: '#06b6d4',
    emoji: '🗄️',
  },
  {
    id: 'site-amu',
    tag: 'SAÉ S1.06',
    title: 'Site Vitrine BUT Informatique IUT Arles',
    languages: ['HTML', 'CSS', 'Bootstrap'],
    description:
      "Site vitrine présentant le BUT Informatique du site d'Arles (IUT Aix-Marseille). Présentation de la formation, compétences, parcours, métiers et SAÉ.",
    github: 'https://github.com/alanajar/site_pour_amu',
    image: imgSiteAmu,
    video: null,
    accent: '#6366f1',
    emoji: '🌐',
  },
  {
    id: 'todo-list',
    tag: 'Projet perso',
    title: 'Application To-Do List',
    languages: ['TypeScript', 'React', 'JavaScript', 'CSS'],
    description:
      "Application de gestion de tâches développée avec React et TypeScript. Interface moderne avec Vite comme bundler.",
    github: 'https://github.com/alanajar/mon_to_do_list',
    image: imgTodo,
    video: null,
    accent: '#f59e0b',
    emoji: '✅',
  },
]

const FILTERS = [
  { label: 'Tous', match: () => true },
  { label: 'C / C++', match: (p) => p.languages.some((l) => l === 'C++' || l === 'C') },
  { label: 'Python', match: (p) => p.languages.includes('Python') },
  { label: 'Bases de données', match: (p) => p.languages.includes('SQL') },
  { label: 'Web', match: (p) => p.languages.some((l) => ['HTML', 'CSS', 'React', 'TypeScript'].includes(l)) },
]

function youtubeId(url) {
  const m = typeof url === 'string' && url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return m ? m[1] : null
}

const isFileVideo = (video) => Boolean(video) && !youtubeId(video)

// ─── Petits composants ──────────────────────────────────────────────────────

function LanguageBadge({ lang }) {
  const color = LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Default
  return (
    <span
      className="text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1.5"
      style={{ background: color + '18', color: color === '#555555' ? '#9ca3af' : color, border: '1px solid ' + color + '33' }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {lang}
    </span>
  )
}

function VideoPlaceholder({ project }) {
  return (
    <div
      className="w-full aspect-video rounded-xl flex flex-col items-center justify-center gap-3 text-center px-6"
      style={{
        background: `radial-gradient(circle at 50% 40%, ${project.accent}26, transparent 70%), rgba(255,255,255,0.02)`,
        border: `1px dashed ${project.accent}55`,
      }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: project.accent + '22', border: `1px solid ${project.accent}55` }}
      >
        <Film size={24} style={{ color: project.accent }} />
      </div>
      <p className="text-slate-300 text-sm font-medium">Démo vidéo bientôt disponible</p>
      <p className="text-slate-500 text-xs">La vidéo de présentation de ce projet arrive prochainement.</p>
    </div>
  )
}

function VideoPlayer({ project }) {
  const id = youtubeId(project.video)
  if (!project.video) return <VideoPlaceholder project={project} />
  if (id) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
          title={`Démo — ${project.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <video
      src={project.video}
      poster={project.image}
      controls
      playsInline
      preload="metadata"
      className="w-full aspect-video rounded-xl bg-black"
      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
    />
  )
}

// ─── Fenêtre de détail d'un projet ──────────────────────────────────────────

function ProjectModal({ project, onClose }) {
  const tabs = [
    { id: 'video', label: 'Vidéo', icon: Play },
    project.image && { id: 'image', label: 'Aperçu', icon: ImageIcon },
    project.pdf && { id: 'pdf', label: 'Rapport', icon: FileText },
  ].filter(Boolean)
  // Ouvre directement sur la vidéo si elle existe, sinon sur le premier contenu disponible
  const [tab, setTab] = useState(project.video || tabs.length === 1 ? 'video' : tabs[1].id)
  const closeRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(5,5,10,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, #13131d, #0d0d14)',
          border: `1px solid ${project.accent}44`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${project.accent}22`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }} />

        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono tracking-wider" style={{ color: project.accent }}>
                {project.tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">{project.title}</h3>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Fermer"
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              data-hover
            >
              <X size={18} />
            </button>
          </div>

          {/* Onglets */}
          <div className="inline-flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="relative flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                style={{ color: tab === id ? '#fff' : '#94a3b8' }}
                data-hover
              >
                {tab === id && (
                  <motion.span
                    layoutId="project-tab"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: project.accent + '33', border: `1px solid ${project.accent}55` }}
                  />
                )}
                <Icon size={14} className="relative" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>

          <div className="mb-6">
            {tab === 'video' && <VideoPlayer project={project} />}
            {tab === 'image' && (
              <a href={project.image} target="_blank" rel="noopener noreferrer" data-hover>
                <img
                  src={project.image}
                  alt={`Capture — ${project.title}`}
                  className="w-full max-h-[60vh] object-contain rounded-xl bg-black/40"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </a>
            )}
            {tab === 'pdf' && (
              <embed
                src={project.pdf}
                type="application/pdf"
                className="w-full rounded-xl"
                style={{ height: '60vh', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            )}
          </div>

          <p className="text-slate-300 leading-relaxed mb-5">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.languages.map((lang) => (
              <LanguageBadge key={lang} lang={lang} />
            ))}
          </div>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-primary" data-hover>
            <Github size={15} />
            Voir le code source
          </a>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

// ─── Carte projet ────────────────────────────────────────────────────────────

const canTilt = !LOW_PERF && typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

function ProjectCard({ project, index, onOpen }) {
  const videoRef = useRef(null)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const [spot, setSpot] = useState({ x: 50, y: 50 })
  const hasFileVideo = isFileVideo(project.video)

  const onMove = (e) => {
    if (!canTilt) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * 8)
    rotateX.set(-(py - 0.5) * 8)
    setSpot({ x: px * 100, y: py * 100 })
  }
  const onEnter = () => {
    if (hasFileVideo) videoRef.current?.play().catch(() => {})
  }
  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    if (hasFileVideo && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative rounded-2xl p-px cursor-pointer"
      onClick={() => onOpen(project)}
      data-hover
    >
      {/* Bordure dégradée qui s'illumine au survol */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${project.accent}aa, rgba(255,255,255,0.06) 40%, ${project.accent}55)` }}
      />

      <div className="relative h-full rounded-2xl overflow-hidden flex flex-col" style={{ background: '#0f0f17' }}>
        {/* Halo qui suit la souris */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{ background: `radial-gradient(400px circle at ${spot.x}% ${spot.y}%, ${project.accent}1f, transparent 60%)` }}
        />

        {/* Média */}
        <div className="relative aspect-video overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${project.accent}55, transparent 60%), radial-gradient(circle at 70% 80%, ${project.accent}33, transparent 60%), #12121c`,
              }}
            >
              <span className="text-6xl transition-transform duration-500 group-hover:scale-110">{project.emoji}</span>
            </div>
          )}

          {hasFileVideo && (
            <video
              ref={videoRef}
              src={project.video}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}

          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0f0f17 0%, transparent 55%)' }} />

          {/* Badges */}
          <span
            className="absolute top-3 left-3 text-[11px] font-mono px-2.5 py-1 rounded-full backdrop-blur-md"
            style={{ background: 'rgba(0,0,0,0.5)', color: project.accent, border: `1px solid ${project.accent}55` }}
          >
            {project.tag}
          </span>
          <span
            className="absolute top-3 right-3 text-[11px] px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1"
            style={{ background: 'rgba(0,0,0,0.5)', color: project.video ? '#fff' : '#94a3b8', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            {project.video ? <Play size={11} fill="currentColor" /> : <Film size={11} />}
            {project.video ? 'Démo vidéo' : 'Vidéo bientôt'}
          </span>

          {/* Bouton lecture au survol */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md scale-75 group-hover:scale-100 transition-transform duration-300"
              style={{ background: project.accent + 'cc', boxShadow: `0 0 30px ${project.accent}88` }}
            >
              <Play size={22} className="text-white ml-0.5" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Texte */}
        <div className="relative flex flex-col flex-1 p-5 pt-3">
          <h3 className="text-white font-semibold text-lg leading-snug mb-2">{project.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.languages.slice(0, 4).map((lang) => (
              <LanguageBadge key={lang} lang={lang} />
            ))}
            {project.languages.length > 4 && (
              <span className="text-[11px] px-2 py-0.5 rounded-md text-slate-400" style={{ background: 'rgba(255,255,255,0.05)' }}>
                +{project.languages.length - 4}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm font-medium" style={{ color: project.accent }}>
              Voir le projet
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Code source de ${project.title} sur GitHub`}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              data-hover
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
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
  const [filter, setFilter] = useState(FILTERS[0].label)
  const [selected, setSelected] = useState(null)
  const closeModal = useCallback(() => setSelected(null), [])

  const active = FILTERS.find((f) => f.label === filter)
  const visibleProjects = PROJECTS.filter(active.match)

  return (
    <section id="projects" className="relative z-10 py-28">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Projets</SectionLabel>

        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mes <span className="gradient-text">projets</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Projets académiques et personnels — cliquez sur une carte pour voir la démo, les captures et le code.
          </p>
        </motion.div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map(({ label }) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className="relative text-sm px-4 py-2 rounded-full transition-colors"
              style={{ color: filter === label ? '#fff' : '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
              data-hover
            >
              {filter === label && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.5), rgba(6,182,212,0.35))' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        {/* Cartes */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence>
            {visibleProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onOpen={setSelected} />
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a href="https://github.com/alanajar" target="_blank" rel="noopener noreferrer" className="btn-outline" data-hover>
            <Github size={16} />
            Voir tous les projets sur GitHub
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal key={selected.id} project={selected} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  )
}
