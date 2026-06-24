// src/components/3D/Room.jsx
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "../../hooks/useIsMobile";

// Floating goal orb
function GoalOrb({ position, color, speed = 1, scale = 1 }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.4) * 0.3;
      meshRef.current.rotation.y += 0.005 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

// Ambient floating particles ring
function ParticleRing({ count = 120, radius = 5, isMobile }) {
  const reducedCount = isMobile ? Math.floor(count / 2) : count;
  const positions = useMemo(() => {
    const arr = new Float32Array(reducedCount * 3);
    for (let i = 0; i < reducedCount; i++) {
      const angle = (i / reducedCount) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 2;
      arr[i * 3]     = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, [reducedCount, radius]);

  const pointsRef = useRef();
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={reducedCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#7c3aed" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// Central vision sphere
function VisionSphere({ isMobile }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.4, isMobile ? 24 : 48, isMobile ? 24 : 48]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#3245ed"
        emissive="#1a0050"
        emissiveIntensity={0.5}
        distort={0.4}
        speed={1.5}
        roughness={0.1}
        metalness={0.6}
        transparent
        opacity={0.85}
      />
    </Sphere>
  );
}

// Scene composition
function Scene({ isMobile }) {
  const orbData = useMemo(() => [
    { position: [-3.5, 1.5, -2], color: "#f59e0b", speed: 0.8, scale: 0.55 },
    { position: [3.5, -1,   -1], color: "#7c3aed", speed: 1.2, scale: 0.45 },
    { position: [-2,  -2,   1 ], color: "#06b6d4", speed: 0.9, scale: 0.5  },
    { position: [2.5,  2,  -3 ], color: "#10b981", speed: 1.1, scale: 0.4  },
  ], []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#7c3aed" />
      <pointLight position={[-5, -5, -3]} intensity={1} color="#3b82f6" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#f59e0b" />

      <Stars
        radius={isMobile ? 60 : 100}
        depth={50}
        count={isMobile ? 800 : 2000}
        factor={4}
        saturation={0.3}
        fade
        speed={0.5}
      />

      <VisionSphere isMobile={isMobile} />
      <ParticleRing count={isMobile ? 60 : 120} isMobile={isMobile} />

      {orbData.map((orb, i) => (
        <GoalOrb key={i} {...orb} />
      ))}
    </>
  );
}

export default function Room({ className = "" }) {
  const isMobile = useIsMobile();

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 7], fov: isMobile ? 70 : 60 }}
        gl={{ antialias: !isMobile, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
