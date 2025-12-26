import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { type WoundAnalysis, type ComparisonReport, woundAnalyses, comparisonReports } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createWoundAnalysis(analysis: Omit<WoundAnalysis, "id" | "timestamp">): Promise<WoundAnalysis>;
  getWoundAnalysis(id: string): Promise<WoundAnalysis | undefined>;
  getAllWoundAnalyses(): Promise<WoundAnalysis[]>;
  createComparisonReport(report: Omit<ComparisonReport, "id" | "timestamp">): Promise<ComparisonReport>;
  getComparisonReport(id: string): Promise<ComparisonReport | undefined>;
  getAllComparisonReports(): Promise<ComparisonReport[]>;
}

class DbStorage implements IStorage {
  private db: any;

  constructor(connectionString: string) {
    const queryClient = postgres(connectionString);
    this.db = drizzle(queryClient);
  }

  async createWoundAnalysis(analysis: Omit<WoundAnalysis, "id" | "timestamp">): Promise<WoundAnalysis> {
    const [result] = await this.db.insert(woundAnalyses).values(analysis).returning();
    return result;
  }

  async getWoundAnalysis(id: string): Promise<WoundAnalysis | undefined> {
    const [result] = await this.db.select().from(woundAnalyses).where(eq(woundAnalyses.id, id));
    return result;
  }

  async getAllWoundAnalyses(): Promise<WoundAnalysis[]> {
    return await this.db.select().from(woundAnalyses);
  }

  async createComparisonReport(report: Omit<ComparisonReport, "id" | "timestamp">): Promise<ComparisonReport> {
    const [result] = await this.db.insert(comparisonReports).values(report).returning();
    return result;
  }

  async getComparisonReport(id: string): Promise<ComparisonReport | undefined> {
    const [result] = await this.db.select().from(comparisonReports).where(eq(comparisonReports.id, id));
    return result;
  }

  async getAllComparisonReports(): Promise<ComparisonReport[]> {
    return await this.db.select().from(comparisonReports);
  }
}

class MemStorage implements IStorage {
  private woundAnalyses: Map<string, WoundAnalysis>;
  private comparisonReports: Map<string, ComparisonReport>;

  constructor() {
    this.woundAnalyses = new Map();
    this.comparisonReports = new Map();
    console.log("[Storage] Using in-memory storage (DATABASE_URL not configured)");
  }

  async createWoundAnalysis(analysis: Omit<WoundAnalysis, "id" | "timestamp">): Promise<WoundAnalysis> {
    const id = randomUUID();
    const timestamp = new Date();
    const woundAnalysis: WoundAnalysis = { ...analysis, id, timestamp };
    this.woundAnalyses.set(id, woundAnalysis);
    return woundAnalysis;
  }

  async getWoundAnalysis(id: string): Promise<WoundAnalysis | undefined> {
    return this.woundAnalyses.get(id);
  }

  async getAllWoundAnalyses(): Promise<WoundAnalysis[]> {
    return Array.from(this.woundAnalyses.values());
  }

  async createComparisonReport(report: Omit<ComparisonReport, "id" | "timestamp">): Promise<ComparisonReport> {
    const id = randomUUID();
    const timestamp = new Date();
    const comparisonReport: ComparisonReport = { ...report, id, timestamp };
    this.comparisonReports.set(id, comparisonReport);
    return comparisonReport;
  }

  async getComparisonReport(id: string): Promise<ComparisonReport | undefined> {
    return this.comparisonReports.get(id);
  }

  async getAllComparisonReports(): Promise<ComparisonReport[]> {
    return Array.from(this.comparisonReports.values());
  }
}

function createStorage(): IStorage {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    try {
      console.log("[Storage] Initializing PostgreSQL database storage");
      return new DbStorage(databaseUrl);
    } catch (error) {
      console.error("[Storage] Failed to initialize database, falling back to in-memory storage:", error);
      return new MemStorage();
    }
  }
  
  console.log("[Storage] DATABASE_URL not found, using in-memory storage");
  return new MemStorage();
}

export const storage = createStorage();
