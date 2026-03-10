import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, X, Link2, Trash2, ZoomIn, ZoomOut, Save, Loader2, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CanvasNode {
  id: string;
  x: number;
  y: number;
  theme: string;
  description: string;
  color: string;
}

export interface CanvasEdge {
  from: string;
  to: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(142 40% 50%)',
  'hsl(280 60% 55%)',
  'hsl(30 80% 55%)',
  'hsl(200 70% 50%)',
];

interface ConceptCanvasProps {
  nodes: CanvasNode[];
  onNodesChange: (nodes: CanvasNode[]) => void;
  edges: CanvasEdge[];
  onEdgesChange: (edges: CanvasEdge[]) => void;
}

const ConceptCanvas = ({ nodes, onNodesChange, edges, onEdgesChange }: ConceptCanvasProps) => {
  const [linking, setLinking] = useState<string | null>(null);
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load canvas from DB on mount
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoaded(true); return; }

      const { data } = await supabase
        .from('forge_canvases' as any)
        .select('nodes, edges')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        const d = data as any;
        if (d.nodes && Array.isArray(d.nodes) && d.nodes.length > 0) onNodesChange(d.nodes);
        if (d.edges && Array.isArray(d.edges)) onEdgesChange(d.edges);
      }
      setLoaded(true);
    };
    load();
  }, []);

  const saveCanvas = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Sign in to save your canvas'); return; }

      const { error } = await (supabase.from('forge_canvases' as any) as any)
        .upsert({
          user_id: user.id,
          nodes: nodes,
          edges: edges,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      toast.success('Canvas saved');
    } catch (err: any) {
      toast.error('Failed to save canvas');
    } finally {
      setSaving(false);
    }
  };

  const removeNode = (id: string) => {
    onNodesChange(nodes.filter(n => n.id !== id));
    onEdgesChange(edges.filter(e => e.from !== id && e.to !== id));
  };

  const handlePointerDown = (e: React.PointerEvent, nodeId: string) => {
    if (linking) {
      if (linking !== nodeId && !edges.find(ed => (ed.from === linking && ed.to === nodeId) || (ed.from === nodeId && ed.to === linking))) {
        onEdgesChange([...edges, { from: linking, to: nodeId }]);
      }
      setLinking(null);
      return;
    }
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - node.x * zoom,
      y: e.clientY - rect.top - node.y * zoom,
    });
    setDragNode(nodeId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragNode || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - dragOffset.x) / zoom;
    const y = (e.clientY - rect.top - dragOffset.y) / zoom;
    onNodesChange(nodes.map(n => n.id === dragNode ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n));
  };

  const handlePointerUp = () => setDragNode(null);
  const getNodeCenter = (node: CanvasNode) => ({ x: node.x + 80, y: node.y + 30 });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Concept Canvas</h3>
          <p className="text-xs text-muted-foreground">Drag to arrange, link to connect ideas</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}>
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={saveCanvas} disabled={saving}>
            {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Cloud className="w-3 h-3 mr-1" />}
            Save
          </Button>
          {nodes.length > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => { onNodesChange([]); onEdgesChange([]); }}>
              <Trash2 className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      <div
        ref={canvasRef}
        className="relative w-full rounded-2xl border border-border/40 bg-card/50 overflow-hidden select-none"
        style={{ height: 360, cursor: linking ? 'crosshair' : 'default' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground/50">{loaded ? 'Collide concepts — then "Add to Canvas"' : 'Loading canvas…'}</p>
          </div>
        )}

        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const a = getNodeCenter(from);
            const b = getNodeCenter(to);
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="hsl(var(--border))" strokeWidth={1.5} strokeDasharray="6 3" opacity={0.6} />;
          })}
        </svg>

        <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0', width: `${100 / zoom}%`, height: `${100 / zoom}%`, position: 'relative' }}>
          {nodes.map(node => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute group"
              style={{ left: node.x, top: node.y, width: 160, touchAction: 'none' }}
              onPointerDown={e => handlePointerDown(e, node.id)}
            >
              <div className="rounded-xl border border-border/60 bg-card p-3 shadow-soft transition-shadow hover:shadow-card" style={{ borderLeftWidth: 3, borderLeftColor: node.color }}>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3 h-3 text-muted-foreground/40" />
                    <span className="text-xs font-medium text-foreground truncate max-w-[100px]">{node.theme}</span>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); setLinking(linking === node.id ? null : node.id); }} className={`p-0.5 rounded ${linking === node.id ? 'text-primary' : 'text-muted-foreground/60 hover:text-foreground'}`}>
                      <Link2 className="w-3 h-3" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); removeNode(node.id); }} className="p-0.5 text-muted-foreground/60 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{node.description}</p>
              </div>
              {linking === node.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      {linking && <p className="text-xs text-primary text-center animate-pulse">Click another node to connect, or click same to cancel</p>}
    </div>
  );
};

export default ConceptCanvas;
