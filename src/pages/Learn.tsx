import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Lock } from 'lucide-react';
import { scaleTypes, chordTypes, cadences } from '@/constants/musicTheory';

const Learn: React.FC = () => {
  // Parcours progressif - seules les gammes sont disponibles au départ
  const learningCategories = [
    {
      title: 'Gammes',
      description: 'Commencez ici pour maîtriser les gammes musicales',
      items: Object.entries(scaleTypes).map(([key, scale]) => ({
        id: key,
        name: scale.name,
        description: scale.description,
        link: `/scale/${key}`
      })),
      color: 'text-primary',
      isUnlocked: true
    },
    {
      title: 'Accords',
      description: 'Débloqué après avoir terminé les gammes',
      items: Object.entries(chordTypes).map(([key, chord]) => ({
        id: key,
        name: chord.name,
        description: chord.description,
        link: `/chord/${key}`
      })),
      color: 'text-secondary',
      isUnlocked: false
    },
    {
      title: 'Cadences',
      description: 'Débloqué après avoir terminé les accords',
      items: Object.entries(cadences).map(([key, cadence]) => ({
        id: key,
        name: cadence.name,
        description: cadence.description,
        link: `/cadence/${key}`
      })),
      color: 'text-secondary',
      isUnlocked: false
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Apprendre la théorie musicale</h1>
          <p className="text-muted-foreground">
            Explorez les fondamentaux de la théorie musicale à travers des leçons interactives
          </p>
        </header>

        <div className="space-y-6">
          {learningCategories.map((category) => (
            <Card key={category.title} className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {category.title}
                  <Badge variant="outline" className={category.color}>
                    {category.isUnlocked ? category.items.length : 0} sujets
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                {category.isUnlocked ? (
                  category.title === 'Gammes' ? (
                    <Link
                      to="/scales"
                      className="group p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:bg-accent/50 block"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                            Commence ici en explorant les gammes
                          </h3>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                      </div>
                    </Link>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.items.map((item) => (
                        <Link
                          key={item.id}
                          to={item.link}
                          className="group p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:bg-accent/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Lock className="h-4 w-4 mr-2" />
                    <span className="text-sm italic">Cette section sera débloquée plus tard.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;