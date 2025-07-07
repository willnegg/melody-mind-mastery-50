import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PianoKeyboard from '@/components/PianoKeyboard';
import { notes, scaleTypes, chordTypes, getScaleNotes, getChordNotes } from '@/constants/musicTheory';
import { useProgressStore } from '@/store/progressStore';
import { useToast } from '@/hooks/use-toast';

const Practice: React.FC = () => {
  const [practiceType, setPracticeType] = useState<'scale' | 'chord'>('scale');
  const [rootNote, setRootNote] = useState<string>('C');
  const [scaleType, setScaleType] = useState<keyof typeof scaleTypes>('major');
  const [chordType, setChordType] = useState<keyof typeof chordTypes>('major');
  const [showAnswer, setShowAnswer] = useState(false);
  
  const { completeScale, completeChord } = useProgressStore();
  const { toast } = useToast();

  const currentNotes = practiceType === 'scale' 
    ? getScaleNotes(rootNote, scaleType)
    : getChordNotes(rootNote, chordType);

  const currentName = practiceType === 'scale'
    ? `${rootNote} ${scaleTypes[scaleType].name}`
    : `${rootNote}${chordTypes[chordType].symbol}`;

  const handleShowAnswer = () => {
    setShowAnswer(true);
    
    if (practiceType === 'scale') {
      completeScale(`${rootNote}-${scaleType}`);
    } else {
      completeChord(`${rootNote}-${chordType}`);
    }

    toast({
      title: "Bien joué !",
      description: `Vous avez pratiqué ${currentName}`,
    });
  };

  const handleReset = () => {
    setShowAnswer(false);
  };

  const generateRandomChallenge = () => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setRootNote(randomNote);
    
    if (practiceType === 'scale') {
      const scaleKeys = Object.keys(scaleTypes) as (keyof typeof scaleTypes)[];
      const randomScale = scaleKeys[Math.floor(Math.random() * scaleKeys.length)];
      setScaleType(randomScale);
    } else {
      const chordKeys = Object.keys(chordTypes) as (keyof typeof chordTypes)[];
      const randomChord = chordKeys[Math.floor(Math.random() * chordKeys.length)];
      setChordType(randomChord);
    }
    
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pratique</h1>
          <p className="text-muted-foreground">
            Testez vos connaissances avec des exercices interactifs
          </p>
        </header>

        <div className="space-y-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de pratique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select value={practiceType} onValueChange={(value: 'scale' | 'chord') => setPracticeType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scale">Gamme</SelectItem>
                      <SelectItem value="chord">Accord</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Note fondamentale</label>
                  <Select value={rootNote} onValueChange={setRootNote}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notes.map((note) => (
                        <SelectItem key={note} value={note}>{note}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {practiceType === 'scale' ? (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type de gamme</label>
                    <Select value={scaleType} onValueChange={(value: keyof typeof scaleTypes) => setScaleType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(scaleTypes).map(([key, scale]) => (
                          <SelectItem key={key} value={key}>{scale.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type d'accord</label>
                    <Select value={chordType} onValueChange={(value: keyof typeof chordTypes) => setChordType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(chordTypes).map(([key, chord]) => (
                          <SelectItem key={key} value={key}>{chord.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex flex-col justify-end">
                  <Button onClick={generateRandomChallenge} variant="outline">
                    Défi aléatoire
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Défi actuel</span>
                <Badge variant="secondary">{currentName}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">
                  Jouez les notes pour : <span className="text-primary">{currentName}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Essayez de trouver les notes, puis cliquez sur "Montrer la réponse" pour voir si vous avez trouvé !
                </p>
              </div>

              <div className="overflow-x-auto">
                <PianoKeyboard 
                  octaves={2}
                  highlightedNotes={showAnswer ? currentNotes : []}
                  showLabels={showAnswer}
                />
              </div>

              <div className="flex justify-center gap-4">
                {!showAnswer ? (
                  <Button onClick={handleShowAnswer} size="lg">
                    Montrer la réponse
                  </Button>
                ) : (
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {currentNotes.map((note, index) => (
                          <Badge key={index} variant="outline">
                            {note}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <Button onClick={handleReset} variant="outline" size="lg">
                  Recommencer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Practice;