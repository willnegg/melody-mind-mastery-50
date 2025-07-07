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
      // Générer les touches blanches
      const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      whiteNotes.forEach((note, index) => {
        const noteWithOctave = `${note}${octave + 4}`;
        
        whiteKeys.push(
          <div
            key={noteWithOctave}
            className={cn(
              'relative bg-white border border-border rounded-b-md cursor-pointer transition-all duration-150',
              'hover:bg-muted active:bg-accent',
              'flex items-end justify-center pb-2',
              highlightedNotes.includes(note) && 'bg-primary text-primary-foreground hover:bg-primary/90',
              'h-32 w-8 md:w-10'
            )}
            onClick={() => {
              if (isLoaded) playNote(note, octave + 4);
              onKeyPress?.(note);
            }}
          >
            {showLabels && (
              <span className="text-xs font-medium">
                {note}
              </span>
            )}
          </div>
        );
      });

      // Position exacte des touches noires selon un vrai piano
      // C# entre C-D, D# entre D-E, F# entre F-G, G# entre G-A, A# entre A-B
      const blackKeyData = [
        { note: 'C#', whiteKeyIndex: 0.5 }, // Entre C (0) et D (1)
        { note: 'D#', whiteKeyIndex: 1.5 }, // Entre D (1) et E (2)  
        { note: 'F#', whiteKeyIndex: 3.5 }, // Entre F (3) et G (4)
        { note: 'G#', whiteKeyIndex: 4.5 }, // Entre G (4) et A (5)
        { note: 'A#', whiteKeyIndex: 5.5 }, // Entre A (5) et B (6)
      ];

      blackKeyData.forEach(({ note, whiteKeyIndex }) => {
        const noteWithOctave = `${note}${octave + 4}`;
        const absolutePosition = octave * 7 + whiteKeyIndex;
        
        blackKeys.push(
          <div
            key={noteWithOctave}
            className={cn(
              'absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150',
              'hover:bg-gray-700 active:bg-gray-600',
              'flex items-end justify-center pb-1',
              'h-20 w-5 md:w-6 z-10'
            )}
            style={{ 
              left: `${absolutePosition * 2}rem`,
              transform: 'translateX(-50%)'
            }}
            onClick={() => {
              if (isLoaded) playNote(note, octave + 4);
              onKeyPress?.(note);
            }}
          >
            {showLabels && (
              <span className="text-xs font-medium text-white">
                {note}
              </span>
            )}
          </div>
        );
      });
    }
    
    return [...whiteKeys, ...blackKeys];
  };

  return (
    <div className={cn('relative flex bg-background p-4 rounded-lg border', className)}>
      <div className="relative flex gap-0">
        {renderKeys()}
      </div>
    </div>
  );
};

export default PianoKeyboard;