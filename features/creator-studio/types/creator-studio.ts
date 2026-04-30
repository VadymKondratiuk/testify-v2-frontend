// src/types/creator-studio.ts

export type TestStatus = "published" | "draft" | "closed" | string;

export interface TestSummary {
  id: string;
  title: string;
  status: TestStatus;
  questionsCount: number;
  completions: number;
  updatedAt: string;
}