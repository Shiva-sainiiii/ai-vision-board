// src/components/3D/GoalCard.jsx
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import { useIsMobile } from "../../hooks/useIsMobile";

const CATEGORY_COLORS = {
  career:    "#4a63f8",
  health:    "#10b981",
  wealth:    "#f59e0b",
  love:      "#ec4899",
  travel:    "#06b6d4",
  personal:  "#7c3aed",
  education: "#f97316",
  default:   "#6d8bff",
};

function CardMesh({ color, hovered }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      const target = hovered ? 0.08 : 0;
      meshRef.current.rotation.y += (target - meshRef.current.rotation.y) * 0.1;
      const scaleTarget = hovered ? 1.04 : 1;
      meshRef.current.scale.x += (scaleTarget - meshRef.current.scale.x) * 0.08;
      meshRef.current.scale.y += (scaleTarget - meshRef.current.scale.y) * 0.08;
    }
  });

  return (
    <RoundedBox ref={meshRef} args={[3.2, 2, 0.12]} radius={0.15} smoothness={4}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        roughness={0.2}
        metalness={0.5}
      />
    </RoundedBox>
  );
}

export default function GoalCard({ goal, category = "default", onClick }) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;

  // Truncate long goal text
  const displayText = goal?.length > 40 ? goal.slice(0, 40) + "…" : goal || "My Goal";

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width: isMobile ? 160 : 200, height: isMobile ? 110 : 130 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color={color} />

        <CardMesh color={color} hovered={hovered} />

        <Text
          position={[0, 0.1, 0.08]}
          fontSize={0.22}
          color="#ffffff"
          maxWidth={2.6}
          textAlign="center"
          font={undefined}
          anchorX="center"
          anchorY="middle"
        >
          {displayText}
        </Text>

        <Text
          position={[0, -0.7, 0.08]}
          fontSize={0.15}
          color="rgba(255,255,255,0.6)"
          anchorX="center"
          anchorY="middle"
        >
          {category.toUpperCase()}
        </Text>
      </Canvas>
    </div>
  );
}
