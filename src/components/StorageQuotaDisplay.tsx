import { useStorageQuota } from '@/hooks/useStorageQuota';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, HardDrive } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export const StorageQuotaDisplay = () => {
  const { quota, loading, error, isNearLimit, isAtLimit } = useStorageQuota();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Stockage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur de chargement du quota: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!quota) {
    return null;
  }

  const getProgressColor = () => {
    if (isAtLimit) return 'destructive';
    if (isNearLimit) return 'warning';
    return 'primary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Stockage
        </CardTitle>
        <CardDescription>
          {quota.usedMB} MB utilisés sur {quota.quotaMB} MB
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Progress 
              value={quota.percentageUsed} 
              className="h-2"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {quota.percentageUsed}% utilisé • {quota.remainingMB} MB restants
          </p>
        </div>

        {isAtLimit && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Quota de stockage presque épuisé. Supprimez des fichiers pour libérer de l'espace.
            </AlertDescription>
          </Alert>
        )}

        {isNearLimit && !isAtLimit && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous approchez de votre limite de stockage ({quota.percentageUsed}%).
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
