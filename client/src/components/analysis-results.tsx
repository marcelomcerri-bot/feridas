import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Stethoscope, Droplets, Maximize2, Wind } from "lucide-react";
import type { WoundAnalysis } from "@shared/schema";

interface AnalysisResultsProps {
  analysis: WoundAnalysis;
  imageUrl: string;
}

export function AnalysisResults({ analysis, imageUrl }: AnalysisResultsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "high":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case "low":
        return "Baixo Risco";
      case "medium":
        return "Risco Moderado";
      case "high":
        return "Alto Risco";
      default:
        return risk;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-1 space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Resultado da Análise</CardTitle>
          <p className="text-sm text-muted-foreground">
            Análise realizada em {new Date(analysis.timestamp).toLocaleString("pt-BR")}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Classificação da Ferida
              </p>
              <Badge
                variant="secondary"
                className="text-lg px-4 py-2 font-semibold"
                data-testid="badge-wound-type"
              >
                {analysis.woundType}
              </Badge>
            </div>

            <div>
              <img
                src={imageUrl}
                alt="Imagem analisada"
                className="w-full max-h-96 object-contain rounded-md border"
                data-testid="img-analyzed-wound"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Características Clínicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3 p-4 rounded-md bg-muted/50">
                <Stethoscope className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Tipo de Tecido
                  </p>
                  <p className="text-base font-mono font-medium mt-1" data-testid="text-tissue-type">
                    {analysis.tissueType}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-md bg-muted/50">
                <Droplets className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Nível de Exsudato
                  </p>
                  <p className="text-base font-mono font-medium mt-1" data-testid="text-exudate">
                    {analysis.exudateLevel}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-md bg-muted/50">
                <Maximize2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Condição das Bordas
                  </p>
                  <p className="text-base font-mono font-medium mt-1" data-testid="text-border">
                    {analysis.borderCondition}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-md bg-muted/50">
                <Maximize2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Profundidade Estimada
                  </p>
                  <p className="text-base font-mono font-medium mt-1" data-testid="text-depth">
                    {analysis.depthEstimate}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-md bg-muted/50">
                <Wind className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Avaliação de Odor
                  </p>
                  <p className="text-base font-mono font-medium mt-1" data-testid="text-odor">
                    {analysis.odorAssessment}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-md bg-muted/50">
                <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Estágio de Cicatrização
                  </p>
                  <p className="text-base font-mono font-medium mt-1" data-testid="text-healing-stage">
                    {analysis.healingStage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div
              className={`p-6 rounded-md border-2 ${getRiskColor(analysis.infectionRisk)}`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1">
                    Avaliação de Risco de Infecção
                  </h3>
                  <p className="text-2xl font-bold font-mono mb-2" data-testid="text-infection-risk">
                    {getRiskText(analysis.infectionRisk)} ({analysis.infectionRiskScore}%)
                  </p>
                  <p className="text-sm opacity-90">{analysis.detailedAnalysis}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Recomendações de Cuidados de Enfermagem
            </h3>
            <div className="space-y-3">
              {(analysis.recommendations || []).map((rec, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 rounded-md bg-muted/50 border"
                  data-testid={`recommendation-${index}`}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
