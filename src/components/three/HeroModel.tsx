import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function ArduinoBoard() {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.2) * 0.1; // idle micro motion
  });

  return (
    <group ref={group}>
      {/* Board base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.06, 1.8]} />
        <meshStandardMaterial color={new THREE.Color("#0b2740")} metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Microcontroller chip */}
      <mesh position={[0.5, 0.12, 0]} castShadow>
        <boxGeometry args={[0.7, 0.16, 0.5]} />
        <meshStandardMaterial color={new THREE.Color("#1e90ff")} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Pin headers */}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} position={[-1.1 + i * 0.18, 0.18, 0.8]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 16]} />
          <meshStandardMaterial color={new THREE.Color("#cbd5e1")} />
        </mesh>
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={`b-${i}`} position={[-1.1 + i * 0.18, 0.18, -0.8]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 16]} />
          <meshStandardMaterial color={new THREE.Color("#cbd5e1")} />
        </mesh>
      ))}

      {/* LEDs */}
      <mesh position={[1.1, 0.15, 0.3]}> 
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial emissive={new THREE.Color("#00ffff")} emissiveIntensity={2} color={new THREE.Color("#003a3a")} />
      </mesh>
      <mesh position={[1.1, 0.15, -0.3]}> 
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial emissive={new THREE.Color("#ff00ff")} emissiveIntensity={2} color={new THREE.Color("#3a003a")} />
      </mesh>
    </group>
  );
}

export default function HeroModel() {
  return (
    <div className="relative w-full h-[360px] md:h-[520px]">
      <Canvas camera={{ position: [3.5, 2.2, 3.5], fov: 55 }} shadows dpr={[1, 1.5]} gl={{ alpha: true }}>
        <hemisphereLight intensity={0.35} color={new THREE.Color("#9ae6b4")} groundColor={new THREE.Color("#1f2937")} />
        <directionalLight position={[4, 6, 3]} intensity={1.2} castShadow color={new THREE.Color("#00ffff")} />
        <ArduinoBoard />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={7} />
      </Canvas>
    </div>
  );
}
