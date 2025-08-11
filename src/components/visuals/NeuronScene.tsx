import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

function NeuronPoints() {
  const ref = useRef<THREE.Points>(null!);
  // Create a cloud of points
  const positions = useMemo(() => {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        size={0.015}
        color={new THREE.Color(`hsl(${180}, 100%, 60%)`) as any}
        depthWrite={false}
        sizeAttenuation
      />
    </Points>
  );
}

export default function NeuronScene() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]}>
        {/* Subtle camera float */}
        <ambientLight intensity={0.2} />
        <NeonRim />
        <NeuronPoints />
        {/* Controls disabled but keeps damping for gentle motion */}
        <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

function NeonRim() {
  // A faint teal rim light for cinematic feel
  const light = useRef<THREE.DirectionalLight>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (light.current) {
      light.current.position.set(Math.sin(t * 0.2) * 2, 1.5, 1.5);
    }
  });
  return <directionalLight ref={light} intensity={0.5} color={new THREE.Color(`hsl(${180}, 100%, 65%)`) as any} />;
}
