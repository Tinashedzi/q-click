export interface PointRule {
  id: string;
  action: string;
  points: number;
  condition?: string;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  trigger: string;
  unlocked: boolean;
  reward?: string;
}

export interface Belt {
  level: number;
  name: string;
  color: string;
  pointsRequired: number;
  conceptsRequired: number;
}

export interface Tournament {
  id: string;
  title: string;
  topic: string;
  startDate: string;
  endDate: string;
  scoring: string;
  participants: { name: string; score: number }[];
  status: 'upcoming' | 'active' | 'completed';
}

export const pointRules: PointRule[] = [
  { id: 'daily-login', action: 'Daily Login', points: 5, icon: '🌅' },
  { id: 'concept-explored', action: 'Explore a Concept', points: 10, icon: '🔍' },
  { id: 'sentence-built', action: 'Build a Sentence', points: 15, icon: '✍️' },
  { id: 'mood-checkin', action: 'Mood Check-In', points: 5, icon: '💚' },
  { id: 'video-watched', action: 'Watch a Video', points: 20, icon: '🎬' },
  { id: 'quiz-passed', action: 'Pass a Quiz', points: 25, condition: 'Score ≥ 80%', icon: '✅' },
  { id: 'forge-creation', action: 'Create in Forge', points: 50, icon: '🔨' },
  { id: 'share-wisdom', action: 'Share with Community', points: 30, icon: '🌍' },
  { id: 'first-language', action: 'Add First Language', points: 100, condition: 'First time only', icon: '🗣️' },
  { id: 'streak-bonus', action: '7-Day Streak', points: 50, condition: 'Weekly bonus', icon: '🔥' },
];

export const achievements: Achievement[] = [
  { id: 'first-word', name: 'First Word', description: 'Explore your first concept in Glossa', icon: '📖', trigger: 'explore_1_concept', unlocked: false },
  { id: 'polyglot', name: 'Polyglot', description: 'Learn words in all 5 languages', icon: '🌐', trigger: 'all_5_languages', unlocked: false },
  { id: 'river-deep', name: 'River Deep', description: 'Explore 10 connected concepts in the Meaning Web', icon: '🌊', trigger: 'explore_10_connected', unlocked: false },
  { id: 'emotional-sage', name: 'Emotional Sage', description: 'Complete 30 mood check-ins', icon: '🧘', trigger: '30_mood_checkins', unlocked: false },
  { id: 'flame-keeper', name: 'Flame Keeper', description: 'Maintain a 30-day learning streak', icon: '🔥', trigger: '30_day_streak', unlocked: false },
  { id: 'forge-master', name: 'Forge Master', description: 'Create 10 items in the Forge', icon: '⚒️', trigger: '10_forge_creations', unlocked: false },
  { id: 'wisdom-seeker', name: 'Wisdom Seeker', description: 'Ask Oasis 50 questions', icon: '🦉', trigger: '50_oasis_questions', unlocked: false },
  { id: 'night-owl', name: 'Night Owl', description: 'Study after 10 PM for 7 days', icon: '🦉', trigger: '7_night_sessions', unlocked: false },
  { id: 'community-star', name: 'Community Star', description: 'Share 5 creations with the community', icon: '⭐', trigger: '5_shares', unlocked: false },
  { id: 'black-belt', name: 'Black Belt', description: 'Reach Black Belt level', icon: '🥋', trigger: 'reach_black_belt', unlocked: false },
];

export const belts: Belt[] = [
  { level: 1, name: 'White Belt', color: 'bg-muted', pointsRequired: 0, conceptsRequired: 0 },
  { level: 2, name: 'Yellow Belt', color: 'bg-gold/30', pointsRequired: 100, conceptsRequired: 5 },
  { level: 3, name: 'Green Belt', color: 'bg-jade/30', pointsRequired: 500, conceptsRequired: 15 },
  { level: 4, name: 'Blue Belt', color: 'bg-primary/30', pointsRequired: 1500, conceptsRequired: 30 },
  { level: 5, name: 'Black Belt', color: 'bg-foreground/20', pointsRequired: 5000, conceptsRequired: 50 },
];

export const sampleTournaments: Tournament[] = [
  {
    id: 't1',
    title: 'Spring Language Challenge',
    topic: 'Master 20 concepts in Shona',
    startDate: '2026-03-01',
    endDate: '2026-03-15',
    scoring: 'Accuracy + Speed',
    status: 'active',
    participants: [
      { name: 'Tendai M.', score: 450 },
      { name: 'Sipho K.', score: 380 },
      { name: 'Amara L.', score: 320 },
      { name: 'You', score: 128 },
    ],
  },
  {
    id: 't2',
    title: 'African Wisdom Bowl',
    topic: 'Proverbs across 5 languages',
    startDate: '2026-03-20',
    endDate: '2026-04-05',
    scoring: 'Creativity + Knowledge',
    status: 'upcoming',
    participants: [],
  },
];
