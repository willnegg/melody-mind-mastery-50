
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

      // Générer les touches noires centrées entre les bonnes touches blanches
      const blackKeyPositions = [
        { note: 'C#', betweenWhiteKeys: [0, 1] }, // Entre C (0) et D (1)
        { note: 'D#', betweenWhiteKeys: [1, 2] }, // Entre D (1) et E (2)
        { note: 'F#', betweenWhiteKeys: [3, 4] }, // Entre F (3) et G (4)
        { note: 'G#', betweenWhiteKeys: [4, 5] }, // Entre G (4) et A (5)
        { note: 'A#', betweenWhiteKeys: [5, 6] }, // Entre A (5) et B (6)
      ];

      blackKeyPositions.forEach(({ note, betweenWhiteKeys }) => {
        const noteWithOctave = `${note}${octave + 4}`;
        const firstWhiteKeyIndex = octave * 7 + betweenWhiteKeys[0];
        const secondWhiteKeyIndex = octave * 7 + betweenWhiteKeys[1];
        // Position centrée entre les deux touches blanches
        const centerPosition = (firstWhiteKeyIndex + secondWhiteKeyIndex) / 2;
        
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
              left: `calc(${centerPosition} * 2rem)`,
              transform: 'translateX(-50%)'
            } as React.CSSProperties}
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
