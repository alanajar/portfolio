import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Mail, Github, Phone, MapPin, Send, CheckCircle, Loader, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(79,70,229,0.4), transparent)' }} />
      <span className="text-xs font-medium tracking-widest uppercase text-slate-500">{children}</span>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(79,70,229,0.4), transparent)' }} />
    </div>
  )
}

function ContactInfo() {
  const items = [
    {
      icon: Mail,
      label: 'Email',
      value: 'alanajar9@gmail.com',
      href: 'mailto:alanajar9@gmail.com',
      color: '#4f46e5',
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: '07 43 57 16 40',
      href: 'tel:+33743571640',
      color: '#06b6d4',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/alanajar',
      href: 'https://github.com/alanajar',
      color: '#7c3aed',
    },
    {
      icon: MapPin,
      label: 'Localisation',
      value: 'Arles — Mobilité Aix-en-Provence',
      href: null,
      color: '#d97706',
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {items.map(({ icon: Icon, label, value, href, color }) => (
        <div
          key={label}
          className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:scale-[1.02] transition-all duration-200"
          style={{ borderColor: color + '22' }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: color + '18', border: '1px solid ' + color + '33' }}
          >
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <p className="text-slate-500 text-xs">{label}</p>
            {href ? (
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-white text-sm hover:text-indigo-300 transition-colors font-medium"
                data-hover
              >
                {value}
              </a>
            ) : (
              <p className="text-white text-sm font-medium">{value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const formRef = useRef(null)

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('loading')

    emailjs.sendForm(
      'service_vci9bqh',
      'template_0las08g',
      formRef.current,
      '1MyqoO-SqkxsIUhJc'
    )
      .then(() => {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
        setTimeout(() => setStatus('idle'), 4000)
      })
      .catch(() => {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 4000)
      })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Votre nom</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Ala NAJAR"
            className="form-input"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1.5 block">Votre email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="vous@exemple.fr"
            className="form-input"
          />
        </div>
      </div>
      <div>
        <label className="text-slate-400 text-xs mb-1.5 block">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Parlez-moi de votre projet ou opportunité d'alternance..."
          className="form-input resize-none"
        />
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.button
            key="idle"
            type="submit"
            className="btn-primary justify-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-hover
          >
            <Send size={15} />
            Envoyer le message
          </motion.button>
        )}

        {status === 'loading' && (
          <motion.div
            key="loading"
            className="btn-primary justify-center w-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader size={15} className="animate-spin" />
            Envoi en cours...
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-medium text-green-400"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle size={16} />
            Message envoyé ! À bientôt 👋
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-medium text-red-400"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <AlertCircle size={16} />
            Erreur lors de l'envoi. Réessayez ou contactez-moi par email.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section
      id="contact"
      className="relative z-10 py-28"
      style={{ background: 'rgba(79,70,229,0.03)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Contact</SectionLabel>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Travaillons <span className="gradient-text">ensemble</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Disponible pour une alternance à partir de septembre 2026. N'hésitez pas à me contacter !
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="glass-card rounded-2xl p-6 mb-6" style={{ borderColor: 'rgba(79,70,229,0.2)' }}>
              <h3 className="text-white font-semibold mb-2 text-lg">🎯 Ce que je recherche</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Une alternance en <strong className="text-indigo-300">Conception & Développement d'Applications</strong> sur
                la région d'Aix-en-Provence / Marseille. Passionné, rigoureux et toujours prêt à apprendre.
              </p>
            </div>
            <ContactInfo />
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
            style={{ borderColor: 'rgba(79,70,229,0.15)' }}
          >
            <h3 className="text-white font-semibold mb-5 text-lg">Envoyer un message</h3>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
