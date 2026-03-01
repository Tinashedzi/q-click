import { useEffect, useRef, useState, useCallback } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import { concepts, Concept } from '@/data/concepts';

interface GraphNode extends SimulationNodeDatum {
  id: string;
  label: string;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface MeaningWebProps {
  focusConcept?: string;
  onSelectConcept?: (id: string) => void;
}

const MeaningWeb = ({ focusConcept, onSelectConcept }: MeaningWebProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      setDimensions({ width: Math.max(width, 300), height: Math.max(height, 300) });
    }
  }, []);

  useEffect(() => {
    const conceptIds = new Set(concepts.map(c => c.id));
    const graphNodes: GraphNode[] = concepts.map(c => ({ id: c.id, label: c.translations.en?.word || c.id }));
    const graphLinks: GraphLink[] = [];
    const linkSet = new Set<string>();

    concepts.forEach(c => {
      c.relatedConcepts.forEach(rc => {
        if (conceptIds.has(rc)) {
          const key = [c.id, rc].sort().join('-');
          if (!linkSet.has(key)) {
            linkSet.add(key);
            graphLinks.push({ source: c.id, target: rc });
          }
        }
      });
    });

    const sim = forceSimulation(graphNodes)
      .force('link', forceLink<GraphNode, GraphLink>(graphLinks).id(d => d.id).distance(80))
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collide', forceCollide(30));

    sim.on('tick', () => {
      setNodes([...graphNodes]);
      setLinks([...graphLinks]);
    });

    sim.alpha(1).restart();

    return () => { sim.stop(); };
  }, [dimensions]);

  return (
    <div className="w-full h-[400px] rounded-xl border border-border/60 bg-card overflow-hidden">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full">
        {/* Links */}
        {links.map((link, i) => {
          const s = link.source as GraphNode;
          const t = link.target as GraphNode;
          return (
            <line
              key={i}
              x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke="hsl(var(--border))"
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((node) => {
          const isFocus = focusConcept === node.id;
          return (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              onClick={() => onSelectConcept?.(node.id)}
              className="cursor-pointer"
            >
              <circle
                r={isFocus ? 18 : 12}
                fill={isFocus ? 'hsl(var(--celadon-jade))' : 'hsl(var(--card))'}
                stroke={isFocus ? 'hsl(var(--celadon-jade))' : 'hsl(var(--border))'}
                strokeWidth={isFocus ? 2.5 : 1.5}
                className="transition-all duration-300"
              />
              <text
                textAnchor="middle"
                dy={isFocus ? 30 : 24}
                className="text-[10px] fill-current text-muted-foreground font-medium pointer-events-none select-none"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MeaningWeb;
