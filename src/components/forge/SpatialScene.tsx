import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface SpatialNode {
  label: string;
  position: [number, number, number];
  color: string;
}

interface ConceptSphereProps {
  label: string;
  position: [number, number, number];
  color: string;
  onClick: () => void;
  isSelected: boolean;
}

const ConceptSphere = ({ label, position, color, onClick, isSelected }: ConceptSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      const target = isSelected ? 1.3 : hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <icosahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 0.6 : hovered ? 0.35 : 0.15}
            wireframe={!isSelected}
            transparent
            opacity={isSelected ? 1 : 0.85}
          />
        </mesh>
        <Text
          position={[0, 0.75, 0]}
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          font={undefined}
        >
          {label}
        </Text>
      </group>
    </Float>
  );
};

const ConnectionLine = ({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) => {
  const points = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    mid.y += 0.4;
    const curve = new THREE.QuadraticBezierCurve3(s, mid, e);
    return curve.getPoints(24);
  }, [start, end]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
  );
};

const ParticleField = () => {
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#888" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

interface SpatialSceneProps {
  dimensions: string[];
  title: string;
}

const PALETTE = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#fb923c'];

const SpatialScene = ({ dimensions, title }: SpatialSceneProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  const nodes: SpatialNode[] = useMemo(() => {
    const all: SpatialNode[] = [
      { label: title, position: [0, 0, 0], color: '#f472b6' },
    ];
    const count = dimensions.length;
    dimensions.forEach((dim, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = 2.2 + Math.random() * 0.5;
      const y = (Math.random() - 0.5) * 1.5;
      all.push({
        label: dim.length > 40 ? dim.slice(0, 38) + '…' : dim,
        position: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        color: PALETTE[i % PALETTE.length],
      });
    });
    return all;
  }, [dimensions, title]);

  return (
    <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-border/30 bg-background/50">
      <Canvas camera={{ position: [0, 2, 5.5], fov: 50 }}>
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#a78bfa" />

        <ParticleField />

        {nodes.map((node, i) => (
          <ConceptSphere
            key={i}
            label={node.label}
            position={node.position}
            color={node.color}
            isSelected={selected === i}
            onClick={() => setSelected(selected === i ? null : i)}
          />
        ))}

        {nodes.slice(1).map((node, i) => (
          <ConnectionLine
            key={`line-${i}`}
            start={nodes[0].position}
            end={node.position}
            color={node.color}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default SpatialScene;
