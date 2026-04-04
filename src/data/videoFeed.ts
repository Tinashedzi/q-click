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

export const categories = ['All', 'Shorts', 'Science', 'Mathematics', 'Technology', 'Africa', 'Biology', 'History', 'Engineering', 'Philosophy', 'Design', 'Geography', 'AI', 'Documentaries'];

export const videoChannels: VideoChannel[] = [
  {
    id: 'veritasium',
    name: 'Veritasium',
    category: 'Science',
    color: 'from-blue-500 to-cyan-500',
    videos: [
      { id: 'veri1', title: 'The Most Misunderstood Concept in Physics', thumbnail: '', duration: '18:23', description: "Entropy, time, and why we can't go backward.", level: 'Advanced', channel: 'Veritasium', category: 'Science', youtubeId: 'DxL2HoqLbyA' },
      { id: 'veri2', title: 'How Electricity Actually Works', thumbnail: '', duration: '19:42', description: 'The surprising truth about how electricity flows through wires.', level: 'Intermediate', channel: 'Veritasium', category: 'Science', youtubeId: 'oI_X2cMHNe0' },
      { id: 'veri3', title: 'The Bizarre Behavior of Rotating Bodies', thumbnail: '', duration: '14:11', description: 'Why spinning objects behave so strangely in space.', level: 'Advanced', channel: 'Veritasium', category: 'Science', youtubeId: '1VPfZ_XzisU' },
      { id: 'veri4', title: 'The Surprising Secret of Synchronization', thumbnail: '', duration: '20:07', description: 'How fireflies, metronomes, and neurons sync up spontaneously.', level: 'Intermediate', channel: 'Veritasium', category: 'Science', youtubeId: 't-_VPRCtiUg' },
      { id: 'veri5', title: 'Why Gravity Is NOT a Force', thumbnail: '', duration: '17:34', description: 'Einstein showed gravity is curved spacetime, not a force.', level: 'Advanced', channel: 'Veritasium', category: 'Science', youtubeId: 'XRr1kaXKBsU' },
      { id: 'veri6', title: 'The Fastest Maze-Solving Competition', thumbnail: '', duration: '21:15', description: 'Micromouse robots race through mazes at incredible speed.', level: 'All Levels', channel: 'Veritasium', category: 'Science', youtubeId: 'ZMQbHMgK2rw' },
    ],
  },
  {
    id: 'kurzgesagt',
    name: 'Kurzgesagt',
    category: 'Science',
    color: 'from-teal-500 to-cyan-600',
    videos: [
      { id: 'kurz1', title: 'The Egg – A Short Story', thumbnail: '', duration: '8:17', description: 'A mind-bending story about identity, humanity, and the universe.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'h6fcK_fRYaI' },
      { id: 'kurz2', title: 'The Immune System Explained', thumbnail: '', duration: '6:48', description: 'How your body defends itself against billions of microbes every day.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Biology', youtubeId: 'zQGOcOUBi6s' },
      { id: 'kurz3', title: 'What If We Detonated All Nuclear Bombs at Once?', thumbnail: '', duration: '9:14', description: 'An animated exploration of the destructive power of nuclear weapons.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'JyECrGp-Sw8' },
      { id: 'kurz4', title: 'You Are Not Where You Think You Are', thumbnail: '', duration: '8:30', description: 'Your actual position in the universe is far stranger than you imagine.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'Pj-h6MEgE7I' },
      { id: 'kurz5', title: 'The Last Human – A Glimpse Into The Far Future', thumbnail: '', duration: '9:40', description: 'What will the last human experience at the end of time?', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'LEENEFaVUzU' },
      { id: 'kurz6', title: 'What Happens If We Throw an Elephant From a Skyscraper?', thumbnail: '', duration: '6:02', description: 'The square-cube law explained through absurd scenarios.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'f7KSfjv4Oq0' },
    ],
  },
  {
    id: '3b1b',
    name: '3Blue1Brown',
    category: 'Mathematics',
    color: 'from-blue-600 to-indigo-500',
    videos: [
      { id: '3b1b1', title: 'The Essence of Calculus', thumbnail: '', duration: '16:30', description: 'Visualizing derivatives and integrals like never before.', level: 'Advanced', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'WUvTyaaNkzM' },
      { id: '3b1b2', title: 'But What Is a Neural Network?', thumbnail: '', duration: '19:13', description: 'A visual deep-dive into neural networks and deep learning.', level: 'Intermediate', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'aircAruvnKk' },
      { id: '3b1b3', title: 'Linear Algebra — Essence of Linear Algebra', thumbnail: '', duration: '11:22', description: 'Vectors, what even are they? A geometric understanding.', level: 'Intermediate', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'fNk_zzaMoSs' },
      { id: '3b1b4', title: 'But What Is the Fourier Transform?', thumbnail: '', duration: '20:57', description: 'An animated introduction to the Fourier Transform.', level: 'Advanced', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'spUNpyF58BY' },
      { id: '3b1b5', title: "Euler's Formula — the most beautiful equation", thumbnail: '', duration: '23:50', description: 'Why e^(iπ) + 1 = 0 is considered the most beautiful equation.', level: 'Advanced', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'v0YEaeIClKY' },
    ],
  },
  {
    id: 'mark-rober',
    name: 'Mark Rober',
    category: 'Engineering',
    color: 'from-green-500 to-emerald-600',
    videos: [
      { id: 'rober1', title: 'Building the Perfect Squirrel-Proof Bird Feeder', thumbnail: '', duration: '21:38', description: 'Former NASA engineer vs squirrels. Who wins?', level: 'All Levels', channel: 'Mark Rober', category: 'Engineering', youtubeId: 'hFZFjoX2cGg' },
      { id: 'rober2', title: 'Glitter Bomb 4.0 vs. Porch Pirates', thumbnail: '', duration: '25:46', description: 'Using engineering to fight package theft with style.', level: 'All Levels', channel: 'Mark Rober', category: 'Engineering', youtubeId: 'h4T_LlK1VE4' },
      { id: 'rober3', title: "World's Largest Horn Shatters Glass", thumbnail: '', duration: '18:33', description: "Building the world's largest horn and testing its destructive power.", level: 'All Levels', channel: 'Mark Rober', category: 'Engineering', youtubeId: 'Boi0XEm9-4E' },
    ],
  },
  {
    id: 'ted-ed',
    name: 'TED-Ed',
    category: 'Science',
    color: 'from-red-500 to-rose-600',
    videos: [
      { id: 'ted1', title: 'How Does Anesthesia Work?', thumbnail: '', duration: '5:24', description: 'The surprisingly mysterious science behind going under.', level: 'All Levels', channel: 'TED-Ed', category: 'Science', youtubeId: 'bEG4nSe6yJY' },
      { id: 'ted2', title: 'What Makes Muscles Grow?', thumbnail: '', duration: '4:38', description: 'The biology of muscle growth explained with beautiful animation.', level: 'All Levels', channel: 'TED-Ed', category: 'Biology', youtubeId: '2tM1LFFxeKg' },
      { id: 'ted3', title: 'How Do Vitamins Work?', thumbnail: '', duration: '4:44', description: 'The essential role of vitamins in keeping your body running.', level: 'All Levels', channel: 'TED-Ed', category: 'Biology', youtubeId: 'ISZLTJH5lYg' },
      { id: 'ted4', title: 'History vs. Cleopatra', thumbnail: '', duration: '4:15', description: 'Separating fact from fiction about the legendary Egyptian queen.', level: 'All Levels', channel: 'TED-Ed', category: 'History', youtubeId: 'Q_qdkRCXSxo' },
    ],
  },
  {
    id: 'cleoabram',
    name: 'Cleo Abram',
    category: 'Technology',
    color: 'from-pink-500 to-rose-500',
    videos: [
      { id: 'cleo1', title: 'Why Fusion Energy Changes Everything', thumbnail: '', duration: '10:15', description: 'The breakthroughs that could power our future.', level: 'Intermediate', channel: 'Cleo Abram', category: 'Technology', youtubeId: 'KkGbmIP4YzI' },
      { id: 'cleo2', title: 'I Got to Fly a Real Jetpack', thumbnail: '', duration: '12:51', description: 'The future of personal flight and what it means for transportation.', level: 'All Levels', channel: 'Cleo Abram', category: 'Technology', youtubeId: 'yb2N5gMnNfw' },
      { id: 'cleo3', title: 'I Saw the First Humanoid Robot Factory', thumbnail: '', duration: '14:22', description: 'Inside the facility building robots that walk like humans.', level: 'All Levels', channel: 'Cleo Abram', category: 'Technology', youtubeId: 'wlOkeSdl-r0' },
    ],
  },
  {
    id: 'astrum',
    name: 'Astrum',
    category: 'Science',
    color: 'from-indigo-500 to-purple-600',
    videos: [
      { id: 'astrum1', title: 'The Insane Scale of the Solar System', thumbnail: '', duration: '12:45', description: 'A breathtaking journey through the scale of our cosmic neighborhood.', level: 'All Levels', channel: 'Astrum', category: 'Science', youtubeId: 'Kj4524AAZdE' },
      { id: 'astrum2', title: 'The Most Stunning Images of Mars', thumbnail: '', duration: '26:14', description: 'Real footage and images from the surface of Mars.', level: 'All Levels', channel: 'Astrum', category: 'Science', youtubeId: 'ZEyAs3NWH4A' },
      { id: 'astrum3', title: 'Why Jupiter Is the Scariest Planet', thumbnail: '', duration: '19:30', description: 'The terrifying storms and magnetic field of Jupiter.', level: 'Intermediate', channel: 'Astrum', category: 'Science', youtubeId: 'Xwn8fQSW7-8' },
    ],
  },
  {
    id: 'african-signal',
    name: 'The African Signal',
    category: 'Africa',
    color: 'from-amber-500 to-orange-600',
    videos: [
      { id: 'afr1', title: 'The Great Zimbabwe: A Lost Empire', thumbnail: '', duration: '14:22', description: 'Uncovering the wealth, architecture, and mystery of Great Zimbabwe.', level: 'Intermediate', channel: 'The African Signal', category: 'Africa', youtubeId: 'PXSbzLKGB2I' },
      { id: 'afr2', title: 'How Ethiopia Stayed Independent', thumbnail: '', duration: '15:40', description: 'The remarkable story of Ethiopian resistance against colonialism.', level: 'All Levels', channel: 'The African Signal', category: 'Africa', youtubeId: 'S3MrtPQkzfs' },
    ],
  },
  {
    id: 'scienceclic',
    name: 'ScienceClic',
    category: 'Science',
    color: 'from-violet-500 to-purple-600',
    videos: [
      { id: 'sclic1', title: 'General Relativity Explained Simply', thumbnail: '', duration: '15:47', description: "Einstein's greatest theory made visual and intuitive.", level: 'Advanced', channel: 'ScienceClic', category: 'Science', youtubeId: 'AwhKZ3fd9JA' },
      { id: 'sclic2', title: 'Quantum Mechanics — An Intuitive Approach', thumbnail: '', duration: '12:06', description: 'Visualizing the strange world of quantum mechanics.', level: 'Advanced', channel: 'ScienceClic', category: 'Science', youtubeId: 'WMzjwnTYJk0' },
    ],
  },
  {
    id: 'deep-look',
    name: 'Deep Look',
    category: 'Biology',
    color: 'from-lime-500 to-green-600',
    videos: [
      { id: 'deep1', title: 'How Do Ants Carry Things 50x Their Weight?', thumbnail: '', duration: '4:12', description: 'Macro photography reveals the incredible strength of ants.', level: 'All Levels', channel: 'Deep Look', category: 'Biology', youtubeId: 'x2W35RxfPBU' },
      { id: 'deep2', title: 'This Mushroom Starts Killing You Before You Know It', thumbnail: '', duration: '5:22', description: "The death cap mushroom — nature's silent killer in ultra-macro.", level: 'All Levels', channel: 'Deep Look', category: 'Biology', youtubeId: 'bl10julnauo' },
    ],
  },
  {
    id: 'real-science',
    name: 'Real Science',
    category: 'Biology',
    color: 'from-teal-500 to-emerald-600',
    videos: [
      { id: 'rs1', title: 'The Insane Biology of the Octopus', thumbnail: '', duration: '14:02', description: 'How octopuses edit their own RNA and rewire their brains.', level: 'Intermediate', channel: 'Real Science', category: 'Biology', youtubeId: 'mFP_AjJeP-M' },
      { id: 'rs2', title: "Why Blue Whales Don't Get Cancer", thumbnail: '', duration: '15:30', description: "Peto's Paradox and what it means for cancer research.", level: 'Intermediate', channel: 'Real Science', category: 'Biology', youtubeId: '1AElONvi9WQ' },
    ],
  },
  {
    id: 'johnny-harris',
    name: 'Johnny Harris',
    category: 'History',
    color: 'from-orange-500 to-red-600',
    videos: [
      { id: 'jh1', title: 'Why Africa Is Changing the World', thumbnail: '', duration: '16:44', description: "An independent journalist explores Africa's rising influence on global affairs.", level: 'All Levels', channel: 'Johnny Harris', category: 'Africa', youtubeId: 'i8TwGBavhco' },
      { id: 'jh2', title: 'How the US Stole the Middle East', thumbnail: '', duration: '14:55', description: 'The geopolitics of oil, power, and foreign intervention.', level: 'All Levels', channel: 'Johnny Harris', category: 'History', youtubeId: '1wm72oqsYqA' },
    ],
  },
  {
    id: 'aperture',
    name: 'Aperture',
    category: 'Philosophy',
    color: 'from-amber-500 to-yellow-600',
    videos: [
      { id: 'aper1', title: 'The Most Disturbing Thought Experiment', thumbnail: '', duration: '13:08', description: 'Boltzmann brains, simulation theory, and the limits of reality.', level: 'Advanced', channel: 'Aperture', category: 'Philosophy', youtubeId: '4b33NTAuF5E' },
      { id: 'aper2', title: "Why You're Not Really Alive", thumbnail: '', duration: '11:45', description: 'What does it actually mean to be alive? Philosophy meets biology.', level: 'Advanced', channel: 'Aperture', category: 'Philosophy', youtubeId: 'GCf8FIn-JUg' },
    ],
  },
  {
    id: 'be-smart',
    name: 'Be Smart',
    category: 'Science',
    color: 'from-cyan-500 to-blue-600',
    videos: [
      { id: 'bs1', title: 'Why Does Ice Float?', thumbnail: '', duration: '10:33', description: 'The simple question that reveals deep physics.', level: 'All Levels', channel: 'Be Smart', category: 'Science', youtubeId: 'UukRgqzk-KE' },
      { id: 'bs2', title: 'What Color Is a Mirror?', thumbnail: '', duration: '8:30', description: 'A surprisingly tricky question about optics and perception.', level: 'All Levels', channel: 'Be Smart', category: 'Science', youtubeId: '-yrZpTHBEss' },
    ],
  },
  {
    id: 'artem-kirsanov',
    name: 'Artem Kirsanov',
    category: 'Science',
    color: 'from-indigo-500 to-blue-600',
    videos: [
      { id: 'art1', title: 'How Your Brain Learns New Concepts', thumbnail: '', duration: '18:44', description: 'At the intersection of neuroscience, CS and mathematics.', level: 'Advanced', channel: 'Artem Kirsanov', category: 'Science', youtubeId: 'rA5qnZUXcqo' },
      { id: 'art2', title: 'The Geometry of Neural Networks', thumbnail: '', duration: '22:11', description: 'How neural networks transform data in high-dimensional space.', level: 'Advanced', channel: 'Artem Kirsanov', category: 'Science', youtubeId: 'wjZofJX0v4M' },
    ],
  },
  {
    id: 'gapminder',
    name: 'Gapminder',
    category: 'History',
    color: 'from-yellow-500 to-orange-600',
    videos: [
      { id: 'gap1', title: 'How Not to Be Ignorant About the World', thumbnail: '', duration: '19:21', description: 'Hans Rosling shows why our view of the world is statistically wrong.', level: 'All Levels', channel: 'Gapminder', category: 'History', youtubeId: 'Sm5xF-UYgdg' },
      { id: 'gap2', title: "The Best Stats You've Ever Seen", thumbnail: '', duration: '19:48', description: "Hans Rosling's legendary TED talk that changed data visualization.", level: 'All Levels', channel: 'Gapminder', category: 'History', youtubeId: 'hVimVzgtD6w' },
    ],
  },
  {
    id: 'casual-geographic',
    name: 'Casual Geographic',
    category: 'Biology',
    color: 'from-green-500 to-lime-600',
    videos: [
      { id: 'cg1', title: "The Most Disrespectful Animals on Earth", thumbnail: '', duration: '12:33', description: "Hilarious breakdown of the animal kingdom's biggest bullies.", level: 'All Levels', channel: 'Casual Geographic', category: 'Biology', youtubeId: 'LJvvxEs1jnI' },
      { id: 'cg2', title: "Why Honey Badgers Don't Care", thumbnail: '', duration: '10:22', description: 'The animal that fears nothing and attacks everything.', level: 'All Levels', channel: 'Casual Geographic', category: 'Biology', youtubeId: 'box0-koAuIY' },
    ],
  },
  {
    id: 'neil-halloran',
    name: 'Neil Halloran',
    category: 'History',
    color: 'from-slate-500 to-zinc-600',
    videos: [
      { id: 'nh1', title: 'The Fallen of World War II', thumbnail: '', duration: '18:30', description: 'A data-driven documentary about the human cost of WWII.', level: 'All Levels', channel: 'Neil Halloran', category: 'History', youtubeId: 'DwKPFT-RioU' },
    ],
  },
  {
    id: 'nova-pbs',
    name: 'NOVA PBS',
    category: 'Science',
    color: 'from-sky-500 to-blue-600',
    videos: [
      { id: 'nova1', title: 'The Fabric of the Cosmos', thumbnail: '', duration: '52:18', description: 'Brian Greene explores space, time, and the nature of reality.', level: 'Advanced', channel: 'NOVA PBS', category: 'Science', youtubeId: 'BII-MXlzcqE' },
    ],
  },
  {
    id: 'closer-to-truth',
    name: 'Closer To Truth',
    category: 'Philosophy',
    color: 'from-slate-500 to-gray-600',
    videos: [
      { id: 'ctt1', title: 'Why Is There Something Rather Than Nothing?', thumbnail: '', duration: '26:41', description: 'Philosophers and physicists tackle the deepest question.', level: 'Advanced', channel: 'Closer To Truth', category: 'Philosophy', youtubeId: 'vlNylFz-GXE' },
    ],
  },
  {
    id: 'satori-graphics',
    name: 'Satori Graphics',
    category: 'Design',
    color: 'from-fuchsia-500 to-pink-600',
    videos: [
      { id: 'sat1', title: '5 Logo Design Tips That Pros Use', thumbnail: '', duration: '10:32', description: 'Professional logo design principles that elevate your brand.', level: 'Intermediate', channel: 'Satori Graphics', category: 'Design', youtubeId: 'j-yoMr8M0Mk' },
      { id: 'sat2', title: 'Color Theory for Graphic Designers', thumbnail: '', duration: '12:18', description: 'How to use color psychology in your designs.', level: 'Beginner', channel: 'Satori Graphics', category: 'Design', youtubeId: '_2LLXnUdUIc' },
    ],
  },
  {
    id: 'wocomodocs',
    name: 'wocomoDOCS',
    category: 'Documentaries',
    color: 'from-gray-600 to-slate-700',
    videos: [
      { id: 'woc1', title: 'The Story of Energy', thumbnail: '', duration: '52:10', description: 'How humanity harnessed energy to build civilization.', level: 'All Levels', channel: 'wocomoDOCS', category: 'Documentaries', youtubeId: 'S4O5voOCqAQ' },
      { id: 'woc2', title: 'The Secret Life of the Brain', thumbnail: '', duration: '48:30', description: 'A deep documentary exploring how the brain shapes our reality.', level: 'Intermediate', channel: 'wocomoDOCS', category: 'Documentaries', youtubeId: 'kLDitGAUrno' },
    ],
  },
  // ---- SHORTS (verified YouTube Shorts IDs) ----
  {
    id: 'shorts-science',
    name: 'Science Shorts',
    category: 'Science',
    color: 'from-blue-500 to-indigo-500',
    videos: [
      { id: 'sh1', title: 'What Happens Inside a Black Hole?', thumbnail: '', duration: '0:59', description: 'A quick dive into black hole physics.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'QqsLTNkzvaY', isShort: true },
      { id: 'sh2', title: 'The Speed of Light Is Slow', thumbnail: '', duration: '0:58', description: 'Why light speed feels slow in cosmic terms.', level: 'All Levels', channel: 'Veritasium', category: 'Science', youtubeId: 'ACUuFg9Y9dY', isShort: true },
      { id: 'sh3', title: 'How Small Are Atoms Really?', thumbnail: '', duration: '0:52', description: 'Visualizing the incredible tininess of atoms.', level: 'All Levels', channel: 'Kurzgesagt', category: 'Science', youtubeId: 'yQP4UJhNn0I', isShort: true },
      { id: 'sh4', title: 'Why Is the Sky Blue?', thumbnail: '', duration: '0:45', description: 'Rayleigh scattering explained in under a minute.', level: 'All Levels', channel: 'Be Smart', category: 'Science', youtubeId: '6QAEgpnTCfI', isShort: true },
    ],
  },
  {
    id: 'shorts-math',
    name: 'Math Shorts',
    category: 'Mathematics',
    color: 'from-blue-600 to-purple-500',
    videos: [
      { id: 'shm1', title: 'Why 0! = 1', thumbnail: '', duration: '0:58', description: 'The surprising reason zero factorial equals one.', level: 'All Levels', channel: '3Blue1Brown', category: 'Mathematics', youtubeId: 'X32dce7_D48', isShort: true },
      { id: 'shm2', title: 'The Collatz Conjecture in 60 Seconds', thumbnail: '', duration: '0:55', description: 'The simplest unsolved problem in mathematics.', level: 'All Levels', channel: 'Veritasium', category: 'Mathematics', youtubeId: '094y1Z2wpJg', isShort: true },
    ],
  },
  {
    id: 'shorts-engineering',
    name: 'Engineering Shorts',
    category: 'Engineering',
    color: 'from-green-500 to-teal-500',
    videos: [
      { id: 'she1', title: 'How a Jet Engine Works', thumbnail: '', duration: '0:59', description: 'Turbofan engine mechanics in under a minute.', level: 'All Levels', channel: 'Mark Rober', category: 'Engineering', youtubeId: 'S6t0mVD5kVQ', isShort: true },
      { id: 'she2', title: 'How a Lock Works', thumbnail: '', duration: '0:50', description: 'Pin tumbler locks explained with animation.', level: 'All Levels', channel: 'TED-Ed', category: 'Engineering', youtubeId: 'rnuigSBYwCM', isShort: true },
    ],
  },
  {
    id: 'shorts-geography',
    name: 'Geography Shorts',
    category: 'Geography',
    color: 'from-emerald-500 to-teal-500',
    videos: [
      { id: 'shg1', title: 'Countries That Will Disappear Soon', thumbnail: '', duration: '0:58', description: 'Rising sea levels threaten entire nations.', level: 'All Levels', channel: 'GeoGlobeTales', category: 'Geography', youtubeId: '3DUHQK2ZOYU', isShort: true },
      { id: 'shg2', title: "The Smallest Countries You've Never Heard Of", thumbnail: '', duration: '0:50', description: 'Tiny nations with fascinating stories.', level: 'All Levels', channel: 'GeoGlobeTales', category: 'Geography', youtubeId: '5Op6OaB7sH4', isShort: true },
    ],
  },
  {
    id: 'shorts-design',
    name: 'Design Shorts',
    category: 'Design',
    color: 'from-purple-500 to-pink-500',
    videos: [
      { id: 'shd1', title: 'The Golden Ratio in Design', thumbnail: '', duration: '0:55', description: 'How nature and design share the same proportions.', level: 'All Levels', channel: 'Satori Graphics', category: 'Design', youtubeId: 'dDn5VZihgR8', isShort: true },
      { id: 'shd2', title: 'Best Color Combos for Logos', thumbnail: '', duration: '0:48', description: 'Quick color theory for branding.', level: 'All Levels', channel: 'Satori Graphics', category: 'Design', youtubeId: 'GyVMoejbGFg', isShort: true },
    ],
  },
  {
    id: 'shorts-ai',
    name: 'AI Shorts',
    category: 'AI',
    color: 'from-violet-500 to-indigo-500',
    videos: [
      { id: 'sha1', title: 'AI Explained in 60 Seconds', thumbnail: '', duration: '0:58', description: 'What is artificial intelligence really?', level: 'All Levels', channel: 'Cleo Abram', category: 'AI', youtubeId: 'ad79nYk2keg', isShort: true },
      { id: 'sha2', title: 'How ChatGPT Actually Works', thumbnail: '', duration: '0:55', description: 'Large language models simplified.', level: 'All Levels', channel: 'Fireship', category: 'AI', youtubeId: 'fOC1SmO0mIM', isShort: true },
    ],
  },
];

export function getAllVideos(): VideoItem[] {
  return videoChannels.flatMap(c => c.videos);
}

export function getVideosByCategory(cat: string): VideoItem[] {
  if (cat === 'All') return getAllVideos().filter(v => !v.isShort);
  if (cat === 'Shorts') return getAllVideos().filter(v => v.isShort);
  return getAllVideos().filter(v => v.category === cat && !v.isShort);
}
