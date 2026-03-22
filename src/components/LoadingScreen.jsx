import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import photo from '../assets/photo.jpg'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setDone(true)
            setTimeout(onComplete, 600)
          }, 200)
          return 100
        }
        return p + Math.random() * 12 + 3
      })
    }, 80)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
          style={{ background: '#0a0a0f' }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="mb-8"
          >
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 0 40px rgba(79,70,229,0.5), 0 0 0 2px #4f46e5' }}
            >
              <img src={photo} alt="Ala NAJAR" className="w-full h-full object-cover object-top" />
            </div>
          </motion.div>

          {/* Name */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm tracking-widest uppercase mb-10"
          >
            Ala NAJAR — Portfolio
          </motion.p>

          {/* Progress bar container */}
          <div className="w-64 h-px bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
                width: `${Math.min(progress, 100)}%`,
              }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Percentage */}
          <motion.p
            className="text-slate-500 text-xs mt-3 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
