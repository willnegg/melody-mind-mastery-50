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
      title: 'Intervalles',
      description: 'Apprenez à identifier la distance entre deux notes',
      tips: [
        'Commencez par les quintes justes et les octaves',
        'Utilisez des chansons de référence pour chaque intervalle',
        'Pratiquez les intervalles ascendants et descendants'
      ],
      color: 'bg-primary/10 text-primary border-primary/20',
      score: earTraining.intervals
    },
    {
      id: 'chords',
      title: 'Accords',
      description: 'Reconnaissez les accords majeurs, mineurs et étendus',
      tips: [
        'Concentrez-vous sur la qualité de la tierce',
        'Écoutez la tension et la résolution',
        'Pratiquez avec différents renversements'
      ],
      color: 'bg-secondary/10 text-secondary border-secondary/20',
      score: earTraining.chords
    },
    {
      id: 'scales',
      title: 'Gammes',
      description: 'Identifiez différents motifs de gammes et modes',
      tips: [
        'Écoutez les intervalles caractéristiques',
        'Portez attention à la note tonique',
        'Comparez les qualités majeure vs mineure'
      ],
      color: 'bg-accent/50 text-accent-foreground border-accent',
      score: earTraining.scales
    },
    {
      id: 'progressions',
      title: 'Progressions',
      description: 'Reconnaissez les progressions d\'accords courantes',
      tips: [
        'Commencez par les progressions ii-V-I',
        'Écoutez le mouvement de la ligne de basse',
        'Pratiquez dans différentes tonalités'
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
          <h1 className="text-3xl font-bold mb-2">Formation auditive</h1>
          <p className="text-muted-foreground">
            Développez votre oreille musicale avec des exercices interactifs
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
                        label="Meilleur score"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.score.score}/{type.score.totalQuestions} correct
                        {type.score.lastAttempt && (
                          <span> • Dernière tentative : {new Date(type.score.lastAttempt).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-2">Conseils :</h4>
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
                      Commencer l'entraînement
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