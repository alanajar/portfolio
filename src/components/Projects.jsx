import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Star, GitFork, ExternalLink, Code2 } from 'lucide-react'

const LANGUAGE_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  C: '#555555',
  'C++': '#f34b7d',
  PHP: '#777bb4',
  HTML: '#e34c26',
  CSS: '#264de4',
  Dart: '#00b4ab',
  Java: '#b07219',
  Shell: '#89e051',
  SQL: '#e38c00',
  Default: '#6b7280',
}

const FEATURED_PROJECTS = [
  {
    id: 'nuit-info',
    name: 'Nuit de l\'Info 2025',
    description:
      'Hackathon international en Tunisie — défis techniques complexes résolus en une nuit, collaboration intensive en équipe, résolution de problématiques algorithmiques sous contrainte de temps.',
    topics: ['hackathon', 'teamwork', 'algorithmique'],
    language: 'JavaScript',
    gradient: 'from-indigo-600 to-cyan-500',
    repoSlug: 'nuit-info-2025',
    emoji: '🌙',
  },
  {
    id: 'programmation-systeme',
    name: 'Programmation Système',
    description:
      'Outils de gestion de données en C/C++ et Python avec optimisation de la gestion mémoire, structures de données avancées et algorithmes de tri/recherche.',
    topics: ['c', 'cpp', 'python', 'memory-management'],
    language: 'C++',
    gradient: 'from-violet-600 to-indigo-500',
    repoSlug: 'programmation-systeme',
    emoji: '⚙️',
  },
  {
    id: 'gestion-donnees',
    name: 'Gestion de Données',
    description:
      'Conception de schémas relationnels (Merise/UML) et requêtage SQL optimisé — modélisation, normalisation, requêtes complexes avec jointures et sous-requêtes.',
    topics: ['sql', 'postgresql', 'mysql', 'database'],
    language: 'SQL',
    gradient: 'from-cyan-600 to-teal-500',
    repoSlug: 'gestion-donnees',
    emoji: '🗄️',
  },
  {
    id: 'logique-applicative',
    name: 'Logique Applicative',
    description:
      'Développement de modules fonctionnels et algorithmes de traitement — logique métier, patterns de conception, modules réutilisables en Python et JavaScript.',
    topics: ['python', 'javascript', 'algorithms'],
    language: 'Python',
    gradient: 'from-amber-500 to-orange-600',
    repoSlug: 'logique-applicative',
    emoji: '🧩',
  },
]

function LanguageDot({ lang }) {
  const color = LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Default
  return (
    <span className="flex items-center gap-1.5 text-xs text-slate-400">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {lang}
    </span>
  )
}

function ProjectGradientCard({ project, repoData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const language = repoData?.language || project.language
  const description = repoData?.description || project.description
  const stars = repoData?.stargazers_count || 0
  const forks = repoData?.forks_count || 0
  const githubUrl = repoData?.html_url || `https://github.com/alanajar/${project.repoSlug}`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="project-card glass-card rounded-2xl overflow-hidden group"
    >
      {/* Gradient banner */}
      <div
        className={`relative h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <span className="text-6xl select-none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>
          {project.emoji}
        </span>
        {/* Language badge */}
        {language && (
          <div
            className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: (LANGUAGE_COLORS[language] || '#6b7280') + '33',
              border: '1px solid ' + (LANGUAGE_COLORS[language] || '#6b7280') + '66',
              color: LANGUAGE_COLORS[language] || '#9ca3af',
              backdropFilter: 'blur(8px)',
            }}
          >
            {language}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-indigo-300 transition-colors">
          {project.name}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{description}</p>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.topics.map(t => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
        </div>

        {/* Stats & links */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Star size={12} /> {stars}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <GitFork size={12} /> {forks}
            </span>
          </div>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            data-hover
          >
            <Github size={13} /> Voir sur GitHub
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function RepoCard({ repo, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass-card rounded-xl p-4 flex items-start gap-3 group hover:border-indigo-500/30 transition-all duration-300"
      data-hover
    >
      <Code2 size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors truncate">
          {repo.name}
        </p>
        {repo.description && (
          <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{repo.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {repo.language && <LanguageDot lang={repo.language} />}
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Star size={10} /> {repo.stargazers_count}
          </span>
        </div>
      </div>
      <ExternalLink size={12} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1" />
    </motion.a>
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
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true })

  useEffect(() => {
    fetch('https://api.github.com/users/alanajar/repos?sort=updated&per_page=20')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getRepoData = (slug) =>
    repos.find(r => r.name.toLowerCase().includes(slug.toLowerCase()))

  const otherRepos = repos.filter(
    r => !FEATURED_PROJECTS.some(p => r.name.toLowerCase().includes(p.repoSlug.toLowerCase()))
  )

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
            Projets académiques et personnels — données en temps réel via l'API GitHub.
          </p>
        </motion.div>

        {/* Featured projects */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
          {FEATURED_PROJECTS.map((project, i) => (
            <ProjectGradientCard
              key={project.id}
              project={project}
              repoData={getRepoData(project.repoSlug)}
            />
          ))}
        </div>

        {/* All GitHub repos */}
        {!loading && otherRepos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Github size={18} className="text-slate-400" />
              Tous les dépôts GitHub
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherRepos.map((repo, i) => (
                <RepoCard key={repo.id} repo={repo} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Chargement des dépôts GitHub...
            </div>
          </div>
        )}

        {!loading && repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
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
        )}
      </div>
    </section>
  )
}
