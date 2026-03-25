import { Github, Mail, Heart } from 'lucide-react'
import photo from '../assets/photo.jpg'

export default function Footer() {
  return (
    <footer
      className="relative z-10 border-t py-10 mt-0"
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,10,15,0.9)' }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
            style={{ boxShadow: '0 0 0 1px #4f46e5' }}
          >
            <img src={photo} alt="Ala NAJAR" className="w-full h-full object-cover object-top" />
          </div>
          <span className="text-slate-400 text-sm">Ala NAJAR</span>
        </div>

        <p className="text-slate-500 text-sm flex items-center gap-1">
          contact 
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/alanajar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
            data-hover
          >
            <Github size={18} />
          </a>
          <a
            href="mailto:alanajar9@gmail.com"
            className="text-slate-400 hover:text-white transition-colors"
            data-hover
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
