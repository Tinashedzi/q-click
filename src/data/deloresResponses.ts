import type { DetectedSignals, EmotionalRecommendation } from '@/types/delores-matrix';

export interface MoodEntry {
  id: string;
  level: number;
  label: string;
  emoji: string;
  contributingFactors: string[];
  freeText?: string;
  timestamp: string;
  detected?: DetectedSignals;
  recommendation?: EmotionalRecommendation;
}

export const moodLevels = [
  { level: 1, emoji: '😢', label: 'Heavy heart' },
  { level: 2, emoji: '😕', label: 'Cloudy' },
  { level: 3, emoji: '😐', label: 'Steady' },
  { level: 4, emoji: '🙂', label: 'Bright' },
  { level: 5, emoji: '😊', label: 'Radiant' },
];

export const contributingChips = [
  'Family', 'Work', 'Health', 'Learning', 'Relationships',
  'Weather', 'Sleep', 'Exercise', 'Finances', 'Creativity',
  'Loneliness', 'Achievement', 'Stress', 'Gratitude', 'Change',
];

export interface DeloresResponse {
  moodRange: [number, number];
  messages: string[];
  culturalWisdom: { culture: string; proverb: string; translation?: string }[];
  advice: string[];
}

export const deloresResponses: DeloresResponse[] = [
  {
    moodRange: [1, 1],
    messages: [
      "I see you're carrying something heavy today. That takes courage to share.",
      "Heavy hearts eventually lighten. I'm here with you.",
      "Sometimes the strongest thing we can do is acknowledge our pain.",
    ],
    culturalWisdom: [
      { culture: 'Shona', proverb: 'Chara chimwe hachitswanyi inda', translation: 'One finger cannot crush a louse — you don\'t have to carry this alone.' },
      { culture: 'Xhosa', proverb: 'Umntu ngumntu ngabantu', translation: 'A person is a person through other people.' },
      { culture: 'Tswana', proverb: 'Motho ke motho ka batho', translation: 'A person is a person because of people.' },
    ],
    advice: [
      "Consider reaching out to someone you trust today.",
      "A short walk, even just five minutes, can shift your energy.",
      "Write three things you're grateful for — they can be small.",
    ],
  },
  {
    moodRange: [2, 2],
    messages: [
      "Cloudy days happen. The sun is still there behind the clouds.",
      "It's okay to feel uncertain. Clarity often follows confusion.",
      "Even on cloudy days, seeds still grow beneath the soil.",
    ],
    culturalWisdom: [
      { culture: 'Shona', proverb: 'Kusina mafuta hapfungwi', translation: 'Where there is no oil, there is no cooking — every challenge has a resource.' },
      { culture: 'Afrikaans', proverb: 'Aanhouer wen', translation: 'The one who perseveres, wins.' },
    ],
    advice: [
      "Try learning something small today — momentum builds clarity.",
      "Take a few deep breaths. Inhale for 4, hold for 4, exhale for 6.",
      "Sometimes changing your environment changes your perspective.",
    ],
  },
  {
    moodRange: [3, 3],
    messages: [
      "Steady is a good place to be. From here, anything is possible.",
      "Balance is its own kind of strength.",
      "A calm sea is perfect for learning to navigate.",
    ],
    culturalWisdom: [
      { culture: 'Xhosa', proverb: 'Isandla sihlamba esinye', translation: 'One hand washes the other — cooperation brings balance.' },
      { culture: 'Tswana', proverb: 'Mmualebe o a bo a bua la gagwe', translation: 'The one who speaks also speaks their own truth.' },
    ],
    advice: [
      "This is a great state for deep learning. Consider tackling a new concept.",
      "Set a small, achievable goal for today.",
      "Steady energy is perfect for building habits.",
    ],
  },
  {
    moodRange: [4, 4],
    messages: [
      "Your brightness is showing! What wonderful energy to learn with.",
      "Feeling bright is a gift. Use it wisely today.",
      "Your positive energy can light up someone else's day too.",
    ],
    culturalWisdom: [
      { culture: 'Shona', proverb: 'Rudo runokosha kupfuura sirivhera', translation: 'Love is more precious than silver.' },
      { culture: 'Afrikaans', proverb: '\'n Boer maak \'n plan', translation: 'A farmer makes a plan — creativity flows when spirits are high.' },
    ],
    advice: [
      "Challenge yourself with something new — you have the energy for it!",
      "Share your brightness with a study partner.",
      "This is an ideal time to tackle difficult concepts.",
    ],
  },
  {
    moodRange: [5, 5],
    messages: [
      "Radiant! Your energy is absolutely beautiful today.",
      "When you shine this brightly, everything you touch becomes clearer.",
      "This radiance is your natural state. Remember this feeling.",
    ],
    culturalWisdom: [
      { culture: 'Shona', proverb: 'Mwana asingachemi anofira mumbereko', translation: 'Express your joy — a child that doesn\'t cry stays unnoticed.' },
      { culture: 'Xhosa', proverb: 'Inkomo ingazali iyazalela umniniya', translation: 'Joy multiplies when shared with others.' },
      { culture: 'Tswana', proverb: 'Letsatsi le tlhaba ka dinao', translation: 'The sun rises on its feet — rise with your full energy.' },
    ],
    advice: [
      "Your peak state is perfect for creative expression and deep learning.",
      "Help someone else learn today — teaching deepens understanding.",
      "Document what contributed to this feeling so you can return to it.",
    ],
  },
];

export function getDeloresResponse(moodLevel: number): DeloresResponse {
  return deloresResponses.find(r => moodLevel >= r.moodRange[0] && moodLevel <= r.moodRange[1]) || deloresResponses[2];
}

export function getMoodEntries(): MoodEntry[] {
  const stored = localStorage.getItem('qclick-mood-entries');
  return stored ? JSON.parse(stored) : [];
}

export function saveMoodEntry(entry: MoodEntry): void {
  const entries = getMoodEntries();
  entries.push(entry);
  localStorage.setItem('qclick-mood-entries', JSON.stringify(entries));
}

export function clearMoodEntries(): void {
  localStorage.removeItem('qclick-mood-entries');
}

export function exportMoodEntries(): string {
  return JSON.stringify(getMoodEntries(), null, 2);
}
