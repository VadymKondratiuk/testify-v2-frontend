export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface TestCardData {
  id: number;
  category: string;
  title: string;
  difficulty: Difficulty;
  duration: string;
  questions: number;
  description: string;
  rating: number;
}