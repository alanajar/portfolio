import { useRef, useMemo, useState, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedTorus() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * 0.3
    ref.current.rotation.y = state.clock.elapsedTime * 0.2
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.8, 0.4, 24, 64]} />
      <meshStandardMaterial
        color="#4f46e5"
        emissive="#4f46e5"
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

function AnimatedTorusWireframe() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = -state.clock.elapsedTime * 0.15
    ref.current.rotation.z = state.clock.elapsedTime * 0.25
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.8, 0.12, 12, 64]} />
      <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.5} />
    </mesh>
  )
}

// Une seule InstancedMesh (1 draw call) au lieu de 12 meshes séparés
function FloatingSpheres() {
  const count = 12
  const spheres = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4 - 2,
      ],
      scale: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? '#4f46e5' : '#06b6d4',
    }))
  }, [])

  const ref = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useLayoutEffect(() => {
    const color = new THREE.Color()
    spheres.forEach((s, i) => ref.current.setColorAt(i, color.set(s.color)))
    ref.current.instanceColor.needsUpdate = true
  }, [spheres])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    spheres.forEach((s, i) => {
      dummy.position.set(
        s.position[0] + Math.cos(t * s.speed * 0.7 + s.offset) * 0.3,
        s.position[1] + Math.sin(t * s.speed + s.offset) * 0.5,
        s.position[2],
      )
      dummy.scale.setScalar(s.scale)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial />
    </instancedMesh>
  )
}

function Particles() {
  const count = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5
    }
    return pos
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#7c3aed" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// active : false quand le hero n'est plus visible → la boucle de rendu s'arrête
// onFallback : appelé si le FPS reste trop bas → le parent bascule sur un fond statique
export default function HeroScene({ active = true, onFallback }) {
  const [dpr, setDpr] = useState(1.25)

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(1.5)}
        onDecline={() => setDpr(1)}
        flipflops={3}
        onFallback={onFallback}
      />

      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#4f46e5" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#06b6d4" />

      <AnimatedTorus />
      <AnimatedTorusWireframe />
      <FloatingSpheres />
      <Particles />
    </Canvas>
  )
}
