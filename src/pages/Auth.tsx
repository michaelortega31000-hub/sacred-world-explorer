import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/sacredworld-logo.png';
import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/mode-selection');
      }
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/mode-selection');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = signupSchema.parse(formData);
      setLoading(true);

      const redirectUrl = `${window.location.origin}/selection`;
      
      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: validatedData.username
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: 'Erreur',
            description: 'Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: 'Compte créé !',
        description: 'Vous pouvez maintenant vous connecter.',
      });
      
      setIsLogin(true);
      setFormData({ username: '', email: validatedData.email, password: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Erreur de validation',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la création du compte.',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = loginSchema.parse({
        email: formData.email,
        password: formData.password
      });
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Erreur',
            description: 'Email ou mot de passe incorrect.',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
        return;
      }

      navigate('/mode-selection');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Erreur de validation',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la connexion.',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Overlay gradient turquoise subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-md border-primary/20 shadow-halo turquoise-reflection">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="SacredWorld Logo" 
              className="w-32 h-32 object-contain gold-halo breathing-glow"
            />
          </div>
          <CardDescription className="text-base text-muted-foreground">
            {isLogin 
              ? 'Connectez-vous pour continuer votre voyage' 
              : 'Rejoignez la communauté SacredWorld'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choisissez un nom d'utilisateur"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-turquoise"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                isLogin ? 'Se connecter' : 'Créer mon compte'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ username: '', email: '', password: '' });
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              disabled={loading}
            >
              {isLogin 
                ? "Pas encore de compte ? S'inscrire" 
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
