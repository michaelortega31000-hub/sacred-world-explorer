import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface AnalysisResult {
  match: boolean;
  confidence: number;
  identified_elements: string[];
  reason: string;
}

interface PhotoAnalysisPreviewProps {
  analysis: AnalysisResult;
  placeName: string;
  photoData: string;
}

export const PhotoAnalysisPreview = ({ 
  analysis, 
  placeName,
  photoData 
}: PhotoAnalysisPreviewProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (confidence >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'Excellente correspondance';
    if (confidence >= 60) return 'Correspondance acceptable';
    return 'Correspondance faible';
  };

  return (
    <div className="space-y-4">
      {/* Photo preview */}
      <div className="relative rounded-lg overflow-hidden border border-border">
        <img
          src={photoData}
          alt="Photo analysée"
          className="w-full h-auto max-h-64 object-contain"
        />
      </div>

      {/* Analysis results */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Analyse IA</h3>
        </div>

        {/* Confidence score */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            {getConfidenceIcon(analysis.confidence)}
            <div>
              <p className="font-medium text-sm">{getConfidenceLabel(analysis.confidence)}</p>
              <p className="text-xs text-muted-foreground">
                Niveau de confiance : {analysis.confidence}%
              </p>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getConfidenceColor(analysis.confidence)}`}>
            {analysis.confidence}%
          </div>
        </div>

        {/* Match status */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          {analysis.match ? (
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-medium text-sm mb-1">
              {analysis.match ? 'Photo correspond au lieu' : 'Photo ne correspond pas au lieu'}
            </p>
            <p className="text-xs text-muted-foreground">{analysis.reason}</p>
          </div>
        </div>

        {/* Identified elements */}
        {analysis.identified_elements.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Éléments détectés :</p>
            <div className="flex flex-wrap gap-2">
              {analysis.identified_elements.map((element, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {element}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="pt-3 border-t border-border">
          {analysis.confidence >= 70 ? (
            <p className="text-sm text-green-600 dark:text-green-400">
              ✅ Cette photo peut être validée pour {placeName}
            </p>
          ) : analysis.confidence >= 50 ? (
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ Photo acceptable mais pourrait être améliorée. Vous pouvez valider ou retenter.
            </p>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400">
              ❌ Cette photo ne correspond pas suffisamment à {placeName}. Veuillez retenter.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
