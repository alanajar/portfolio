import { useEffect, useRef } from 'react'

// Version canvas 2D du réseau de neurones (sans WebGL) : un globe de neurones
// projeté en perspective, qui tourne et suit la souris, traversé par des signaux.
// Utilisée quand le navigateur n'a pas WebGL (accélération matérielle désactivée…).

const COUNT = 110
const NEIGHBORS = 3
const PULSES = 40
const COLORS = ['#6366f1', '#22d3ee', '#a855f7']

function buildNetwork() {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const nodes = Array.from({ length: COUNT }, (_, i) => {
    const y = 1 - (i / (COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const len = 0.85 + Math.random() * 0.3
    return {
      x: Math.cos(golden * i) * r * len,
      y: y * len,
      z: Math.sin(golden * i) * r * len,
      color: COLORS[i % COLORS.length],
      glow: 0,
    }
  })
  const adjacency = nodes.map(() => [])
  const edges = []
  const seen = new Set()
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, NEIGHBORS)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (seen.has(key)) return
        seen.add(key)
        edges.push([i, j])
        adjacency[i].push(j)
        adjacency[j].push(i)
      })
  })
  const pulses = Array.from({ length: PULSES }, () => {
    const from = Math.floor(Math.random() * COUNT)
    return { from, to: adjacency[from][0], t: Math.random(), speed: 0.6 + Math.random() * 0.8 }
  })
  return { nodes, edges, adjacency, pulses }
}

export default function NeuralCanvas2D({ active = true }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { nodes, edges, adjacency, pulses } = buildNetwork()
    const mouse = { x: 0, y: 0 }
    const rot = { x: 0, y: 0 }
    let width = 0
    let height = 0
    let frame
    let last = performance.now()
    const projected = nodes.map(() => ({ x: 0, y: 0, z: 0, s: 1 }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    const project = (p, out, radius, cx, cy) => {
      const cosY = Math.cos(rot.y)
      const sinY = Math.sin(rot.y)
      const cosX = Math.cos(rot.x)
      const sinX = Math.sin(rot.x)
      const x1 = p.x * cosY - p.z * sinY
      const z1 = p.x * sinY + p.z * cosY
      const y1 = p.y * cosX - z1 * sinX
      const z2 = p.y * sinX + z1 * cosX
      const s = 3 / (3 + z2) // perspective
      out.x = cx + x1 * radius * s
      out.y = cy + y1 * radius * s
      out.z = z2
      out.s = s
    }

    const draw = (now) => {
      frame = requestAnimationFrame(draw)
      if (!activeRef.current) return
      const delta = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = now / 1000

      rot.y += (t * 0.08 + mouse.x * 0.4 - rot.y) * Math.min(1, delta * 2)
      rot.x += (mouse.y * 0.25 - rot.x) * Math.min(1, delta * 2)

      const radius = Math.min(width, height) * 0.36
      const cx = width / 2
      const cy = height / 2
      nodes.forEach((n, i) => project(n, projected[i], radius, cx, cy))

      ctx.clearRect(0, 0, width, height)

      // connexions
      ctx.lineWidth = 1
      for (const [a, b] of edges) {
        const pa = projected[a]
        const pb = projected[b]
        const depth = (2 - (pa.z + pb.z) / 2) / 3 // plus proche = plus visible
        ctx.strokeStyle = `rgba(99,102,241,${0.08 + depth * 0.3})`
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.stroke()
      }

      // signaux
      ctx.fillStyle = '#a5f3fc'
      ctx.shadowColor = '#22d3ee'
      ctx.shadowBlur = 12
      for (const p of pulses) {
        p.t += delta * p.speed
        if (p.t >= 1) {
          nodes[p.to].glow = 1
          const next = adjacency[p.to].filter((n) => n !== p.from)
          p.from = p.to
          p.to = next.length ? next[Math.floor(Math.random() * next.length)] : adjacency[p.to][0]
          p.t = 0
        }
        const a = projected[p.from]
        const b = projected[p.to]
        ctx.beginPath()
        ctx.arc(a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, 2.2 * a.s, 0, Math.PI * 2)
        ctx.fill()
      }

      // neurones
      nodes.forEach((n, i) => {
        const p = projected[i]
        n.glow = Math.max(0, n.glow - delta * 1.5)
        ctx.shadowColor = n.color
        ctx.shadowBlur = 6 + n.glow * 14
        ctx.fillStyle = n.glow > 0.3 ? '#e0f2fe' : n.color
        ctx.globalAlpha = 0.45 + ((1 - p.z) / 2) * 0.55
        ctx.beginPath()
        ctx.arc(p.x, p.y, (2 + n.glow * 2.5) * p.s, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
