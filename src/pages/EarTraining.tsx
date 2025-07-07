import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useProgressStore } from '@/store/progressStore';
import ProgressBar from '@/components/ProgressBar';

const EarTraining: React.FC = () => {
  const { earTraining } = useProgressStore();

  const trainingTypes = [
    {
      id: 'intervals',
      title: 'Intervals',
      description: 'Learn to identify the distance between two notes',
      tips: [
        'Start with perfect fifths and octaves',
        'Use reference songs for each interval',
        'Practice ascending and descending intervals'
      ],
      color: 'bg-primary/10 text-primary border-primary/20',
      score: earTraining.intervals
    },
    {
      id: 'chords',
      title: 'Chords',
      description: 'Recognize major, minor, and extended chords',
      tips: [
        'Focus on the quality of the third',
        'Listen for tension and resolution',
        'Practice with different inversions'
      ],
      color: 'bg-secondary/10 text-secondary border-secondary/20',
      score: earTraining.chords
    },
    {
      id: 'scales',
      title: 'Scales',
      description: 'Identify different scale patterns and modes',
      tips: [
        'Listen for the characteristic intervals',
        'Pay attention to the tonic note',
        'Compare major vs minor qualities'
      ],
      color: 'bg-accent/50 text-accent-foreground border-accent',
      score: earTraining.scales
    },
    {
      id: 'progressions',
      title: 'Progressions',
      description: 'Recognize common chord progressions',
      tips: [
        'Start with ii-V-I progressions',
        'Listen for the bass line movement',
        'Practice in different keys'
      ],
      color: 'bg-muted text-muted-foreground border-muted-foreground/20',
      score: earTraining.progressions
    }
  ];

  const getScorePercentage = (score: typeof earTraining.intervals) => {
    return score.totalQuestions > 0 ? (score.score / score.totalQuestions) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Ear Training</h1>
          <p className="text-muted-foreground">
            Develop your musical hearing with interactive exercises
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainingTypes.map((type) => {
            const scorePercentage = getScorePercentage(type.score);
            
            return (
              <Card key={type.id} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {type.title}
                    <Badge variant="outline" className={type.color}>
                      {scorePercentage.toFixed(0)}%
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {type.score.totalQuestions > 0 && (
                    <div>
                      <ProgressBar 
                        progress={scorePercentage / 100}
                        label="Best Score"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.score.score}/{type.score.totalQuestions} correct
                        {type.score.lastAttempt && (
                          <span> • Last attempt: {new Date(type.score.lastAttempt).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-2">Tips:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {type.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={`/ear-training/${type.id}`} className="block">
                    <Button className="w-full">
                      Start Training
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EarTraining;