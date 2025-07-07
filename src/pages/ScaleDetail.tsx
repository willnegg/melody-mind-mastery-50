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
  
  // Ajouter l'octave (8ème degré) - une octave plus haut
  const completeScaleNotes = [...scaleNotes.map(note => `${note}4`), `${currentRoot}5`];

  // Fonction pour obtenir le nom de la gamme avec français/international
  const getScaleDisplayName = (root: string) => {
    const frenchNames: Record<string, string> = {
      'C': 'C (Do)',
      'G': 'G (Sol)', 
      'F': 'F (Fa)',
      'D': 'D (Ré)'
    };
    
    // Afficher les noms français pour les 4 premières gammes, puis seulement international
    if (currentScaleIndex < 4) {
      return frenchNames[root] || root;
    }
    return root;
  };

  // Fonction pour obtenir la signature de la gamme
  const getScaleSignature = (root: string) => {
    const signatures: Record<string, string> = {
      'C': '',
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

  // Questions de quiz dynamiques
  const getQuizQuestions = (): QuizQuestion[] => [
    {
      question: `Combien y a-t-il de notes différentes dans la gamme de ${currentRoot} majeur ?`,
      answers: ['6 notes', '7 notes', '8 notes', '9 notes'],
      correctAnswer: 1
    },
    {
      question: `Quelle est la première note (tonique) de la gamme de ${currentRoot} majeur ?`,
      answers: [scaleNotes[1], currentRoot, scaleNotes[2], scaleNotes[3]],
      correctAnswer: 1
    },
    {
      question: `Quelle est la troisième note de la gamme de ${currentRoot} majeur ?`,
      answers: [scaleNotes[1], scaleNotes[2], scaleNotes[3], scaleNotes[4]],
      correctAnswer: 1
    },
    {
      question: `Quelle est la cinquième note de la gamme de ${currentRoot} majeur ?`,
      answers: [scaleNotes[3], scaleNotes[4], scaleNotes[5], scaleNotes[6]],
      correctAnswer: 1
    },
    {
      question: `Quelle est la septième note de la gamme de ${currentRoot} majeur ?`,
      answers: [scaleNotes[5], scaleNotes[6], currentRoot, scaleNotes[1]],
      correctAnswer: 1
    },
    {
      question: `Dans une gamme majeure, quels sont les demi-tons naturels ?`,
      answers: ['Entre les degrés 1-2 et 4-5', 'Entre les degrés 3-4 et 7-8', 'Entre les degrés 2-3 et 6-7', 'Entre les degrés 1-3 et 5-7'],
      correctAnswer: 1
    },
    {
      question: `Combien de demi-tons y a-t-il entre la première et la troisième note ?`,
      answers: ['1 demi-ton', '2 demi-tons', '3 demi-tons', '4 demi-tons'],
      correctAnswer: 2
    },
    {
      question: `La gamme majeure suit quelle structure en tons et demi-tons ?`,
      answers: ['Ton-Ton-1/2Ton-Ton-Ton-Ton-1/2Ton', '1/2Ton-Ton-Ton-1/2Ton-Ton-Ton-Ton', 'Ton-1/2Ton-Ton-Ton-1/2Ton-Ton-Ton', 'Ton-Ton-Ton-1/2Ton-Ton-Ton-1/2Ton'],
      correctAnswer: 0
    },
    {
      question: `La deuxième note de la gamme de ${currentRoot} majeur est :`,
      answers: [scaleNotes[0], scaleNotes[1], scaleNotes[2], scaleNotes[3]],
      correctAnswer: 2
    },
    {
      question: `Entre la septième note et l'octave, il y a :`,
      answers: ['1 ton', '1 demi-ton', '1 ton et demi', '2 tons'],
      correctAnswer: 1
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
      // Calculer le temps total de la gamme (nombre de notes * interval + durée de la dernière note)
      const totalDuration = completeScaleNotes.length * 500 + 200; // 500ms par note + 200ms pour la dernière
      setTimeout(() => {
        setHasListened(true);
      }, totalDuration);
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
          {/* Section éducative */}
          {!showQuiz && (
            <Card>
              <CardHeader>
                <CardTitle>🎹 Les bases du piano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="font-medium text-foreground">
                    Bienvenue dans ta première leçon ! Le piano peut sembler impressionnant au début, mais en réalité, son clavier suit un schéma très simple et logique. Une fois que tu comprends comment il est construit, tout devient plus clair.
                  </p>
                  
                  <h4 className="font-semibold text-foreground mt-4 mb-2">Les touches</h4>
                  <p className="text-muted-foreground">
                    Regarde bien le clavier :
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Les touches blanches sont les notes principales.</li>
                    <li>• Les touches noires sont un peu en retrait. Ce sont les altérations : elles servent à faire des dièses (♯) ou des bémols (♭).</li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-4 mb-2">Le motif qui se répète</h4>
                  <p className="text-muted-foreground">
                    Les touches noires ne sont pas placées au hasard. Elles sont groupées par 2, puis par 3 et se répètent tout le long du clavier.
                    Ce motif est super important : il permet de se repérer facilement, même quand on débute.
                  </p>

                  <h4 className="font-semibold text-foreground mt-4 mb-2">Comment repérer les notes</h4>
                  <div className="text-muted-foreground space-y-2">
                    <p><strong>Le groupe de 2 touches noires :</strong></p>
                    <ul className="space-y-1">
                      <li>• La touche blanche juste à gauche de ce groupe, c'est C en notation internationale (ou Do en français).</li>
                      <li>• Ensuite viennent D (Ré) et E (Mi), juste à droite.</li>
                    </ul>
                    
                    <p><strong>Le groupe de 3 touches noires :</strong></p>
                    <ul className="space-y-1">
                      <li>• La touche blanche juste à gauche de ce groupe, c'est F (Fa).</li>
                      <li>• Puis on a G (Sol), A (La) et B (Si).</li>
                    </ul>
                  </div>

                  <h4 className="font-semibold text-foreground mt-4 mb-2">Les noms des notes</h4>
                  <p className="text-muted-foreground">
                    Avant d'aller plus loin, il faut bien connaître le nom des 7 notes.
                    Dès maintenant, apprend ces notes par cœur parce qu'en musique, les partitions, les grilles, les logiciels ou sur les vidéos YouTube que tu regardes, on retrouve majoritairement cette notation internationale.
                  </p>
                  
                  <div className="grid grid-cols-7 gap-2 my-4 p-4 bg-muted rounded-lg">
                    <div className="text-center"><strong>C</strong><br/>Do</div>
                    <div className="text-center"><strong>D</strong><br/>Ré</div>
                    <div className="text-center"><strong>E</strong><br/>Mi</div>
                    <div className="text-center"><strong>F</strong><br/>Fa</div>
                    <div className="text-center"><strong>G</strong><br/>Sol</div>
                    <div className="text-center"><strong>A</strong><br/>La</div>
                    <div className="text-center"><strong>B</strong><br/>Si</div>
                  </div>

                  <h4 className="font-semibold text-foreground mt-4 mb-2">À retenir :</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Le clavier est organisé en motifs qui se répètent.</li>
                    <li>• C est toujours juste à gauche du groupe de 2 touches noires.</li>
                    <li>• F est toujours juste à gauche du groupe de 3 touches noires.</li>
                    <li>• Tu connais désormais le nom des 7 notes, en français et en anglais.</li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-4 mb-2">🎵 Construction d'une gamme majeure</h4>
                  <p className="text-muted-foreground">
                    Maintenant que tu connais les notes, voyons comment construire une gamme majeure. Toutes les gammes majeures suivent la même formule en <strong>tons</strong> et <strong>demi-tons</strong> :
                  </p>
                  
                  <div className="bg-muted p-4 rounded-lg my-4">
                    <p className="font-mono text-center text-lg font-semibold">
                      Ton - Ton - Demi-ton - Ton - Ton - Ton - Demi-ton
                    </p>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Cette formule magique crée TOUJOURS une gamme majeure !
                    </p>
                  </div>

                  <h5 className="font-medium text-foreground">Qu'est-ce qu'un ton et un demi-ton ?</h5>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong>Demi-ton</strong> : la plus petite distance entre deux notes (une case sur le clavier)</li>
                    <li>• <strong>Ton</strong> : deux demi-tons (deux cases sur le clavier)</li>
                  </ul>

                  <h5 className="font-medium text-foreground mt-3">Les demi-tons naturels</h5>
                  <p className="text-muted-foreground">
                    Sur le clavier, il y a des demi-tons "naturels" entre certaines touches blanches :
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Entre E et F (Mi et Fa)</li>
                    <li>• Entre B et C (Si et Do)</li>
                  </ul>
                  <p className="text-muted-foreground text-sm">
                    C'est pourquoi il n'y a pas de touches noires entre ces notes !
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gamme actuelle */}
          {!showQuiz && (
            <Card>
              <CardHeader>
                <CardTitle>{getScaleDisplayName(currentRoot)} {scale.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    {getScaleSignature(currentRoot) && (
                      <p className="font-medium mb-2">{getScaleSignature(currentRoot)}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
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
          )}

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
          {!showQuiz && (
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
          )}

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