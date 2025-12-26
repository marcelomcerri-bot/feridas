import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeWoundImage, compareWoundImages } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze-wound", async (req, res) => {
    try {
      const { imageData } = req.body;

      if (!imageData) {
        return res.status(400).json({ error: "Image data is required" });
      }

      const analysisResult = await analyzeWoundImage(imageData);

      const woundAnalysis = await storage.createWoundAnalysis({
        imageUrl: imageData,
        ...analysisResult,
      });

      res.json(woundAnalysis);
    } catch (error) {
      console.error("Error in /api/analyze-wound:", error);
      res.status(500).json({ error: "Failed to analyze wound" });
    }
  });

  app.post("/api/compare-wounds", async (req, res) => {
    try {
      const { beforeImage, afterImage } = req.body;

      if (!beforeImage || !afterImage) {
        return res.status(400).json({ error: "Both images are required" });
      }

      const beforeAnalysisResult = await analyzeWoundImage(beforeImage);
      const afterAnalysisResult = await analyzeWoundImage(afterImage);

      const comparisonResult = await compareWoundImages(
        beforeImage,
        afterImage,
        beforeAnalysisResult,
        afterAnalysisResult
      );

      const beforeAnalysis = await storage.createWoundAnalysis({
        imageUrl: beforeImage,
        ...beforeAnalysisResult,
      });

      const afterAnalysis = await storage.createWoundAnalysis({
        imageUrl: afterImage,
        ...afterAnalysisResult,
      });

      const comparisonReport = await storage.createComparisonReport({
        beforeImage,
        afterImage,
        beforeAnalysis,
        afterAnalysis,
        ...comparisonResult,
      });

      res.json(comparisonReport);
    } catch (error) {
      console.error("Error in /api/compare-wounds:", error);
      res.status(500).json({ error: "Failed to compare wounds" });
    }
  });

  app.get("/api/analyses", async (_req, res) => {
    try {
      const analyses = await storage.getAllWoundAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error("Error in /api/analyses:", error);
      res.status(500).json({ error: "Failed to fetch analyses" });
    }
  });

  app.get("/api/comparisons", async (_req, res) => {
    try {
      const comparisons = await storage.getAllComparisonReports();
      res.json(comparisons);
    } catch (error) {
      console.error("Error in /api/comparisons:", error);
      res.status(500).json({ error: "Failed to fetch comparisons" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
