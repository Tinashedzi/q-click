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
  { id: 'yt6', title: 'The Story of Maths', channel: 'BBC', videoCount: 4, thumbnail: '📐', category: 'Mathematics' },
  { id: 'yt7', title: 'Cosmos: A Spacetime Odyssey', channel: 'National Geographic', videoCount: 13, thumbnail: '🌌', category: 'Science' },
  { id: 'yt8', title: 'History of Africa', channel: 'Home Team History', videoCount: 10, thumbnail: '🏛️', category: 'History' },
  { id: 'yt9', title: 'Crash Course Computer Science', channel: 'Crash Course', videoCount: 40, thumbnail: '💻', category: 'Technology' },
  { id: 'yt10', title: 'Human Anatomy & Physiology', channel: 'Khan Academy', videoCount: 32, thumbnail: '🫀', category: 'Science' },
  { id: 'yt11', title: 'Introduction to Psychology', channel: 'Yale Courses', videoCount: 20, thumbnail: '🧠', category: 'Psychology' },
  { id: 'yt12', title: 'Climate Science Explained', channel: 'Kurzgesagt', videoCount: 12, thumbnail: '🌡️', category: 'Science' },
  { id: 'yt13', title: 'Learn Zulu in 30 Days', channel: 'African Language Academy', videoCount: 30, thumbnail: '🇿🇦', category: 'Languages' },
  { id: 'yt14', title: 'Creative Writing Masterclass', channel: 'Brandon Sanderson', videoCount: 15, thumbnail: '✍️', category: 'Arts' },
  { id: 'yt15', title: 'Financial Literacy Basics', channel: 'Two Cents', videoCount: 18, thumbnail: '💰', category: 'Finance' },
  { id: 'yt16', title: 'Organic Chemistry Tutor', channel: 'The Organic Chemistry Tutor', videoCount: 50, thumbnail: '🧪', category: 'Science' },
  { id: 'yt17', title: 'World Music & Rhythm', channel: 'Sound Field', videoCount: 14, thumbnail: '🎵', category: 'Arts' },
  { id: 'yt18', title: 'Engineering an Empire', channel: 'History Channel', videoCount: 11, thumbnail: '🏗️', category: 'History' },
];

export const governmentResources: GovernmentResource[] = [
  { id: 'g1', title: 'Patient Assessment Protocols', category: 'nursing', description: 'Standard nursing assessment frameworks with cultural sensitivity guidelines.', source: 'WHO Training Portal', difficulty: 'Intermediate' },
  { id: 'g2', title: 'Wound Care Management', category: 'nursing', description: 'Evidence-based wound care techniques and documentation standards.', source: 'SA Nursing Council', difficulty: 'Advanced' },
  { id: 'g3', title: 'Web Development Standards', category: 'coding', description: 'Industry best practices for accessible, performant web applications.', source: 'W3C Guidelines', difficulty: 'Intermediate' },
  { id: 'g4', title: 'Python for Data Science', category: 'coding', description: 'Comprehensive guide to data analysis with Python and pandas.', source: 'Open Source Curriculum', difficulty: 'Beginner' },
  { id: 'g5', title: 'Structural Foundations', category: 'construction', description: 'Foundation types, soil analysis, and load calculations for residential buildings.', source: 'Master Builders SA', difficulty: 'Advanced' },
  { id: 'g6', title: 'Green Building Techniques', category: 'construction', description: 'Sustainable construction methods using local and recycled materials.', source: 'GBCSA Standards', difficulty: 'Intermediate' },
  { id: 'g7', title: 'Pharmacology Essentials', category: 'nursing', description: 'Drug classifications, dosage calculations, and medication safety protocols.', source: 'SA Pharmacy Council', difficulty: 'Advanced' },
  { id: 'g8', title: 'JavaScript Fundamentals', category: 'coding', description: 'Core JavaScript concepts including ES6+, async programming, and DOM manipulation.', source: 'MDN Web Docs', difficulty: 'Beginner' },
  { id: 'g9', title: 'Electrical Wiring Standards', category: 'construction', description: 'SANS 10142 residential wiring regulations and safety requirements.', source: 'SABS Standards', difficulty: 'Intermediate' },
  { id: 'g10', title: 'Mental Health Nursing', category: 'nursing', description: 'Psychiatric assessment, therapeutic communication, and crisis intervention.', source: 'WHO Mental Health', difficulty: 'Advanced' },
  { id: 'g11', title: 'React & TypeScript Guide', category: 'coding', description: 'Building type-safe React applications with modern patterns and hooks.', source: 'React Documentation', difficulty: 'Intermediate' },
  { id: 'g12', title: 'Plumbing & Drainage Systems', category: 'construction', description: 'Residential plumbing design, installation, and maintenance standards.', source: 'IOPSA Guidelines', difficulty: 'Intermediate' },
];

export const sampleCollections = [
  { id: 'c1', name: 'Language Research', itemCount: 0, icon: '📚' },
  { id: 'c2', name: 'Science Reading', itemCount: 0, icon: '🔬' },
  { id: 'c3', name: 'Professional Development', itemCount: 0, icon: '💼' },
];
