import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SpatialNode {
  label: string;
  fullText: string;
  position: [number, number, number];
  color: string;
}

interface ConceptSphereProps {
  label: string;
  fullText: string;
  position: [number, number, number];
  color: string;
  onClick: () => void;
  isSelected: boolean;
}

const ConceptSphere = ({ label, fullText, position, color, onClick, isSelected }: ConceptSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      const target = isSelected ? 1.3 : hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
    }
    // Animate glow ring
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.15 + 1;
      const targetScale = isSelected ? pulse * 1.8 : hovered ? 1.5 : 0;
      glowRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = isSelected ? 0.25 : hovered ? 0.15 : 0;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        {/* Glow ring */}
        <mesh ref={glowRef} scale={0}>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0} side={THREE.BackSide} />
        </mesh>

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
            emissiveIntensity={isSelected ? 0.8 : hovered ? 0.5 : 0.15}
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

const ConnectionLine = ({ start, end, color, isActive }: { start: [number, number, number]; end: [number, number, number]; color: string; isActive: boolean }) => {
  const ref = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    mid.y += 0.4;
    const curve = new THREE.QuadraticBezierCurve3(s, mid, e);
    return curve.getPoints(24);
  }, [start, end]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame(() => {
    if (ref.current) {
      const mat = ref.current.material as THREE.LineBasicMaterial;
      const targetOpacity = isActive ? 0.8 : 0.25;
      mat.opacity += (targetOpacity - mat.opacity) * 0.1;
    }
  });

  const line = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 });
    return new THREE.Line(geometry, mat);
  }, [geometry, color]);

  return <primitive ref={ref} object={line} />;
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
  onAddToCanvas?: (result: { theme: string; description: string }) => void;
}

const PALETTE = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#fb923c'];

const SpatialScene = ({ dimensions, title, onAddToCanvas }: SpatialSceneProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  const nodes: SpatialNode[] = useMemo(() => {
    const all: SpatialNode[] = [
      { label: title.length > 30 ? title.slice(0, 28) + '…' : title, fullText: `Central concept: ${title}. Click surrounding nodes to explore spatial dimensions.`, position: [0, 0, 0], color: '#f472b6' },
    ];
    const count = dimensions.length;
    dimensions.forEach((dim, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = 2.2 + Math.random() * 0.5;
      const y = (Math.random() - 0.5) * 1.5;
      all.push({
        label: dim.length > 40 ? dim.slice(0, 38) + '…' : dim,
        fullText: dim,
        position: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        color: PALETTE[i % PALETTE.length],
      });
    });
    return all;
  }, [dimensions, title]);

  const selectedNode = selected !== null ? nodes[selected] : null;

  return (
    <div className="space-y-3">
      <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-border/30 bg-background/50 relative">
        <Canvas camera={{ position: [0, 2, 5.5], fov: 50 }}>
          <ambientLight intensity={0.35} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -3, -5]} intensity={0.3} color="#a78bfa" />

          <ParticleField />

          {nodes.map((node, i) => (
            <ConceptSphere
              key={i}
              label={node.label}
              fullText={node.fullText}
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
              isActive={selected === i + 1 || selected === 0}
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

        {/* Overlay detail panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute bottom-4 left-4 right-4 rounded-xl border border-border/50 bg-card/95 backdrop-blur-md p-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" style={{ color: selectedNode.color }} />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">{selectedNode.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{selectedNode.fullText}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {onAddToCanvas && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-accent hover:text-accent"
                      onClick={() => onAddToCanvas({ theme: selectedNode.label, description: selectedNode.fullText })}
                    >
                      <LayoutGrid className="w-3 h-3 mr-1" /> Canvas
                    </Button>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="rounded-xl bg-muted/20 border border-border/20 px-4 py-3">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk mb-1.5">How to use</p>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
          <li>Click any node to see its detail — selected nodes glow</li>
          <li>Drag to rotate the 3D scene, scroll to zoom in/out</li>
          <li>Click "Canvas" on a node detail to add it to your concept map</li>
          <li>Connection lines brighten when their node is selected</li>
        </ul>
      </div>
    </div>
  );
};

export default SpatialScene;
