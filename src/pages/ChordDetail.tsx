import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { chordTypes, notes, getChordNotes } from '@/constants/musicTheory';
import ChordDisplay from '@/components/ChordDisplay';
import PianoKeyboard from '@/components/PianoKeyboard';

const ChordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedInversion, setSelectedInversion] = useState(0);
  
  const chordType = id as keyof typeof chordTypes;
  const chord = chordTypes[chordType];

  if (!chord) {
    return (
      <div className="min-h-screen bg-background pb-20 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Chord Not Found</h1>
          <Link to="/learn">
            <Button>Back to Learn</Button>
          </Link>
        </div>
      </div>
    );
  }

  const chordNotes = getChordNotes(selectedRoot, chordType);
  
  // Create inversions
  const getInversion = (notes: string[], inversion: number) => {
    const inverted = [...notes];
    for (let i = 0; i < inversion; i++) {
      const first = inverted.shift();
      if (first) inverted.push(first);
    }
    return inverted;
  };

  const currentInversion = getInversion(chordNotes, selectedInversion);

  const getInversionName = (inversion: number) => {
    switch (inversion) {
      case 0: return 'Root Position';
      case 1: return '1st Inversion';
      case 2: return '2nd Inversion';
      case 3: return '3rd Inversion';
      default: return `${inversion}th Inversion`;
    }
  };

  const musicalExamples = {
    major: [
      { progression: 'I-V-vi-IV', description: 'Pop progression (C-G-Am-F)' },
      { progression: 'I-IV-V-I', description: 'Classic cadence' },
      { progression: 'vi-IV-I-V', description: 'Popular in modern music' }
    ],
    minor: [
      { progression: 'i-iv-V-i', description: 'Minor key progression' },
      { progression: 'i-VII-VI-VII', description: 'Natural minor progression' },
      { progression: 'i-v-iv-i', description: 'Modal minor sound' }
    ],
    diminished: [
      { progression: 'vii°-I', description: 'Leading tone resolution' },
      { progression: 'ii°-V', description: 'Predominant function' },
      { progression: 'passing chord', description: 'Between stable chords' }
    ],
    augmented: [
      { progression: 'I+-vi', description: 'Unexpected resolution' },
      { progression: 'V+-I', description: 'Altered dominant' },
      { progression: 'chromatic', description: 'Voice leading tool' }
    ],
    major7: [
      { progression: 'Imaj7-vi-ii-V', description: 'Jazz standard progression' },
      { progression: 'IVmaj7-I', description: 'Lydian sound' },
      { progression: 'Imaj7-Imaj7', description: 'Tonic prolongation' }
    ],
    dominant7: [
      { progression: 'V7-I', description: 'Dominant resolution' },
      { progression: 'I7-IV', description: 'Blues progression' },
      { progression: 'ii-V7-I', description: 'ii-V-I turnaround' }
    ],
    minor7: [
      { progression: 'ii7-V7-I', description: 'Jazz ii-V-I' },
      { progression: 'vi7-ii7-V7-I', description: 'Circle of fifths' },
      { progression: 'i7-iv7', description: 'Minor seventh chords' }
    ]
  };

  const currentExamples = musicalExamples[chordType] || [];

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link to="/learn" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Learn
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{chord.name} Chord</h1>
              <p className="text-muted-foreground">{chord.description}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {selectedRoot}{chord.symbol}
            </Badge>
          </div>
        </header>

        <div className="space-y-6">
          {/* Root Note Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Root Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {notes.map((note) => (
                  <Button
                    key={note}
                    variant={selectedRoot === note ? "default" : "outline"}
                    onClick={() => setSelectedRoot(note)}
                    className="aspect-square"
                  >
                    {note}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chord Display */}
          <ChordDisplay 
            rootNote={selectedRoot}
            chordType={chordType}
          />

          {/* Inversions */}
          <Card>
            <CardHeader>
              <CardTitle>Chord Inversions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {Array.from({ length: chordNotes.length }, (_, i) => (
                  <Button
                    key={i}
                    variant={selectedInversion === i ? "default" : "outline"}
                    onClick={() => setSelectedInversion(i)}
                  >
                    {getInversionName(i)}
                  </Button>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">
                  {getInversionName(selectedInversion)} - {currentInversion.join(' - ')}
                </h4>
                <div className="overflow-x-auto">
                  <PianoKeyboard 
                    octaves={2}
                    highlightedNotes={currentInversion}
                    showLabels={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chord Progressions */}
          {currentExamples.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Common Progressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentExamples.map((example, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border">
                      <h3 className="font-medium mb-2">{example.progression}</h3>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chord Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Chord Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Chord Tones:</h4>
                  <div className="space-y-2">
                    {chordNotes.map((note, index) => {
                      const intervals = ['Root', '3rd', '5th', '7th'];
                      return (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm text-muted-foreground">{intervals[index] || `${index + 1}th`}:</span>
                          <Badge variant="outline">{note}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Chord Quality:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{chord.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Symbol:</span>
                      <span>{selectedRoot}{chord.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Notes:</span>
                      <span>{chordNotes.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChordDetail;