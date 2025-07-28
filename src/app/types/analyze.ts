// src/types/analysis.d.ts
export interface AnalysisResult {
  summary: string;
  sentiment: string; // e.g., 'Positive', 'Negative', 'Mixed', 'Neutral'
  keyThemes: {
    positive: string[];
    negative: string[];
  };
  actionableInsights: string;
  keyTakeaways: string[]; // e.g., "Customer service is a strong point.", "Wait times are a recurring issue."
  recommendations: string[]; // e.g., "Implement a digital queuing system.", "Cross-train staff for busy periods."
}
