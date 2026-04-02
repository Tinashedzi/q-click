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
  isShort?: boolean;
}

export const categories = ['All', 'Science', 'Mathematics', 'Technology', 'Africa', 'Biology', 'History', 'Engineering', 'Philosophy', 'Future Quotient', 'Design', 'Geography', 'Cooking', 'Cars', 'AI', 'Documentaries'];

export const videoChannels: VideoChannel[] = [
  {
    id: 'qclick-labs',
    name: 'Q-Click Labs',
    category: 'Future Quotient',
    color: 'from-emerald-500 to-teal-600',
    videos: [
      { id: 'hero1', title: 'The Grand Leap: Human System Optimization', thumbnail: 'https://i.ytimg.com/vi/6Il0CJx9yU8/hqdefault.jpg', duration: '22:10', description: 'The definitive manifesto on upgrading human cognition and the Future Quotient.', level: '10x Upgrade', channel: 'Q-Click Labs', category: 'Future Quotient', youtubeId: '6Il0CJx9yU8' },
    ],
  },
  {
    id: 'veritasium',
    name: 'Veritasium',
    category: 'Science',
    color: 'from-blue-500 to-cyan-500',
    videos: [
      { id: 'veri1', title: 'The Most Misunderstood Concept in Physics', thumbnail: 'https://i.ytimg.com/vi/DxL2HoqLbyA/hqdefault.jpg', duration: '18:23', description: "Entropy, time, and why we can't go backward.", level: 'Advanced', channel: 'Veritasium', category: 'Science', youtubeId: 'DxL2HoqLbyA' },
      { id: 'veri2', title: 'How Electricity Actually Works', thumbnail: 'https://i.ytimg.com/vi/oI_X2cMHNe0/hqdefault.jpg', duration: '19:42', description: 'The surprising truth about how electricity flows through wires.', level: 'Intermediate', channel: 'Veritasium', category: 'Science', youtubeId: 'oI_X2cMHNe0' },
      { id: 'veri3', title: 'The Bizarre Behavior of Rotating Bodies', thumbnail: 'https://i.ytimg.com/vi/1VPfZ_XzisU/hqdefault.jpg', duration: '14:11', description: 'Why spinning objects behave so strangely in space.', level: 'Advanced', channel: 'Veritasium', category: 'Science', youtubeId: '1VPfZ_XzisU' },
      { id: 'veri4', title: 'The Surprising Secret of Synchronization', thumbnail: 'https://i.ytimg.com/vi/t-_VPRCtiUg/hqdefault.jpg', duration: '20:07', description: 'How fireflies, metronomes, and neurons sync up spontaneously.', level: 'Intermediate', channel: 'Veritasium', category: 'Science', youtubeId: 't-_VPRCtiUg' },
      { id: 'veri5', title: 'Why Gravity Is NOT a Force', thumbnail: 'https://i.ytimg.com/vi/XRr1kaXKBsU/hqdefault.jpg', duration: '17:34', description: 'Einstein showed gravity is curved spacetime, not a force.', level: 'Advanced', channel: 'Veritasium', category: 'Science', youtubeId: 'XRr1kaXKBsU' },
      { id: 'veri6', title: 'The Fastest Maze-Solving Competition', thumbnail: 'https://i.ytimg.com/vi/ZMQbHMgK2rw/hqdefault.jpg', duration: '21:15', description: 'Micromouse robots race through mazes at incredible speed.', level: 'All Levels', channel: 'Veritasium', category: 'Science', youtubeId: 'ZMQbHMgK2rw' },
    ],
  },
  {
    id: 'kurzgesagt',
    name: 'Kurzgesagt',
    category: 'Science',
    color: 'from-teal-500 to-cyan-600',
    videos: [
      { id: 'kurz1', title: 'The Egg – A Short Story', thumbnail: 'https://i.ytimg.com/vi/h6fcK_fRYaI/hqdefault.jpg', duration: '8:17', description: 'A mind-bending story about identity, humanity, and the universe.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'h6fcK_fRYaI' },
      { id: 'kurz2', title: 'The Immune System Explained', thumbnail: 'https://i.ytimg.com/vi/zQGOcOUBi6s/hqdefault.jpg', duration: '6:48', description: 'How your body defends itself against billions of microbes every day.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Biology', youtubeId: 'zQGOcOUBi6s' },
      { id: 'kurz3', title: 'What If We Detonated All Nuclear Bombs at Once?', thumbnail: 'https://i.ytimg.com/vi/JyECrGp-Sw8/hqdefault.jpg', duration: '9:14', description: 'An animated exploration of the destructive power of nuclear weapons.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'JyECrGp-Sw8' },
      { id: 'kurz4', title: 'You Are Not Where You Think You Are', thumbnail: 'https://i.ytimg.com/vi/Pj-h6MEgE7I/hqdefault.jpg', duration: '8:30', description: 'Your actual position in the universe is far stranger than you imagine.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'Pj-h6MEgE7I' },
      { id: 'kurz5', title: 'The Last Human – A Glimpse Into The Far Future', thumbnail: 'https://i.ytimg.com/vi/LEENEFaVUzU/hqdefault.jpg', duration: '9:40', description: 'What will the last human experience at the end of time?', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'LEENEFaVUzU' },
      { id: 'kurz6', title: 'What Happens If We Throw an Elephant From a Skyscraper?', thumbnail: 'https://i.ytimg.com/vi/f7KSfjv4Oq0/hqdefault.jpg', duration: '6:02', description: 'The square-cube law explained through absurd scenarios.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'f7KSfjv4Oq0' },
    ],
  },
  {
    id: 'nightshift',
    name: 'Nightshift – Kurzgesagt After Dark',
    category: 'History',
    color: 'from-indigo-600 to-violet-700',
    videos: [
      { id: 'ns1', title: 'The Most Satisfying Death in History', thumbnail: 'https://i.ytimg.com/vi/0e-jR2EFWHY/hqdefault.jpg', duration: '12:33', description: 'Explore the weird, beautiful, and sometimes unsettling side of history.', level: 'All Levels', channel: 'Nightshift', category: 'History', youtubeId: '0e-jR2EFWHY' },
      { id: 'ns2', title: 'The City That Stole Children', thumbnail: 'https://i.ytimg.com/vi/3D0SqEi0cME/hqdefault.jpg', duration: '14:11', description: 'A dark chapter of history told through beautiful animation.', level: 'Intermediate', channel: 'Nightshift', category: 'History', youtubeId: '3D0SqEi0cME' },
    ],
  },
  {
    id: '3b1b',
    name: '3Blue1Brown',
    category: 'Mathematics',
    color: 'from-blue-600 to-indigo-500',
    videos: [
      { id: '3b1b1', title: 'The Essence of Calculus', thumbnail: 'https://i.ytimg.com/vi/WUvTyaaNkzM/hqdefault.jpg', duration: '16:30', description: 'Visualizing derivatives and integrals like never before.', level: 'Advanced', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'WUvTyaaNkzM' },
      { id: '3b1b2', title: 'But What Is a Neural Network?', thumbnail: 'https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg', duration: '19:13', description: 'A visual deep-dive into neural networks and deep learning.', level: 'Intermediate', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'aircAruvnKk' },
      { id: '3b1b3', title: 'Linear Algebra — Essence of Linear Algebra', thumbnail: 'https://i.ytimg.com/vi/fNk_zzaMoSs/hqdefault.jpg', duration: '11:22', description: 'Vectors, what even are they? A geometric understanding.', level: 'Intermediate', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'fNk_zzaMoSs' },
      { id: '3b1b4', title: 'But What Is the Fourier Transform?', thumbnail: 'https://i.ytimg.com/vi/spUNpyF58BY/hqdefault.jpg', duration: '20:57', description: 'An animated introduction to the Fourier Transform.', level: 'Advanced', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'spUNpyF58BY' },
      { id: '3b1b5', title: 'Euler\'s Formula — the most beautiful equation', thumbnail: 'https://i.ytimg.com/vi/v0YEaeIClKY/hqdefault.jpg', duration: '23:50', description: 'Why e^(iπ) + 1 = 0 is considered the most beautiful equation.', level: 'Advanced', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'v0YEaeIClKY' },
    ],
  },
  {
    id: 'astrum',
    name: 'Astrum',
    category: 'Science',
    color: 'from-indigo-500 to-purple-600',
    videos: [
      { id: 'astrum1', title: 'The Insane Scale of the Solar System', thumbnail: 'https://i.ytimg.com/vi/Kj4524AAZdE/hqdefault.jpg', duration: '12:45', description: 'A breathtaking journey through the scale of our cosmic neighborhood.', level: 'All Levels', channel: 'Astrum', category: 'Science', youtubeId: 'Kj4524AAZdE' },
      { id: 'astrum2', title: 'The Most Stunning Images of Mars', thumbnail: 'https://i.ytimg.com/vi/ZEyAs3NWH4A/hqdefault.jpg', duration: '26:14', description: 'Real footage and images from the surface of Mars.', level: 'All Levels', channel: 'Astrum', category: 'Science', youtubeId: 'ZEyAs3NWH4A' },
      { id: 'astrum3', title: 'Why Jupiter Is the Scariest Planet', thumbnail: 'https://i.ytimg.com/vi/Xwn8fQSW7-8/hqdefault.jpg', duration: '19:30', description: 'The terrifying storms and magnetic field of Jupiter.', level: 'Intermediate', channel: 'Astrum', category: 'Science', youtubeId: 'Xwn8fQSW7-8' },
    ],
  },
  {
    id: 'african-signal',
    name: 'The African Signal',
    category: 'Africa',
    color: 'from-amber-500 to-orange-600',
    videos: [
      { id: 'afr1', title: 'The Great Zimbabwe: A Lost Empire', thumbnail: 'https://i.ytimg.com/vi/PXSbzLKGB2I/hqdefault.jpg', duration: '14:22', description: 'Uncovering the wealth, architecture, and mystery of Great Zimbabwe.', level: 'Intermediate', channel: 'The African Signal', category: 'Africa', youtubeId: 'PXSbzLKGB2I' },
      { id: 'afr2', title: 'How Ethiopia Stayed Independent', thumbnail: 'https://i.ytimg.com/vi/S3MrtPQkzfs/hqdefault.jpg', duration: '15:40', description: 'The remarkable story of Ethiopian resistance against colonialism.', level: 'All Levels', channel: 'The African Signal', category: 'Africa', youtubeId: 'S3MrtPQkzfs' },
    ],
  },
  {
    id: 'cleoabram',
    name: 'Cleo Abram',
    category: 'Technology',
    color: 'from-pink-500 to-rose-500',
    videos: [
      { id: 'cleo1', title: 'Why Fusion Energy Changes Everything', thumbnail: 'https://i.ytimg.com/vi/KkGbmIP4YzI/hqdefault.jpg', duration: '10:15', description: 'The breakthroughs that could power our future.', level: 'Intermediate', channel: 'Cleo Abram', category: 'Technology', youtubeId: 'KkGbmIP4YzI' },
      { id: 'cleo2', title: 'I Got to Fly a Real Jetpack', thumbnail: 'https://i.ytimg.com/vi/yb2N5gMnNfw/hqdefault.jpg', duration: '12:51', description: 'The future of personal flight and what it means for transportation.', level: 'All Levels', channel: 'Cleo Abram', category: 'Technology', youtubeId: 'yb2N5gMnNfw' },
      { id: 'cleo3', title: 'I Saw the First Humanoid Robot Factory', thumbnail: 'https://i.ytimg.com/vi/wlOkeSdl-r0/hqdefault.jpg', duration: '14:22', description: 'Inside the facility building robots that walk like humans.', level: 'All Levels', channel: 'Cleo Abram', category: 'Technology', youtubeId: 'wlOkeSdl-r0' },
    ],
  },
  {
    id: 'mark-rober',
    name: 'Mark Rober',
    category: 'Engineering',
    color: 'from-green-500 to-emerald-600',
    videos: [
      { id: 'rober1', title: 'Building the Perfect Squirrel-Proof Bird Feeder', thumbnail: 'https://i.ytimg.com/vi/hFZFjoX2cGg/hqdefault.jpg', duration: '21:38', description: 'Former NASA engineer vs squirrels. Who wins?', level: 'All Levels', channel: 'Mark Rober', category: 'Engineering', youtubeId: 'hFZFjoX2cGg' },
      { id: 'rober2', title: 'Glitter Bomb 4.0 vs. Porch Pirates', thumbnail: 'https://i.ytimg.com/vi/h4T_LlK1VE4/hqdefault.jpg', duration: '25:46', description: 'Using engineering to fight package theft with style.', level: 'All Levels', channel: 'Mark Rober', category: 'Engineering', youtubeId: 'h4T_LlK1VE4' },
      { id: 'rober3', title: 'World\'s Largest Horn Shatters Glass', thumbnail: 'https://i.ytimg.com/vi/Boi0XEm9-4E/hqdefault.jpg', duration: '18:33', description: 'Building the world\'s largest horn and testing its destructive power.', level: 'All Levels', channel: 'Mark Rober', category: 'Engineering', youtubeId: 'Boi0XEm9-4E' },
    ],
  },
  {
    id: 'ted-ed',
    name: 'TED-Ed',
    category: 'Science',
    color: 'from-red-500 to-rose-600',
    videos: [
      { id: 'ted1', title: 'How Does Anesthesia Work?', thumbnail: 'https://i.ytimg.com/vi/bEG4nSe6yJY/hqdefault.jpg', duration: '5:24', description: 'The surprisingly mysterious science behind going under.', level: 'All Levels', channel: 'TED-Ed', category: 'Science', youtubeId: 'bEG4nSe6yJY' },
      { id: 'ted2', title: 'What Makes Muscles Grow?', thumbnail: 'https://i.ytimg.com/vi/2tM1LFFxeKg/hqdefault.jpg', duration: '4:38', description: 'The biology of muscle growth explained with beautiful animation.', level: 'All Levels', channel: 'TED-Ed', category: 'Biology', youtubeId: '2tM1LFFxeKg' },
      { id: 'ted3', title: 'How Do Vitamins Work?', thumbnail: 'https://i.ytimg.com/vi/ISZLTJH5lYg/hqdefault.jpg', duration: '4:44', description: 'The essential role of vitamins in keeping your body running.', level: 'All Levels', channel: 'TED-Ed', category: 'Biology', youtubeId: 'ISZLTJH5lYg' },
      { id: 'ted4', title: 'History vs. Cleopatra', thumbnail: 'https://i.ytimg.com/vi/Q_qdkRCXSxo/hqdefault.jpg', duration: '4:15', description: 'Separating fact from fiction about the legendary Egyptian queen.', level: 'All Levels', channel: 'TED-Ed', category: 'History', youtubeId: 'Q_qdkRCXSxo' },
    ],
  },
  {
    id: 'scienceclic',
    name: 'ScienceClic',
    category: 'Science',
    color: 'from-violet-500 to-purple-600',
    videos: [
      { id: 'sclic1', title: 'General Relativity Explained Simply', thumbnail: 'https://i.ytimg.com/vi/AwhKZ3fd9JA/hqdefault.jpg', duration: '15:47', description: 'Einstein\'s greatest theory made visual and intuitive.', level: 'Advanced', channel: 'ScienceClic', category: 'Science', youtubeId: 'AwhKZ3fd9JA' },
      { id: 'sclic2', title: 'Quantum Mechanics — An Intuitive Approach', thumbnail: 'https://i.ytimg.com/vi/WMzjwnTYJk0/hqdefault.jpg', duration: '12:06', description: 'Visualizing the strange world of quantum mechanics.', level: 'Advanced', channel: 'ScienceClic', category: 'Science', youtubeId: 'WMzjwnTYJk0' },
    ],
  },
  {
    id: 'deep-look',
    name: 'Deep Look',
    category: 'Biology',
    color: 'from-lime-500 to-green-600',
    videos: [
      { id: 'deep1', title: 'How Do Ants Carry Things 50x Their Weight?', thumbnail: 'https://i.ytimg.com/vi/x2W35RxfPBU/hqdefault.jpg', duration: '4:12', description: 'Macro photography reveals the incredible strength of ants.', level: 'All Levels', channel: 'Deep Look', category: 'Biology', youtubeId: 'x2W35RxfPBU' },
      { id: 'deep2', title: 'This Mushroom Starts Killing You Before You Know It', thumbnail: 'https://i.ytimg.com/vi/bl10julnauo/hqdefault.jpg', duration: '5:22', description: 'The death cap mushroom — nature\'s silent killer in ultra-macro.', level: 'All Levels', channel: 'Deep Look', category: 'Biology', youtubeId: 'bl10julnauo' },
    ],
  },
  {
    id: 'nature-pbs',
    name: 'Nature on PBS',
    category: 'Biology',
    color: 'from-emerald-500 to-green-600',
    videos: [
      { id: 'pbs1', title: 'The Secret World of Fungi', thumbnail: 'https://i.ytimg.com/vi/3OIxL-RUz7s/hqdefault.jpg', duration: '53:21', description: 'How fungi networks connect entire forests underground.', level: 'All Levels', channel: 'Nature on PBS', category: 'Biology', youtubeId: '3OIxL-RUz7s' },
    ],
  },
  {
    id: 'nova-pbs',
    name: 'NOVA PBS',
    category: 'Science',
    color: 'from-sky-500 to-blue-600',
    videos: [
      { id: 'nova1', title: 'The Fabric of the Cosmos', thumbnail: 'https://i.ytimg.com/vi/BII-MXlzcqE/hqdefault.jpg', duration: '52:18', description: 'Brian Greene explores space, time, and the nature of reality.', level: 'Advanced', channel: 'NOVA PBS', category: 'Science', youtubeId: 'BII-MXlzcqE' },
      { id: 'nova2', title: 'Can We Cool the Planet?', thumbnail: 'https://i.ytimg.com/vi/Gv12JJIFMaQ/hqdefault.jpg', duration: '53:30', description: 'Scientists race to find ways to reverse climate change.', level: 'Intermediate', channel: 'NOVA PBS', category: 'Science', youtubeId: 'Gv12JJIFMaQ' },
    ],
  },
  {
    id: 'aperture',
    name: 'Aperture',
    category: 'Philosophy',
    color: 'from-amber-500 to-yellow-600',
    videos: [
      { id: 'aper1', title: 'The Most Disturbing Thought Experiment', thumbnail: 'https://i.ytimg.com/vi/4b33NTAuF5E/hqdefault.jpg', duration: '13:08', description: 'Boltzmann brains, simulation theory, and the limits of reality.', level: 'Advanced', channel: 'Aperture', category: 'Philosophy', youtubeId: '4b33NTAuF5E' },
      { id: 'aper2', title: 'Why You\'re Not Really Alive', thumbnail: 'https://i.ytimg.com/vi/GCf8FIn-JUg/hqdefault.jpg', duration: '11:45', description: 'What does it actually mean to be alive? Philosophy meets biology.', level: 'Advanced', channel: 'Aperture', category: 'Philosophy', youtubeId: 'GCf8FIn-JUg' },
    ],
  },
  {
    id: 'johnny-harris',
    name: 'Johnny Harris',
    category: 'History',
    color: 'from-orange-500 to-red-600',
    videos: [
      { id: 'jh1', title: 'Why Africa Is Changing the World', thumbnail: 'https://i.ytimg.com/vi/i8TwGBavhco/hqdefault.jpg', duration: '16:44', description: 'An independent journalist explores Africa\'s rising influence on global affairs.', level: 'All Levels', channel: 'Johnny Harris', category: 'Africa', youtubeId: 'i8TwGBavhco' },
      { id: 'jh2', title: 'How the US Stole the Middle East', thumbnail: 'https://i.ytimg.com/vi/1wm72oqsYqA/hqdefault.jpg', duration: '14:55', description: 'The geopolitics of oil, power, and foreign intervention.', level: 'All Levels', channel: 'Johnny Harris', category: 'History', youtubeId: '1wm72oqsYqA' },
    ],
  },
  {
    id: 'real-science',
    name: 'Real Science',
    category: 'Biology',
    color: 'from-teal-500 to-emerald-600',
    videos: [
      { id: 'rs1', title: 'The Insane Biology of the Octopus', thumbnail: 'https://i.ytimg.com/vi/mFP_AjJeP-M/hqdefault.jpg', duration: '14:02', description: 'How octopuses edit their own RNA and rewire their brains.', level: 'Intermediate', channel: 'Real Science', category: 'Biology', youtubeId: 'mFP_AjJeP-M' },
      { id: 'rs2', title: 'Why Blue Whales Don\'t Get Cancer', thumbnail: 'https://i.ytimg.com/vi/1AElONvi9WQ/hqdefault.jpg', duration: '15:30', description: 'Peto\'s Paradox and what it means for cancer research.', level: 'Intermediate', channel: 'Real Science', category: 'Biology', youtubeId: '1AElONvi9WQ' },
    ],
  },
  {
    id: 'be-smart',
    name: 'Be Smart',
    category: 'Science',
    color: 'from-cyan-500 to-blue-600',
    videos: [
      { id: 'bs1', title: 'Why Does Ice Float?', thumbnail: 'https://i.ytimg.com/vi/UukRgqzk-KE/hqdefault.jpg', duration: '10:33', description: 'The simple question that reveals deep physics.', level: 'All Levels', channel: 'Be Smart', category: 'Science', youtubeId: 'UukRgqzk-KE' },
      { id: 'bs2', title: 'What Color Is a Mirror?', thumbnail: 'https://i.ytimg.com/vi/-yrZpTHBEss/hqdefault.jpg', duration: '8:30', description: 'A surprisingly tricky question about optics and perception.', level: 'All Levels', channel: 'Be Smart', category: 'Science', youtubeId: '-yrZpTHBEss' },
    ],
  },
  {
    id: 'artem-kirsanov',
    name: 'Artem Kirsanov',
    category: 'Science',
    color: 'from-indigo-500 to-blue-600',
    videos: [
      { id: 'art1', title: 'How Your Brain Learns New Concepts', thumbnail: 'https://i.ytimg.com/vi/rA5qnZUXcqo/hqdefault.jpg', duration: '18:44', description: 'At the intersection of neuroscience, CS and mathematics.', level: 'Advanced', channel: 'Artem Kirsanov', category: 'Science', youtubeId: 'rA5qnZUXcqo' },
      { id: 'art2', title: 'The Geometry of Neural Networks', thumbnail: 'https://i.ytimg.com/vi/wjZofJX0v4M/hqdefault.jpg', duration: '22:11', description: 'How neural networks transform data in high-dimensional space.', level: 'Advanced', channel: 'Artem Kirsanov', category: 'Science', youtubeId: 'wjZofJX0v4M' },
    ],
  },
  {
    id: 'ancient-tech',
    name: 'Ancient Tech',
    category: 'History',
    color: 'from-stone-500 to-amber-600',
    videos: [
      { id: 'anc1', title: 'Roman Concrete: Why Modern Concrete Can\'t Compare', thumbnail: 'https://i.ytimg.com/vi/qpoSs1-_jL0/hqdefault.jpg', duration: '12:09', description: 'The lost engineering of Roman concrete that self-heals.', level: 'All Levels', channel: 'Ancient Tech', category: 'History', youtubeId: 'qpoSs1-_jL0' },
      { id: 'anc2', title: 'The Antikythera Mechanism — Ancient Computer', thumbnail: 'https://i.ytimg.com/vi/UpLcnAIpVRA/hqdefault.jpg', duration: '14:20', description: 'A 2000-year-old analog computer found in a shipwreck.', level: 'Intermediate', channel: 'Ancient Tech', category: 'History', youtubeId: 'UpLcnAIpVRA' },
    ],
  },
  {
    id: 'ioha',
    name: 'Institute of Human Anatomy',
    category: 'Biology',
    color: 'from-rose-500 to-red-600',
    videos: [
      { id: 'ioha1', title: 'What Happens to Your Body After You Die', thumbnail: 'https://i.ytimg.com/vi/PfFCnXIdjpY/hqdefault.jpg', duration: '11:58', description: 'A cadaver lab reveals what happens after death.', level: 'Intermediate', channel: 'Institute of Human Anatomy', category: 'Biology', youtubeId: 'PfFCnXIdjpY' },
      { id: 'ioha2', title: 'What Sitting Does to Your Body', thumbnail: 'https://i.ytimg.com/vi/JNt5_pWOkR4/hqdefault.jpg', duration: '10:15', description: 'The anatomical effects of prolonged sitting on real cadavers.', level: 'All Levels', channel: 'Institute of Human Anatomy', category: 'Biology', youtubeId: 'JNt5_pWOkR4' },
    ],
  },
  {
    id: 'gapminder',
    name: 'Gapminder',
    category: 'History',
    color: 'from-yellow-500 to-orange-600',
    videos: [
      { id: 'gap1', title: 'How Not to Be Ignorant About the World', thumbnail: 'https://i.ytimg.com/vi/Sm5xF-UYgdg/hqdefault.jpg', duration: '19:21', description: 'Hans Rosling shows why our view of the world is statistically wrong.', level: 'All Levels', channel: 'Gapminder', category: 'History', youtubeId: 'Sm5xF-UYgdg' },
      { id: 'gap2', title: 'The Best Stats You\'ve Ever Seen', thumbnail: 'https://i.ytimg.com/vi/hVimVzgtD6w/hqdefault.jpg', duration: '19:48', description: 'Hans Rosling\'s legendary TED talk that changed data visualization.', level: 'All Levels', channel: 'Gapminder', category: 'History', youtubeId: 'hVimVzgtD6w' },
    ],
  },
  {
    id: 'closer-to-truth',
    name: 'Closer To Truth',
    category: 'Philosophy',
    color: 'from-slate-500 to-gray-600',
    videos: [
      { id: 'ctt1', title: 'Why Is There Something Rather Than Nothing?', thumbnail: 'https://i.ytimg.com/vi/vlNylFz-GXE/hqdefault.jpg', duration: '26:41', description: 'Philosophers and physicists tackle the deepest question.', level: 'Advanced', channel: 'Closer To Truth', category: 'Philosophy', youtubeId: 'vlNylFz-GXE' },
      { id: 'ctt2', title: 'Is Consciousness an Illusion?', thumbnail: 'https://i.ytimg.com/vi/p_RqTdO7HBc/hqdefault.jpg', duration: '28:15', description: 'Leading thinkers debate the nature of conscious experience.', level: 'Advanced', channel: 'Closer To Truth', category: 'Philosophy', youtubeId: 'p_RqTdO7HBc' },
    ],
  },
  {
    id: 'rabbit-hole',
    name: 'Rabbit Hole',
    category: 'Science',
    color: 'from-purple-500 to-fuchsia-600',
    videos: [
      { id: 'rh1', title: 'Why We Still Don\'t Understand Sleep', thumbnail: 'https://i.ytimg.com/vi/GWBM4xIjHRQ/hqdefault.jpg', duration: '15:23', description: 'The greatest unsolved mystery in biology.', level: 'All Levels', channel: 'Rabbit Hole', category: 'Science', youtubeId: 'GWBM4xIjHRQ' },
    ],
  },
  {
    id: 'brainbook',
    name: 'Brainbook',
    category: 'Biology',
    color: 'from-red-500 to-pink-600',
    videos: [
      { id: 'bb1', title: 'Inside the Brain: A Neurosurgery Journey', thumbnail: 'https://i.ytimg.com/vi/JzR1ydIJ-P4/hqdefault.jpg', duration: '9:45', description: 'Real neurosurgery explained with beautiful medical-imaging.', level: 'Advanced', channel: 'Brainbook', category: 'Biology', youtubeId: 'JzR1ydIJ-P4' },
    ],
  },
  {
    id: 'casual-geographic',
    name: 'Casual Geographic',
    category: 'Biology',
    color: 'from-green-500 to-lime-600',
    videos: [
      { id: 'cg1', title: 'The Most Disrespectful Animals on Earth', thumbnail: 'https://i.ytimg.com/vi/LJvvxEs1jnI/hqdefault.jpg', duration: '12:33', description: 'Hilarious breakdown of the animal kingdom\'s biggest bullies.', level: 'All Levels', channel: 'Casual Geographic', category: 'Biology', youtubeId: 'LJvvxEs1jnI' },
      { id: 'cg2', title: 'Why Honey Badgers Don\'t Care', thumbnail: 'https://i.ytimg.com/vi/box0-koAuIY/hqdefault.jpg', duration: '10:22', description: 'The animal that fears nothing and attacks everything.', level: 'All Levels', channel: 'Casual Geographic', category: 'Biology', youtubeId: 'box0-koAuIY' },
    ],
  },
  {
    id: 'joel-creates',
    name: 'Joel Creates',
    category: 'Engineering',
    color: 'from-cyan-500 to-teal-600',
    videos: [
      { id: 'jc1', title: 'I Built a Real Working Iron Man Helmet', thumbnail: 'https://i.ytimg.com/vi/M3D0LOl8Z9g/hqdefault.jpg', duration: '16:02', description: 'Engineering the impossible — a fully functional motorized helmet.', level: 'Intermediate', channel: 'Joel Creates', category: 'Engineering', youtubeId: 'M3D0LOl8Z9g' },
    ],
  },
  {
    id: 'neil-halloran',
    name: 'Neil Halloran',
    category: 'History',
    color: 'from-slate-500 to-zinc-600',
    videos: [
      { id: 'nh1', title: 'The Fallen of World War II', thumbnail: 'https://i.ytimg.com/vi/DwKPFT-RioU/hqdefault.jpg', duration: '18:30', description: 'A data-driven documentary about the human cost of WWII.', level: 'All Levels', channel: 'Neil Halloran', category: 'History', youtubeId: 'DwKPFT-RioU' },
    ],
  },
  {
    id: 'gpad-maths',
    name: 'Gpad Learn Maths',
    category: 'Mathematics',
    color: 'from-orange-500 to-amber-600',
    videos: [
      { id: 'gpad1', title: 'How to Solve Any Quadratic Equation', thumbnail: 'https://i.ytimg.com/vi/IlNAJl36-10/hqdefault.jpg', duration: '12:15', description: 'Master quadratics with this clear step-by-step guide.', level: 'Beginner', channel: 'Gpad Learn Maths', category: 'Mathematics', youtubeId: 'IlNAJl36-10' },
      { id: 'gpad2', title: 'Trigonometry Made Easy', thumbnail: 'https://i.ytimg.com/vi/PUB0TaZ7bhA/hqdefault.jpg', duration: '15:30', description: 'Understand sin, cos, and tan from scratch.', level: 'Beginner', channel: 'Gpad Learn Maths', category: 'Mathematics', youtubeId: 'PUB0TaZ7bhA' },
    ],
  },
  // ---- NEW CHANNELS FROM NOTION ----
  {
    id: 'satori-graphics',
    name: 'Satori Graphics',
    category: 'Design',
    color: 'from-fuchsia-500 to-pink-600',
    videos: [
      { id: 'sat1', title: '5 Logo Design Tips That Pros Use', thumbnail: 'https://i.ytimg.com/vi/j-yoMr8M0Mk/hqdefault.jpg', duration: '10:32', description: 'Professional logo design principles that elevate your brand.', level: 'Intermediate', channel: 'Satori Graphics', category: 'Design', youtubeId: 'j-yoMr8M0Mk' },
      { id: 'sat2', title: 'Color Theory for Graphic Designers', thumbnail: 'https://i.ytimg.com/vi/_2LLXnUdUIc/hqdefault.jpg', duration: '12:18', description: 'How to use color psychology in your designs.', level: 'Beginner', channel: 'Satori Graphics', category: 'Design', youtubeId: '_2LLXnUdUIc' },
      { id: 'sat3', title: 'Typography Rules Every Designer Must Know', thumbnail: 'https://i.ytimg.com/vi/QrNi9FmdlxY/hqdefault.jpg', duration: '8:45', description: 'Master the art of type selection and pairing.', level: 'All Levels', channel: 'Satori Graphics', category: 'Design', youtubeId: 'QrNi9FmdlxY' },
    ],
  },
  {
    id: 'geoglobetales',
    name: 'GeoGlobeTales',
    category: 'Geography',
    color: 'from-emerald-500 to-teal-500',
    videos: [
      { id: 'geo1', title: 'Countries That Will Disappear Soon', thumbnail: 'https://i.ytimg.com/vi/3DUHQK2ZOYU/hqdefault.jpg', duration: '0:58', description: 'Rising sea levels threaten entire nations.', level: 'All Levels', channel: 'GeoGlobeTales', category: 'Geography', youtubeId: '3DUHQK2ZOYU', isShort: true },
      { id: 'geo2', title: 'The Smallest Countries You\'ve Never Heard Of', thumbnail: 'https://i.ytimg.com/vi/5Op6OaB7sH4/hqdefault.jpg', duration: '0:50', description: 'Tiny nations with fascinating stories.', level: 'All Levels', channel: 'GeoGlobeTales', category: 'Geography', youtubeId: '5Op6OaB7sH4', isShort: true },
      { id: 'geo3', title: 'Why Africa\'s Borders Are So Straight', thumbnail: 'https://i.ytimg.com/vi/X4sPAhG4aHk/hqdefault.jpg', duration: '0:55', description: 'The colonial history behind African borders.', level: 'All Levels', channel: 'GeoGlobeTales', category: 'Geography', youtubeId: 'X4sPAhG4aHk', isShort: true },
    ],
  },
  {
    id: 'cardom',
    name: 'Cardom',
    category: 'Cars',
    color: 'from-red-500 to-orange-500',
    videos: [
      { id: 'car1', title: 'How a Car Engine Works', thumbnail: 'https://i.ytimg.com/vi/DKF5dKo_r2c/hqdefault.jpg', duration: '0:59', description: 'Internal combustion explained in 60 seconds.', level: 'All Levels', channel: 'Cardom', category: 'Cars', youtubeId: 'DKF5dKo_r2c', isShort: true },
      { id: 'car2', title: 'Turbo vs Supercharger Explained', thumbnail: 'https://i.ytimg.com/vi/R8M5WNMR8Y/hqdefault.jpg', duration: '0:55', description: 'The difference between forced induction methods.', level: 'All Levels', channel: 'Cardom', category: 'Cars', youtubeId: 'R8M5WNMR8Y', isShort: true },
      { id: 'car3', title: 'How AWD Actually Works', thumbnail: 'https://i.ytimg.com/vi/gzLtVj-f30c/hqdefault.jpg', duration: '0:58', description: 'All-wheel drive systems demystified.', level: 'All Levels', channel: 'Cardom', category: 'Cars', youtubeId: 'gzLtVj-f30c', isShort: true },
    ],
  },
  {
    id: 'cookrecipes',
    name: 'CookRecipes',
    category: 'Cooking',
    color: 'from-amber-500 to-red-500',
    videos: [
      { id: 'cook1', title: 'Perfect Fried Rice in 60 Seconds', thumbnail: 'https://i.ytimg.com/vi/l-kshtNraWE/hqdefault.jpg', duration: '0:58', description: 'Quick fried rice technique for beginners.', level: 'All Levels', channel: 'CookRecipes', category: 'Cooking', youtubeId: 'l-kshtNraWE', isShort: true },
      { id: 'cook2', title: 'The Easiest Pasta Trick', thumbnail: 'https://i.ytimg.com/vi/bJUiWdM__Qw/hqdefault.jpg', duration: '0:55', description: 'A cooking hack that will change your pasta game.', level: 'All Levels', channel: 'CookRecipes', category: 'Cooking', youtubeId: 'bJUiWdM__Qw', isShort: true },
    ],
  },
  {
    id: 'brain-inventor',
    name: 'Brain Inventor',
    category: 'Engineering',
    color: 'from-zinc-500 to-slate-600',
    videos: [
      { id: 'bi1', title: 'Perfect TIG Welding Technique', thumbnail: 'https://i.ytimg.com/vi/s_qMz-O4mMY/hqdefault.jpg', duration: '0:59', description: 'Satisfying welding short showing perfect bead technique.', level: 'All Levels', channel: 'Brain Inventor', category: 'Engineering', youtubeId: 's_qMz-O4mMY', isShort: true },
      { id: 'bi2', title: 'Smart Metal Cutting Trick', thumbnail: 'https://i.ytimg.com/vi/4wXwRDkXJ0U/hqdefault.jpg', duration: '0:50', description: 'Work smarter not harder with this angle grinder tip.', level: 'Intermediate', channel: 'Brain Inventor', category: 'Engineering', youtubeId: '4wXwRDkXJ0U', isShort: true },
    ],
  },
  {
    id: 'code-circuit',
    name: 'Code & Circuit',
    category: 'Technology',
    color: 'from-green-500 to-cyan-500',
    videos: [
      { id: 'cc1', title: 'Build Your Own LED Matrix', thumbnail: 'https://i.ytimg.com/vi/2yfHhHCP_rQ/hqdefault.jpg', duration: '0:58', description: 'DIY electronics project in under a minute.', level: 'Intermediate', channel: 'Code & Circuit', category: 'Technology', youtubeId: '2yfHhHCP_rQ', isShort: true },
      { id: 'cc2', title: 'Raspberry Pi Security Camera', thumbnail: 'https://i.ytimg.com/vi/WR3bP8EKYPA/hqdefault.jpg', duration: '0:55', description: 'Build a home security system with a Raspberry Pi.', level: 'Intermediate', channel: 'Code & Circuit', category: 'Technology', youtubeId: 'WR3bP8EKYPA', isShort: true },
    ],
  },
  {
    id: 'hydraulic-systems',
    name: 'Hydraulic & Pneumatic Systems',
    category: 'Engineering',
    color: 'from-blue-600 to-indigo-600',
    videos: [
      { id: 'hyd1', title: 'How a Hydraulic Pump Works', thumbnail: 'https://i.ytimg.com/vi/gQV-nRBwpWs/hqdefault.jpg', duration: '8:15', description: 'Detailed 3D animation of hydraulic pump internals.', level: 'Intermediate', channel: 'Hydraulic Systems', category: 'Engineering', youtubeId: 'gQV-nRBwpWs' },
      { id: 'hyd2', title: 'How a Hydraulic Cylinder Works', thumbnail: 'https://i.ytimg.com/vi/c_dF8jEGRwM/hqdefault.jpg', duration: '6:44', description: 'The mechanics of hydraulic cylinders explained visually.', level: 'Intermediate', channel: 'Hydraulic Systems', category: 'Engineering', youtubeId: 'c_dF8jEGRwM' },
    ],
  },
  {
    id: 'ai4next',
    name: 'AI4Next',
    category: 'AI',
    color: 'from-violet-500 to-indigo-500',
    videos: [
      { id: 'ai1', title: 'The Best AI Tools of 2025', thumbnail: 'https://i.ytimg.com/vi/jl45qBhYaBU/hqdefault.jpg', duration: '12:30', description: 'A comprehensive review of the most powerful AI tools available today.', level: 'All Levels', channel: 'AI4Next', category: 'AI', youtubeId: 'jl45qBhYaBU' },
      { id: 'ai2', title: 'How to Use AI for Studying', thumbnail: 'https://i.ytimg.com/vi/2xUVQ7kA99s/hqdefault.jpg', duration: '10:15', description: 'Practical AI study techniques for students.', level: 'All Levels', channel: 'AI4Next', category: 'AI', youtubeId: '2xUVQ7kA99s' },
    ],
  },
  {
    id: 'justhackify',
    name: 'JustHackify',
    category: 'Science',
    color: 'from-yellow-500 to-lime-500',
    videos: [
      { id: 'jh_s1', title: 'Science Experiment You Can Try at Home', thumbnail: 'https://i.ytimg.com/vi/Bi-Up8Xuh9c/hqdefault.jpg', duration: '0:45', description: 'Quick science trick explained with real physics.', level: 'All Levels', channel: 'JustHackify', category: 'Science', youtubeId: 'Bi-Up8Xuh9c', isShort: true },
      { id: 'jh_s2', title: 'Water Bending Trick Explained', thumbnail: 'https://i.ytimg.com/vi/piA_BaREYBs/hqdefault.jpg', duration: '0:50', description: 'Static electricity makes water bend — here\'s why.', level: 'All Levels', channel: 'JustHackify', category: 'Science', youtubeId: 'piA_BaREYBs', isShort: true },
    ],
  },
  {
    id: 'magic-3d',
    name: 'Magic 3D',
    category: 'Design',
    color: 'from-purple-500 to-pink-500',
    videos: [
      { id: 'mg1', title: 'Satisfying 3D Animation Loop', thumbnail: 'https://i.ytimg.com/vi/vRdp7LyF0Hg/hqdefault.jpg', duration: '0:30', description: 'Mesmerizing 3D visual art that loops perfectly.', level: 'All Levels', channel: 'Magic 3D', category: 'Design', youtubeId: 'vRdp7LyF0Hg', isShort: true },
      { id: 'mg2', title: 'How Objects Are 3D Printed', thumbnail: 'https://i.ytimg.com/vi/_Ca5Cs4ON4c/hqdefault.jpg', duration: '0:55', description: 'The 3D printing process in mesmerizing detail.', level: 'All Levels', channel: 'Magic 3D', category: 'Design', youtubeId: '_Ca5Cs4ON4c', isShort: true },
    ],
  },
  {
    id: 'wocomodocs',
    name: 'wocomoDOCS',
    category: 'Documentaries',
    color: 'from-gray-600 to-slate-700',
    videos: [
      { id: 'woc1', title: 'The Story of Energy', thumbnail: 'https://i.ytimg.com/vi/S4O5voOCqAQ/hqdefault.jpg', duration: '52:10', description: 'How humanity harnessed energy to build civilization.', level: 'All Levels', channel: 'wocomoDOCS', category: 'Documentaries', youtubeId: 'S4O5voOCqAQ' },
      { id: 'woc2', title: 'The Secret Life of the Brain', thumbnail: 'https://i.ytimg.com/vi/kLDitGAUrno/hqdefault.jpg', duration: '48:30', description: 'A deep documentary exploring how the brain shapes our reality.', level: 'Intermediate', channel: 'wocomoDOCS', category: 'Documentaries', youtubeId: 'kLDitGAUrno' },
    ],
  },
  {
    id: 'raviraj-master',
    name: 'Raviraj Master',
    category: 'Science',
    color: 'from-orange-500 to-yellow-500',
    videos: [
      { id: 'rav1', title: 'Fun Science Experiment for Students', thumbnail: 'https://i.ytimg.com/vi/jDbsJXUAj3E/hqdefault.jpg', duration: '8:12', description: 'Engaging classroom science experiments anyone can do.', level: 'Beginner', channel: 'Raviraj Master', category: 'Science', youtubeId: 'jDbsJXUAj3E' },
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
