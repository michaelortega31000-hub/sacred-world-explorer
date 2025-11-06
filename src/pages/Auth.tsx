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
import { Checkbox } from '@/components/ui/checkbox';
import { ImageBackground } from '@/components/ImageBackground';
import { getIconicImageForReligion } from '@/lib/religionImageHelper';
import { Religion } from '@/contexts/AppContext';

const signupSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial')
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [authImage] = useState(() => {
    const allReligions: Religion[] = ['christianity', 'islam', 'judaism', 'buddhism', 'hinduism', 'astronomy'];
    const randomReligion = allReligions[Math.floor(Math.random() * allReligions.length)];
    return getIconicImageForReligion(randomReligion);
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Vérifier si c'était une session temporaire (non persistante)
        const isTemporarySession = !sessionStorage.getItem('temp_session');
        if (isTemporarySession && !sessionStorage.getItem('temp_session')) {
          // Si il n'y a pas de flag de session temporaire, c'est une session persistante
          navigate('/welcome');
        } else if (sessionStorage.getItem('temp_session')) {
          // Si le flag existe, la session est valide pour cette session de navigateur
          navigate('/mode-selection');
        } else {
          // Sinon, déconnecter (session expirée après fermeture du navigateur)
          supabase.auth.signOut();
        }
      }
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = signupSchema.parse(formData);
      setLoading(true);

      const redirectUrl = `${window.location.origin}/welcome`;
      
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

      // Gérer la persistance de session
      if (!rememberMe) {
        // Marquer comme session temporaire
        sessionStorage.setItem('temp_session', 'true');
      } else {
        // S'assurer qu'il n'y a pas de flag de session temporaire
        sessionStorage.removeItem('temp_session');
      }

      navigate('/welcome');
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail || !z.string().email().safeParse(resetEmail).success) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un email valide.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) throw error;

      toast({
        title: 'Email envoyé !',
        description: 'Vérifiez votre boîte email pour réinitialiser votre mot de passe.',
      });
      
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi de l\'email.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      images={authImage}
      blur={6}
      overlay="dark"
      className="min-h-screen flex items-center justify-center p-4"
    >
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
            {showForgotPassword
              ? 'Réinitialiser votre mot de passe'
              : isLogin 
                ? 'Connectez-vous pour continuer votre voyage' 
                : 'Rejoignez la communauté SacredWorld'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForgotPassword ? (
            <>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
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
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le lien de réinitialisation'
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  disabled={loading}
                >
                  Retour à la connexion
                </button>
              </div>
            </>
          ) : (
            <>
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
                  <Label htmlFor="password">
                    Mot de passe
                    {!isLogin && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (12+ caractères, majuscule, minuscule, chiffre, caractère spécial)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isLogin ? "••••••••" : "Mot de passe sécurisé"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                {isLogin && (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={loading}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Se souvenir de moi
                    </Label>
                  </div>
                )}

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

              {isLogin && (
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
                    disabled={loading}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <div className="mt-6 text-center pt-4 border-t border-border/50">
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
            </>
          )}
        </CardContent>
      </Card>
    </ImageBackground>
  );
};

export default Auth;
