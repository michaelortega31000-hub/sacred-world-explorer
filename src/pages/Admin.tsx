import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { migratePlacesToSupabase } from '@/utils/migratePlacesData';
import Header from '@/components/Header';
import { ArrowLeft, Database, AlertCircle, CheckCircle2, BookPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Admin = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPlace, setCurrentPlace] = useState('');
  const [result, setResult] = useState<{ success: number; errors: number; details: string[] } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMigration = async () => {
    setIsMigrating(true);
    setProgress(0);
    setResult(null);

    try {
      const migrationResult = await migratePlacesToSupabase(
        (current, total, placeName) => {
          setProgress((current / total) * 100);
          setCurrentPlace(placeName);
        }
      );

      setResult(migrationResult);
      
      if (migrationResult.errors === 0) {
        toast({
          title: "Migration réussie",
          description: `${migrationResult.success} lieux ont été migrés avec succès`,
        });
      } else {
        toast({
          title: "Migration terminée avec des erreurs",
          description: `${migrationResult.success} réussis, ${migrationResult.errors} échecs`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Erreur de migration",
        description: "Une erreur est survenue pendant la migration",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Administration</h1>
                <p className="text-muted-foreground">
                  Outils de gestion de la base de données
                </p>
              </div>
            </div>

            {/* Data Enrichment Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Enrichissement des données</h2>
              <p className="text-muted-foreground mb-4">
                Ajoutez de nouveaux lieux sacrés avec des sources vérifiées (Wikipedia, UNESCO, etc.)
              </p>
              <Link to="/admin/enrich-data">
                <Button size="lg" variant="outline">
                  <BookPlus className="mr-2 h-4 w-4" />
                  Enrichir les données
                </Button>
              </Link>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Migration des lieux</h2>
              <p className="text-muted-foreground mb-4">
                Cette action va importer tous les lieux depuis les données locales vers la base de données Supabase.
                Cela peut prendre quelques minutes.
              </p>

              {!isMigrating && !result && (
                <Button onClick={handleMigration} size="lg">
                  <Database className="mr-2 h-4 w-4" />
                  Lancer la migration
                </Button>
              )}

              {isMigrating && (
                <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {progress.toFixed(0)}% - Migration de: {currentPlace}
                  </p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted">
                    {result.errors === 0 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Résultat de la migration</h3>
                      <div className="space-y-1 text-sm">
                        <p>✅ Réussis: {result.success}</p>
                        <p>❌ Échecs: {result.errors}</p>
                      </div>
                      
                      {result.details.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-sm mb-2">Détails des erreurs:</h4>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {result.details.map((detail, index) => (
                              <p key={index} className="text-xs text-muted-foreground">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button onClick={handleMigration} variant="outline">
                    Relancer la migration
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
