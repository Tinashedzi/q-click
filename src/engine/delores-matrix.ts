import type { DetectedSignals, EmotionalState, EmotionalRecommendation, InteractionEvent, RecommendationAction } from '@/types/delores-matrix';

const STORAGE_KEY = 'qclick-emotional-matrix';
const EVENTS_KEY = 'qclick-interaction-events';
const MAX_EVENTS = 200;
const MAX_SNAPSHOTS = 50;

function clamp(v: number, min = 1, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(v)));
}

class EmotionalMatrixEngine {
  private events: InteractionEvent[] = [];

  constructor() {
    this.loadEvents();
  }

  // --- Event tracking ---

  trackEvent(type: InteractionEvent['type'], metadata?: Record<string, unknown>): void {
    this.events.push({ type, timestamp: new Date().toISOString(), metadata });
    if (this.events.length > MAX_EVENTS) this.events = this.events.slice(-MAX_EVENTS);
    this.persistEvents();
  }

  // --- Signal computation ---

  computeSignals(): DetectedSignals {
    const now = Date.now();
    const recentMs = 30 * 60 * 1000; // last 30 min
    const recent = this.events.filter(e => now - new Date(e.timestamp).getTime() < recentMs);

    const engagement = this.computeEngagement(recent);
    const confusion = this.computeConfusion(recent);
    const frustration = this.computeFrustration(recent);
    const curiosity = this.computeCuriosity(recent);
    const confidence = this.computeConfidence(recent);

    return { engagement, confusion, frustration, curiosity, confidence };
  }

  private computeEngagement(events: InteractionEvent[]): number {
    // More interactions = more engagement
    const clicks = events.filter(e => e.type === 'click' || e.type === 'navigation').length;
    return clamp(Math.min(clicks / 3, 10) || 5);
  }

  private computeConfusion(events: InteractionEvent[]): number {
    const repeats = events.filter(e => e.type === 'repeat_view' || e.type === 'hesitation').length;
    return clamp(Math.min(repeats * 2, 10) || 2);
  }

  private computeFrustration(events: InteractionEvent[]): number {
    const exits = events.filter(e => e.type === 'exit').length;
    const failures = events.filter(e => e.type === 'quiz_result' && e.metadata?.correct === false).length;
    return clamp(Math.min((exits + failures) * 2, 10) || 1);
  }

  private computeCuriosity(events: InteractionEvent[]): number {
    const explorations = events.filter(e => e.type === 'exploration' || e.type === 'concept_view').length;
    return clamp(Math.min(explorations / 2, 10) || 4);
  }

  private computeConfidence(events: InteractionEvent[]): number {
    const quizResults = events.filter(e => e.type === 'quiz_result');
    if (quizResults.length === 0) return 5;
    const correct = quizResults.filter(e => e.metadata?.correct === true).length;
    return clamp((correct / quizResults.length) * 10);
  }

  // --- Recommendation ---

  generateRecommendation(mood: number, signals: DetectedSignals): EmotionalRecommendation {
    const { confusion, frustration, curiosity, confidence, engagement } = signals;

    let action: RecommendationAction;
    let message: string;
    let intensity: number;

    if (frustration >= 7) {
      action = 'break';
      intensity = frustration;
      message = "You've been pushing hard. A short break can reset your focus and energy.";
    } else if (confusion >= 7) {
      action = 'simplify';
      intensity = confusion;
      message = "Let's slow down and revisit the foundations. Understanding builds layer by layer.";
    } else if (mood <= 2 && engagement <= 3) {
      action = 'encourage';
      intensity = 8;
      message = "Every journey has quiet moments. Your presence here already shows strength.";
    } else if (confidence >= 8 && curiosity >= 7) {
      action = 'challenge';
      intensity = confidence;
      message = "You're in a powerful flow state! Let's tackle something that stretches your edges.";
    } else if (confidence >= 8) {
      action = 'celebrate';
      intensity = confidence;
      message = "Look how far you've come! Your understanding is deepening beautifully.";
    } else if (curiosity >= 6) {
      action = 'challenge';
      intensity = curiosity;
      message = "Your curiosity is alive — let's channel it into a deeper exploration.";
    } else if (mood >= 4 && engagement >= 5) {
      action = 'challenge';
      intensity = 6;
      message = "Your energy is bright. This is an ideal moment for growth.";
    } else {
      action = 'redirect';
      intensity = 5;
      message = "Let's try a different angle. Sometimes a fresh perspective unlocks everything.";
    }

    return { action, intensity: clamp(intensity), message };
  }

  // --- Snapshots ---

  createSnapshot(mood: number, context?: string): EmotionalState {
    const signals = this.computeSignals();
    const recommendation = this.generateRecommendation(mood, signals);

    const state: EmotionalState = {
      userId: 'local',
      timestamp: new Date().toISOString(),
      selfReported: { mood, context },
      detected: signals,
      recommendation,
    };

    this.saveSnapshot(state);
    return state;
  }

  getSnapshots(): EmotionalState[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveSnapshot(state: EmotionalState): void {
    const snapshots = this.getSnapshots();
    snapshots.push(state);
    if (snapshots.length > MAX_SNAPSHOTS) snapshots.splice(0, snapshots.length - MAX_SNAPSHOTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  }

  clearData(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EVENTS_KEY);
    this.events = [];
  }

  // --- Persistence ---

  private persistEvents(): void {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(this.events));
  }

  private loadEvents(): void {
    const stored = localStorage.getItem(EVENTS_KEY);
    this.events = stored ? JSON.parse(stored) : [];
  }
}

// Singleton
export const emotionalMatrix = new EmotionalMatrixEngine();
