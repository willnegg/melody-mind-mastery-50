import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const PianoBasics: React.FC = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/scale/major');
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link to="/scales" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux gammes
          </Link>
          
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">🎹 Les bases du piano</h1>
            <p className="text-muted-foreground">Apprends les fondamentaux avant de commencer les gammes</p>
          </div>
        </header>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none space-y-6">
                <p className="font-medium text-foreground text-lg">
                  Bienvenue dans ta première leçon ! Le piano peut sembler impressionnant au début, mais en réalité, son clavier suit un schéma très simple et logique. Une fois que tu comprends comment il est construit, tout devient plus clair.
                </p>
                
                <div>
                  <h3 className="font-semibold text-foreground text-xl mb-3">Les touches</h3>
                  <p className="text-muted-foreground mb-2">
                    Regarde bien le clavier :
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Les touches blanches sont les notes principales.</li>
                    <li>• Les touches noires sont un peu en retrait. Ce sont les altérations : elles servent à faire des dièses (♯) ou des bémols (♭).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-xl mb-3">Le motif qui se répète</h3>
                  <p className="text-muted-foreground">
                    Les touches noires ne sont pas placées au hasard. Elles sont groupées par 2, puis par 3 et se répètent tout le long du clavier.
                    Ce motif est super important : il permet de se repérer facilement, même quand on débute.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-xl mb-3">Comment repérer les notes</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-foreground">Le groupe de 2 touches noires :</p>
                      <ul className="text-muted-foreground space-y-1 mt-2">
                        <li>• La touche blanche juste à gauche de ce groupe, c'est C en notation internationale (ou Do en français).</li>
                        <li>• Ensuite viennent D (Ré) et E (Mi), juste à droite.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium text-foreground">Le groupe de 3 touches noires :</p>
                      <ul className="text-muted-foreground space-y-1 mt-2">
                        <li>• La touche blanche juste à gauche de ce groupe, c'est F (Fa).</li>
                        <li>• Puis on a G (Sol), A (La) et B (Si).</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-xl mb-3">Les noms des notes</h3>
                  <p className="text-muted-foreground mb-4">
                    Avant d'aller plus loin, il faut bien connaître le nom des 7 notes.
                    Dès maintenant, apprend ces notes par cœur parce qu'en musique, les partitions, les grilles, les logiciels ou sur les vidéos YouTube que tu regardes, on retrouve majoritairement cette notation internationale.
                  </p>
                  
                  <div className="grid grid-cols-7 gap-3 my-6 p-6 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="font-bold text-lg">C</div>
                      <div className="text-sm text-muted-foreground">Do</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">D</div>
                      <div className="text-sm text-muted-foreground">Ré</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">E</div>
                      <div className="text-sm text-muted-foreground">Mi</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">F</div>
                      <div className="text-sm text-muted-foreground">Fa</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">G</div>
                      <div className="text-sm text-muted-foreground">Sol</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">A</div>
                      <div className="text-sm text-muted-foreground">La</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">B</div>
                      <div className="text-sm text-muted-foreground">Si</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-xl mb-3">À retenir :</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Le clavier est organisé en motifs qui se répètent.</li>
                    <li>• C est toujours juste à gauche du groupe de 2 touches noires.</li>
                    <li>• F est toujours juste à gauche du groupe de 3 touches noires.</li>
                    <li>• Tu connais désormais le nom des 7 notes, en français et en anglais.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => navigate('/scales')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux gammes
            </Button>
            
            <Button onClick={handleStartLearning} className="text-lg px-8 py-3">
              Commencer l'apprentissage des gammes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PianoBasics;