export interface QClickVideo {
  id: string;
  title: string;
  description: string;
  hook: string;
  split: string;
  radiation: string;
  fallout: string;
  duration: string;
  thumbnail: string;
  category: string;
  wisdomPoints: number;
  bookmarked: boolean;
}

export const sampleVideos: QClickVideo[] = [
  {
    id: 'v1',
    title: "The River's Journey",
    description: 'How rivers teach us about persistence, adaptation, and the power of following your natural path.',
    hook: "A river never asks permission to flow. It simply follows the path of least resistance — and carves canyons.",
    split: "In Shona, 'rwizi' (river) shares roots with concepts of life-flow. In Xhosa, 'umlambo' carries the weight of community — rivers are where people gather.",
    radiation: "Every language encodes a different relationship with water. English sees rivers as geography. Shona sees them as life-force. Xhosa sees them as meeting places.",
    fallout: "Your learning journey is a river. Don't fight the current — learn where it wants to take you.",
    duration: '2:30',
    thumbnail: '',
    category: 'Nature & Wisdom',
    wisdomPoints: 15,
    bookmarked: false,
  },
  {
    id: 'v2',
    title: 'Why We Love',
    description: 'The universal concept of love examined through five languages and five different worldviews.',
    hook: "The word 'love' in English does the work of fifteen words in other languages.",
    split: "Shona: 'rudo' — love as a communal force. Xhosa: 'uthando' — love as deep recognition. Afrikaans: 'liefde' — love as devotion. Tswana: 'lorato' — love as choosing.",
    radiation: "Love isn't one thing — it's a spectrum. Each language reveals a facet that English alone cannot capture.",
    fallout: "To learn a language is to learn a new way to love. What facet of love does your mother tongue emphasize?",
    duration: '3:15',
    thumbnail: '',
    category: 'Emotions & Culture',
    wisdomPoints: 20,
    bookmarked: false,
  },
  {
    id: 'v3',
    title: 'The Hidden Structure of Language',
    description: 'Why grammar is not a set of rules but a window into how cultures organize reality.',
    hook: "What if grammar isn't about rules — but about how your brain organizes reality?",
    split: "English puts the subject first: 'I see the mountain.' Shona wraps the subject into the verb: 'Ndinoona gomo.' The mountain isn't separate from the seeing.",
    radiation: "Grammar reveals philosophy. Subject-verb-object languages separate the observer from the observed. Agglutinative languages weave them together.",
    fallout: "Next time you struggle with grammar, remember: you're not learning rules. You're learning a new way to see.",
    duration: '4:00',
    thumbnail: '',
    category: 'Language & Mind',
    wisdomPoints: 25,
    bookmarked: false,
  },
  {
    id: 'v4',
    title: 'The Mathematics of Music',
    description: 'How mathematical patterns underlie every song, and what African rhythms teach us about complexity.',
    hook: "Every song you've ever loved is built on mathematics. But African rhythms broke the Western formula — beautifully.",
    split: "Western music counts in 4. African polyrhythms layer 3 over 4 over 5. The result? Complexity that computers still struggle to replicate.",
    radiation: "The Shona mbira uses a tuning system that doesn't exist in Western music. It creates overtones that sound like multiple instruments from one.",
    fallout: "Mathematics isn't cold. It's the hidden heartbeat of every beautiful thing you've ever heard.",
    duration: '3:45',
    thumbnail: '',
    category: 'Science & Art',
    wisdomPoints: 20,
    bookmarked: false,
  },
  {
    id: 'v5',
    title: 'What Trees Know',
    description: 'Underground networks, chemical communication, and what the forest teaches about community.',
    hook: "Trees talk. Not with words, but through a network so vast it makes the internet look simple.",
    split: "In Tswana, 'setlhare' means both tree and medicine. In Xhosa, 'umthi' carries the same dual meaning. Our ancestors knew: trees are healers.",
    radiation: "Mycorrhizal networks — the 'wood wide web' — allow trees to share nutrients, warn of danger, and nurture their young. Ubuntu in nature.",
    fallout: "Like trees, we learn best when connected. Your knowledge network is your strength.",
    duration: '3:00',
    thumbnail: '',
    category: 'Nature & Science',
    wisdomPoints: 15,
    bookmarked: false,
  },
];

export function getBookmarkedVideos(): string[] {
  const stored = localStorage.getItem('qclick-bookmarked-videos');
  return stored ? JSON.parse(stored) : [];
}

export function toggleBookmark(videoId: string): boolean {
  const bookmarks = getBookmarkedVideos();
  const idx = bookmarks.indexOf(videoId);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    localStorage.setItem('qclick-bookmarked-videos', JSON.stringify(bookmarks));
    return false;
  } else {
    bookmarks.push(videoId);
    localStorage.setItem('qclick-bookmarked-videos', JSON.stringify(bookmarks));
    return true;
  }
}
