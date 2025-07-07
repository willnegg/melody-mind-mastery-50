import React from 'react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';

interface PianoKeyboardProps {
  octaves?: number;
  highlightedNotes?: string[];
  onKeyPress?: (note: string) => void;
  showLabels?: boolean;
  className?: string;
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  octaves = 2,
  highlightedNotes = [],
  onKeyPress,
  showLabels = false,
  className
}) => {
  const { playNote, isLoaded } = useAudio();

  const renderKeys = () => {
    const whiteKeys = [];
    const blackKeys = [];
    
    for (let octave = 0; octave < octaves; octave++) {
      // Render white keys
      for (let i = 0; i < 7; i++) {
        const whiteNote = ['C', 'D', 'E', 'F', 'G', 'A', 'B'][i];
        const whiteNoteWithOctave = `${whiteNote}${octave + 4}`;

        whiteKeys.push(
          <div
            key={whiteNoteWithOctave}
            className={cn(
              'relative bg-white border border-gray-300 rounded-b-md cursor-pointer transition-all duration-150',
              'hover:bg-gray-50 active:bg-gray-100',
              'flex items-end justify-center pb-2',
              highlightedNotes.includes(whiteNote) && 'bg-blue-100 border-blue-300 shadow-md',
              'h-32 w-8 md:w-10'
            )}
            onClick={() => {
              if (isLoaded) playNote(whiteNote, octave + 4);
              onKeyPress?.(whiteNote);
            }}
          >
            {showLabels && (
              <span className={cn(
                'text-xs font-medium',
                highlightedNotes.includes(whiteNote) ? 'text-blue-700 font-bold' : 'text-gray-600'
              )}>
                {whiteNote}
              </span>
            )}
          </div>
        );
      }

      // Render black keys with correct positioning
      const blackKeyPositions = [
        { note: 'C#', position: 0.5 }, // Between C and D
        { note: 'D#', position: 1.5 }, // Between D and E
        // No black key between E and F
        { note: 'F#', position: 3.5 }, // Between F and G
        { note: 'G#', position: 4.5 }, // Between G and A
        { note: 'A#', position: 5.5 }, // Between A and B
        // No black key between B and C
      ];

      blackKeyPositions.forEach(({ note, position }) => {
        const blackNoteWithOctave = `${note}${octave + 4}`;
        const keyWidth = 32; // Same as md:w-10 in pixels
        const leftPosition = (octave * 7 + position) * keyWidth;

        blackKeys.push(
          <div
            key={blackNoteWithOctave}
            className={cn(
              'absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150',
              'hover:bg-gray-700 active:bg-gray-600',
              'flex items-end justify-center pb-1',
              highlightedNotes.includes(note) && 'bg-blue-800 border-blue-600',
              'h-20 w-5 md:w-6 z-10'
            )}
            style={{ 
              left: `${leftPosition}px`,
              transform: 'translateX(-50%)'
            }}
            onClick={() => {
              if (isLoaded) playNote(note, octave + 4);
              onKeyPress?.(note);
            }}
          >
            {showLabels && (
              <span className={cn(
                'text-xs font-medium',
                highlightedNotes.includes(note) ? 'text-blue-200 font-bold' : 'text-white'
              )}>
                {note}
              </span>
            )}
          </div>
        );
      });
    }
    
    return { whiteKeys, blackKeys };
  };

  const { whiteKeys, blackKeys } = renderKeys();

  return (
    <div className={cn('relative flex bg-background p-4 rounded-lg border', className)}>
      <div className="relative flex gap-0">
        {whiteKeys}
        {blackKeys}
      </div>
    </div>
  );
};

export default PianoKeyboard;