import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Play, ArrowRight, ArrowLeft, Volume2, Brain } from 'lucide-react';
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

interface QuizQuestion {
  question: string;
  answers: string[];
  correctAnswer: number;
}

const ScaleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playScale, playNote, isPlaying, stopAll, isLoaded } = useAudio();
  const { scales, completeScale, recordPracticeSession } = useProgressStore();
  
  const [currentScaleIndex, setCurrentScaleIndex] = useState(0);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [hasListened, setHasListened] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const scaleType = id as keyof typeof scaleTypes;
  const scale = scaleTypes[scaleType];
  const currentRoot = scaleProgression[currentScaleIndex];
  const scaleNotes = getScaleNotes(currentRoot, scaleType);
  
  // Ajouter l'octave (8ème degré)
  const completeScaleNotes = [...scaleNotes, currentRoot];

  // Questions de quiz dynamiques
  const getQuizQuestions = (): QuizQuestion[] => [
    {
      question: `Combien y a-t-il de notes dans la gamme de ${currentRoot} majeur ?`,
      answers: ['6 notes', '7 notes', '8 notes', '9 notes'],
      correctAnswer: 1
    },
    {
      question: `Quelle est la première note de la gamme de ${currentRoot} majeur ?`,
      answers: [scaleNotes[1], currentRoot, scaleNotes[2], scaleNotes[3]],
      correctAnswer: 1
    },
    {
      question: `Quelle est la cinquième note (dominante) de la gamme de ${currentRoot} majeur ?`,
      answers: [scaleNotes[3], scaleNotes[4], scaleNotes[5], scaleNotes[6]],
      correctAnswer: 1
    },
    {
      question: `${getScaleSignature(currentRoot)}. Cette gamme a :`,
      answers: ['Aucune altération', 'Des dièses', 'Des bémols', 'Les deux'],
      correctAnswer: currentRoot.includes('#') || ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(currentRoot) ? 2 : 
                   ['G', 'D', 'A', 'E', 'B'].includes(currentRoot) ? 1 : 0
    }
  ];

  const quizQuestions = getQuizQuestions();

  // Étapes d'apprentissage
  const learningSteps: LearningStep[] = [
    {
      id: 'listen',
      title: 'Écouter la gamme',
      description: `Écoutez la gamme de ${currentRoot} ${scale?.name} complète`,
      completed: hasListened
    },
    {
      id: 'play',
      title: 'Jouer les notes',
      description: 'Jouez chaque note de la gamme sur le clavier',
      completed: playedNotes.length === scaleNotes.length && scaleNotes.every(note => playedNotes.includes(note))
    },
    {
      id: 'quiz',
      title: 'Quiz de validation',
      description: 'Testez vos connaissances avec un petit quiz',
      completed: quizCompleted
    }
  ];

  const isCurrentScaleCompleted = scales[`${scaleType}-${currentRoot}`]?.completed || false;
  const progressPercentage = (currentScaleIndex / scaleProgression.length) * 100;
  const allStepsCompleted = learningSteps.every(step => step.completed);

  useEffect(() => {
    // Trouve l'index de la gamme actuelle ou la première non complétée
    const uncompletedIndex = scaleProgression.findIndex(root => 
      !scales[`${scaleType}-${root}`]?.completed
    );
    setCurrentScaleIndex(uncompletedIndex === -1 ? 0 : uncompletedIndex);
  }, [scales, scaleType]);

  useEffect(() => {
    // Reset states when scale changes
    setPlayedNotes([]);
    setHasListened(false);
    setShowQuiz(false);
    setQuizCompleted(false);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
  }, [currentScaleIndex]);

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

  const handleListenScale = async () => {
    if (isPlaying) {
      stopAll();
    } else {
      await playScale(completeScaleNotes);
      setHasListened(true);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuizQuestion(0);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);

    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Quiz terminé
      const correctAnswers = newAnswers.filter((answer, index) => 
        answer === quizQuestions[index].correctAnswer
      ).length;
      
      if (correctAnswers >= quizQuestions.length - 1) { // Au moins 3/4 correct
        setQuizCompleted(true);
      }
      setShowQuiz(false);
    }
  };

  const handleCompleteScale = () => {
    completeScale(`${scaleType}-${currentRoot}`);
    if (currentScaleIndex < scaleProgression.length - 1) {
      setCurrentScaleIndex(currentScaleIndex + 1);
    }
  };

  const handlePreviousScale = () => {
    if (currentScaleIndex > 0 && isCurrentScaleCompleted) {
      setCurrentScaleIndex(currentScaleIndex - 1);
    }
  };

  const handleNextScale = () => {
    if (currentScaleIndex < scaleProgression.length - 1 && isCurrentScaleCompleted) {
      setCurrentScaleIndex(currentScaleIndex + 1);
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

  const getQuizScore = () => {
    const correctAnswers = quizAnswers.filter((answer, index) => 
      answer === quizQuestions[index].correctAnswer
    ).length;
    return `${correctAnswers}/${quizQuestions.length}`;
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
                    disabled={currentScaleIndex === 0 || !isCurrentScaleCompleted}
                    title={!isCurrentScaleCompleted ? "Terminez cette gamme avant de naviguer" : ""}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNextScale}
                    disabled={currentScaleIndex === scaleProgression.length - 1 || !isCurrentScaleCompleted}
                    title={!isCurrentScaleCompleted ? "Terminez cette gamme avant de naviguer" : ""}
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
                        {index + 1}. {note}
                      </Badge>
                    ))}
                    <Badge variant="secondary">8. {currentRoot}</Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleListenScale}
                  disabled={!isLoaded}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {isPlaying ? 'Stop' : 'Écouter la gamme'}
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
                    {step.id === 'quiz' && learningSteps[1].completed && !step.completed && !showQuiz && (
                      <Button onClick={handleStartQuiz} size="sm">
                        <Brain className="h-4 w-4 mr-2" />
                        Commencer le quiz
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quiz */}
          {showQuiz && (
            <Card>
              <CardHeader>
                <CardTitle>Quiz - Question {currentQuizQuestion + 1}/{quizQuestions.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{quizQuestions[currentQuizQuestion].question}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quizQuestions[currentQuizQuestion].answers.map((answer, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleQuizAnswer(index)}
                        className="text-left justify-start h-auto p-4"
                      >
                        {answer}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Résultat du quiz */}
          {quizAnswers.length === quizQuestions.length && !showQuiz && (
            <Card>
              <CardHeader>
                <CardTitle>Résultat du quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-lg mb-2">Score : {getQuizScore()}</p>
                  {quizCompleted ? (
                    <div className="text-green-600">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>Excellent ! Vous avez validé cette gamme.</p>
                    </div>
                  ) : (
                    <div className="text-orange-600">
                      <p>Vous pouvez recommencer le quiz pour améliorer votre score.</p>
                      <Button onClick={handleStartQuiz} className="mt-2">
                        Recommencer le quiz
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Piano interactif */}
          <Card>
            <CardHeader>
              <CardTitle>Piano - Jouez les 7 notes de la gamme</CardTitle>
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
                {allStepsCompleted && !isCurrentScaleCompleted && (
                  <Button onClick={handleCompleteScale} className="mt-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Terminer cette gamme
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