export interface WisdomEntry {
  id: string;
  patterns: string[];
  response: string;
  followUp: string;
  category: string;
}

export interface MasterClass {
  id: string;
  title: string;
  series: string;
  description: string;
  lessons: { title: string; type: 'video' | 'quiz' | 'reflection' | 'application'; duration: string }[];
  color: string;
}

export const wisdomEntries: WisdomEntry[] = [
  { id: 'w1', patterns: ['hello', 'hi', 'hey', 'greetings'], response: "Welcome, seeker. I am Oasis — your companion on the path of understanding. What draws your curiosity today?", followUp: "What subject has been occupying your thoughts recently?", category: 'greeting' },
  { id: 'w2', patterns: ['how do i learn', 'best way to learn', 'study tips'], response: "The ancient Shona say: *'Chitsva chiri murutsoka'* — what is new is underfoot. Learning begins by being present with what is right in front of you. What is right in front of you now?", followUp: "Tell me about the last thing you learned that surprised you.", category: 'learning' },
  { id: 'w3', patterns: ['language', 'languages', 'why learn languages'], response: "Language is the architecture of thought. When you learn a new language, you don't just gain words — you gain an entirely new way of seeing reality. The Xhosa say: *'Umntu ngumntu ngabantu'* — you become more human through connection with others.", followUp: "Which language calls to you most? And why do you think that is?", category: 'language' },
  { id: 'w4', patterns: ['motivation', 'unmotivated', 'can\'t focus', 'lazy'], response: "Even the mighty Zambezi river has still pools along its journey. Rest is not laziness — it is preparation. The Tswana remind us: *'Motho ke motho ka batho'* — perhaps your energy returns through connection?", followUp: "When was the last time you felt truly energized while learning?", category: 'motivation' },
  { id: 'w5', patterns: ['difficult', 'hard', 'struggling', 'confused'], response: "Confusion is the doorway to understanding. If everything were clear, there would be nothing left to learn. An Afrikaans proverb says: *'Aanhouer wen'* — the one who perseveres, wins.", followUp: "Can you tell me specifically what feels most confusing? Sometimes naming the fog helps it lift.", category: 'difficulty' },
  { id: 'w6', patterns: ['meaning', 'purpose', 'why'], response: "You ask 'why' — the most powerful question a human can ask. The Shona say: *'Kudzidza hakuperi'* — learning never ends. Perhaps the meaning is in the seeking itself.", followUp: "What would it mean to you if you mastered this subject?", category: 'philosophy' },
  { id: 'w7', patterns: ['grammar', 'sentence structure', 'syntax'], response: "Grammar is the skeleton of language — invisible, yet it holds everything together. Start not with rules, but with patterns. Listen to how sentences breathe in each language.", followUp: "Would you like to explore how the same thought is structured differently across languages?", category: 'grammar' },
  { id: 'w8', patterns: ['vocabulary', 'words', 'memorize'], response: "Words are not to be memorized — they are to be *lived*. Use Glossa to see the universal meaning beneath each word. When you understand the concept, the words in every language become echoes of the same truth.", followUp: "Which word has fascinated you recently?", category: 'vocabulary' },
  { id: 'w9', patterns: ['afraid', 'scared', 'anxiety', 'worried'], response: "Fear and learning share the same doorway — they both require stepping into the unknown. The Xhosa say: *'Isandla sihlamba esinye'* — one hand washes the other. You don't face this alone.", followUp: "What would you do if you knew you could not fail?", category: 'emotional' },
  { id: 'w10', patterns: ['happy', 'excited', 'great', 'wonderful'], response: "Your radiance is beautiful! The Shona say: *'Rudo runokosha kupfuura sirivhera'* — love is more precious than silver. Channel this joy into learning and it will multiply.", followUp: "What sparked this joy? Can we build on it?", category: 'emotional' },
  { id: 'w11', patterns: ['physics', 'science', 'atoms', 'energy'], response: "Everything in the universe is connected — atoms dance in patterns, stars speak in light. The same curiosity that makes you ask about physics is the force that drives the cosmos itself.", followUp: "What aspect of the physical world most fascinates you?", category: 'science' },
  { id: 'w12', patterns: ['ai', 'artificial intelligence', 'technology'], response: "AI is a mirror of human thought — beautiful and imperfect. Understanding AI begins with understanding yourself: how you think, learn, and create patterns. Shall we explore this together?", followUp: "What do you think makes human intelligence different from artificial intelligence?", category: 'technology' },
  { id: 'w13', patterns: ['culture', 'african', 'heritage', 'tradition'], response: "Culture is the river that carries wisdom across generations. Africa's languages hold knowledge systems that predate written history. Every proverb is a compressed lesson from thousands of years.", followUp: "Which cultural tradition speaks most strongly to you?", category: 'culture' },
  { id: 'w14', patterns: ['help', 'stuck', 'don\'t know'], response: "Being stuck is not failure — it is the moment before breakthrough. The river doesn't stop at the rock; it finds a way around. Let us find your way around together.", followUp: "If you could solve just one small piece of what's blocking you, what would it be?", category: 'support' },
  { id: 'w15', patterns: ['thank', 'thanks', 'grateful'], response: "Gratitude is the soil in which wisdom grows. *Ndinotenda* (Shona), *Enkosi* (Xhosa), *Dankie* (Afrikaans), *Ke a leboga* (Tswana). The beauty of thank you — universal yet unique in every tongue.", followUp: "What are you most grateful for in your learning journey?", category: 'gratitude' },
];

export const masterClasses: MasterClass[] = [
  {
    id: 'mc1', title: 'Physics of the Future', series: 'Science',
    description: 'Explore quantum mechanics, relativity, and the frontiers of human understanding.',
    color: 'jade',
    lessons: [
      { title: 'The Dance of Atoms', type: 'video', duration: '8 min' },
      { title: 'Quantum Foundations Quiz', type: 'quiz', duration: '5 min' },
      { title: 'What Does Uncertainty Mean to You?', type: 'reflection', duration: '10 min' },
      { title: 'Build a Thought Experiment', type: 'application', duration: '15 min' },
    ],
  },
  {
    id: 'mc2', title: 'African Wisdom', series: 'Culture',
    description: 'Journey through proverbs, stories, and knowledge systems from across the continent.',
    color: 'clay',
    lessons: [
      { title: 'Ubuntu: I Am Because We Are', type: 'video', duration: '10 min' },
      { title: 'Proverbs Across Borders', type: 'quiz', duration: '5 min' },
      { title: 'Your Heritage Reflection', type: 'reflection', duration: '10 min' },
      { title: 'Create Your Own Wisdom Story', type: 'application', duration: '20 min' },
    ],
  },
  {
    id: 'mc3', title: 'AI Literacy', series: 'Technology',
    description: 'Understand artificial intelligence from first principles — for adults who want to lead, not follow.',
    color: 'petal',
    lessons: [
      { title: 'What Is Intelligence?', type: 'video', duration: '12 min' },
      { title: 'Pattern Recognition Quiz', type: 'quiz', duration: '5 min' },
      { title: 'AI and Your Future', type: 'reflection', duration: '10 min' },
      { title: 'Train a Simple Model', type: 'application', duration: '20 min' },
    ],
  },
  {
    id: 'mc4', title: 'The Architecture of Language', series: 'Language',
    description: 'Discover why language shapes thought, and how multilingualism expands consciousness.',
    color: 'gold',
    lessons: [
      { title: 'How Words Shape Reality', type: 'video', duration: '9 min' },
      { title: 'Linguistic Patterns Quiz', type: 'quiz', duration: '5 min' },
      { title: 'Your Language Autobiography', type: 'reflection', duration: '15 min' },
      { title: 'Translate a Concept, Not a Word', type: 'application', duration: '20 min' },
    ],
  },
];

export function findWisdomResponse(input: string): WisdomEntry | null {
  const lower = input.toLowerCase();
  return wisdomEntries.find(entry =>
    entry.patterns.some(p => lower.includes(p))
  ) || null;
}

export const oasisFallback = {
  response: "That's a fascinating thought. Let me reflect on it... The best answers often come from asking deeper questions. Tell me more about what prompted this.",
  followUp: "What would the answer look like if you already knew it?",
};
