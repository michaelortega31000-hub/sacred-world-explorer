interface CameraPermissionInstructionsProps {
  platform: 'ios' | 'android' | 'desktop';
  browser: 'safari' | 'chrome' | 'firefox' | 'unknown';
  errorType: 'checking' | 'prompt' | 'denied' | 'granted';
}

const CameraPermissionInstructions = ({ 
  platform, 
  browser, 
  errorType 
}: CameraPermissionInstructionsProps) => {
  const getInstructions = () => {
    if (platform === 'desktop') {
      return (
        <div className="text-left space-y-2">
          <p className="text-sm text-muted-foreground">
            Cette fonctionnalité nécessite un appareil mobile avec caméra.
          </p>
        </div>
      );
    }

    if (platform === 'ios' && browser === 'safari') {
      return (
        <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
          <p className="font-semibold text-sm text-foreground mb-3">
            Pour activer la caméra sur iOS :
          </p>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Allez dans <strong>Réglages → Safari</strong></li>
            <li>Descendez jusqu'à <strong>"Appareil photo"</strong></li>
            <li>Autorisez l'accès pour ce site</li>
            <li>Revenez et appuyez sur "Réessayer"</li>
          </ol>
        </div>
      );
    }

    if (platform === 'android') {
      return (
        <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
          <p className="font-semibold text-sm text-foreground mb-3">
            Pour activer la caméra sur Android :
          </p>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Appuyez sur le cadenas/icône à gauche de l'URL</li>
            <li>Appuyez sur <strong>"Autorisations"</strong></li>
            <li>Activez <strong>"Appareil photo"</strong></li>
            <li>Rechargez la page ou appuyez sur "Réessayer"</li>
          </ol>
        </div>
      );
    }

    return (
      <div className="bg-muted/50 rounded-lg p-4 text-left">
        <p className="text-sm text-muted-foreground">
          Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {getInstructions()}
    </div>
  );
};

export default CameraPermissionInstructions;
