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
  youtubeId?: string;
}

export const categories = ['All', 'Science', 'Africa', 'Mathematics', 'Technology', 'History', 'Future Quotient'];

export const videoChannels: VideoChannel[] = [
  {
    id: 'qclick-labs',
    name: 'Q-Click Labs',
    category: 'Future Quotient',
    color: 'from-emerald-500 to-teal-600',
    videos: [
      {
        id: 'hero1',
        title: 'The Grand Leap: Human System Optimization',
        thumbnail: 'https://i.ytimg.com/vi/6Il0CJx9yU8/hqdefault.jpg',
        duration: '22:10',
        description: 'The definitive manifesto on upgrading human cognition and the Future Quotient.',
        level: '10x Upgrade',
        channel: 'Q-Click Labs',
        category: 'Future Quotient',
        youtubeId: '6Il0CJx9yU8',
      },
    ],
  },
  {
    id: 'astrum',
    name: 'Astrum',
    category: 'Space & Science',
    color: 'from-indigo-500 to-purple-600',
    videos: [
      {
        id: 'astrum1',
        title: 'The Insane Scale of the Solar System',
        thumbnail: 'https://i.ytimg.com/vi/Kj4524AAZdE/hqdefault.jpg',
        duration: '12:45',
        description: 'A breathtaking journey through the scale of our cosmic neighborhood.',
        level: 'All Levels',
        channel: 'Astrum',
        category: 'Science',
        youtubeId: 'Kj4524AAZdE',
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
        thumbnail: 'https://i.ytimg.com/vi/h6fcK_fRYaI/hqdefault.jpg',
        duration: '8:17',
        description: 'A mind-bending story about identity, humanity, and the universe.',
        level: 'All Levels',
        channel: 'Kurzgesagt',
        category: 'Science',
        youtubeId: 'h6fcK_fRYaI',
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
        thumbnail: 'https://i.ytimg.com/vi/DxL2HoqLbyA/hqdefault.jpg',
        duration: '18:23',
        description: 'Entropy, time, and why we can\'t go backward.',
        level: 'Advanced',
        channel: 'Veritasium',
        category: 'Science',
        youtubeId: 'DxL2HoqLbyA',
      },
    ],
  },
  {
    id: 'african-signal',
    name: 'The African Signal',
    category: 'African Business & History',
    color: 'from-amber-500 to-orange-600',
    videos: [
      {
        id: 'afr1',
        title: 'The Great Zimbabwe: A Lost Empire',
        thumbnail: 'https://i.ytimg.com/vi/PXSbzLKGB2I/hqdefault.jpg',
        duration: '14:22',
        description: 'Uncovering the wealth, architecture, and mystery of Great Zimbabwe.',
        level: 'Intermediate',
        channel: 'The African Signal',
        category: 'Africa',
        youtubeId: 'PXSbzLKGB2I',
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
        thumbnail: 'https://i.ytimg.com/vi/WUvTyaaNkzM/hqdefault.jpg',
        duration: '16:30',
        description: 'Visualizing derivatives and integrals like never before.',
        level: 'Advanced',
        channel: '3Blue1Brown',
        category: 'Mathematics',
        youtubeId: 'WUvTyaaNkzM',
      },
    ],
  },
  {
    id: 'cleoabram',
    name: 'Cleo Abram',
    category: 'Optimistic Tech',
    color: 'from-pink-500 to-rose-500',
    videos: [
      {
        id: 'cleo1',
        title: 'Why Fusion Energy Changes Everything',
        thumbnail: 'https://i.ytimg.com/vi/KkGbmIP4YzI/hqdefault.jpg',
        duration: '10:15',
        description: 'The breakthroughs that could power our future.',
        level: 'Intermediate',
        channel: 'Cleo Abram',
        category: 'Technology',
        youtubeId: 'KkGbmIP4YzI',
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
