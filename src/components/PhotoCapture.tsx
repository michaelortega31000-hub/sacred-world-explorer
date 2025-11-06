import { useState, useRef } from 'react';
import { Camera, X, Check, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PhotoAnalysisPreview } from './PhotoAnalysisPreview';

interface PhotoCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: string;
  placeName: string;
  userLat: number;
  userLon: number;
  onSuccess: (data: { pointsEarned: number; photoUrl: string }) => void;
}

interface AnalysisResult {
  match: boolean;
  confidence: number;
  identified_elements: string[];
  reason: string;
}

export const PhotoCapture = ({ 
  isOpen, 
  onClose, 
  placeId, 
  placeName, 
  userLat, 
  userLon, 
  onSuccess 
}: PhotoCaptureProps) => {
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoData(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleRetake = () => {
    setPhotoData(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!photoData) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const base64Data = photoData.split(',')[1];

      const { data, error } = await supabase.functions.invoke('analyze-visit-photo', {
        body: {
          placeId,
          photoBase64: base64Data
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        toast.error('Erreur lors de l\'analyse');
        return;
      }

      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        toast.success('🤖 Analyse terminée !');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleValidate = async () => {
    if (!photoData) return;

    setIsValidating(true);

    try {
      // Extract base64 data
      const base64Data = photoData.split(',')[1];

      const { data, error } = await supabase.functions.invoke('verify-visit-with-photo', {
        body: {
          placeId,
          userLat,
          userLon,
          photoBase64: base64Data
        }
      });

      if (error) {
        console.error('Function error:', error);
        toast.error('Erreur lors de la vérification');
        return;
      }

      console.log('Verification result:', data);

      if (data.success) {
        toast.success(`✨ Visite validée ! +${data.pointsEarned} points`);
        onSuccess({ 
          pointsEarned: data.pointsEarned,
          photoUrl: data.photoUrl
        });
        onClose();
      } else {
        // Show detailed feedback
        if (data.confidence < 50) {
          toast.error(`Cette photo ne semble pas correspondre à ${placeName}. ${data.reason}`);
        } else {
          toast.warning(`Photo peu claire (confiance: ${data.confidence}%). ${data.reason}. Réessayez avec une meilleure vue.`);
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Validation avec photo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Prenez une photo de <strong>{placeName}</strong> pour valider votre visite
          </p>

          {!photoData ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Capturez les éléments caractéristiques du lieu
                </p>
                <Button onClick={handleCaptureClick} size="lg">
                  <Camera className="w-5 h-5 mr-2" />
                  Prendre une photo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {!analysisResult ? (
                <>
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={photoData}
                      alt="Photo capturée"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleRetake}
                      disabled={isAnalyzing}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reprendre
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Analyser la photo
                        </>
                      )}
                    </Button>
                  </div>

                  {isAnalyzing && (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        🤖 L'IA analyse votre photo pour identifier {placeName}...
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <PhotoAnalysisPreview
                    analysis={analysisResult}
                    placeName={placeName}
                    photoData={photoData}
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleRetake}
                      disabled={isValidating}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Retenter
                    </Button>
                    <Button
                      onClick={handleValidate}
                      disabled={isValidating || analysisResult.confidence < 50}
                      className="flex-1"
                    >
                      {isValidating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Validation...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Valider la visite
                        </>
                      )}
                    </Button>
                  </div>

                  {isValidating && (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        ✨ Validation de votre visite en cours...
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};