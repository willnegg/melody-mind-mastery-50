import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { cadences, notes, getChordNotes } from '@/constants/musicTheory';
import PianoKeyboard from '@/components/PianoKeyboard';

const CadenceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedKey, setSelectedKey] = useState('C');
  
  const cadenceType = id as keyof typeof cadences;
  const cadence = cadences[cadenceType];

  if (!cadence) {
    return (
      <div className="min-h-screen bg-background pb-20 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Cadence Not Found</h1>
          <Link to="/learn">
            <Button>Back to Learn</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Roman numeral to scale degree mapping
  const romanNumeralToScaleDegree = {
    'I': 0, 'ii': 1, 'iii': 2, 'IV': 3, 'V': 4, 'vi': 5, 'vii°': 6
  };

  // Get chord notes for the progression
  const getProgressionChords = (key: string, progression: string[]) => {
    const keyIndex = notes.indexOf(key);
    const majorScale = [0, 2, 4, 5, 7, 9, 11]; // Major scale intervals
    
    return progression.map((romanNumeral) => {
      const scaleDegree = romanNumeralToScaleDegree[romanNumeral as keyof typeof romanNumeralToScaleDegree];
      if (scaleDegree === undefined) return [];
      
      const rootNote = notes[(keyIndex + majorScale[scaleDegree]) % 12];
      
      // Determine chord type based on roman numeral
      if (romanNumeral === romanNumeral.toLowerCase()) {
        // Minor chord
        return getChordNotes(rootNote, 'minor');
      } else if (romanNumeral.includes('°')) {
        // Diminished chord
        return getChordNotes(rootNote, 'diminished');
      } else {
        // Major chord
        return getChordNotes(rootNote, 'major');
      }
    });
  };

  const progressionChords = getProgressionChords(selectedKey, cadence.progression);
  const allCadenceNotes = [...new Set(progressionChords.flat())];

  const cadenceAnalysis = {
    perfect: {
      function: 'Dominant to Tonic',
      strength: 'Very Strong',
      feeling: 'Complete resolution',
      usage: 'End of phrases, sections, pieces'
    },
    plagal: {
      function: 'Subdominant to Tonic',
      strength: 'Moderate',
      feeling: 'Soft, religious quality',
      usage: 'Church music, folk songs'
    },
    imperfect: {
      function: 'Any chord to Dominant',
      strength: 'Weak (no resolution)',
      feeling: 'Expectation, suspension',
      usage: 'Middle of phrases, questions'
    },
    deceptive: {
      function: 'Dominant to Submediant',
      strength: 'Surprising',
      feeling: 'Unexpected, continues forward',
      usage: 'Avoiding closure, extending phrases'
    },
    half: {
      function: 'Any chord to Dominant',
      strength: 'Moderate',
      feeling: 'Question-like, incomplete',
      usage: 'End of first half of phrases'
    }
  };

  const analysis = cadenceAnalysis[cadenceType];

  const musicalExamples = {
    perfect: [
      { piece: 'Bach Chorale #1', description: 'Every phrase ends with V-I' },
      { piece: 'Beethoven Symphony 5', description: 'Dramatic perfect cadences' },
      { piece: 'Mozart Sonata K545', description: 'Classical perfect cadences' }
    ],
    plagal: [
      { piece: 'Amazing Grace', description: 'IV-I "Amen" ending' },
      { piece: 'Hey Jude (Beatles)', description: 'Famous plagal cadence' },
      { piece: 'Traditional Hymns', description: 'Common in church music' }
    ],
    imperfect: [
      { piece: 'Bach Inventions', description: 'Mid-phrase cadences' },
      { piece: 'Chopin Nocturnes', description: 'Creating expectation' },
      { piece: 'Classical Sonatas', description: 'First half of phrases' }
    ],
    deceptive: [
      { piece: 'Bach Chorale harmonizations', description: 'V-vi progressions' },
      { piece: 'Mozart Piano Sonatas', description: 'Extending phrases' },
      { piece: 'Romantic era pieces', description: 'Avoiding resolution' }
    ],
    half: [
      { piece: 'Bach Chorales', description: 'Mid-phrase punctuation' },
      { piece: 'Classical period works', description: 'Antecedent phrases' },
      { piece: 'Folk songs', description: 'Question-answer structure' }
    ]
  };

  const currentExamples = musicalExamples[cadenceType] || [];

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
              <h1 className="text-3xl font-bold mb-2">{cadence.name}</h1>
              <p className="text-muted-foreground">{cadence.description}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {cadence.progression.join(' → ')}
            </Badge>
          </div>
        </header>

        <div className="space-y-6">
          {/* Key Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Key</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {notes.map((note) => (
                  <Button
                    key={note}
                    variant={selectedKey === note ? "default" : "outline"}
                    onClick={() => setSelectedKey(note)}
                    className="aspect-square"
                  >
                    {note}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cadence Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Cadence in {selectedKey} Major</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">
                  {cadence.progression.join(' → ')} = {cadence.example.replace('C', selectedKey)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progressionChords.map((chordNotes, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="text-center mb-3">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {cadence.progression[index]}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {chordNotes.join(' - ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <PianoKeyboard 
                  octaves={2}
                  highlightedNotes={allCadenceNotes}
                  showLabels={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Harmonic Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Harmonic Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Cadence Properties:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Function:</span>
                      <span>{analysis.function}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Strength:</span>
                      <span>{analysis.strength}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Feeling:</span>
                      <span>{analysis.feeling}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usage:</span>
                      <span className="text-right">{analysis.usage}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Voice Leading:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {cadenceType === 'perfect' && (
                      <>
                        <div>• Leading tone resolves up to tonic</div>
                        <div>• Dominant resolves down to tonic</div>
                        <div>• Strong pull towards resolution</div>
                      </>
                    )}
                    {cadenceType === 'plagal' && (
                      <>
                        <div>• Subdominant moves to tonic</div>
                        <div>• No leading tone resolution</div>
                        <div>• Smoother voice leading</div>
                      </>
                    )}
                    {cadenceType === 'deceptive' && (
                      <>
                        <div>• Expected tonic replaced by vi</div>
                        <div>• Leading tone still resolves up</div>
                        <div>• Creates forward momentum</div>
                      </>
                    )}
                    {(cadenceType === 'imperfect' || cadenceType === 'half') && (
                      <>
                        <div>• Ends on dominant chord</div>
                        <div>• Creates expectation</div>
                        <div>• Requires continuation</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
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
                      <h3 className="font-medium mb-2">{example.piece}</h3>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CadenceDetail;