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

  const renderOctave = (octave: number) => {
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const keyWidth = 40; // largeur fixe en pixels
    
    // Définition précise des touches noires : entre quelles touches blanches elles se situent
    const blackKeys = [
      { note: 'C#', betweenKeys: [0, 1] }, // entre C (0) et D (1)
      { note: 'D#', betweenKeys: [1, 2] }, // entre D (1) et E (2)
      { note: 'F#', betweenKeys: [3, 4] }, // entre F (3) et G (4)
      { note: 'G#', betweenKeys: [4, 5] }, // entre G (4) et A (5)
      { note: 'A#', betweenKeys: [5, 6] }  // entre A (5) et B (6)
    ];

    return (
      <div key={octave} className="relative">
        {/* Conteneur pour les touches blanches */}
        <div className="flex">
          {whiteKeys.map((note, index) => {
            const noteWithOctave = `${note}${octave + 4}`;
            return (
              <div
                key={noteWithOctave}
                className={cn(
                  'bg-white border border-border rounded-b-md cursor-pointer transition-all duration-150',
                  'hover:bg-muted active:bg-accent',
                  'flex items-end justify-center pb-2',
                  highlightedNotes.includes(note) && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  'h-32'
                )}
                style={{ width: `${keyWidth}px` }}
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
          })}
        </div>
        
        {/* Touches noires positionnées au centre entre les touches blanches */}
        {blackKeys.map((blackKey) => {
          const [leftKeyIndex, rightKeyIndex] = blackKey.betweenKeys;
          const leftPosition = leftKeyIndex * keyWidth + keyWidth; // fin de la touche de gauche
          const rightPosition = rightKeyIndex * keyWidth; // début de la touche de droite
          const centerPosition = (leftPosition + rightPosition) / 2; // centre exact
          
          return (
            <div
              key={`${blackKey.note}${octave + 4}`}
              className={cn(
                'absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150',
                'hover:bg-gray-700 active:bg-gray-600 flex items-end justify-center pb-1 z-10',
                'h-20 w-6',
                highlightedNotes.includes(blackKey.note) && 'bg-primary hover:bg-primary/80'
              )}
              style={{ 
                left: `${centerPosition}px`,
                transform: 'translateX(-50%)',
                top: 0
              }}
              onClick={() => {
                if (isLoaded) playNote(blackKey.note, octave + 4);
                onKeyPress?.(blackKey.note);
              }}
            >
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn('relative bg-background p-4 rounded-lg border inline-block', className)}>
      <div className="flex gap-0">
        {Array.from({ length: octaves }, (_, i) => renderOctave(i))}
      </div>
    </div>
  );
};

export default PianoKeyboard;