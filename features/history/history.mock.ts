import { HistoryItem } from "@/features/history/history.types";

export const mockHistory: HistoryItem[] = [
  { id: "1", title: "React Hooks Deep Dive", category: "Frontend", date: "24 Apr, 2026", score: 92, totalQuestions: 25, correctAnswers: 23, timeSpent: "18m 45s", status: "passed", completedAt: "2026-04-24T00:00:00.000Z" },
  { id: "2", title: "Database Optimization & Indexing", category: "PostgreSQL", date: "22 Apr, 2026", score: 45, totalQuestions: 20, correctAnswers: 9, timeSpent: "25m 10s", status: "failed", completedAt: "2026-04-22T00:00:00.000Z" },
  { id: "3", title: "Figma UI Patterns", category: "Design", date: "15 Apr, 2026", score: 100, totalQuestions: 15, correctAnswers: 15, timeSpent: "10m 20s", status: "passed", completedAt: "2026-04-15T00:00:00.000Z" },
  { id: "4", title: "NestJS Microservices Architecture", category: "Backend", date: "10 Apr, 2026", score: 68, totalQuestions: 30, correctAnswers: 20, timeSpent: "35m 00s", status: "failed", completedAt: "2026-04-10T00:00:00.000Z" },
];
