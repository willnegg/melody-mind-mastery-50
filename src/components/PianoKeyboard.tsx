import React from 'react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';

interface PianoKeyboardProps {
  octaves?: number;
  highlightedNotes?: string[];
  onKeyPress?: (note: string) => void;
  showLabels?: boolean;
  className?: string;
  startingNote?: string;
  baseOctave?: number;
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  octaves = 2,
  highlightedNotes = [],
  onKeyPress,
  showLabels = false,
  className,
  startingNote = 'C',
  baseOctave = 4
}) => {
  const { playNote, isLoaded } = useAudio();

  const renderOctave = (octave: number) => {
    // Adapter les touches selon la note de départ
    const allWhiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const startIndex = allWhiteKeys.indexOf(startingNote);
    const whiteKeys = [...allWhiteKeys.slice(startIndex), ...allWhiteKeys.slice(0, startIndex)];
    
    const keyWidth = 40; // largeur fixe en pixels
    
    // Définition précise des touches noires selon la note de départ
    const getBlackKeys = () => {
      if (startingNote === 'C') {
        return [
          { note: 'C#', betweenKeys: [0, 1] },
          { note: 'D#', betweenKeys: [1, 2] },
          { note: 'F#', betweenKeys: [3, 4] },
          { note: 'G#', betweenKeys: [4, 5] },
          { note: 'A#', betweenKeys: [5, 6] }
        ];
      } else { // startingNote === 'F'
        return [
          { note: 'F#', betweenKeys: [0, 1] }, // entre F et G
          { note: 'G#', betweenKeys: [1, 2] }, // entre G et A
          { note: 'A#', betweenKeys: [2, 3] }, // entre A et B
          { note: 'C#', betweenKeys: [4, 5] }, // entre C et D
          { note: 'D#', betweenKeys: [5, 6] }  // entre D et E
        ];
      }
    };
    
    const blackKeys = getBlackKeys();

    return (
      <div key={octave} className="relative">
        {/* Conteneur pour les touches blanches */}
        <div className="flex">
          {whiteKeys.map((note, index) => {
            const currentOctave = baseOctave + octave + (startingNote !== 'C' && ['C', 'D', 'E'].includes(note) ? 1 : 0);
            const noteWithOctave = `${note}${currentOctave}`;
            return (
              <div
                key={noteWithOctave}
                className={cn(
                  'bg-white border border-border rounded-b-md cursor-pointer transition-all duration-150',
                  'hover:bg-muted active:bg-accent',
                  'flex items-end justify-center pb-2 relative',
                  'h-32'
                )}
                style={{ width: `${keyWidth}px` }}
                onClick={() => {
                  if (isLoaded) playNote(note, currentOctave);
                  onKeyPress?.(note);
                }}
              >
                {/* Pastille pour les notes de la gamme */}
                {highlightedNotes.includes(note) && (
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {note}
                  </div>
                )}
                {showLabels && !highlightedNotes.includes(note) && (
                  <span className="text-xs font-medium text-muted-foreground">
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
          const leftPosition = leftKeyIndex * keyWidth + keyWidth;
          const rightPosition = rightKeyIndex * keyWidth;
          const centerPosition = (leftPosition + rightPosition) / 2;
          const currentOctave = baseOctave + octave + (startingNote !== 'C' && ['C', 'D', 'E'].includes(blackKey.note) ? 1 : 0);
          
          return (
            <div
              key={`${blackKey.note}${currentOctave}`}
              className={cn(
                'absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150',
                'hover:bg-gray-700 active:bg-gray-600 flex items-end justify-center pb-1 z-10 relative',
                'h-20 w-6'
              )}
              style={{ 
                left: `${centerPosition}px`,
                transform: 'translateX(-50%)',
                top: 0
              }}
              onClick={() => {
                if (isLoaded) playNote(blackKey.note, currentOctave);
                onKeyPress?.(blackKey.note);
              }}
            >
              {/* Pastille pour les notes noires de la gamme */}
              {highlightedNotes.includes(blackKey.note) && (
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {blackKey.note.replace('#', '♯').replace('b', '♭')}
                </div>
              )}
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