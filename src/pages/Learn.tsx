import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { scaleTypes, chordTypes, cadences } from '@/constants/musicTheory';

const Learn: React.FC = () => {
  const learningCategories = [
    {
      title: 'Scales',
      description: 'Master the fundamental patterns of music',
      items: Object.entries(scaleTypes).map(([key, scale]) => ({
        id: key,
        name: scale.name,
        description: scale.description,
        link: `/scale/${key}`
      })),
      color: 'bg-primary/10 text-primary border-primary/20'
    },
    {
      title: 'Chords',
      description: 'Learn harmony and chord progressions',
      items: Object.entries(chordTypes).map(([key, chord]) => ({
        id: key,
        name: chord.name,
        description: chord.description,
        link: `/chord/${key}`
      })),
      color: 'bg-secondary/10 text-secondary border-secondary/20'
    },
    {
      title: 'Cadences',
      description: 'Understand harmonic progressions',
      items: Object.entries(cadences).map(([key, cadence]) => ({
        id: key,
        name: cadence.name,
        description: cadence.description,
        link: `/cadence/${key}`
      })),
      color: 'bg-accent/50 text-accent-foreground border-accent'
    },
    {
      title: 'Ear Training',
      description: 'Develop your musical hearing',
      items: [
        { id: 'intervals', name: 'Intervals', description: 'Learn to identify intervals between notes', link: '/ear-training/intervals' },
        { id: 'chords', name: 'Chords', description: 'Recognize different chord types', link: '/ear-training/chords' },
        { id: 'scales', name: 'Scales', description: 'Identify scale patterns by ear', link: '/ear-training/scales' },
        { id: 'progressions', name: 'Progressions', description: 'Recognize chord progressions', link: '/ear-training/progressions' }
      ],
      color: 'bg-muted text-muted-foreground border-muted-foreground/20'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Learn Music Theory</h1>
          <p className="text-muted-foreground">
            Explore the fundamentals of music theory through interactive lessons
          </p>
        </header>

        <div className="space-y-8">
          {learningCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {category.title}
                  <Badge variant="outline" className={category.color}>
                    {category.items.length} topics
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      className="group p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:bg-accent/50"
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;