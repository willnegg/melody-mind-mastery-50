import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';
import { scaleTypes, notes, getScaleNotes } from '@/constants/musicTheory';
import ScaleDisplay from '@/components/ScaleDisplay';
import CircleOfFifths from '@/components/CircleOfFifths';

const ScaleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedRoot, setSelectedRoot] = useState('C');
  
  const scaleType = id as keyof typeof scaleTypes;
  const scale = scaleTypes[scaleType];

  if (!scale) {
    return (
      <div className="min-h-screen bg-background pb-20 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Scale Not Found</h1>
          <Link to="/learn">
            <Button>Back to Learn</Button>
          </Link>
        </div>
      </div>
    );
  }

  const scaleNotes = getScaleNotes(selectedRoot, scaleType);

  const musicalExamples = {
    major: [
      { song: 'Happy Birthday', description: 'Classic melody in major scale' },
      { song: 'Twinkle Twinkle Little Star', description: 'Simple major scale melody' },
      { song: 'Do-Re-Mi', description: 'From The Sound of Music' }
    ],
    minor: [
      { song: 'Für Elise', description: 'Beethoven\'s famous piece in A minor' },
      { song: 'Scarborough Fair', description: 'Traditional English ballad' },
      { song: 'Mad World', description: 'Haunting minor melody' }
    ],
    pentatonic: [
      { song: 'Amazing Grace', description: 'Traditional hymn using pentatonic' },
      { song: 'Auld Lang Syne', description: 'New Year\'s Eve classic' },
      { song: 'Swing Low, Sweet Chariot', description: 'Spiritual using pentatonic' }
    ],
    blues: [
      { song: 'Sweet Home Chicago', description: 'Classic blues progression' },
      { song: 'The Thrill Is Gone', description: 'B.B. King classic' },
      { song: 'Stormy Monday', description: 'T-Bone Walker blues standard' }
    ],
    dorian: [
      { song: 'So What', description: 'Miles Davis jazz standard' },
      { song: 'Scarborough Fair', description: 'Can be heard in Dorian mode' },
      { song: 'Eleanor Rigby', description: 'Beatles song with Dorian flavor' }
    ]
  };

  const currentExamples = musicalExamples[scaleType] || [];

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
              <h1 className="text-3xl font-bold mb-2">{scale.name} Scale</h1>
              <p className="text-muted-foreground">{scale.description}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {scale.formula}
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

          {/* Scale Display */}
          <ScaleDisplay 
            rootNote={selectedRoot}
            scaleType={scaleType}
          />

          {/* Circle of Fifths */}
          <Card>
            <CardHeader>
              <CardTitle>Circle of Fifths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <CircleOfFifths 
                  highlightedNotes={scaleNotes}
                  onNoteClick={setSelectedRoot}
                  size={300}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Click on any note in the circle to change the root note
              </p>
            </CardContent>
          </Card>

          {/* Musical Examples */}
          {currentExamples.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Musical Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentExamples.map((example, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border">
                      <h3 className="font-medium mb-2">{example.song}</h3>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scale Degrees */}
          <Card>
            <CardHeader>
              <CardTitle>Scale Degrees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-3">In {selectedRoot} {scale.name}:</h4>
                  <div className="space-y-2">
                    {scaleNotes.map((note, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="font-medium">{index + 1}.</span>
                        <Badge variant="outline">{note}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Scale Degree Names:</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>1. Tonic (Do)</div>
                    <div>2. Supertonic (Re)</div>
                    <div>3. Mediant (Mi)</div>
                    <div>4. Subdominant (Fa)</div>
                    <div>5. Dominant (Sol)</div>
                    <div>6. Submediant (La)</div>
                    <div>7. Leading Tone (Ti)</div>
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

export default ScaleDetail;