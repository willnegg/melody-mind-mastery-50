import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { scaleTypes, getScaleNotes } from '@/constants/musicTheory';
import PianoKeyboard from './PianoKeyboard';

interface ScaleDisplayProps {
  rootNote: string;
  scaleType: keyof typeof scaleTypes;
  className?: string;
}

const ScaleDisplay: React.FC<ScaleDisplayProps> = ({
  rootNote,
  scaleType,
  className
}) => {
  const scale = scaleTypes[scaleType];
  const scaleNotes = getScaleNotes(rootNote, scaleType);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{rootNote} {scale.name}</span>
          <Badge variant="secondary">{scale.formula}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Notes:</h4>
          <div className="flex flex-wrap gap-2">
            {scaleNotes.map((note, index) => (
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
              highlightedNotes={scaleNotes}
              showLabels={true}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Description:</h4>
          <p className="text-sm text-muted-foreground">{scale.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScaleDisplay;