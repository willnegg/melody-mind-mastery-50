// Music theory constants and data structures

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Enharmonic mapping for each major key
const enharmonicMap: Record<string, Record<string, string>> = {
  'C': {},
  'G': {},
  'F': { 'A#': 'Bb' },
  'D': {},
  'Bb': { 'D#': 'Eb', 'A#': 'Bb' },
  'A': {},
  'Eb': { 'D#': 'Eb', 'G#': 'Ab', 'A#': 'Bb' },
  'Ab': { 'C#': 'Db', 'D#': 'Eb', 'G#': 'Ab', 'A#': 'Bb' },
  'E': {},
  'B': {},
  'Db': { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' },
  'Gb': { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb', 'B': 'Cb' }
};

// Function to convert chromatic note to enharmonic equivalent for a given key
export const getEnharmonicEquivalent = (chromaticNote: string, key: string): string => {
  return enharmonicMap[key]?.[chromaticNote] || chromaticNote;
};

export const scaleTypes = {
  major: {
    name: 'Majeure',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: 'La gamme la plus courante en musique occidentale, brillante et joyeuse.',
    formula: 'W-W-H-W-W-W-H'
  },
  minor: {
    name: 'Mineure naturelle',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: 'La gamme mineure naturelle, sombre et mélancolique.',
    formula: 'W-H-W-W-H-W-W'
  },
  pentatonic: {
    name: 'Pentatonique',
    intervals: [0, 2, 4, 7, 9],
    description: 'Une gamme de 5 notes utilisée dans de nombreuses traditions musicales.',
    formula: 'W-W-WH-W-WH'
  },
  blues: {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    description: 'La gamme blues avec les notes bleues caractéristiques.',
    formula: 'Pentatonique mineure + ♭5'
  },
  dorian: {
    name: 'Dorien',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: 'Un mode avec un son jazzy et sophistiqué.',
    formula: 'W-H-W-W-W-H-W'
  }
};

export const chordTypes = {
  major: {
    name: 'Majeur',
    intervals: [0, 4, 7],
    symbol: '',
    description: 'Brillant et stable, la base de l\'harmonie occidentale.'
  },
  minor: {
    name: 'Mineur',
    intervals: [0, 3, 7],
    symbol: 'm',
    description: 'Plus sombre et émotionnel que les accords majeurs.'
  },
  diminished: {
    name: 'Diminué',
    intervals: [0, 3, 6],
    symbol: '°',
    description: 'Tendu et instable, souvent utilisé comme accord de passage.'
  },
  augmented: {
    name: 'Augmenté',
    intervals: [0, 4, 8],
    symbol: '+',
    description: 'Mystérieux et non résolu, crée de la tension.'
  },
  major7: {
    name: 'Majeur 7e',
    intervals: [0, 4, 7, 11],
    symbol: 'maj7',
    description: 'Sophistiqué et jazzy, ajoute de la couleur aux progressions.'
  },
  dominant7: {
    name: 'Dominante 7e',
    intervals: [0, 4, 7, 10],
    symbol: '7',
    description: 'Forte tendance à résoudre, fondamental dans le blues et le jazz.'
  },
  minor7: {
    name: 'Mineur 7e',
    intervals: [0, 3, 7, 10],
    symbol: 'm7',
    description: 'Doux et moelleux, courant dans le jazz et la R&B.'
  }
};

export const intervals = {
  'minor2nd': { name: 'Minor 2nd', semitones: 1 },
  'major2nd': { name: 'Major 2nd', semitones: 2 },
  'minor3rd': { name: 'Minor 3rd', semitones: 3 },
  'major3rd': { name: 'Major 3rd', semitones: 4 },
  'perfect4th': { name: 'Perfect 4th', semitones: 5 },
  'tritone': { name: 'Tritone', semitones: 6 },
  'perfect5th': { name: 'Perfect 5th', semitones: 7 },
  'minor6th': { name: 'Minor 6th', semitones: 8 },
  'major6th': { name: 'Major 6th', semitones: 9 },
  'minor7th': { name: 'Minor 7th', semitones: 10 },
  'major7th': { name: 'Major 7th', semitones: 11 },
  'octave': { name: 'Octave', semitones: 12 }
};

export const cadences = {
  perfect: {
    name: 'Cadence parfaite',
    progression: ['V', 'I'],
    description: 'La cadence la plus forte, crée un sentiment de résolution.',
    example: 'Sol → Do en Do majeur'
  },
  plagal: {
    name: 'Cadence plagale',
    progression: ['IV', 'I'],
    description: 'La cadence "Amen", plus douce que la cadence parfaite.',
    example: 'Fa → Do en Do majeur'
  },
  imperfect: {
    name: 'Cadence imparfaite',
    progression: ['I', 'V'],
    description: 'Crée de l\'attente et un mouvement vers l\'avant.',
    example: 'Do → Sol en Do majeur'
  },
  deceptive: {
    name: 'Cadence rompue',
    progression: ['V', 'vi'],
    description: 'Surprend l\'oreille en ne résolvant pas comme attendu.',
    example: 'Sol → La m en Do majeur'
  },
  half: {
    name: 'Demi-cadence',
    progression: ['I', 'V'],
    description: 'Se termine sur V, créant un effet interrogatif.',
    example: 'Do → Sol en Do majeur'
  }
};

export const circleOfFifths = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'
];

export const relativeMinors = {
  'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m',
  'E': 'C#m', 'B': 'G#m', 'F#': 'D#m', 'C#': 'A#m',
  'G#': 'Fm', 'D#': 'Cm', 'A#': 'Gm', 'F': 'Dm'
};

// Enharmonic equivalents for major scales
const majorScaleEnharmonics: Record<string, string[]> = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F']
};

// Helper functions
export const getScaleNotes = (rootNote: string, scaleType: keyof typeof scaleTypes): string[] => {
  // For major scales, use enharmonic equivalents
  if (scaleType === 'major' && majorScaleEnharmonics[rootNote]) {
    return majorScaleEnharmonics[rootNote];
  }
  
  // Fallback to chromatic calculation for other scales
  const rootIndex = notes.indexOf(rootNote);
  const intervals = scaleTypes[scaleType].intervals;
  return intervals.map(interval => notes[(rootIndex + interval) % 12]);
};

export const getChordNotes = (rootNote: string, chordType: keyof typeof chordTypes): string[] => {
  const rootIndex = notes.indexOf(rootNote);
  const intervals = chordTypes[chordType].intervals;
  return intervals.map(interval => notes[(rootIndex + interval) % 12]);
};

export const getNoteNumber = (note: string, octave: number = 4): number => {
  const noteIndex = notes.indexOf(note);
  return octave * 12 + noteIndex + 12; // MIDI note number
};