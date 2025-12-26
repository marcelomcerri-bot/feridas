import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ComparisonReport } from "@shared/schema";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ComparisonResultsProps {
  comparison: ComparisonReport;
  beforeImage: string;
  afterImage: string;
}

export function ComparisonResults({
  comparison,
  beforeImage,
  afterImage,
}: ComparisonResultsProps) {
  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4" />;
    if (value < 0) return <ArrowDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getChangeColor = (value: number, inverse = false) => {
    const isPositive = inverse ? value < 0 : value > 0;
    if (isPositive) return "text-green-600 bg-green-500/10 border-green-500/20";
    if (value < 0 && !inverse) return "text-red-600 bg-red-500/10 border-red-500/20";
    if (value > 0 && inverse) return "text-red-600 bg-red-500/10 border-red-500/20";
    return "text-muted-foreground bg-muted/50";
  };

  const chartData = {
    labels: ["Antes", "Depois"],
    datasets: [
      {
        label: "Pontuação de Cicatrização",
        data: [50, comparison.healingProgress],
        borderColor: "hsl(197, 92%, 42%)",
        backgroundColor: "hsl(197, 92%, 42%, 0.1)",
        tension: 0.4,
      },
      {
        label: "Risco de Infecção",
        data: [
          comparison.beforeAnalysis.infectionRiskScore,
          comparison.afterAnalysis.infectionRiskScore,
        ],
        borderColor: "hsl(0, 72%, 45%)",
        backgroundColor: "hsl(0, 72%, 45%, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Evolução da Cicatrização",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-1 space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Comparação Temporal</CardTitle>
          <p className="text-sm text-muted-foreground">
            Análise comparativa realizada em {new Date(comparison.timestamp).toLocaleString("pt-BR")}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Imagem Anterior</p>
              <img
                src={beforeImage}
                alt="Antes"
                className="w-full h-64 object-contain rounded-md border"
                data-testid="img-before"
              />
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {comparison.beforeAnalysis.woundType}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Imagem Atual</p>
              <img
                src={afterImage}
                alt="Depois"
                className="w-full h-64 object-contain rounded-md border"
                data-testid="img-after"
              />
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {comparison.afterAnalysis.woundType}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Métricas de Evolução</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-md border-2 ${getChangeColor(comparison.sizeChange, true)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Redução de Tamanho
                  </p>
                  {getChangeIcon(comparison.sizeChange)}
                </div>
                <p className="text-2xl font-bold font-mono" data-testid="text-size-change">
                  {comparison.sizeChange > 0 ? "+" : ""}
                  {comparison.sizeChange.toFixed(1)}%
                </p>
              </div>

              <div
                className={`p-4 rounded-md border-2 ${getChangeColor(comparison.tissueImprovement)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Melhora do Tecido
                  </p>
                  {getChangeIcon(comparison.tissueImprovement)}
                </div>
                <p className="text-2xl font-bold font-mono" data-testid="text-tissue-improvement">
                  {comparison.tissueImprovement > 0 ? "+" : ""}
                  {comparison.tissueImprovement.toFixed(1)}%
                </p>
              </div>

              <div
                className={`p-4 rounded-md border-2 ${getChangeColor(comparison.exudateChange, true)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Alteração de Exsudato
                  </p>
                  {getChangeIcon(comparison.exudateChange)}
                </div>
                <p className="text-2xl font-bold font-mono" data-testid="text-exudate-change">
                  {comparison.exudateChange > 0 ? "+" : ""}
                  {comparison.exudateChange.toFixed(1)}%
                </p>
              </div>

              <div
                className={`p-4 rounded-md border-2 ${getChangeColor(comparison.healingProgress)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Progresso Geral
                  </p>
                  {comparison.healingProgress > 50 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <p className="text-2xl font-bold font-mono" data-testid="text-healing-progress">
                  {comparison.healingProgress.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Gráfico de Evolução</h3>
            <div className="bg-card p-4 rounded-md border">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Avaliação Geral</h3>
            <div className="p-6 rounded-md bg-muted/50 border">
              <p className="text-base leading-relaxed" data-testid="text-overall-assessment">
                {comparison.overallAssessment}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Resumo da Evolução</h3>
            <div className="p-6 rounded-md bg-primary/5 border-2 border-primary/20">
              <p className="text-base leading-relaxed" data-testid="text-evolution-summary">
                {comparison.evolutionSummary}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
