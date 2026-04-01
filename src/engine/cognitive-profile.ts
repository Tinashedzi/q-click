// Cognitive DNA Profile Engine
// Derives learning personalization from onboarding probe responses

export interface CognitiveDNA {
  information_processing: string; // e.g. "Visual/Strategic, High Structure"
  motivational_drivers: string;   // e.g. "Intrinsic/Mastery"
  risk_resilience: string;        // e.g. "High Grit, Competitive"
  social_dynamics: string;        // e.g. "Collaborative/Leader"
  emotional_baseline: string;     // e.g. "Requires High Empathy/Slower Pacing"
  raw_answers: number[];          // indices 0-3 for each of the 5 probes
}

export const PROBES = [
  {
    id: 1,
    dimension: 'Information Processing',
    question: "Imagine you're dropped into a complex, unfamiliar city with no map. What's your first move?",
    options: [
      { text: 'Find the highest point to get a bird\'s-eye view of the layout.', trait: 'Visual/Strategic, High Structure' },
      { text: 'Start walking and see what interesting things I stumble upon.', trait: 'Kinesthetic/Exploratory, High Ambiguity Tolerance' },
      { text: 'Ask a local for the best places to go.', trait: 'Auditory/Social, Collaborative' },
      { text: 'Find a library or information center to study the history and culture.', trait: 'Text-based/Analytical, Low Risk' },
    ],
  },
  {
    id: 2,
    dimension: 'Motivational Drivers',
    question: 'When you finally master a difficult concept, what is the most satisfying part?',
    options: [
      { text: 'The quiet realization that my mind has expanded.', trait: 'Intrinsic/Mastery' },
      { text: 'Being able to explain it clearly to someone else.', trait: 'Intrinsic/Social/Mentor' },
      { text: 'Earning the recognition or credential that proves I did it.', trait: 'Extrinsic/Status' },
      { text: 'Using that new knowledge to solve a real-world problem immediately.', trait: 'Intrinsic/Application' },
    ],
  },
  {
    id: 3,
    dimension: 'Risk & Resilience',
    question: "You've been working on a puzzle for an hour and you're completely stuck. How does your body feel?",
    options: [
      { text: 'Tense and frustrated. I need to step away.', trait: 'Low Frustration Tolerance, Needs Pacing' },
      { text: 'Energized. The harder it is, the more I want to beat it.', trait: 'High Grit, Competitive' },
      { text: 'Curious. I start looking for completely different angles to approach it.', trait: 'High Cognitive Flexibility' },
      { text: "Defeated. I usually assume I'm just not good at this type of puzzle.", trait: 'Fixed Mindset, Needs High SEL Support' },
    ],
  },
  {
    id: 4,
    dimension: 'Social Dynamics',
    question: 'If you were building a team to survive on a deserted island, what role do you naturally fall into?',
    options: [
      { text: 'The Architect: Planning the shelter and resource management.', trait: 'Strategic/Lone Wolf' },
      { text: 'The Scout: Exploring the unknown territory for hidden advantages.', trait: 'Exploratory/Independent' },
      { text: "The Chief: Organizing everyone's tasks and keeping morale high.", trait: 'Collaborative/Leader' },
      { text: 'The Specialist: Focusing intensely on mastering one crucial skill, like fire-building.', trait: 'Mastery/Focused' },
    ],
  },
  {
    id: 5,
    dimension: 'Emotional Baseline',
    question: 'Before we begin this journey, what is the one thing you want me to remember about how you learn best?',
    options: [
      { text: "Push me hard. Don't let me get comfortable.", trait: 'Requires High Challenge/Low Empathy' },
      { text: "Give me the 'why' before the 'how'.", trait: 'Requires Context/Analytical' },
      { text: 'Be patient. I need time to process before I perform.', trait: 'Requires High Empathy/Slower Pacing' },
      { text: "Keep it moving. If I'm bored, I'm gone.", trait: 'Requires High Stimulation/Variable Rewards' },
    ],
  },
];

export function buildCognitiveDNA(answers: number[]): CognitiveDNA {
  return {
    information_processing: PROBES[0].options[answers[0]]?.trait || '',
    motivational_drivers: PROBES[1].options[answers[1]]?.trait || '',
    risk_resilience: PROBES[2].options[answers[2]]?.trait || '',
    social_dynamics: PROBES[3].options[answers[3]]?.trait || '',
    emotional_baseline: PROBES[4].options[answers[4]]?.trait || '',
    raw_answers: answers,
  };
}

/** Generate a system prompt supplement based on cognitive DNA */
export function dnaToPromptContext(dna: CognitiveDNA): string {
  return `
USER'S COGNITIVE DNA PROFILE:
- Learning Style: ${dna.information_processing}
- Motivation: ${dna.motivational_drivers}
- Challenge Response: ${dna.risk_resilience}
- Social Preference: ${dna.social_dynamics}
- Emotional Needs: ${dna.emotional_baseline}

PERSONALIZATION RULES:
${dna.emotional_baseline.includes('High Challenge') ? '- Push harder, be direct, avoid coddling.' : ''}
${dna.emotional_baseline.includes('High Empathy') ? '- Be extra patient and gentle. Validate before challenging.' : ''}
${dna.emotional_baseline.includes('High Stimulation') ? '- Keep it fast-paced, varied, and exciting. Avoid long explanations.' : ''}
${dna.emotional_baseline.includes('Context/Analytical') ? '- Always explain WHY before HOW. Provide reasoning and context.' : ''}
${dna.risk_resilience.includes('Fixed Mindset') ? '- Focus on growth mindset reinforcement. Normalize struggle.' : ''}
${dna.risk_resilience.includes('High Grit') ? '- Set ambitious challenges. This learner thrives on difficulty.' : ''}
${dna.motivational_drivers.includes('Extrinsic') ? '- Highlight badges, points, and achievements frequently.' : ''}
${dna.motivational_drivers.includes('Mastery') ? '- Focus on depth of understanding over external rewards.' : ''}
${dna.social_dynamics.includes('Lone Wolf') || dna.social_dynamics.includes('Independent') ? '- Respect independence. Offer solo challenges.' : ''}
${dna.social_dynamics.includes('Collaborative') || dna.social_dynamics.includes('Mentor') ? '- Encourage teaching others and collaborative activities.' : ''}
`.trim();
}

/** Determine quest difficulty multiplier */
export function dnaToDifficulty(dna: CognitiveDNA): 'easy' | 'medium' | 'hard' {
  if (dna.risk_resilience.includes('High Grit') || dna.emotional_baseline.includes('High Challenge')) return 'hard';
  if (dna.risk_resilience.includes('Fixed Mindset') || dna.emotional_baseline.includes('High Empathy')) return 'easy';
  return 'medium';
}

/** Determine preferred content type for feed ordering */
export function dnaToContentPreference(dna: CognitiveDNA): string[] {
  const prefs: string[] = [];
  if (dna.information_processing.includes('Visual')) prefs.push('video', 'diagram');
  if (dna.information_processing.includes('Kinesthetic')) prefs.push('simulation', 'experiment');
  if (dna.information_processing.includes('Text-based')) prefs.push('article', 'book');
  if (dna.information_processing.includes('Auditory')) prefs.push('podcast', 'discussion');
  return prefs.length ? prefs : ['video'];
}
