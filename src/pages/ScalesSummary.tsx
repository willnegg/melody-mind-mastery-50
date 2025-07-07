import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ArrowLeft, Lock } from 'lucide-react';
import { scaleTypes } from '@/constants/musicTheory';

const ScalesSummary: React.FC = () => {
  // Ajout du module "Les bases du piano"
  const pianoBasics = {
    id: 'piano-basics',
    name: 'Les bases du piano',
    description: 'Commencez par apprendre les fondamentaux',
    isUnlocked: true,
    isPreliminary: true
  };

  // Gammes de base (débloquées)
  const basicScales = [
    { id: 'major', name: 'Majeure', isUnlocked: true },
    { id: 'minor', name: 'Mineure', isUnlocked: true }
  ];

  // Modes avancés (verrouillés)
  const advancedScales = [
    { id: 'pentatonic', name: 'Pentatonique', isUnlocked: false },
    { id: 'blues', name: 'Blues', isUnlocked: false },
    { id: 'dorian', name: 'Dorien', isUnlocked: false }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link 
            to="/learn" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'apprentissage
          </Link>
          <h1 className="text-3xl font-bold mb-2">Gammes</h1>
          <p className="text-muted-foreground">
            Commencez ici pour maîtriser les gammes musicales
          </p>
        </header>

        <div className="space-y-6">
          {/* Module préliminaire - Les bases du piano */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">📚 Module préliminaire</h2>
            <Link
              to="/piano-basics"
              className="group p-6 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-200 hover:bg-primary/10 block"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    🎹 {pianoBasics.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {pianoBasics.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-4" />
              </div>
            </Link>
          </div>

          {/* Gammes principales */}
          <div>
            <h2 className="text-xl font-semibold mb-4">🎼 Gammes principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {basicScales.map((scale) => (
                <Link
                  key={scale.id}
                  to={`/scale/${scale.id}`}
                  className="group p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:bg-accent/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        {scale.name}
                      </h3>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                  </div>
                </Link>
              ))}
              
              {/* Modes avancés (verrouillés) */}
              {advancedScales.map((scale) => (
                <div
                  key={scale.id}
                  className="p-4 rounded-lg bg-card border border-border opacity-60"
                >
                  <div className="flex items-center justify-center">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScalesSummary;