import { useEffect, useRef } from 'react'
import { LOW_PERF } from '../utils/performance'

const HOVER_SELECTOR = 'a, button, [data-hover]'

// Curseur personnalisé désactivé sur machines lentes et écrans tactiles
const ENABLED =
  !LOW_PERF && typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

export default function Cursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    if (!ENABLED) return
    const cursor = cursorRef.current
    const dot = dotRef.current
    let mouseX = 0, mouseY = 0
    let cursorX = 0, cursorY = 0
    let raf = 0

    document.documentElement.classList.add('has-custom-cursor')

    // transform (compositing GPU) au lieu de left/top (relayout à chaque frame)
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.12
      cursorY += (mouseY - cursorY) * 0.12
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`
      // La boucle s'arrête dès que le curseur a rattrapé la souris
      raf = Math.abs(mouseX - cursorX) + Math.abs(mouseY - cursorY) > 0.5
        ? requestAnimationFrame(animate)
        : 0
    }

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      if (!raf) raf = requestAnimationFrame(animate)
    }

    // Délégation : fonctionne aussi pour les éléments rendus après le montage
    const onOver = (e) => {
      cursor.classList.toggle('hovering', !!e.target.closest?.(HOVER_SELECTOR))
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  if (!ENABLED) return null

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  )
}
