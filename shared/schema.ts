import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const woundAnalyses = pgTable("wound_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  woundType: text("wound_type").notNull(),
  tissueType: text("tissue_type").notNull(),
  exudateLevel: text("exudate_level").notNull(),
  borderCondition: text("border_condition").notNull(),
  depthEstimate: text("depth_estimate").notNull(),
  odorAssessment: text("odor_assessment").notNull(),
  infectionRisk: text("infection_risk").notNull(),
  infectionRiskScore: integer("infection_risk_score").notNull(),
  healingStage: text("healing_stage").notNull(),
  recommendations: text("recommendations").array().notNull(),
  detailedAnalysis: text("detailed_analysis").notNull(),
});

export const insertWoundAnalysisSchema = createInsertSchema(woundAnalyses).omit({
  id: true,
  timestamp: true,
});

export type InsertWoundAnalysis = z.infer<typeof insertWoundAnalysisSchema>;
export type WoundAnalysis = typeof woundAnalyses.$inferSelect;

export const comparisonReports = pgTable("comparison_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  beforeImage: text("before_image").notNull(),
  afterImage: text("after_image").notNull(),
  beforeAnalysis: jsonb("before_analysis").notNull(),
  afterAnalysis: jsonb("after_analysis").notNull(),
  sizeChange: integer("size_change").notNull(),
  tissueImprovement: integer("tissue_improvement").notNull(),
  exudateChange: integer("exudate_change").notNull(),
  healingProgress: integer("healing_progress").notNull(),
  overallAssessment: text("overall_assessment").notNull(),
  evolutionSummary: text("evolution_summary").notNull(),
});

export const insertComparisonReportSchema = createInsertSchema(comparisonReports).omit({
  id: true,
  timestamp: true,
});

export type InsertComparisonReport = z.infer<typeof insertComparisonReportSchema>;
export type ComparisonReport = typeof comparisonReports.$inferSelect;

export * from "./models/chat";
