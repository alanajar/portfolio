import { useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

// Scène "IA & développement" :
// - un réseau de neurones en forme de globe, traversé par des signaux lumineux
// - un noyau "IA" en icosaèdre entouré d'anneaux orbitaux
// - une pluie de code (0/1, symboles) en arrière-plan, façon Matrix
// - des fragments de code / IA qui flottent autour

const INDIGO = new THREE.Color('#6366f1')
const CYAN = new THREE.Color('#22d3ee')
const VIOLET = new THREE.Color('#a855f7')
const MONO = '"JetBrains Mono", "Fira Code", Consolas, monospace'

// ---------- Réseau de neurones (généré une fois au chargement du module) ----------

function buildNetwork(count, radius, neighbors) {
  const nodes = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    const len = radius * (0.85 + Math.random() * 0.3)
    nodes.push(new THREE.Vector3(Math.cos(theta) * r * len, y * len, Math.sin(theta) * r * len))
  }

  const edges = []
  const seen = new Set()
  const adjacency = nodes.map(() => [])
  nodes.forEach((a, i) => {
    const nearest = nodes
      .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
      .filter(({ j }) => j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, neighbors)
    nearest.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) return
      seen.add(key)
      edges.push([i, j])
      adjacency[i].push(j)
      adjacency[j].push(i)
    })
  })

  const palette = [INDIGO, CYAN, VIOLET]
  const baseColors = nodes.map(() => palette[Math.floor(Math.random() * palette.length)].clone())
  return { nodes, edges, adjacency, baseColors }
}

const NETWORK = buildNetwork(170, 2.6, 3)

// Pulses initiaux : chacun part d'un nœud vers un voisin
function makePulses(count) {
  return Array.from({ length: count }, () => {
    const from = Math.floor(Math.random() * NETWORK.nodes.length)
    const list = NETWORK.adjacency[from]
    return {
      from,
      to: list[Math.floor(Math.random() * list.length)],
      t: Math.random(),
      speed: 0.6 + Math.random() * 0.9,
    }
  })
}
const PULSES_FULL = makePulses(80)
const PULSES_LITE = PULSES_FULL.slice(0, 35)

function makeDotTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.8)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

function NeuralGlobe({ lite }) {
  const { nodes, edges, adjacency, baseColors } = NETWORK
  const pulses = lite ? PULSES_LITE : PULSES_FULL

  const dot = useMemo(() => makeDotTexture(), [])
  const nodePositions = useMemo(() => new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z])), [nodes])
  const edgePositions = useMemo(
    () => new Float32Array(edges.flatMap(([a, b]) => [...nodes[a].toArray(), ...nodes[b].toArray()])),
    [nodes, edges],
  )
  const nodeColors = useMemo(() => new Float32Array(nodes.length * 3), [nodes])
  const pulsePositions = useMemo(() => new Float32Array(pulses.length * 3), [pulses])
  const pulseState = useRef(pulses.map((p) => ({ ...p })))
  const glow = useRef(new Float32Array(nodes.length))

  const nodesRef = useRef()
  const pulsesRef = useRef()
  const tmp = useMemo(() => new THREE.Color(), [])

  useEffect(() => () => dot.dispose(), [dot])

  useLayoutEffect(() => {
    pulseState.current = pulses.map((p) => ({ ...p }))
  }, [pulses])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const g = glow.current

    // Déplacement des signaux le long des connexions
    const pulsePos = pulsesRef.current.geometry.attributes.position
    pulseState.current.forEach((p, i) => {
      p.t += delta * p.speed
      if (p.t >= 1) {
        g[p.to] = 1 // le neurone d'arrivée "s'allume"
        const next = adjacency[p.to].filter((n) => n !== p.from)
        p.from = p.to
        p.to = next.length ? next[Math.floor(Math.random() * next.length)] : adjacency[p.to][0]
        p.t = 0
      }
      const a = nodes[p.from]
      const b = nodes[p.to]
      pulsePos.setXYZ(i, a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, a.z + (b.z - a.z) * p.t)
    })
    pulsePos.needsUpdate = true

    // Couleur des neurones : base + éclat qui retombe
    const colors = nodesRef.current.geometry.attributes.color
    for (let i = 0; i < nodes.length; i++) {
      g[i] = Math.max(0, g[i] - delta * 1.5)
      tmp.copy(baseColors[i]).multiplyScalar(0.55).lerp(CYAN, g[i] * 0.6).addScalar(g[i] * 0.5)
      colors.setXYZ(i, tmp.r, tmp.g, tmp.b)
    }
    colors.needsUpdate = true
  })

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>

      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          map={dot}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      <points ref={pulsesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          map={dot}
          color="#a5f3fc"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

// Noyau "IA" + anneaux orbitaux
function AICore() {
  const core = useRef()
  const ring1 = useRef()
  const ring2 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    core.current.rotation.set(t * 0.4, t * 0.3, 0)
    core.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05)
    ring1.current.rotation.z = t * 0.5
    ring2.current.rotation.z = -t * 0.35
  })

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
      <group rotation={[Math.PI / 2.4, 0, 0]}>
        <mesh ref={ring1}>
          <torusGeometry args={[1.35, 0.012, 8, 96]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
        </mesh>
      </group>
      <group rotation={[Math.PI / 1.7, 0.6, 0]}>
        <mesh ref={ring2}>
          <torusGeometry args={[1.6, 0.01, 8, 96]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  )
}

// ---------- Pluie de code (une seule InstancedMesh + shader) ----------

const RAIN_CHARS = '01{}<>/;=()[]#$&|+*01010110'

function makeRainTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 64, 1024)
  ctx.font = `bold 44px ${MONO}`
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < 20; i++) {
    ctx.fillText(RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)], 32, 26 + i * 51.2)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

const RAIN_COUNT = 46
const RAIN_LAYOUT = Array.from({ length: RAIN_COUNT }, (_, i) => ({
  x: -13 + (i / (RAIN_COUNT - 1)) * 26 + (Math.random() - 0.5) * 0.4,
  y: (Math.random() - 0.5) * 4,
  z: -7 - Math.random() * 4,
  speed: 0.12 + Math.random() * 0.25,
  offset: Math.random(),
}))

const rainVertex = /* glsl */ `
  attribute float aSpeed;
  attribute float aOffset;
  varying vec2 vUv;
  varying float vSpeed;
  varying float vOffset;
  void main() {
    vUv = uv;
    vSpeed = aSpeed;
    vOffset = aOffset;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

const rainFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  varying vec2 vUv;
  varying float vSpeed;
  varying float vOffset;
  void main() {
    float glyph = texture2D(uMap, vec2(vUv.x, vUv.y * 2.0 + vOffset * 7.0 + floor(uTime * 6.0 * vSpeed) * 0.05)).r;
    float head = 1.0 - fract(uTime * vSpeed + vOffset);
    float d = fract(vUv.y - head);
    float trail = pow(1.0 - d, 5.0);
    vec3 color = mix(vec3(0.39, 0.4, 0.95), vec3(0.13, 0.83, 0.93), trail);
    color = mix(color, vec3(1.0), smoothstep(0.97, 1.0, 1.0 - d));
    gl_FragColor = vec4(color, glyph * trail * 0.75);
  }
`

function CodeRain() {
  const ref = useRef()
  const material = useRef()
  const uniforms = useMemo(() => ({ uMap: { value: makeRainTexture() }, uTime: { value: 0 } }), [])
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.32, 9)
    geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(new Float32Array(RAIN_LAYOUT.map((r) => r.speed)), 1))
    geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(RAIN_LAYOUT.map((r) => r.offset)), 1))
    return geo
  }, [])

  useEffect(() => () => {
    geometry.dispose()
    uniforms.uMap.value.dispose()
  }, [geometry, uniforms])

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    RAIN_LAYOUT.forEach((r, i) => {
      dummy.position.set(r.x, r.y, r.z)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((state) => {
    material.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, RAIN_COUNT]} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={rainVertex}
        fragmentShader={rainFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}

// ---------- Fragments de code / IA flottants ----------

const SNIPPETS = [
  { text: 'model.fit(X, y)', color: '#22d3ee' },
  { text: 'import numpy as np', color: '#60a5fa' },
  { text: 'def train(data):', color: '#c792ea' },
  { text: 'SELECT * FROM users', color: '#34d399' },
  { text: 'git push origin main', color: '#fb923c' },
  { text: 'npm run dev', color: '#facc15' },
  { text: 'accuracy: 0.97', color: '#a5f3fc' },
  { text: '<App />', color: '#67e8f9' },
  { text: 'while (true) { learn(); }', color: '#a78bfa' },
  { text: 'neurons = 128', color: '#818cf8' },
]

const SNIPPET_LAYOUT = SNIPPETS.map((s, i) => ({
  ...s,
  x: (i % 2 ? 1 : -1) * (3.6 + Math.random() * 2.8),
  y: -3 + (i / SNIPPETS.length) * 6,
  z: -1.5 - Math.random() * 2.5,
  speed: 0.15 + Math.random() * 0.15,
}))

function makeSnippetTexture(text, color) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.font = `600 34px ${MONO}`
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 8, 34)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function FloatingSnippets() {
  const items = useMemo(
    () => SNIPPET_LAYOUT.map((s) => ({ ...s, texture: makeSnippetTexture(s.text, s.color) })),
    [],
  )
  const refs = useRef([])

  useEffect(() => () => items.forEach((it) => it.texture.dispose()), [items])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    items.forEach((it, i) => {
      const sprite = refs.current[i]
      if (!sprite) return
      // montent lentement, réapparaissent en bas, avec fondu aux extrémités
      const y = ((it.y + 3.5 + t * it.speed) % 7) - 3.5
      sprite.position.y = y
      sprite.material.opacity = 0.6 * Math.min(1, (3.5 - Math.abs(y)) / 1.2)
    })
  })

  return items.map((it, i) => (
    <sprite key={it.text} ref={(el) => (refs.current[i] = el)} position={[it.x, it.y, it.z]} scale={[3.2, 0.4, 1]}>
      <spriteMaterial map={it.texture} transparent depthWrite={false} />
    </sprite>
  ))
}

// ---------- Caméra qui suit la souris (écoute sur window : le texte du hero est au-dessus du canvas) ----------

function MouseRig({ children }) {
  const group = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const g = group.current
    const t = state.clock.elapsedTime
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, t * 0.08 + mouse.current.x * 0.4, 2, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, mouse.current.y * 0.25, 2, delta)
  })

  return <group ref={group}>{children}</group>
}

// active : false quand le hero n'est plus visible → la boucle de rendu s'arrête
// lite : version allégée (machine lente) — la scène reste visible, avec moins d'éléments
export default function HeroScene({ active = true, lite: initialLite = false }) {
  const [lite, setLite] = useState(initialLite)
  const [dpr, setDpr] = useState(initialLite ? 1 : 1.25)

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 55 }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
    >
      <PerformanceMonitor
        onIncline={() => !lite && setDpr(1.5)}
        onDecline={() => setDpr(1)}
        flipflops={3}
        onFallback={() => setLite(true)}
      />

      {!lite && <CodeRain />}
      <MouseRig>
        <NeuralGlobe lite={lite} />
        <AICore />
      </MouseRig>
      {!lite && <FloatingSnippets />}
    </Canvas>
  )
}
