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

  // Debug pour voir les notes mises en évidence
  console.log('highlightedNotes:', highlightedNotes);

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
                {showLabels && !highlightedNotes.includes(note) && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {note}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Touches noires avec positionnement corrigé */}
        {blackKeys.map((blackKey, blackIndex) => {
          const [leftKeyIndex] = blackKey.betweenKeys;
          // Position centrée entre les deux touches blanches correctement
          const centerPosition = (leftKeyIndex + 0.5) * keyWidth;
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
            </div>
          );
        })}

        {/* Pastilles pour toutes les touches de la gamme - au premier plan */}
        {/* Pastilles touches blanches */}
        {whiteKeys.map((note, index) => {
          const currentOctave = baseOctave + octave + (startingNote !== 'C' && ['C', 'D', 'E'].includes(note) ? 1 : 0);
          if (!highlightedNotes.includes(note)) return null;
          
          return (
            <div
              key={`pastille-white-${note}${currentOctave}`}
              className="absolute bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-50 pointer-events-none"
              style={{
                left: `${(index + 0.5) * keyWidth}px`,
                top: '8px',
                transform: 'translateX(-50%)'
              }}
            >
              {note}
            </div>
          );
        })}

        {/* Pastilles touches noires */}
        {blackKeys.map((blackKey, blackIndex) => {
          const [leftKeyIndex] = blackKey.betweenKeys;
          const centerPosition = (leftKeyIndex + 0.5) * keyWidth;
          const currentOctave = baseOctave + octave + (startingNote !== 'C' && ['C', 'D', 'E'].includes(blackKey.note) ? 1 : 0);
          
          if (!highlightedNotes.includes(blackKey.note)) return null;
          
          console.log('Rendering black pastille for:', blackKey.note, 'highlighted:', highlightedNotes.includes(blackKey.note));
          
          return (
            <div
              key={`pastille-black-${blackKey.note}${currentOctave}`}
              className="absolute bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold z-50 pointer-events-none"
              style={{
                left: `${centerPosition}px`,
                top: '4px',
                transform: 'translateX(-50%)'
              }}
            >
              {blackKey.note.replace('#', '♯').replace('b', '♭')}
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