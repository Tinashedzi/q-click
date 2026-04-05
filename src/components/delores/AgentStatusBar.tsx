import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, MessageCircle, Ear, Wrench } from 'lucide-react';
import type { AgentState, ToolExecution } from '@/engine/delores-agent';
import { TOOL_DISPLAY, getStateDescription } from '@/engine/delores-agent';

interface AgentStatusBarProps {
  state: AgentState;
  memoryCount: number;
  sessionCount: number;
  recentTools: ToolExecution[];
}

const stateConfig: Record<AgentState, { icon: typeof Brain; color: string }> = {
  idle: { icon: Brain, color: 'text-muted-foreground' },
  listening: { icon: Ear, color: 'text-primary' },
  thinking: { icon: Brain, color: 'text-primary animate-pulse' },
  planning: { icon: Sparkles, color: 'text-accent animate-pulse' },
  acting: { icon: Wrench, color: 'text-accent' },
  responding: { icon: MessageCircle, color: 'text-primary' },
};

const AgentStatusBar = ({ state, memoryCount, sessionCount, recentTools }: AgentStatusBarProps) => {
  const config = stateConfig[state];
  const Icon = config.icon;
  const desc = getStateDescription(state);

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-border/30">
      {/* State indicator */}
      <AnimatePresence mode="wait">
        {state !== 'idle' && (
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5"
          >
            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
            <span className="text-xs text-muted-foreground">{desc}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Memory indicator */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
        <Brain className="w-3 h-3" />
        <span>{memoryCount} memories</span>
      </div>

      {/* Session count */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
        <Zap className="w-3 h-3" />
        <span>{sessionCount} sessions</span>
      </div>

      {/* Recent tool executions */}
      <AnimatePresence>
        {recentTools.slice(-3).map((tool, i) => {
          const display = TOOL_DISPLAY[tool.tool];
          if (!display) return null;
          return (
            <motion.div
              key={`${tool.tool}-${i}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xs"
              title={display.actionVerb}
            >
              {display.emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AgentStatusBar;
