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
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];

  const renderKeys = () => {
    const keys = [];
    
    for (let octave = 0; octave < octaves; octave++) {
      for (let i = 0; i < whiteKeys.length; i++) {
        const whiteNote = whiteKeys[i];
        const blackNote = blackKeys[i];
        const whiteNoteWithOctave = `${whiteNote}${octave + 4}`;
        const blackNoteWithOctave = blackNote ? `${blackNote}${octave + 4}` : '';

        // White key
        keys.push(
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

        // Black key (if exists)
        if (blackNote) {
          keys.push(
            <div
              key={blackNoteWithOctave}
              className={cn(
                'absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150',
                'hover:bg-gray-700 active:bg-gray-600',
                'flex items-end justify-center pb-1',
                highlightedNotes.includes(blackNote) && 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
                'h-20 w-5 md:w-6 z-10',
                '-ml-3 md:-ml-3'
              )}
              style={{ 
                left: `${(octave * 7 + i) * 32 + 20}px`,
                transform: 'translateX(-50%)'
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
      }
    }
    
    return keys;
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