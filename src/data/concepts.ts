export type PartOfSpeech = 'noun' | 'verb' | 'determiner' | 'adjective' | 'preposition' | 'adverb' | 'conjunction';

export interface Translation {
  word: string;
  pronunciation?: string;
  partOfSpeech: PartOfSpeech;
}

export interface ExampleSentence {
  language: string;
  text: string;
  translation: string;
}

export interface Concept {
  id: string;
  universalMeaning: string;
  relatedConcepts: string[];
  translations: Record<string, Translation>;
  examples: ExampleSentence[];
}

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sn', name: 'Shona', flag: '🇿🇼' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'tn', name: 'Tswana', flag: '🇧🇼' },
];

export const POS_COLORS: Record<PartOfSpeech, string> = {
  noun: 'jade',
  verb: 'clay',
  determiner: 'gold',
  adjective: 'petal',
  preposition: 'dew',
  adverb: 'clay',
  conjunction: 'gold',
};

export const concepts: Concept[] = [
  {
    id: 'river',
    universalMeaning: 'flowing water that carves its path through the earth',
    relatedConcepts: ['water', 'rain', 'ocean', 'fish'],
    translations: {
      en: { word: 'river', partOfSpeech: 'noun' },
      sn: { word: 'rwizi', partOfSpeech: 'noun' },
      xh: { word: 'umlambo', partOfSpeech: 'noun' },
      af: { word: 'rivier', partOfSpeech: 'noun' },
      tn: { word: 'noka', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'The river flows to the sea.', translation: 'Rwizi runoyerera kuenda kugungwa.' },
      { language: 'sn', text: 'Rwizi rwakadzika.', translation: 'The river is deep.' },
      { language: 'xh', text: 'Umlambo ubaleka ngokukhawuleza.', translation: 'The river runs fast.' },
    ],
  },
  {
    id: 'heart',
    universalMeaning: 'the center of feeling and life force',
    relatedConcepts: ['love', 'life', 'blood', 'courage'],
    translations: {
      en: { word: 'heart', partOfSpeech: 'noun' },
      sn: { word: 'mwoyo', partOfSpeech: 'noun' },
      xh: { word: 'intliziyo', partOfSpeech: 'noun' },
      af: { word: 'hart', partOfSpeech: 'noun' },
      tn: { word: 'pelo', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'She has a kind heart.', translation: 'Ane mwoyo wakanaka.' },
      { language: 'sn', text: 'Mwoyo wangu unofara.', translation: 'My heart is happy.' },
      { language: 'xh', text: 'Intliziyo yam iyavuya.', translation: 'My heart rejoices.' },
    ],
  },
  {
    id: 'love',
    universalMeaning: 'deep affection that binds beings together',
    relatedConcepts: ['heart', 'family', 'child', 'joy'],
    translations: {
      en: { word: 'love', partOfSpeech: 'noun' },
      sn: { word: 'rudo', partOfSpeech: 'noun' },
      xh: { word: 'uthando', partOfSpeech: 'noun' },
      af: { word: 'liefde', partOfSpeech: 'noun' },
      tn: { word: 'lorato', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'Love conquers all.', translation: 'Rudo runokunda zvose.' },
      { language: 'sn', text: 'Rudo rwaamai haruna muganhu.', translation: "A mother's love has no boundary." },
      { language: 'af', text: 'Liefde is geduldig.', translation: 'Love is patient.' },
    ],
  },
  {
    id: 'family',
    universalMeaning: 'the circle of belonging where one is nurtured',
    relatedConcepts: ['love', 'child', 'home', 'mother'],
    translations: {
      en: { word: 'family', partOfSpeech: 'noun' },
      sn: { word: 'mhuri', partOfSpeech: 'noun' },
      xh: { word: 'usapho', partOfSpeech: 'noun' },
      af: { word: 'familie', partOfSpeech: 'noun' },
      tn: { word: 'lelapa', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'Family is everything.', translation: 'Mhuri ndiyo zvese.' },
      { language: 'xh', text: 'Usapho lwam lukhulu.', translation: 'My family is big.' },
      { language: 'tn', text: 'Lelapa ke botshelo.', translation: 'Family is life.' },
    ],
  },
  {
    id: 'tree',
    universalMeaning: 'a rooted being that reaches for the sky and shelters life',
    relatedConcepts: ['forest', 'leaf', 'earth', 'shade'],
    translations: {
      en: { word: 'tree', partOfSpeech: 'noun' },
      sn: { word: 'muti', partOfSpeech: 'noun' },
      xh: { word: 'umthi', partOfSpeech: 'noun' },
      af: { word: 'boom', partOfSpeech: 'noun' },
      tn: { word: 'setlhare', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'The tree gives shade.', translation: 'Muti unopa mumvuri.' },
      { language: 'sn', text: 'Muti wakakura.', translation: 'The tree is tall.' },
      { language: 'af', text: 'Die boom is groot.', translation: 'The tree is big.' },
    ],
  },
  {
    id: 'sun',
    universalMeaning: 'the great fire that gives light and warmth to all living things',
    relatedConcepts: ['moon', 'light', 'fire', 'day'],
    translations: {
      en: { word: 'sun', partOfSpeech: 'noun' },
      sn: { word: 'zuva', partOfSpeech: 'noun' },
      xh: { word: 'ilanga', partOfSpeech: 'noun' },
      af: { word: 'son', partOfSpeech: 'noun' },
      tn: { word: 'letsatsi', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'The sun rises in the east.', translation: 'Zuva rinobuda kumabvazuva.' },
      { language: 'xh', text: 'Ilanga liyakhanya.', translation: 'The sun is shining.' },
      { language: 'tn', text: 'Letsatsi le a tlhaba.', translation: 'The sun is rising.' },
    ],
  },
  {
    id: 'moon',
    universalMeaning: 'the gentle light that guides through darkness',
    relatedConcepts: ['sun', 'night', 'stars', 'light'],
    translations: {
      en: { word: 'moon', partOfSpeech: 'noun' },
      sn: { word: 'mwedzi', partOfSpeech: 'noun' },
      xh: { word: 'inyanga', partOfSpeech: 'noun' },
      af: { word: 'maan', partOfSpeech: 'noun' },
      tn: { word: 'ngwedi', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'The moon is full tonight.', translation: 'Mwedzi uzere usiku huno.' },
      { language: 'sn', text: 'Mwedzi unopenya.', translation: 'The moon is shining.' },
      { language: 'af', text: 'Die maan is mooi.', translation: 'The moon is beautiful.' },
    ],
  },
  {
    id: 'child',
    universalMeaning: 'a young being full of wonder and possibility',
    relatedConcepts: ['family', 'mother', 'love', 'play'],
    translations: {
      en: { word: 'child', partOfSpeech: 'noun' },
      sn: { word: 'mwana', partOfSpeech: 'noun' },
      xh: { word: 'umntwana', partOfSpeech: 'noun' },
      af: { word: 'kind', partOfSpeech: 'noun' },
      tn: { word: 'ngwana', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'The child is playing.', translation: 'Mwana ari kutamba.' },
      { language: 'sn', text: 'Mwana arikutamba.', translation: 'The child is playing.' },
      { language: 'xh', text: 'Umntwana uyadlala.', translation: 'The child is playing.' },
    ],
  },
  {
    id: 'water',
    universalMeaning: 'the essence of life that flows, cleanses, and sustains',
    relatedConcepts: ['river', 'rain', 'ocean', 'life'],
    translations: {
      en: { word: 'water', partOfSpeech: 'noun' },
      sn: { word: 'mvura', partOfSpeech: 'noun' },
      xh: { word: 'amanzi', partOfSpeech: 'noun' },
      af: { word: 'water', partOfSpeech: 'noun' },
      tn: { word: 'metsi', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'Water is life.', translation: 'Mvura ndoupenyu.' },
      { language: 'sn', text: 'Mvura iri kunaya.', translation: 'It is raining.' },
      { language: 'tn', text: 'Metsi ke botshelo.', translation: 'Water is life.' },
    ],
  },
  {
    id: 'fire',
    universalMeaning: 'the transformative force of warmth, light, and destruction',
    relatedConcepts: ['sun', 'light', 'heat', 'cook'],
    translations: {
      en: { word: 'fire', partOfSpeech: 'noun' },
      sn: { word: 'moto', partOfSpeech: 'noun' },
      xh: { word: 'umlilo', partOfSpeech: 'noun' },
      af: { word: 'vuur', partOfSpeech: 'noun' },
      tn: { word: 'molelo', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'The fire keeps us warm.', translation: 'Moto unotidziisa.' },
      { language: 'sn', text: 'Moto uri kupisa.', translation: 'The fire is burning.' },
      { language: 'xh', text: 'Umlilo uyatshisa.', translation: 'The fire is hot.' },
    ],
  },
  {
    id: 'rain',
    universalMeaning: 'blessings falling from the sky to nourish the earth',
    relatedConcepts: ['water', 'cloud', 'earth', 'river'],
    translations: {
      en: { word: 'rain', partOfSpeech: 'noun' },
      sn: { word: 'mvura', partOfSpeech: 'noun' },
      xh: { word: 'imvula', partOfSpeech: 'noun' },
      af: { word: 'reën', partOfSpeech: 'noun' },
      tn: { word: 'pula', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'The rain is coming.', translation: 'Mvura iri kuuya.' },
      { language: 'tn', text: 'Pula e a na.', translation: 'It is raining.' },
      { language: 'af', text: 'Dit reën vandag.', translation: 'It is raining today.' },
    ],
  },
  {
    id: 'earth',
    universalMeaning: 'the ground beneath us, mother of all growth',
    relatedConcepts: ['tree', 'rain', 'home', 'mountain'],
    translations: {
      en: { word: 'earth', partOfSpeech: 'noun' },
      sn: { word: 'nyika', partOfSpeech: 'noun' },
      xh: { word: 'umhlaba', partOfSpeech: 'noun' },
      af: { word: 'aarde', partOfSpeech: 'noun' },
      tn: { word: 'lefatshe', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'The earth provides for us.', translation: 'Nyika inotipa zvose.' },
      { language: 'sn', text: 'Nyika yakanaka.', translation: 'The earth is beautiful.' },
      { language: 'tn', text: 'Lefatshe le legolo.', translation: 'The earth is big.' },
    ],
  },
  {
    id: 'home',
    universalMeaning: 'the place where the spirit finds rest and belonging',
    relatedConcepts: ['family', 'love', 'earth', 'shelter'],
    translations: {
      en: { word: 'home', partOfSpeech: 'noun' },
      sn: { word: 'musha', partOfSpeech: 'noun' },
      xh: { word: 'ikhaya', partOfSpeech: 'noun' },
      af: { word: 'huis', partOfSpeech: 'noun' },
      tn: { word: 'legae', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'Home is where the heart is.', translation: 'Musha uri pane mwoyo.' },
      { language: 'xh', text: 'Ikhaya lam likhulu.', translation: 'My home is big.' },
      { language: 'af', text: 'Ons huis is mooi.', translation: 'Our home is beautiful.' },
    ],
  },
  {
    id: 'mountain',
    universalMeaning: 'the immovable witness that stands between earth and sky',
    relatedConcepts: ['earth', 'sky', 'stone', 'strength'],
    translations: {
      en: { word: 'mountain', partOfSpeech: 'noun' },
      sn: { word: 'gomo', partOfSpeech: 'noun' },
      xh: { word: 'intaba', partOfSpeech: 'noun' },
      af: { word: 'berg', partOfSpeech: 'noun' },
      tn: { word: 'thaba', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'The mountain is tall.', translation: 'Gomo rakareba.' },
      { language: 'sn', text: 'Gomo rine chando.', translation: 'The mountain is cold.' },
      { language: 'xh', text: 'Intaba iphakamile.', translation: 'The mountain is high.' },
    ],
  },
  {
    id: 'sing',
    universalMeaning: 'to release the spirit through melody and voice',
    relatedConcepts: ['joy', 'music', 'voice', 'dance'],
    translations: {
      en: { word: 'sing', partOfSpeech: 'verb' },
      sn: { word: 'kuimba', partOfSpeech: 'verb' },
      xh: { word: 'ukucula', partOfSpeech: 'verb' },
      af: { word: 'sing', partOfSpeech: 'verb' },
      tn: { word: 'go opela', partOfSpeech: 'verb' },
    },
    examples: [
      { language: 'en', text: 'The children sing together.', translation: 'Vana vanoimba pamwe chete.' },
      { language: 'sn', text: 'Ndinoimba rwiyo.', translation: 'I sing a song.' },
      { language: 'xh', text: 'Sicula ingoma.', translation: 'We sing a song.' },
    ],
  },
  {
    id: 'walk',
    universalMeaning: 'to move forward step by step through the world',
    relatedConcepts: ['journey', 'path', 'foot', 'travel'],
    translations: {
      en: { word: 'walk', partOfSpeech: 'verb' },
      sn: { word: 'kufamba', partOfSpeech: 'verb' },
      xh: { word: 'ukuhamba', partOfSpeech: 'verb' },
      af: { word: 'loop', partOfSpeech: 'verb' },
      tn: { word: 'go tsamaya', partOfSpeech: 'verb' },
    },
    examples: [
      { language: 'en', text: 'We walk to school.', translation: 'Tinofamba kuenda kuchikoro.' },
      { language: 'sn', text: 'Ndinofamba zuva rese.', translation: 'I walk all day.' },
      { language: 'af', text: 'Ons loop na skool toe.', translation: 'We walk to school.' },
    ],
  },
  {
    id: 'eat',
    universalMeaning: 'to take sustenance and transform it into life energy',
    relatedConcepts: ['food', 'hunger', 'cook', 'together'],
    translations: {
      en: { word: 'eat', partOfSpeech: 'verb' },
      sn: { word: 'kudya', partOfSpeech: 'verb' },
      xh: { word: 'ukutya', partOfSpeech: 'verb' },
      af: { word: 'eet', partOfSpeech: 'verb' },
      tn: { word: 'go ja', partOfSpeech: 'verb' },
    },
    examples: [
      { language: 'en', text: 'We eat together.', translation: 'Tinodya pamwe chete.' },
      { language: 'sn', text: 'Ndinodya sadza.', translation: 'I eat sadza.' },
      { language: 'tn', text: 'Re ja mmogo.', translation: 'We eat together.' },
    ],
  },
  {
    id: 'beautiful',
    universalMeaning: 'that which delights the senses and stirs the soul',
    relatedConcepts: ['love', 'joy', 'flower', 'light'],
    translations: {
      en: { word: 'beautiful', partOfSpeech: 'adjective' },
      sn: { word: '-naka', partOfSpeech: 'adjective' },
      xh: { word: '-hle', partOfSpeech: 'adjective' },
      af: { word: 'mooi', partOfSpeech: 'adjective' },
      tn: { word: '-ntle', partOfSpeech: 'adjective' },
    },
    examples: [
      { language: 'en', text: 'The sunset is beautiful.', translation: 'Kunyura kwezuva kwakanaka.' },
      { language: 'sn', text: 'Zuva rakanaka.', translation: 'The day is beautiful.' },
      { language: 'xh', text: 'Le ndawo intle.', translation: 'This place is beautiful.' },
    ],
  },
  {
    id: 'strong',
    universalMeaning: 'possessing inner or outer power to endure and overcome',
    relatedConcepts: ['mountain', 'courage', 'body', 'tree'],
    translations: {
      en: { word: 'strong', partOfSpeech: 'adjective' },
      sn: { word: '-simba', partOfSpeech: 'adjective' },
      xh: { word: '-omelele', partOfSpeech: 'adjective' },
      af: { word: 'sterk', partOfSpeech: 'adjective' },
      tn: { word: '-tiileng', partOfSpeech: 'adjective' },
    },
    examples: [
      { language: 'en', text: 'She is strong.', translation: 'Ane simba.' },
      { language: 'sn', text: 'Muti une simba.', translation: 'The tree is strong.' },
      { language: 'af', text: 'Hy is baie sterk.', translation: 'He is very strong.' },
    ],
  },
  {
    id: 'joy',
    universalMeaning: 'the light that fills the heart when all is well',
    relatedConcepts: ['love', 'sing', 'dance', 'child'],
    translations: {
      en: { word: 'joy', partOfSpeech: 'noun' },
      sn: { word: 'mufaro', partOfSpeech: 'noun' },
      xh: { word: 'uvuyo', partOfSpeech: 'noun' },
      af: { word: 'vreugde', partOfSpeech: 'noun' },
      tn: { word: 'boitumelo', partOfSpeech: 'noun' },
    },
    examples: [
      { language: 'en', text: 'Joy fills the room.', translation: 'Mufaro uzere mumba.' },
      { language: 'sn', text: 'Mufaro mukuru.', translation: 'Great joy.' },
      { language: 'xh', text: 'Uvuyo olukhulu.', translation: 'Great joy.' },
    ],
  },
];
