// Music theory constants and data structures

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const scaleTypes = {
  major: {
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: 'The most common scale in Western music, bright and happy sounding.',
    formula: 'W-W-H-W-W-W-H'
  },
  minor: {
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: 'The natural minor scale, dark and melancholic.',
    formula: 'W-H-W-W-H-W-W'
  },
  pentatonic: {
    name: 'Pentatonic',
    intervals: [0, 2, 4, 7, 9],
    description: 'A 5-note scale used in many musical traditions.',
    formula: 'W-W-WH-W-WH'
  },
  blues: {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    description: 'The blues scale with the characteristic blue notes.',
    formula: 'Minor pentatonic + ♭5'
  },
  dorian: {
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: 'A modal scale with a jazzy, sophisticated sound.',
    formula: 'W-H-W-W-W-H-W'
  }
};

export const chordTypes = {
  major: {
    name: 'Major',
    intervals: [0, 4, 7],
    symbol: '',
    description: 'Bright and stable, the foundation of Western harmony.'
  },
  minor: {
    name: 'Minor',
    intervals: [0, 3, 7],
    symbol: 'm',
    description: 'Darker and more emotional than major chords.'
  },
  diminished: {
    name: 'Diminished',
    intervals: [0, 3, 6],
    symbol: '°',
    description: 'Tense and unstable, often used as passing chords.'
  },
  augmented: {
    name: 'Augmented',
    intervals: [0, 4, 8],
    symbol: '+',
    description: 'Mysterious and unresolved, creates tension.'
  },
  major7: {
    name: 'Major 7th',
    intervals: [0, 4, 7, 11],
    symbol: 'maj7',
    description: 'Sophisticated and jazzy, adds color to progressions.'
  },
  dominant7: {
    name: 'Dominant 7th',
    intervals: [0, 4, 7, 10],
    symbol: '7',
    description: 'Strong tendency to resolve, fundamental in blues and jazz.'
  },
  minor7: {
    name: 'Minor 7th',
    intervals: [0, 3, 7, 10],
    symbol: 'm7',
    description: 'Smooth and mellow, common in jazz and R&B.'
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
    name: 'Perfect Cadence',
    progression: ['V', 'I'],
    description: 'The strongest cadence, creates a sense of resolution.',
    example: 'G → C in C major'
  },
  plagal: {
    name: 'Plagal Cadence',
    progression: ['IV', 'I'],
    description: 'The "Amen" cadence, softer than perfect cadence.',
    example: 'F → C in C major'
  },
  imperfect: {
    name: 'Imperfect Cadence',
    progression: ['I', 'V'],
    description: 'Creates expectation and forward motion.',
    example: 'C → G in C major'
  },
  deceptive: {
    name: 'Deceptive Cadence',
    progression: ['V', 'vi'],
    description: 'Surprises the ear by not resolving as expected.',
    example: 'G → Am in C major'
  },
  half: {
    name: 'Half Cadence',
    progression: ['I', 'V'],
    description: 'Ends on V, creating a question-like effect.',
    example: 'C → G in C major'
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

// Helper functions
export const getScaleNotes = (rootNote: string, scaleType: keyof typeof scaleTypes): string[] => {
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