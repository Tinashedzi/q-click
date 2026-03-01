export interface LibraryItem {
  id: string;
  title: string;
  source: 'wikipedia' | 'gutenberg' | 'arxiv' | 'youtube' | 'government';
  description: string;
  url?: string;
  savedAt?: string;
  collection?: string;
  progress?: number;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  channel: string;
  videoCount: number;
  thumbnail: string;
  category: string;
}

export interface GovernmentResource {
  id: string;
  title: string;
  category: 'nursing' | 'coding' | 'construction';
  description: string;
  source: string;
  difficulty: string;
}

export const curatedPlaylists: YouTubePlaylist[] = [
  { id: 'yt1', title: 'African Languages: Origins & Families', channel: 'Langfocus', videoCount: 12, thumbnail: '🌍', category: 'Languages' },
  { id: 'yt2', title: 'Physics Made Beautiful', channel: 'Veritasium', videoCount: 24, thumbnail: '⚛️', category: 'Science' },
  { id: 'yt3', title: 'AI for Everyone', channel: '3Blue1Brown', videoCount: 8, thumbnail: '🤖', category: 'Technology' },
  { id: 'yt4', title: 'African Philosophy & Wisdom', channel: 'Academy of Ideas', videoCount: 6, thumbnail: '🦉', category: 'Philosophy' },
  { id: 'yt5', title: 'Mathematics of Language', channel: 'Numberphile', videoCount: 15, thumbnail: '🔢', category: 'Mathematics' },
];

export const governmentResources: GovernmentResource[] = [
  { id: 'g1', title: 'Patient Assessment Protocols', category: 'nursing', description: 'Standard nursing assessment frameworks with cultural sensitivity guidelines.', source: 'WHO Training Portal', difficulty: 'Intermediate' },
  { id: 'g2', title: 'Wound Care Management', category: 'nursing', description: 'Evidence-based wound care techniques and documentation standards.', source: 'SA Nursing Council', difficulty: 'Advanced' },
  { id: 'g3', title: 'Web Development Standards', category: 'coding', description: 'Industry best practices for accessible, performant web applications.', source: 'W3C Guidelines', difficulty: 'Intermediate' },
  { id: 'g4', title: 'Python for Data Science', category: 'coding', description: 'Comprehensive guide to data analysis with Python and pandas.', source: 'Open Source Curriculum', difficulty: 'Beginner' },
  { id: 'g5', title: 'Structural Foundations', category: 'construction', description: 'Foundation types, soil analysis, and load calculations for residential buildings.', source: 'Master Builders SA', difficulty: 'Advanced' },
  { id: 'g6', title: 'Green Building Techniques', category: 'construction', description: 'Sustainable construction methods using local and recycled materials.', source: 'GBCSA Standards', difficulty: 'Intermediate' },
];

export const sampleCollections = [
  { id: 'c1', name: 'Language Research', itemCount: 0, icon: '📚' },
  { id: 'c2', name: 'Science Reading', itemCount: 0, icon: '🔬' },
  { id: 'c3', name: 'Professional Development', itemCount: 0, icon: '💼' },
];
