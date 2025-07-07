
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

      // Générer les touches noires avec un positionnement réaliste comme sur un vrai piano
      const blackKeyPositions = [
        { note: 'C#', leftOffset: 0.75 }, // Légèrement à droite de C
        { note: 'D#', leftOffset: 1.75 }, // Légèrement à droite de D
        { note: 'F#', leftOffset: 3.75 }, // Légèrement à droite de F
        { note: 'G#', leftOffset: 4.75 }, // Légèrement à droite de G
        { note: 'A#', leftOffset: 5.75 }, // Légèrement à droite de A
      ];

      blackKeyPositions.forEach(({ note, leftOffset }) => {
        const noteWithOctave = `${note}${octave + 4}`;
        const positionInOctave = octave * 7 + leftOffset;
        
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
              left: `calc(${positionInOctave} * 2rem)`,
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
