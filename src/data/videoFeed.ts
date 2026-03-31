export interface VideoChannel {
  id: string;
  name: string;
  category: string;
  color: string;
  videos: VideoItem[];
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  description: string;
  level: string;
  channel: string;
  category: string;
}

export const categories = ['All', 'Science', 'Africa', 'Mathematics', 'Technology', 'History'];

export const videoChannels: VideoChannel[] = [
  {
    id: 'astrum',
    name: 'Astrum',
    category: 'Space & Science',
    color: 'from-indigo-500 to-purple-600',
    videos: [
      {
        id: 'astrum1',
        title: 'How Big is the Solar System?',
        thumbnail: '',
        duration: '12:45',
        description: 'A breathtaking journey through the scale of our cosmic neighborhood.',
        level: 'All Levels',
        channel: 'Astrum',
        category: 'Science',
      },
    ],
  },
  {
    id: 'kurzgesagt',
    name: 'Kurzgesagt',
    category: 'Science Explained',
    color: 'from-teal-500 to-cyan-600',
    videos: [
      {
        id: 'kurz1',
        title: 'The Egg – A Short Story',
        thumbnail: '',
        duration: '8:17',
        description: 'A mind-bending story about identity, humanity, and the universe.',
        level: 'All Levels',
        channel: 'Kurzgesagt',
        category: 'Science',
      },
    ],
  },
  {
    id: 'veritasium',
    name: 'Veritasium',
    category: 'Physics & Reality',
    color: 'from-blue-500 to-cyan-500',
    videos: [
      {
        id: 'veri1',
        title: 'The Most Misunderstood Concept in Physics',
        thumbnail: '',
        duration: '18:23',
        description: 'Entropy, time, and why we can\'t go backward.',
        level: 'Advanced',
        channel: 'Veritasium',
        category: 'Science',
      },
    ],
  },
  {
    id: 'african-signal',
    name: 'The African Signal',
    category: 'African Business & History',
    color: 'from-green-500 to-emerald-600',
    videos: [
      {
        id: 'afr1',
        title: 'The Great Zimbabwe: A Lost Empire',
        thumbnail: '',
        duration: '14:22',
        description: 'Uncovering the wealth, architecture, and mystery of Great Zimbabwe.',
        level: 'Intermediate',
        channel: 'The African Signal',
        category: 'Africa',
      },
    ],
  },
  {
    id: '3b1b',
    name: '3Blue1Brown',
    category: 'Mathematics',
    color: 'from-blue-600 to-indigo-500',
    videos: [
      {
        id: '3b1b1',
        title: 'The Essence of Calculus',
        thumbnail: '',
        duration: '16:30',
        description: 'Visualizing derivatives and integrals like never before.',
        level: 'Advanced',
        channel: '3Blue1Brown',
        category: 'Mathematics',
      },
    ],
  },
];

export function getAllVideos(): VideoItem[] {
  return videoChannels.flatMap(c => c.videos);
}

export function getVideosByCategory(cat: string): VideoItem[] {
  if (cat === 'All') return getAllVideos();
  return getAllVideos().filter(v => v.category === cat);
}
