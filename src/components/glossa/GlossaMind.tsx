import { useRef, useMemo, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, OrbitControls, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { concepts, Concept, POS_COLORS } from '@/data/concepts';

// ─── Graph layout computation ───────────────────────────────────────

interface NodeData {
  id: string;
  label: string;
  pos: PartOfSpeech;
  meaning: string;
  position: [number, number, number];
  connections: string[];
}

type PartOfSpeech = 'noun' | 'verb' | 'determiner' | 'adjective' | 'preposition' | 'adverb' | 'conjunction';

const POS_HEX: Record<string, string> = {
  jade: '#8fad8f',
  clay: '#c4a07c',
  gold: '#c4a434',
  petal: '#c9a0b8',
  dew: '#c9baa8',
};

function getPosColor(pos: PartOfSpeech): string {
  return POS_HEX[POS_COLORS[pos]] || '#8fad8f';
}

function buildGraph(conceptList: Concept[]): { nodes: NodeData[]; edges: [string, string][] } {
  const ids = new Set(conceptList.map(c => c.id));
  const edgeSet = new Set<string>();
  const edges: [string, string][] = [];

  // Spherical layout with slight randomness
  const nodes: NodeData[] = conceptList.map((c, i) => {
    const phi = Math.acos(-1 + (2 * i) / conceptList.length);
    const theta = Math.sqrt(conceptList.length * Math.PI) * phi;
    const r = 4 + Math.random() * 1.5;
    return {
      id: c.id,
      label: c.translations.en?.word || c.id,
      pos: c.translations.en?.partOfSpeech || 'noun',
      meaning: c.universalMeaning,
      position: [
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ] as [number, number, number],
      connections: c.relatedConcepts.filter(rc => ids.has(rc)),
    };
  });

  conceptList.forEach(c => {
    c.relatedConcepts.forEach(rc => {
      if (ids.has(rc)) {
        const key = [c.id, rc].sort().join('|');
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push([c.id, rc]);
        }
      }
    });
  });

  return { nodes, edges };
}

// ─── 3D Node Component ──────────────────────────────────────────────

interface ConceptNodeProps {
  node: NodeData;
  isActive: boolean;
  isConnected: boolean;
  onClick: (id: string) => void;
}

function ConceptNode({ node, isActive, isConnected, onClick }: ConceptNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const rippleRef = useRef(0);
  const targetScale = isActive ? 1.6 : hovered ? 1.3 : isConnected ? 1.1 : 1;
  const currentScale = useRef(1);
  const color = useMemo(() => new THREE.Color(getPosColor(node.pos)), [node.pos]);

  useFrame((_, delta) => {
    // Smooth scale lerp
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 5);
    if (meshRef.current) {
      meshRef.current.scale.setScalar(currentScale.current);
    }

    // Ripple on glow
    if (glowRef.current) {
      if (isActive) {
        rippleRef.current += delta * 3;
        const rippleScale = 1.5 + Math.sin(rippleRef.current) * 0.3;
        glowRef.current.scale.setScalar(rippleScale * currentScale.current);
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(rippleRef.current) * 0.08;
      } else {
        rippleRef.current = 0;
        const s = hovered ? 1.4 : 1.2;
        glowRef.current.scale.setScalar(s * currentScale.current);
        const targetOp = hovered ? 0.12 : 0.05;
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(
          (glowRef.current.material as THREE.MeshBasicMaterial).opacity,
          targetOp,
          delta * 4
        );
      }
    }

    // Gentle breathing float
    if (meshRef.current) {
      meshRef.current.position.y = node.position[1] + Math.sin(Date.now() * 0.001 + node.position[0]) * 0.08;
    }
  });

  return (
    <group position={node.position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} />
      </mesh>

      {/* Main node */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(node.id); }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.3}
          chromaticAberration={0.05}
          anisotropy={0.2}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          transmission={0.95}
          roughness={0.15}
          color={color}
        />
      </mesh>

      {/* Inner core */}
      <mesh scale={0.12}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.9 : 0.5} />
      </mesh>

      {/* Label */}
      {(hovered || isActive || isConnected) && (
        <Float speed={2} floatIntensity={0.3} rotationIntensity={0}>
          <Text
            position={[0, -0.55, 0]}
            fontSize={isActive ? 0.22 : 0.16}
            color={isActive ? '#ffffff' : '#b0a898'}
            anchorX="center"
            anchorY="top"
            font="/fonts/Inter-Medium.woff"
            outlineWidth={0.02}
            outlineColor="#1a1a2e"
          >
            {node.label}
          </Text>
        </Float>
      )}
    </group>
  );
}

// ─── Edges ──────────────────────────────────────────────────────────

interface EdgesProps {
  edges: [string, string][];
  nodeMap: Map<string, NodeData>;
  activeNode: string | null;
}

function Edges({ edges, nodeMap, activeNode }: EdgesProps) {
  const linesRef = useRef<THREE.Group>(null!);

  const lineData = useMemo(() => {
    return edges.map(([a, b]) => {
      const na = nodeMap.get(a)!;
      const nb = nodeMap.get(b)!;
      return {
        key: `${a}-${b}`,
        a, b,
        points: [
          new THREE.Vector3(...na.position),
          new THREE.Vector3(
            (na.position[0] + nb.position[0]) / 2 + (Math.random() - 0.5) * 0.4,
            (na.position[1] + nb.position[1]) / 2 + (Math.random() - 0.5) * 0.4,
            (na.position[2] + nb.position[2]) / 2 + (Math.random() - 0.5) * 0.4,
          ),
          new THREE.Vector3(...nb.position),
        ],
      };
    });
  }, [edges, nodeMap]);

  return (
    <group ref={linesRef}>
      {lineData.map(({ key, a, b, points }) => {
        const isActive = activeNode === a || activeNode === b;
        const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
        const curvePoints = curve.getPoints(20);
        const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

        return (
          <line key={key} geometry={geometry}>
            <lineBasicMaterial
              color={isActive ? '#c9baa8' : '#6b6560'}
              transparent
              opacity={isActive ? 0.6 : 0.15}
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
}

// ─── Floating particles ─────────────────────────────────────────────

function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null!);
  const count = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.02;
      particlesRef.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#c9baa8"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Info Panel ──────────────────────────────────────────────────────

interface InfoPanelProps {
  node: NodeData | null;
  onClose: () => void;
  onNavigate?: (id: string) => void;
}

function InfoPanel({ node, onClose, onNavigate }: InfoPanelProps) {
  if (!node) return null;
  const concept = concepts.find(c => c.id === node.id);

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 glass-wavey rounded-2xl p-5 z-20 animate-fade-in">
      <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-sm">✕</button>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: getPosColor(node.pos) }}
        />
        <h3 className="text-lg font-serif text-foreground capitalize">{node.label}</h3>
        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">{node.pos}</span>
      </div>
      {concept && (
        <>
          <p className="text-sm text-muted-foreground italic mb-3">⟦ {concept.universalMeaning} ⟧</p>
          {node.connections.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {node.connections.map(c => (
                <button
                  key={c}
                  onClick={() => onNavigate?.(c)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Auto-rotate camera ─────────────────────────────────────────────

function CameraRig() {
  const { camera } = useThree();
  const angleRef = useRef(0);
  const isInteracting = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onStart = () => {
      isInteracting.current = true;
      if (timeout.current) clearTimeout(timeout.current);
    };
    const onEnd = () => {
      timeout.current = setTimeout(() => { isInteracting.current = false; }, 3000);
    };

    const canvas = document.querySelector('canvas');
    canvas?.addEventListener('pointerdown', onStart);
    canvas?.addEventListener('pointerup', onEnd);
    return () => {
      canvas?.removeEventListener('pointerdown', onStart);
      canvas?.removeEventListener('pointerup', onEnd);
    };
  }, []);

  useFrame((_, delta) => {
    if (!isInteracting.current) {
      angleRef.current += delta * 0.05;
      const r = 10;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.cos(angleRef.current) * r, delta * 0.5);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, Math.sin(angleRef.current) * r, delta * 0.5);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// ─── Main Scene ─────────────────────────────────────────────────────

function GlossaMindScene({ onSelectNode, activeNode }: {
  onSelectNode: (id: string | null) => void;
  activeNode: string | null;
}) {
  const { nodes, edges } = useMemo(() => buildGraph(concepts), []);
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);
  const activeConnections = useMemo(() => {
    if (!activeNode) return new Set<string>();
    const n = nodeMap.get(activeNode);
    return new Set(n?.connections || []);
  }, [activeNode, nodeMap]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#f5f0e8" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#8fad8f" />

      <AmbientParticles />
      <Edges edges={edges} nodeMap={nodeMap} activeNode={activeNode} />

      {nodes.map(node => (
        <ConceptNode
          key={node.id}
          node={node}
          isActive={activeNode === node.id}
          isConnected={activeConnections.has(node.id)}
          onClick={onSelectNode}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={4}
        maxDistance={18}
        dampingFactor={0.08}
        enableDamping
        zoomSpeed={0.6}
      />
      <CameraRig />
    </>
  );
}

// ─── Exported Component ─────────────────────────────────────────────

interface GlossaMindProps {
  onSelectConcept?: (id: string) => void;
}

const GlossaMind = ({ onSelectConcept }: GlossaMindProps) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const nodeMap = useMemo(() => {
    const { nodes } = buildGraph(concepts);
    return new Map(nodes.map(n => [n.id, n]));
  }, []);

  const handleSelect = useCallback((id: string | null) => {
    setActiveNode(prev => prev === id ? null : id);
    if (id) onSelectConcept?.(id);
  }, [onSelectConcept]);

  const handleNavigate = useCallback((id: string) => {
    setActiveNode(id);
    onSelectConcept?.(id);
  }, [onSelectConcept]);

  const activeData = activeNode ? nodeMap.get(activeNode) || null : null;

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] rounded-2xl overflow-hidden border border-border/40">
      {/* Deep background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(230,35%,12%)] via-[hsl(230,30%,16%)] to-[hsl(260,25%,14%)]" />

      <Canvas
        camera={{ position: [0, 2, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <GlossaMindScene activeNode={activeNode} onSelectNode={handleSelect} />
        </Suspense>
      </Canvas>

      {/* Title overlay */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-sm font-grotesk font-medium text-white/70 tracking-wider uppercase">Cloud of Thought</h3>
        <p className="text-xs text-white/40 mt-0.5">{concepts.length} concepts · drag to explore</p>
      </div>

      {/* Info panel */}
      <InfoPanel node={activeData} onClose={() => setActiveNode(null)} onNavigate={handleNavigate} />
    </div>
  );
};

export default GlossaMind;
