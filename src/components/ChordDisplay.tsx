import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { chordTypes, getChordNotes } from '@/constants/musicTheory';
import PianoKeyboard from './PianoKeyboard';

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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{rootNote}{chord.symbol}</span>
          <Badge variant="secondary">{chord.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Notes:</h4>
          <div className="flex flex-wrap gap-2">
            {chordNotes.map((note, index) => (
              <Badge key={index} variant="outline">
                {note}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">On Piano:</h4>
          <div className="overflow-x-auto">
            <PianoKeyboard 
              octaves={2}
              highlightedNotes={chordNotes}
              showLabels={true}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Description:</h4>
          <p className="text-sm text-muted-foreground">{chord.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChordDisplay;