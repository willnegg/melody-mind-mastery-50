import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';
import { intervals, chordTypes, scaleTypes, notes } from '@/constants/musicTheory';
import { useProgressStore } from '@/store/progressStore';
import { useToast } from '@/hooks/use-toast';

const EarTrainingExercise: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const { updateEarTrainingScore } = useProgressStore();
  const { toast } = useToast();

  const totalQuestions = 10;

  // Fonction utilitaire pour mélanger un tableau (algorithme Fisher-Yates)
  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate questions based on type
  useEffect(() => {
    const generateQuestions = () => {
      const newQuestions = [];
      
      for (let i = 0; i < totalQuestions; i++) {
        switch (type) {
          case 'intervals':
            const intervalKeys = Object.keys(intervals);
            const correctInterval = intervalKeys[Math.floor(Math.random() * intervalKeys.length)];
            const wrongAnswers = shuffleArray(intervalKeys
              .filter(int => int !== correctInterval))
              .slice(0, 3);
            
            const intervalOptions = shuffleArray([correctInterval, ...wrongAnswers]);
            const correctIntervalIndex = intervalOptions.indexOf(correctInterval);
            
            newQuestions.push({
              type: 'interval',
              correct: correctInterval,
              correctIndex: correctIntervalIndex,
              options: intervalOptions,
              question: `What interval is this?`
            });
            break;

          case 'chords':
            const chordKeys = Object.keys(chordTypes);
            const correctChord = chordKeys[Math.floor(Math.random() * chordKeys.length)];
            const wrongChords = shuffleArray(chordKeys
              .filter(chord => chord !== correctChord))
              .slice(0, 3);
            
            const chordOptions = shuffleArray([correctChord, ...wrongChords]);
            const correctChordIndex = chordOptions.indexOf(correctChord);
            
            newQuestions.push({
              type: 'chord',
              correct: correctChord,
              correctIndex: correctChordIndex,
              options: chordOptions,
              question: `What type of chord is this?`
            });
            break;

          case 'scales':
            const scaleKeys = Object.keys(scaleTypes);
            const correctScale = scaleKeys[Math.floor(Math.random() * scaleKeys.length)];
            const wrongScales = shuffleArray(scaleKeys
              .filter(scale => scale !== correctScale))
              .slice(0, 3);
            
            const scaleOptions = shuffleArray([correctScale, ...wrongScales]);
            const correctScaleIndex = scaleOptions.indexOf(correctScale);
            
            newQuestions.push({
              type: 'scale',
              correct: correctScale,
              correctIndex: correctScaleIndex,
              options: scaleOptions,
              question: `What scale is this?`
            });
            break;

          case 'progressions':
            const progressions = ['I-V-vi-IV', 'ii-V-I', 'I-vi-IV-V', 'vi-IV-I-V'];
            const correctProgression = progressions[Math.floor(Math.random() * progressions.length)];
            const wrongProgressions = shuffleArray(progressions
              .filter(prog => prog !== correctProgression))
              .slice(0, 3);
            
            const progressionOptions = shuffleArray([correctProgression, ...wrongProgressions]);
            const correctProgressionIndex = progressionOptions.indexOf(correctProgression);
            
            newQuestions.push({
              type: 'progression',
              correct: correctProgression,
              correctIndex: correctProgressionIndex,
              options: progressionOptions,
              question: `What chord progression is this?`
            });
            break;

          default:
            break;
        }
      }
      
      setQuestions(newQuestions);
    };

    generateQuestions();
  }, [type]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion]?.correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      setIsComplete(true);
      updateEarTrainingScore(type as 'intervals' | 'chords' | 'scales' | 'progressions', score + (selectedAnswer === questions[currentQuestion]?.correct ? 1 : 0), totalQuestions);
      
      const finalScore = score + (selectedAnswer === questions[currentQuestion]?.correct ? 1 : 0);
      const percentage = Math.round((finalScore / totalQuestions) * 100);
      
      toast({
        title: "Quiz Complete!",
        description: `You scored ${finalScore}/${totalQuestions} (${percentage}%)`,
      });
    }
  };

  const getDisplayName = (key: string, questionType: string) => {
    switch (questionType) {
      case 'interval':
        return intervals[key as keyof typeof intervals]?.name || key;
      case 'chord':
        return chordTypes[key as keyof typeof chordTypes]?.name || key;
      case 'scale':
        return scaleTypes[key as keyof typeof scaleTypes]?.name || key;
      case 'progression':
        return key;
      default:
        return key;
    }
  };

  const getTypeTitle = () => {
    switch (type) {
      case 'intervals': return 'Interval Recognition';
      case 'chords': return 'Chord Recognition';
      case 'scales': return 'Scale Recognition';
      case 'progressions': return 'Progression Recognition';
      default: return 'Ear Training';
    }
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-background pb-20 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const finalScore = score;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    
    return (
      <div className="min-h-screen bg-background pb-20 p-4">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <Link to="/ear-training" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Ear Training
            </Link>
          </header>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {percentage}%
                </div>
                <p className="text-muted-foreground">
                  You scored {finalScore} out of {totalQuestions} questions correctly
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={percentage} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {percentage >= 80 ? 'Excellent work! 🎉' : 
                   percentage >= 60 ? 'Good job! Keep practicing 👍' : 
                   'Keep practicing, you\'ll improve! 💪'}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
                <Link to="/ear-training">
                  <Button variant="outline">
                    Back to Ear Training
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link to="/ear-training" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Ear Training
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{getTypeTitle()}</h1>
            <Badge variant="secondary">
              {currentQuestion + 1} / {totalQuestions}
            </Badge>
          </div>
        </header>

        <div className="space-y-6">
          {/* Progress */}
          <div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Question {currentQuestion + 1} of {totalQuestions} • Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
            </p>
          </div>

          {/* Question */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Play Sound Button */}
              <div className="text-center">
                <Button size="lg" className="mb-6">
                  🔊 Play Sound
                </Button>
                <p className="text-sm text-muted-foreground">
                  (Audio playback not implemented - this is a visual demo)
                </p>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option: string, index: number) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === question.correct;
                  
                  let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline";
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonVariant = "default"; // Correct answer (green-ish)
                    } else if (isSelected && !isCorrect) {
                      buttonVariant = "destructive"; // Wrong selected answer
                    }
                  } else if (isSelected) {
                    buttonVariant = "secondary";
                  }

                   return (
                     <Button
                       key={`${currentQuestion}-${index}`}
                       variant={buttonVariant}
                       onClick={() => handleAnswerSelect(option)}
                       disabled={showResult}
                       className="h-auto p-4 text-left justify-start"
                     >
                      <div>
                        <div className="font-medium">
                          {getDisplayName(option, question.type)}
                        </div>
                        {showResult && isCorrect && (
                          <div className="text-xs mt-1 opacity-80">
                            ✓ Correct answer
                          </div>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <div className="text-xs mt-1 opacity-80">
                            ✗ Your answer
                          </div>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Next Button */}
              {showResult && (
                <div className="text-center pt-4">
                  <Button onClick={handleNextQuestion} size="lg">
                    {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EarTrainingExercise;