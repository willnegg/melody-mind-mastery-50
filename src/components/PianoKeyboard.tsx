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
    const keys = [];
    
    for (let octave = 0; octave < octaves; octave++) {
      // Génération de toutes les touches dans l'ordre logique
      const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      
      whiteNotes.forEach((note, index) => {
        const noteWithOctave = `${note}${octave + 4}`;
        const position = octave * 7 + index;
        
        // Touche blanche
        keys.push(
          <div
            key={noteWithOctave}
            className={cn(
              'bg-white border border-border rounded-b-md cursor-pointer transition-all duration-150',
              'hover:bg-muted active:bg-accent',
              'flex items-end justify-center pb-2',
              highlightedNotes.includes(note) && 'bg-primary text-primary-foreground hover:bg-primary/90',
              'h-32 w-8 md:w-10'
            )}
            style={{ 
              position: 'absolute',
              left: `calc(${position} * 2rem)`,
              zIndex: 1
            }}
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
        
        // Ajouter la touche noire correspondante si elle existe
        const blackNoteMap: Record<string, string> = {
          'C': 'C#',
          'D': 'D#',
          'F': 'F#',
          'G': 'G#',
          'A': 'A#'
        };
        
        if (blackNoteMap[note]) {
          const blackNote = blackNoteMap[note];
          const blackNoteWithOctave = `${blackNote}${octave + 4}`;
          const blackPosition = position + 0.5; // Centre entre cette touche et la suivante
          
          keys.push(
            <div
              key={blackNoteWithOctave}
              className={cn(
                'bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150',
                'hover:bg-gray-700 active:bg-gray-600',
                'flex items-end justify-center pb-1',
                'h-20 w-5 md:w-6'
              )}
              style={{ 
                position: 'absolute',
                left: `calc(${blackPosition} * 2rem)`,
                transform: 'translateX(-50%)',
                zIndex: 2
              }}
              onClick={() => {
                if (isLoaded) playNote(blackNote, octave + 4);
                onKeyPress?.(blackNote);
              }}
            >
              {showLabels && (
                <span className="text-xs font-medium text-white">
                  {blackNote}
                </span>
              )}
            </div>
          );
        }
      });
    }
    
    return keys;
  };

  return (
    <div className={cn('relative bg-background p-4 rounded-lg border', className)}>
      <div className="relative" style={{ height: '8rem', width: `${octaves * 7 * 2}rem` }}>
        {renderKeys()}
      </div>
    </div>
  );
};

export default PianoKeyboard;