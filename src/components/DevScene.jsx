import { useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { CODE_LINES, CODE_LENGTH } from '../utils/devCode'

const TYPING_SPEED = 28 // caractères par seconde
const HOLD_TIME = 3 // pause (s) une fois le code entièrement tapé
const CYCLE = CODE_LENGTH / TYPING_SPEED + HOLD_TIME

const TECHS = [
  { name: 'Python', color: '#60a5fa' },
  { name: 'C++', color: '#818cf8' },
  { name: 'JavaScript', color: '#facc15' },
  { name: 'PHP', color: '#a78bfa' },
  { name: 'SQL', color: '#22d3ee' },
  { name: 'Git', color: '#fb923c' },
  { name: 'Linux', color: '#e2e8f0' },
  { name: 'Docker', color: '#38bdf8' },
  { name: 'React', color: '#67e8f9' },
  { name: 'UML', color: '#34d399' },
]

const SYMBOLS = ['{ }', '</>', '=>', ';', '#', '01', '( )', '[ ]', '&&', '!=']

const MONO = '"JetBrains Mono", "Fira Code", Consolas, monospace'

// ---------- Textures dessinées sur un <canvas> 2D (aucun fichier à charger) ----------

function makeCanvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d'), width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function makeLabelTexture(text, color) {
  return makeCanvasTexture(320, 112, (ctx, w, h) => {
    ctx.beginPath()
    ctx.roundRect(6, 6, w - 12, h - 12, 50)
    ctx.fillStyle = 'rgba(15,15,25,0.85)'
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = color
    ctx.stroke()
    ctx.font = `bold 44px ${MONO}`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2 + 2)
  })
}

function makeSymbolTexture(text) {
  return makeCanvasTexture(256, 128, (ctx, w, h) => {
    ctx.font = `bold 84px ${MONO}`
    ctx.fillStyle = '#a5b4fc'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2)
  })
}

const SCREEN_W = 1024
const SCREEN_H = 640
const HEADER_H = 64
const LINE_H = 36

// Dessine l'éditeur de code avec les `chars` premiers caractères tapés
function drawEditor(ctx, chars, cursorOn) {
  ctx.fillStyle = '#0d1117'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)

  // Barre de titre + onglet
  ctx.fillStyle = '#161b22'
  ctx.fillRect(0, 0, SCREEN_W, HEADER_H)
  ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(32 + i * 30, HEADER_H / 2, 9, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill()
  })
  ctx.fillStyle = '#0d1117'
  ctx.fillRect(140, 14, 230, HEADER_H - 14)
  ctx.font = `22px ${MONO}`
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#facc15'
  ctx.fillText('JS', 158, HEADER_H / 2 + 6)
  ctx.fillStyle = '#cbd5e1'
  ctx.fillText('developpeur.js', 192, HEADER_H / 2 + 6)

  ctx.font = `24px ${MONO}`
  const charW = ctx.measureText('M').width
  let remaining = chars
  let cursorX = 80
  let cursorY = HEADER_H + 30

  for (let i = 0; i < CODE_LINES.length; i++) {
    const y = HEADER_H + 30 + i * LINE_H
    ctx.fillStyle = '#475569'
    ctx.textAlign = 'right'
    ctx.fillText(String(i + 1), 52, y)
    ctx.textAlign = 'left'

    if (remaining <= 0) continue
    let x = 80
    for (const [text, color] of CODE_LINES[i]) {
      if (remaining <= 0) break
      const shown = text.slice(0, remaining)
      ctx.fillStyle = color
      ctx.fillText(shown, x, y)
      x += shown.length * charW
      remaining -= shown.length
    }
    cursorX = x
    cursorY = y
    remaining -= 1 // retour à la ligne
  }

  if (cursorOn) {
    ctx.fillStyle = '#06b6d4'
    ctx.fillRect(cursorX + 2, cursorY - 14, 3, 28)
  }
}

// ---------- Objets 3D ----------

function Screen({ onType }) {
  const texture = useMemo(() => makeCanvasTexture(SCREEN_W, SCREEN_H, () => {}), [])
  const last = useRef('')
  const material = useRef()

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state) => {
    const t = state.clock.elapsedTime % CYCLE
    const chars = Math.min(CODE_LENGTH, Math.floor(t * TYPING_SPEED))
    const cursorOn = Math.floor(state.clock.elapsedTime * 2) % 2 === 0
    const key = chars + '-' + cursorOn
    if (key === last.current) return // on ne redessine que si quelque chose change
    const prevChars = Number(last.current.split('-')[0])
    last.current = key
    if (chars > prevChars) onType()
    const map = material.current.map
    drawEditor(map.image.getContext('2d'), chars, cursorOn)
    map.needsUpdate = true
  })

  return (
    <mesh position={[0, 1.02, 0.037]}>
      <planeGeometry args={[2.8, 1.75]} />
      <meshBasicMaterial ref={material} map={texture} toneMapped={false} />
    </mesh>
  )
}

// Clavier : une seule InstancedMesh, les touches s'allument quand le code est tapé
const KEY_COLS = 14
const KEY_ROWS = 5
const KEY_COUNT = KEY_COLS * KEY_ROWS
const KEY_BASE = new THREE.Color('#1e1b2e')
const KEY_GLOW = new THREE.Color('#06b6d4')

function Keyboard({ pressRef }) {
  const ref = useRef()
  const glowRef = useRef(new Float32Array(KEY_COUNT))
  const color = useMemo(() => new THREE.Color(), [])

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    for (let r = 0; r < KEY_ROWS; r++) {
      for (let c = 0; c < KEY_COLS; c++) {
        const i = r * KEY_COLS + c
        dummy.position.set((c - (KEY_COLS - 1) / 2) * 0.19, 0, -0.8 + r * 0.19)
        dummy.updateMatrix()
        ref.current.setMatrixAt(i, dummy.matrix)
        ref.current.setColorAt(i, KEY_BASE)
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.instanceColor.needsUpdate = true
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const glow = glowRef.current
    // Touches "pressées" depuis la dernière frame
    while (pressRef.current > 0) {
      glow[Math.floor(Math.random() * KEY_COUNT)] = 1
      pressRef.current--
    }
    let changed = false
    for (let i = 0; i < KEY_COUNT; i++) {
      if (glow[i] <= 0) continue
      glow[i] = Math.max(0, glow[i] - delta * 3)
      ref.current.setColorAt(i, color.copy(KEY_BASE).lerp(KEY_GLOW, glow[i]))
      changed = true
    }
    if (changed) ref.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, KEY_COUNT]} position={[0, 0.075, 0]}>
      <boxGeometry args={[0.16, 0.03, 0.16]} />
      <meshStandardMaterial roughness={0.6} />
    </instancedMesh>
  )
}

function Laptop() {
  const pressRef = useRef(0)
  const metal = <meshStandardMaterial color="#2b2a3d" metalness={0.4} roughness={0.35} />

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0, -0.35]}>
        <boxGeometry args={[3.1, 0.12, 2.1]} />
        {metal}
      </mesh>
      <Keyboard pressRef={pressRef} />
      {/* Pavé tactile */}
      <mesh position={[0, 0.061, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.95, 0.5]} />
        <meshStandardMaterial color="#232233" roughness={0.3} />
      </mesh>

      {/* Écran, articulé à l'arrière de la base */}
      <group position={[0, 0.06, -1.38]} rotation={[-0.22, 0, 0]}>
        <mesh position={[0, 1.02, 0]}>
          <boxGeometry args={[3.1, 2.04, 0.07]} />
          {metal}
        </mesh>
        <Screen onType={() => pressRef.current++} />
      </group>

      {/* Lueur de l'écran sur le clavier */}
      <pointLight position={[0, 1, 0.3]} intensity={2.5} distance={4} color="#06b6d4" />
    </group>
  )
}

function TechLabel({ tech, angle, radius }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const texture = useMemo(() => makeLabelTexture(tech.name, tech.color), [tech])
  useEffect(() => () => texture.dispose(), [texture])

  useFrame((_, delta) => {
    const target = hovered ? 1.35 : 1
    const s = THREE.MathUtils.damp(ref.current.scale.y / 0.43, target, 8, delta)
    ref.current.scale.set(1.23 * s, 0.43 * s, 1)
  })

  return (
    <sprite
      ref={ref}
      position={[Math.cos(angle) * radius, 0.9 + Math.sin(angle * 2) * 0.45, Math.sin(angle) * radius]}
      scale={[1.23, 0.43, 1]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  )
}

function TechOrbit() {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.18
  })
  return (
    <group ref={ref}>
      {TECHS.map((tech, i) => (
        <TechLabel key={tech.name} tech={tech} angle={(i / TECHS.length) * Math.PI * 2} radius={3.3} />
      ))}
    </group>
  )
}

// Positions tirées une seule fois au chargement du module
const SYMBOL_LAYOUT = SYMBOLS.map((text, i) => ({
  text,
  position: [
    (i % 2 ? 1 : -1) * (4.2 + Math.random() * 1.5),
    -0.5 + Math.random() * 3.5,
    -2.5 - Math.random() * 2,
  ],
  speed: 0.4 + Math.random() * 0.4,
  offset: Math.random() * Math.PI * 2,
}))

function FloatingSymbols() {
  const items = useMemo(
    () => SYMBOL_LAYOUT.map((it) => ({ ...it, texture: makeSymbolTexture(it.text) })),
    [],
  )
  const refs = useRef([])

  useEffect(() => () => items.forEach((it) => it.texture.dispose()), [items])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    items.forEach((it, i) => {
      const s = refs.current[i]
      if (s) s.position.y = it.position[1] + Math.sin(t * it.speed + it.offset) * 0.3
    })
  })

  return items.map((it, i) => (
    <sprite key={i} ref={(el) => (refs.current[i] = el)} position={it.position} scale={[1, 0.5, 1]}>
      <spriteMaterial map={it.texture} transparent opacity={0.35} depthWrite={false} />
    </sprite>
  ))
}

// Légère inclinaison qui suit la souris + flottement, et mise à l'échelle sur petit écran
function Rig({ children }) {
  const ref = useRef()
  const { viewport } = useThree()
  const scale = Math.min(1, viewport.width / 8.5)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const g = ref.current
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.45 + Math.sin(t * 0.3) * 0.15, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.12, 3, delta)
    g.position.y = -0.9 + Math.sin(t * 0.8) * 0.06
  })

  return (
    <group ref={ref} scale={scale}>
      {children}
    </group>
  )
}

// active : false quand la scène n'est plus visible → la boucle de rendu s'arrête
// onFallback : appelé si le FPS reste trop bas → le parent bascule sur la version statique
export default function DevScene({ active = true, onFallback }) {
  const [dpr, setDpr] = useState(1.25)

  return (
    <Canvas
      camera={{ position: [0, 1, 7.5], fov: 45 }}
      style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(1.5)}
        onDecline={() => setDpr(1)}
        flipflops={3}
        onFallback={onFallback}
      />

      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#c7d2fe" />
      <pointLight position={[-4, 2, 3]} intensity={1.5} color="#7c3aed" />

      <Rig>
        <Laptop />
        <TechOrbit />
      </Rig>
      <FloatingSymbols />
    </Canvas>
  )
}
