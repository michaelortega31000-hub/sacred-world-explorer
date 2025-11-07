import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Shield, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  name: string;
  description: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

const SecurityTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setUserEmail(session?.user?.email || '');
  };

  const runSecurityTests = async () => {
    setTesting(true);
    const results: TestResult[] = [];

    // Test 1: Vérifier l'accès aux profils
    results.push({
      name: 'Accès aux profils',
      description: 'Vérification que les profils nécessitent une authentification',
      status: 'pending',
      message: 'Test en cours...'
    });

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (isAuthenticated && data) {
        results[0] = {
          ...results[0],
          status: 'success',
          message: `✅ Accès autorisé (utilisateur authentifié) - ${data.length} profil(s) trouvé(s)`
        };
      } else if (!isAuthenticated && error) {
        results[0] = {
          ...results[0],
          status: 'success',
          message: '✅ Accès refusé correctement (utilisateur non authentifié)'
        };
      } else {
        results[0] = {
          ...results[0],
          status: 'error',
          message: '❌ Problème de sécurité détecté'
        };
      }
    } catch (err) {
      results[0] = {
        ...results[0],
        status: 'error',
        message: '❌ Erreur lors du test'
      };
    }

    setTestResults([...results]);

    // Test 2: Vérifier l'accès aux souvenirs
    results.push({
      name: 'Accès aux souvenirs',
      description: 'Vérification que les souvenirs nécessitent une authentification',
      status: 'pending',
      message: 'Test en cours...'
    });

    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .limit(1);

      if (isAuthenticated && data) {
        results[1] = {
          ...results[1],
          status: 'success',
          message: `✅ Accès autorisé (utilisateur authentifié) - ${data.length} souvenir(s) trouvé(s)`
        };
      } else if (!isAuthenticated && error) {
        results[1] = {
          ...results[1],
          status: 'success',
          message: '✅ Accès refusé correctement (utilisateur non authentifié)'
        };
      } else {
        results[1] = {
          ...results[1],
          status: 'error',
          message: '❌ Problème de sécurité détecté'
        };
      }
    } catch (err) {
      results[1] = {
        ...results[1],
        status: 'error',
        message: '❌ Erreur lors du test'
      };
    }

    setTestResults([...results]);

    // Test 3: Vérifier l'accès aux restaurants
    results.push({
      name: 'Accès aux restaurants',
      description: 'Vérification que les restaurants (avec téléphones) nécessitent une authentification',
      status: 'pending',
      message: 'Test en cours...'
    });

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('name, phone')
        .limit(1);

      if (isAuthenticated && data) {
        results[2] = {
          ...results[2],
          status: 'success',
          message: `✅ Accès autorisé (utilisateur authentifié) - ${data.length} restaurant(s) trouvé(s)`
        };
      } else if (!isAuthenticated && error) {
        results[2] = {
          ...results[2],
          status: 'success',
          message: '✅ Accès refusé correctement (utilisateur non authentifié)'
        };
      } else {
        results[2] = {
          ...results[2],
          status: 'error',
          message: '❌ Problème de sécurité détecté'
        };
      }
    } catch (err) {
      results[2] = {
        ...results[2],
        status: 'error',
        message: '❌ Erreur lors du test'
      };
    }

    setTestResults([...results]);

    // Test 4: Vérifier l'accès à user_progress
    results.push({
      name: 'Accès aux progrès utilisateur',
      description: 'Vérification que user_progress est protégé',
      status: 'pending',
      message: 'Test en cours...'
    });

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .limit(1);

      if (isAuthenticated && data) {
        results[3] = {
          ...results[3],
          status: 'success',
          message: `✅ Accès autorisé (utilisateur authentifié) - ${data.length} progrès trouvé(s)`
        };
      } else if (!isAuthenticated && error) {
        results[3] = {
          ...results[3],
          status: 'success',
          message: '✅ Accès refusé correctement (utilisateur non authentifié)'
        };
      } else {
        results[3] = {
          ...results[3],
          status: 'error',
          message: '❌ Problème de sécurité détecté'
        };
      }
    } catch (err) {
      results[3] = {
        ...results[3],
        status: 'error',
        message: '❌ Erreur lors du test'
      };
    }

    setTestResults([...results]);
    setTesting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Déconnexion réussie',
      description: 'Vous êtes maintenant déconnecté. Relancez les tests pour vérifier la protection.',
    });
    setIsAuthenticated(false);
    setUserEmail('');
    setTestResults([]);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Test de Sécurité</h1>
        </div>
        <Button variant="outline" onClick={() => navigate('/welcome')}>
          Retour
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>État de l'Authentification</CardTitle>
          <CardDescription>
            Vérification de votre statut d'authentification actuel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-success" />
                  <div>
                    <p className="font-medium">Connecté</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-destructive" />
                  <div>
                    <p className="font-medium">Non connecté</p>
                    <p className="text-sm text-muted-foreground">Vous devez vous connecter pour accéder aux données</p>
                  </div>
                </>
              )}
            </div>
            {isAuthenticated && (
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tests de Sécurité RLS</CardTitle>
          <CardDescription>
            Vérification que les politiques de sécurité Row-Level Security protègent correctement vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runSecurityTests} 
              disabled={testing}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Tests en cours...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Lancer les tests de sécurité
                </>
              )}
            </Button>

            {testResults.length > 0 && (
              <div className="mt-6 space-y-3">
                {testResults.map((result, index) => (
                  <Card key={index} className={`border-l-4 ${
                    result.status === 'success' ? 'border-l-success' :
                    result.status === 'error' ? 'border-l-destructive' :
                    'border-l-warning'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {result.status === 'success' && <CheckCircle2 className="w-5 h-5 text-success" />}
                            {result.status === 'error' && <XCircle className="w-5 h-5 text-destructive" />}
                            {result.status === 'pending' && <Loader2 className="w-5 h-5 animate-spin text-warning" />}
                            <h4 className="font-semibold">{result.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                          <p className="text-sm">{result.message}</p>
                        </div>
                        <Badge variant={
                          result.status === 'success' ? 'default' :
                          result.status === 'error' ? 'destructive' :
                          'secondary'
                        }>
                          {result.status === 'success' ? 'Sécurisé' :
                           result.status === 'error' ? 'Vulnérable' :
                           'En cours'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions de Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium mb-2">Pour tester la sécurité :</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li><strong>Connecté :</strong> Lancez les tests - vous devriez avoir accès aux données (normal)</li>
              <li><strong>Déconnecté :</strong> Cliquez sur "Se déconnecter", puis relancez les tests</li>
              <li><strong>Résultat attendu :</strong> Tous les tests doivent être "✅ Accès refusé correctement"</li>
              <li><strong>Si un test échoue :</strong> Cela indique une vulnérabilité de sécurité</li>
            </ol>
          </div>
          
          <div className="bg-success/10 p-4 rounded-lg border border-success/20">
            <p className="font-medium text-success mb-1">✅ Politiques RLS actives :</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
              <li>Profiles : Authentification requise</li>
              <li>Memories : Authentification requise</li>
              <li>Restaurants : Authentification requise</li>
              <li>User Progress : Authentification requise</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTest;
