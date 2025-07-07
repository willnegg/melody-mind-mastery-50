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
    const keys = [];
    
    // Structure d'une octave : C C# D D# E F F# G G# A A# B
    const octaveStructure = [
      { note: 'C', type: 'white' },
      { note: 'C#', type: 'black' },
      { note: 'D', type: 'white' },
      { note: 'D#', type: 'black' },
      { note: 'E', type: 'white' },
      { note: 'F', type: 'white' },
      { note: 'F#', type: 'black' },
      { note: 'G', type: 'white' },
      { note: 'G#', type: 'black' },
      { note: 'A', type: 'white' },
      { note: 'A#', type: 'black' },
      { note: 'B', type: 'white' }
    ];

    return (
      <div key={octave} className="relative flex">
        {/* Touches blanches */}
        {octaveStructure.filter(k => k.type === 'white').map((keyInfo, index) => {
          const noteWithOctave = `${keyInfo.note}${octave + 4}`;
          return (
            <div
              key={noteWithOctave}
              className={cn(
                'bg-white border border-border rounded-b-md cursor-pointer transition-all duration-150',
                'hover:bg-muted active:bg-accent',
                'flex items-end justify-center pb-2',
                highlightedNotes.includes(keyInfo.note) && 'bg-primary text-primary-foreground hover:bg-primary/90',
                'h-32 w-8 md:w-10'
              )}
              onClick={() => {
                if (isLoaded) playNote(keyInfo.note, octave + 4);
                onKeyPress?.(keyInfo.note);
              }}
            >
              {showLabels && (
                <span className="text-xs font-medium">
                  {keyInfo.note}
                </span>
              )}
            </div>
          );
        })}
        
        {/* Touches noires en position absolue */}
        <div
          className="absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150 hover:bg-gray-700 active:bg-gray-600 flex items-end justify-center pb-1 h-20 w-5 md:w-6 z-10"
          style={{ left: '1.5rem', transform: 'translateX(-50%)' }}
          onClick={() => {
            if (isLoaded) playNote('C#', octave + 4);
            onKeyPress?.('C#');
          }}
        >
          {showLabels && <span className="text-xs font-medium text-white">C#</span>}
        </div>
        
        <div
          className="absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150 hover:bg-gray-700 active:bg-gray-600 flex items-end justify-center pb-1 h-20 w-5 md:w-6 z-10"
          style={{ left: '3.5rem', transform: 'translateX(-50%)' }}
          onClick={() => {
            if (isLoaded) playNote('D#', octave + 4);
            onKeyPress?.('D#');
          }}
        >
          {showLabels && <span className="text-xs font-medium text-white">D#</span>}
        </div>
        
        <div
          className="absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150 hover:bg-gray-700 active:bg-gray-600 flex items-end justify-center pb-1 h-20 w-5 md:w-6 z-10"
          style={{ left: '7.5rem', transform: 'translateX(-50%)' }}
          onClick={() => {
            if (isLoaded) playNote('F#', octave + 4);
            onKeyPress?.('F#');
          }}
        >
          {showLabels && <span className="text-xs font-medium text-white">F#</span>}
        </div>
        
        <div
          className="absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150 hover:bg-gray-700 active:bg-gray-600 flex items-end justify-center pb-1 h-20 w-5 md:w-6 z-10"
          style={{ left: '9.5rem', transform: 'translateX(-50%)' }}
          onClick={() => {
            if (isLoaded) playNote('G#', octave + 4);
            onKeyPress?.('G#');
          }}
        >
          {showLabels && <span className="text-xs font-medium text-white">G#</span>}
        </div>
        
        <div
          className="absolute bg-gray-800 border border-gray-700 rounded-b-md cursor-pointer transition-all duration-150 hover:bg-gray-700 active:bg-gray-600 flex items-end justify-center pb-1 h-20 w-5 md:w-6 z-10"
          style={{ left: '11.5rem', transform: 'translateX(-50%)' }}
          onClick={() => {
            if (isLoaded) playNote('A#', octave + 4);
            onKeyPress?.('A#');
          }}
        >
          {showLabels && <span className="text-xs font-medium text-white">A#</span>}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('relative flex bg-background p-4 rounded-lg border', className)}>
      <div className="flex gap-0">
        {Array.from({ length: octaves }, (_, i) => renderOctave(i))}
      </div>
    </div>
  );
};

export default PianoKeyboard;