import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, XCircle } from 'lucide-react';

interface CameraPermissionExplainerProps {
  onActivate: () => void;
  onCancel: () => void;
}

const CameraPermissionExplainer = ({ onActivate, onCancel }: CameraPermissionExplainerProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/98 backdrop-blur-md">
      <div className="text-center p-8 max-w-lg mx-4">
        {/* Icon */}
        <div className="relative mb-6">
          <Camera className="w-20 h-20 text-primary mx-auto" />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Mode AR - Réalité Augmentée
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          Pour cette fonctionnalité, nous avons besoin d'accéder à votre caméra.
        </p>

        {/* What we do */}
        <div className="text-left mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Afficher des symboles religieux 3D sur votre environnement
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Détecter les lieux sacrés à proximité
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Enrichir votre expérience de visite
            </p>
          </div>
        </div>

        {/* What we don't do */}
        <div className="text-left mb-8 space-y-3">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Nous ne sauvegarderons AUCUNE image
            </p>
          </div>
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Aucune donnée ne sera envoyée à des serveurs
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Button onClick={onActivate} size="lg" className="w-full">
            Activer la caméra
          </Button>
          <Button onClick={onCancel} variant="outline" size="lg" className="w-full">
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraPermissionExplainer;
