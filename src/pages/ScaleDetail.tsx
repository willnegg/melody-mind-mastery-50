import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Play, ArrowRight, ArrowLeft, Volume2 } from 'lucide-react';
import { scaleTypes, getScaleNotes } from '@/constants/musicTheory';
import PianoKeyboard from '@/components/PianoKeyboard';
import { useAudio } from '@/hooks/useAudio';
import { useProgressStore } from '@/store/progressStore';

// Ordre de progression des gammes majeures avec altérations croissantes
const scaleProgression = ['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'Ab', 'E', 'B', 'Db', 'Gb'];

interface LearningStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const ScaleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playScale, playNote, isPlaying, stopAll, isLoaded } = useAudio();
  const { scales, completeScale, recordPracticeSession } = useProgressStore();
  
  const [currentScaleIndex, setCurrentScaleIndex] = useState(0);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const scaleType = id as keyof typeof scaleTypes;
  const scale = scaleTypes[scaleType];
  const currentRoot = scaleProgression[currentScaleIndex];
  const scaleNotes = getScaleNotes(currentRoot, scaleType);

  // Étapes d'apprentissage
  const learningSteps: LearningStep[] = [
    {
      id: 'listen',
      title: 'Écouter la gamme',
      description: `Écoutez la gamme de ${currentRoot} ${scale?.name}`,
      completed: false
    },
    {
      id: 'play',
      title: 'Jouer les notes',
      description: 'Jouez chaque note de la gamme sur le clavier',
      completed: playedNotes.length === scaleNotes.length && scaleNotes.every(note => playedNotes.includes(note))
    },
    {
      id: 'validate',
      title: 'Validation',
      description: 'Bravo ! Vous maîtrisez cette gamme',
      completed: false
    }
  ];

  const isCurrentScaleCompleted = scales[`${scaleType}-${currentRoot}`]?.completed || false;
  const progressPercentage = (currentScaleIndex / scaleProgression.length) * 100;

  useEffect(() => {
    // Trouve l'index de la gamme actuelle ou la première non complétée
    const uncompletedIndex = scaleProgression.findIndex(root => 
      !scales[`${scaleType}-${root}`]?.completed
    );
    setCurrentScaleIndex(uncompletedIndex === -1 ? 0 : uncompletedIndex);
  }, [scales, scaleType]);

  if (!scale) {
    return (
      <div className="min-h-screen bg-background pb-20 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Gamme non trouvée</h1>
          <Link to="/scales">
            <Button>Retour aux gammes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleNotePlay = (note: string) => {
    if (!playedNotes.includes(note) && scaleNotes.includes(note)) {
      setPlayedNotes([...playedNotes, note]);
    }
  };

  const handleCompleteScale = () => {
    completeScale(`${scaleType}-${currentRoot}`);
    if (currentScaleIndex < scaleProgression.length - 1) {
      setCurrentScaleIndex(currentScaleIndex + 1);
      setPlayedNotes([]);
      setCurrentStep(0);
    }
  };

  const handlePreviousScale = () => {
    if (currentScaleIndex > 0) {
      setCurrentScaleIndex(currentScaleIndex - 1);
      setPlayedNotes([]);
      setCurrentStep(0);
    }
  };

  const handleNextScale = () => {
    if (currentScaleIndex < scaleProgression.length - 1) {
      setCurrentScaleIndex(currentScaleIndex + 1);
      setPlayedNotes([]);
      setCurrentStep(0);
    }
  };

  const getScaleSignature = (root: string) => {
    const signatures: Record<string, string> = {
      'C': 'Aucune altération',
      'G': '1 dièse (F#)',
      'F': '1 bémol (Bb)',
      'D': '2 dièses (F#, C#)',
      'Bb': '2 bémols (Bb, Eb)',
      'A': '3 dièses (F#, C#, G#)',
      'Eb': '3 bémols (Bb, Eb, Ab)',
      'Ab': '4 bémols (Bb, Eb, Ab, Db)',
      'E': '4 dièses (F#, C#, G#, D#)',
      'B': '5 dièses (F#, C#, G#, D#, A#)',
      'Db': '5 bémols (Bb, Eb, Ab, Db, Gb)',
      'Gb': '6 bémols (Bb, Eb, Ab, Db, Gb, Cb)'
    };
    return signatures[root] || '';
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link to="/scales" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux gammes
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gamme {scale.name}</h1>
              <p className="text-muted-foreground">{scale.description}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {currentScaleIndex + 1}/{scaleProgression.length}
            </Badge>
          </div>

          {/* Progression globale */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression globale</span>
              <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </header>

        <div className="space-y-6">
          {/* Gamme actuelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentRoot} {scale.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePreviousScale}
                    disabled={currentScaleIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNextScale}
                    disabled={currentScaleIndex === scaleProgression.length - 1}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{getScaleSignature(currentRoot)}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {scaleNotes.map((note, index) => (
                      <Badge 
                        key={index} 
                        variant={playedNotes.includes(note) ? "default" : "outline"}
                        className="transition-colors"
                      >
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => isPlaying ? stopAll() : playScale(scaleNotes)}
                  disabled={!isLoaded}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {isPlaying ? 'Stop' : 'Écouter'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Étapes d'apprentissage */}
          <Card>
            <CardHeader>
              <CardTitle>Étapes d'apprentissage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Piano interactif */}
          <Card>
            <CardHeader>
              <CardTitle>Piano - Jouez les notes de la gamme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <PianoKeyboard 
                  octaves={2}
                  highlightedNotes={scaleNotes}
                  onKeyPress={handleNotePlay}
                  showLabels={true}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Notes jouées : {playedNotes.length}/{scaleNotes.length}
                </p>
                {learningSteps[1].completed && !isCurrentScaleCompleted && (
                  <Button onClick={handleCompleteScale} className="mt-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Valider cette gamme
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/scales')}>
              Retour aux gammes
            </Button>
            {currentScaleIndex === scaleProgression.length - 1 && isCurrentScaleCompleted && (
              <Button onClick={() => navigate('/scales')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Toutes les gammes terminées !
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScaleDetail;