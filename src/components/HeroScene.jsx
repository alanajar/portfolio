import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Torus, Sphere } from '@react-three/drei'
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
      <torusGeometry args={[1.8, 0.4, 32, 100]} />
      <meshStandardMaterial
        color="#4f46e5"
        emissive="#4f46e5"
        emissiveIntensity={0.3}
        wireframe={false}
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
      <torusGeometry args={[2.8, 0.12, 16, 80]} />
      <meshStandardMaterial
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={0.5}
        wireframe={true}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

function FloatingSpheres() {
  const spheres = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
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

  const refs = useRef(spheres.map(() => null))

  useFrame((state) => {
    refs.current.forEach((ref, i) => {
      if (!ref) return
      const s = spheres[i]
      ref.position.y = s.position[1] + Math.sin(state.clock.elapsedTime * s.speed + s.offset) * 0.5
      ref.position.x = s.position[0] + Math.cos(state.clock.elapsedTime * s.speed * 0.7 + s.offset) * 0.3
    })
  })

  return (
    <>
      {spheres.map((s, i) => (
        <mesh key={s.id} ref={el => (refs.current[i] = el)} position={s.position} scale={s.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </>
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
      <pointsMaterial
        size={0.05}
        color="#7c3aed"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#4f46e5" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#06b6d4" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#7c3aed" />

      <AnimatedTorus />
      <AnimatedTorusWireframe />
      <FloatingSpheres />
      <Particles />
    </Canvas>
  )
}
