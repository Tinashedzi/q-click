export type RecommendationAction = 'simplify' | 'challenge' | 'encourage' | 'redirect' | 'break' | 'celebrate';

export interface DetectedSignals {
  engagement: number;    // 1-10, from interaction patterns
  confusion: number;     // 1-10, from hesitation, repeats
  frustration: number;   // 1-10, from rapid failures, exits
  curiosity: number;     // 1-10, from exploration depth
  confidence: number;    // 1-10, from quiz speed, accuracy
}

export interface EmotionalRecommendation {
  action: RecommendationAction;
  intensity: number;     // 1-10
  message: string;
}

export interface EmotionalState {
  userId: string;
  timestamp: string;
  selfReported: {
    mood: number;        // 1-5
    context?: string;
  };
  detected: DetectedSignals;
  recommendation: EmotionalRecommendation;
}

export interface InteractionEvent {
  type: 'click' | 'navigation' | 'hesitation' | 'quiz_result' | 'concept_view' | 'exit' | 'repeat_view' | 'exploration';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export const SIGNAL_LABELS: Record<keyof DetectedSignals, string> = {
  engagement: 'Engagement',
  confusion: 'Confusion',
  frustration: 'Frustration',
  curiosity: 'Curiosity',
  confidence: 'Confidence',
};

export const ACTION_CONFIG: Record<RecommendationAction, { emoji: string; label: string; color: string }> = {
  simplify:  { emoji: '🔬', label: 'Simplify', color: 'hsl(var(--primary))' },
  challenge: { emoji: '⚡', label: 'Challenge', color: 'hsl(var(--ochre-gold))' },
  encourage: { emoji: '💛', label: 'Encourage', color: 'hsl(var(--secondary))' },
  redirect:  { emoji: '🧭', label: 'Redirect', color: 'hsl(var(--accent))' },
  break:     { emoji: '☕', label: 'Take a Break', color: 'hsl(var(--muted-foreground))' },
  celebrate: { emoji: '🎉', label: 'Celebrate', color: 'hsl(var(--celadon-jade))' },
};
