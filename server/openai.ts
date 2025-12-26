import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface WoundAnalysisResult {
  woundType: string;
  tissueType: string;
  exudateLevel: string;
  borderCondition: string;
  depthEstimate: string;
  odorAssessment: string;
  infectionRisk: "low" | "medium" | "high";
  infectionRiskScore: number;
  healingStage: string;
  recommendations: string[];
  detailedAnalysis: string;
}

export async function analyzeWoundImage(base64Image: string): Promise<WoundAnalysisResult> {
  try {
    const imageData = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em enfermagem e análise de feridas. Analise a imagem da ferida fornecida e forneça uma avaliação clínica detalhada em português brasileiro.

Seu relatório deve incluir:
1. Tipo de ferida (úlcera por pressão, cirúrgica, queimadura, laceração, etc.)
2. Tipo de tecido predominante (granulação, necrótico, fibrina, epitelização)
3. Nível de exsudato (ausente, mínimo, moderado, abundante, purulento)
4. Condição das bordas (definidas, difusas, maceradas, hiperqueratóticas, epitelizadas)
5. Profundidade estimada (superficial, espessura parcial, espessura total, estruturas profundas)
6. Avaliação de odor (ausente, mínimo, moderado, forte)
7. Risco de infecção (low/medium/high) com score numérico 0-100
8. Estágio de cicatrização (inflamatório, proliferativo, remodelação)
9. 4-6 recomendações específicas de cuidados de enfermagem
10. Análise detalhada descrevendo o aspecto geral e sinais preocupantes

Responda APENAS em formato JSON válido.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de ferida e forneça um relatório clínico completo em português. Retorne os dados em JSON com esta estrutura exata:
{
  "woundType": "tipo da ferida",
  "tissueType": "tipo de tecido",
  "exudateLevel": "nível de exsudato",
  "borderCondition": "condição das bordas",
  "depthEstimate": "profundidade estimada",
  "odorAssessment": "avaliação de odor",
  "infectionRisk": "low|medium|high",
  "infectionRiskScore": número de 0 a 100,
  "healingStage": "estágio de cicatrização",
  "recommendations": ["recomendação 1", "recomendação 2", ...],
  "detailedAnalysis": "análise detalhada do aspecto geral"
}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);

    return {
      woundType: result.woundType || "Não classificado",
      tissueType: result.tissueType || "Não identificado",
      exudateLevel: result.exudateLevel || "Não avaliado",
      borderCondition: result.borderCondition || "Não avaliado",
      depthEstimate: result.depthEstimate || "Não avaliado",
      odorAssessment: result.odorAssessment || "Não avaliado",
      infectionRisk: result.infectionRisk || "medium",
      infectionRiskScore: result.infectionRiskScore || 50,
      healingStage: result.healingStage || "Não determinado",
      recommendations: result.recommendations || [
        "Manter a ferida limpa e protegida",
        "Consultar profissional de saúde",
      ],
      detailedAnalysis:
        result.detailedAnalysis ||
        "Análise visual da ferida com base na imagem fornecida.",
    };
  } catch (error) {
    console.error("Error analyzing wound image:", error);
    throw new Error("Failed to analyze wound image");
  }
}

export interface ComparisonAnalysisResult {
  sizeChange: number;
  tissueImprovement: number;
  exudateChange: number;
  healingProgress: number;
  overallAssessment: string;
  evolutionSummary: string;
}

export async function compareWoundImages(
  beforeImage: string,
  afterImage: string,
  beforeAnalysis: WoundAnalysisResult,
  afterAnalysis: WoundAnalysisResult
): Promise<ComparisonAnalysisResult> {
  try {
    const beforeImageData = beforeImage.replace(/^data:image\/[a-z]+;base64,/, "");
    const afterImageData = afterImage.replace(/^data:image\/[a-z]+;base64,/, "");

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em enfermagem especializado em análise de evolução de feridas. Compare duas imagens de uma mesma ferida (antes e depois) e forneça uma análise detalhada da evolução em português brasileiro.

Seu relatório deve incluir:
1. Mudança percentual no tamanho (-100 a +100, negativo = redução/melhora)
2. Melhora no tecido (0-100, maior = melhor)
3. Mudança no exsudato (-100 a +100, negativo = redução/melhora)
4. Progresso geral de cicatrização (0-100)
5. Avaliação geral descritiva da evolução
6. Resumo executivo da evolução

Responda APENAS em formato JSON válido.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Compare estas duas imagens de ferida (antes e depois) e forneça uma análise da evolução.

Análise da imagem ANTES:
- Tipo: ${beforeAnalysis.woundType}
- Tecido: ${beforeAnalysis.tissueType}
- Exsudato: ${beforeAnalysis.exudateLevel}
- Risco de infecção: ${beforeAnalysis.infectionRisk} (${beforeAnalysis.infectionRiskScore}%)

Análise da imagem DEPOIS:
- Tipo: ${afterAnalysis.woundType}
- Tecido: ${afterAnalysis.tissueType}
- Exsudato: ${afterAnalysis.exudateLevel}
- Risco de infecção: ${afterAnalysis.infectionRisk} (${afterAnalysis.infectionRiskScore}%)

Retorne em JSON com esta estrutura:
{
  "sizeChange": número de -100 a +100,
  "tissueImprovement": número de 0 a 100,
  "exudateChange": número de -100 a +100,
  "healingProgress": número de 0 a 100,
  "overallAssessment": "avaliação detalhada",
  "evolutionSummary": "resumo executivo"
}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${beforeImageData}`,
              },
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${afterImageData}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);

    return {
      sizeChange: result.sizeChange || 0,
      tissueImprovement: result.tissueImprovement || 50,
      exudateChange: result.exudateChange || 0,
      healingProgress: result.healingProgress || 50,
      overallAssessment:
        result.overallAssessment || "Comparação visual das duas imagens da ferida.",
      evolutionSummary:
        result.evolutionSummary ||
        "Análise da evolução da ferida entre as duas imagens fornecidas.",
    };
  } catch (error) {
    console.error("Error comparing wound images:", error);
    throw new Error("Failed to compare wound images");
  }
}
