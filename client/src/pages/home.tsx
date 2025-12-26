import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Activity, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AnalysisResults } from "@/components/analysis-results";
import { ComparisonResults } from "@/components/comparison-results";
import { useToast } from "@/hooks/use-toast";
import type { WoundAnalysis, ComparisonReport } from "@shared/schema";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<WoundAnalysis | null>(null);
  const [comparison, setComparison] = useState<ComparisonReport | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest("POST", "/api/analyze-wound", { imageData });
      return (await response.json()) as WoundAnalysis;
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: "Análise Concluída",
        description: "A análise da ferida foi realizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro na Análise",
        description: "Não foi possível analisar a imagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const compareMutation = useMutation({
    mutationFn: async ({ before, after }: { before: string; after: string }) => {
      const response = await apiRequest("POST", "/api/compare-wounds", {
        beforeImage: before,
        afterImage: after,
      });
      return (await response.json()) as ComparisonReport;
    },
    onSuccess: (data) => {
      setComparison(data);
      toast({
        title: "Comparação Concluída",
        description: "A comparação temporal foi realizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro na Comparação",
        description: "Não foi possível comparar as imagens. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSingleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const onBeforeDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBeforeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onAfterDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAfterImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const singleDropzone = useDropzone({
    onDrop: onSingleDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxFiles: 1,
  });

  const beforeDropzone = useDropzone({
    onDrop: onBeforeDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxFiles: 1,
  });

  const afterDropzone = useDropzone({
    onDrop: onAfterDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxFiles: 1,
  });

  const handleAnalyze = () => {
    if (selectedImage) {
      analyzeMutation.mutate(selectedImage);
    }
  };

  const handleCompare = () => {
    if (beforeImage && afterImage) {
      setComparison(null);
      compareMutation.mutate({ before: beforeImage, after: afterImage });
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setAnalysis(null);
  };

  const handleClearComparison = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setComparison(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">WoundVision</h1>
              <p className="text-xs text-muted-foreground">Classificador Inteligente de Feridas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="analysis" data-testid="tab-analysis">
              <Activity className="h-4 w-4 mr-2" />
              Análise Individual
            </TabsTrigger>
            <TabsTrigger value="comparison" data-testid="tab-comparison">
              <GitCompare className="h-4 w-4 mr-2" />
              Comparação Temporal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader className="gap-1 space-y-0 pb-4">
                    <CardTitle className="text-lg">Upload de Imagem</CardTitle>
                    <CardDescription>
                      Arraste uma imagem da ferida ou clique para selecionar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      {...singleDropzone.getRootProps()}
                      className={`min-h-96 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-4 p-6 cursor-pointer transition-colors ${
                        singleDropzone.isDragActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover-elevate"
                      }`}
                      data-testid="dropzone-single"
                    >
                      <input {...singleDropzone.getInputProps()} />
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Imagem da ferida"
                          className="max-h-80 w-full object-contain rounded-md"
                        />
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              Arraste a imagem ou clique aqui
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG ou JPEG (máx. 10MB)
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={handleAnalyze}
                        disabled={!selectedImage || analyzeMutation.isPending}
                        className="flex-1"
                        size="lg"
                        data-testid="button-analyze"
                      >
                        {analyzeMutation.isPending ? "Analisando..." : "Analisar Ferida"}
                      </Button>
                      {selectedImage && (
                        <Button
                          onClick={handleClear}
                          variant="outline"
                          size="lg"
                          data-testid="button-clear"
                        >
                          Limpar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {analyzeMutation.isPending && (
                  <Card>
                    <CardContent className="p-12">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">
                          Analisando imagem com IA...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {analysis && <AnalysisResults analysis={analysis} imageUrl={selectedImage!} />}

                {!analysis && !analyzeMutation.isPending && (
                  <Card>
                    <CardContent className="p-12">
                      <div className="text-center text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Faça upload de uma imagem para iniciar a análise</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader className="gap-1 space-y-0 pb-4">
                <CardTitle className="text-lg">Upload de Imagens para Comparação</CardTitle>
                <CardDescription>
                  Selecione duas imagens para comparar a evolução da ferida
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Imagem Anterior</label>
                    <div
                      {...beforeDropzone.getRootProps()}
                      className={`min-h-64 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-4 p-6 cursor-pointer transition-colors ${
                        beforeDropzone.isDragActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover-elevate"
                      }`}
                      data-testid="dropzone-before"
                    >
                      <input {...beforeDropzone.getInputProps()} />
                      {beforeImage ? (
                        <img
                          src={beforeImage}
                          alt="Imagem anterior"
                          className="max-h-56 w-full object-contain rounded-md"
                        />
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm text-center">Imagem inicial</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Imagem Atual</label>
                    <div
                      {...afterDropzone.getRootProps()}
                      className={`min-h-64 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-4 p-6 cursor-pointer transition-colors ${
                        afterDropzone.isDragActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover-elevate"
                      }`}
                      data-testid="dropzone-after"
                    >
                      <input {...afterDropzone.getInputProps()} />
                      {afterImage ? (
                        <img
                          src={afterImage}
                          alt="Imagem atual"
                          className="max-h-56 w-full object-contain rounded-md"
                        />
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm text-center">Imagem recente</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCompare}
                    disabled={!beforeImage || !afterImage || compareMutation.isPending}
                    className="flex-1"
                    size="lg"
                    data-testid="button-compare"
                  >
                    {compareMutation.isPending ? "Comparando..." : "Comparar Evolução"}
                  </Button>
                  {(beforeImage || afterImage) && (
                    <Button
                      onClick={handleClearComparison}
                      variant="outline"
                      size="lg"
                      data-testid="button-clear-comparison"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {compareMutation.isPending && (
              <Card>
                <CardContent className="p-12">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      Comparando imagens e analisando evolução...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {comparison && (
              <ComparisonResults
                comparison={comparison}
                beforeImage={beforeImage!}
                afterImage={afterImage!}
              />
            )}

            {!comparison && !compareMutation.isPending && (
              <Card>
                <CardContent className="p-12">
                  <div className="text-center text-muted-foreground">
                    <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Faça upload de duas imagens para comparar a evolução</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
