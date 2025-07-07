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
    const blackKeys = [
      { note: 'C#', position: 1, offset: 0.5 },
      { note: 'D#', position: 2, offset: 0.5 },
      { note: 'F#', position: 4, offset: 0.5 },
      { note: 'G#', position: 5, offset: 0.5 },
      { note: 'A#', position: 6, offset: 0.5 }
    ];

    return (
      <div key={octave} className="relative flex">
        {/* Touches blanches */}
        {whiteKeys.map((note, index) => {
          const noteWithOctave = `${note}${octave + 4}`;
          return (
            <div
              key={noteWithOctave}
              className={cn(
                'bg-background border border-border rounded-b-md cursor-pointer transition-all duration-150',
                'hover:bg-muted active:bg-accent',
                'flex items-end justify-center pb-2',
                highlightedNotes.includes(note) && 'bg-primary text-primary-foreground hover:bg-primary/90',
                'h-32 w-10 select-none'
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
        })}
        
        {/* Touches noires */}
        {blackKeys.map((keyInfo) => {
          const noteWithOctave = `${keyInfo.note}${octave + 4}`;
          return (
            <div
              key={noteWithOctave}
              className={cn(
                'absolute bg-muted-foreground border border-muted rounded-b-md cursor-pointer transition-all duration-150',
                'hover:bg-muted-foreground/80 active:bg-muted-foreground/60 flex items-end justify-center pb-1 z-10',
                'h-20 w-6 select-none',
                highlightedNotes.includes(keyInfo.note) && 'bg-primary hover:bg-primary/90'
              )}
              style={{ 
                left: `${(keyInfo.position - 1) * 2.5 + 1.75}rem`,
                transform: 'translateX(-50%)'
              }}
              onClick={() => {
                if (isLoaded) playNote(keyInfo.note, octave + 4);
                onKeyPress?.(keyInfo.note);
              }}
            >
              {showLabels && (
                <span className="text-xs font-medium text-background">
                  {keyInfo.note}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn('relative flex bg-muted p-4 rounded-lg border', className)}>
      <div className="flex gap-0">
        {Array.from({ length: octaves }, (_, i) => renderOctave(i))}
      </div>
    </div>
  );
};

export default PianoKeyboard;