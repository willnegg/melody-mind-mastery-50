import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';
import { chordTypes, getChordNotes } from '@/constants/musicTheory';
import PianoKeyboard from './PianoKeyboard';
import { useAudio } from '@/hooks/useAudio';

interface ChordDisplayProps {
  rootNote: string;
  chordType: keyof typeof chordTypes;
  className?: string;
}

const ChordDisplay: React.FC<ChordDisplayProps> = ({
  rootNote,
  chordType,
  className
}) => {
  const chord = chordTypes[chordType];
  const chordNotes = getChordNotes(rootNote, chordType);
  const { playChord, isPlaying, stopAll, isLoaded } = useAudio();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{rootNote}{chord.symbol}</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{chord.name}</Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => isPlaying ? stopAll() : playChord(chordNotes)}
              disabled={!isLoaded}
            >
              {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Notes :</h4>
          <div className="flex flex-wrap gap-2">
            {chordNotes.map((note, index) => (
              <Badge key={index} variant="outline">
                {note}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Au piano :</h4>
          <div className="overflow-x-auto">
            <PianoKeyboard 
              octaves={2}
              highlightedNotes={chordNotes}
              showLabels={true}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Description :</h4>
          <p className="text-sm text-muted-foreground">{chord.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChordDisplay;