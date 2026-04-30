// src/types/history.ts

export type HistoryStatus = "passed" | "failed";

export interface HistoryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: string;
  status: HistoryStatus;
}