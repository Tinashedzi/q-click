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

export const categories = ['All', 'Science', 'Mathematics', 'Technology', 'Africa', 'Biology', 'History', 'Engineering', 'Philosophy', 'Future Quotient'];

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
    ],
  },
  {
    id: 'astrum',
    name: 'Astrum',
    category: 'Science',
    color: 'from-indigo-500 to-purple-600',
    videos: [
      { id: 'astrum1', title: 'The Insane Scale of the Solar System', thumbnail: 'https://i.ytimg.com/vi/Kj4524AAZdE/hqdefault.jpg', duration: '12:45', description: 'A breathtaking journey through the scale of our cosmic neighborhood.', level: 'All Levels', channel: 'Astrum', category: 'Science', youtubeId: 'Kj4524AAZdE' },
    ],
  },
  {
    id: 'african-signal',
    name: 'The African Signal',
    category: 'Africa',
    color: 'from-amber-500 to-orange-600',
    videos: [
      { id: 'afr1', title: 'The Great Zimbabwe: A Lost Empire', thumbnail: 'https://i.ytimg.com/vi/PXSbzLKGB2I/hqdefault.jpg', duration: '14:22', description: 'Uncovering the wealth, architecture, and mystery of Great Zimbabwe.', level: 'Intermediate', channel: 'The African Signal', category: 'Africa', youtubeId: 'PXSbzLKGB2I' },
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
    ],
  },
  {
    id: 'scienceclic',
    name: 'ScienceClic',
    category: 'Science',
    color: 'from-violet-500 to-purple-600',
    videos: [
      { id: 'sclic1', title: 'General Relativity Explained Simply', thumbnail: 'https://i.ytimg.com/vi/AwhKZ3fd9JA/hqdefault.jpg', duration: '15:47', description: 'Einstein\'s greatest theory made visual and intuitive.', level: 'Advanced', channel: 'ScienceClic', category: 'Science', youtubeId: 'AwhKZ3fd9JA' },
    ],
  },
  {
    id: 'deep-look',
    name: 'Deep Look',
    category: 'Biology',
    color: 'from-lime-500 to-green-600',
    videos: [
      { id: 'deep1', title: 'How Do Ants Carry Things 50x Their Weight?', thumbnail: 'https://i.ytimg.com/vi/x2W35RxfPBU/hqdefault.jpg', duration: '4:12', description: 'Macro photography reveals the incredible strength of ants.', level: 'All Levels', channel: 'Deep Look', category: 'Biology', youtubeId: 'x2W35RxfPBU' },
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
    ],
  },
  {
    id: 'aperture',
    name: 'Aperture',
    category: 'Philosophy',
    color: 'from-amber-500 to-yellow-600',
    videos: [
      { id: 'aper1', title: 'The Most Disturbing Thought Experiment', thumbnail: 'https://i.ytimg.com/vi/4b33NTAuF5E/hqdefault.jpg', duration: '13:08', description: 'Boltzmann brains, simulation theory, and the limits of reality.', level: 'Advanced', channel: 'Aperture', category: 'Philosophy', youtubeId: '4b33NTAuF5E' },
    ],
  },
  {
    id: 'johnny-harris',
    name: 'Johnny Harris',
    category: 'History',
    color: 'from-orange-500 to-red-600',
    videos: [
      { id: 'jh1', title: 'Why Africa Is Changing the World', thumbnail: 'https://i.ytimg.com/vi/i8TwGBavhco/hqdefault.jpg', duration: '16:44', description: 'An independent journalist explores Africa\'s rising influence on global affairs.', level: 'All Levels', channel: 'Johnny Harris', category: 'Africa', youtubeId: 'i8TwGBavhco' },
    ],
  },
  {
    id: 'real-science',
    name: 'Real Science',
    category: 'Biology',
    color: 'from-teal-500 to-emerald-600',
    videos: [
      { id: 'rs1', title: 'The Insane Biology of the Octopus', thumbnail: 'https://i.ytimg.com/vi/mFP_AjJeP-M/hqdefault.jpg', duration: '14:02', description: 'How octopuses edit their own RNA and rewire their brains.', level: 'Intermediate', channel: 'Real Science', category: 'Biology', youtubeId: 'mFP_AjJeP-M' },
    ],
  },
  {
    id: 'be-smart',
    name: 'Be Smart',
    category: 'Science',
    color: 'from-cyan-500 to-blue-600',
    videos: [
      { id: 'bs1', title: 'Why Does Ice Float?', thumbnail: 'https://i.ytimg.com/vi/UukRgqzk-KE/hqdefault.jpg', duration: '10:33', description: 'The simple question that reveals deep physics.', level: 'All Levels', channel: 'Be Smart', category: 'Science', youtubeId: 'UukRgqzk-KE' },
    ],
  },
  {
    id: 'artem-kirsanov',
    name: 'Artem Kirsanov',
    category: 'Science',
    color: 'from-indigo-500 to-blue-600',
    videos: [
      { id: 'art1', title: 'How Your Brain Learns New Concepts', thumbnail: 'https://i.ytimg.com/vi/rA5qnZUXcqo/hqdefault.jpg', duration: '18:44', description: 'At the intersection of neuroscience, CS and mathematics.', level: 'Advanced', channel: 'Artem Kirsanov', category: 'Science', youtubeId: 'rA5qnZUXcqo' },
    ],
  },
  {
    id: 'ancient-tech',
    name: 'Ancient Tech',
    category: 'History',
    color: 'from-stone-500 to-amber-600',
    videos: [
      { id: 'anc1', title: 'Roman Concrete: Why Modern Concrete Can\'t Compare', thumbnail: 'https://i.ytimg.com/vi/qpoSs1-_jL0/hqdefault.jpg', duration: '12:09', description: 'The lost engineering of Roman concrete that self-heals.', level: 'All Levels', channel: 'Ancient Tech', category: 'History', youtubeId: 'qpoSs1-_jL0' },
    ],
  },
  {
    id: 'ioha',
    name: 'Institute of Human Anatomy',
    category: 'Biology',
    color: 'from-rose-500 to-red-600',
    videos: [
      { id: 'ioha1', title: 'What Happens to Your Body After You Die', thumbnail: 'https://i.ytimg.com/vi/PfFCnXIdjpY/hqdefault.jpg', duration: '11:58', description: 'A cadaver lab reveals what happens after death.', level: 'Intermediate', channel: 'Institute of Human Anatomy', category: 'Biology', youtubeId: 'PfFCnXIdjpY' },
    ],
  },
  {
    id: 'gapminder',
    name: 'Gapminder',
    category: 'History',
    color: 'from-yellow-500 to-orange-600',
    videos: [
      { id: 'gap1', title: 'How Not to Be Ignorant About the World', thumbnail: 'https://i.ytimg.com/vi/Sm5xF-UYgdg/hqdefault.jpg', duration: '19:21', description: 'Hans Rosling shows why our view of the world is statistically wrong.', level: 'All Levels', channel: 'Gapminder', category: 'History', youtubeId: 'Sm5xF-UYgdg' },
    ],
  },
  {
    id: 'closer-to-truth',
    name: 'Closer To Truth',
    category: 'Philosophy',
    color: 'from-slate-500 to-gray-600',
    videos: [
      { id: 'ctt1', title: 'Why Is There Something Rather Than Nothing?', thumbnail: 'https://i.ytimg.com/vi/vlNylFz-GXE/hqdefault.jpg', duration: '26:41', description: 'Philosophers and physicists tackle the deepest question.', level: 'Advanced', channel: 'Closer To Truth', category: 'Philosophy', youtubeId: 'vlNylFz-GXE' },
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
