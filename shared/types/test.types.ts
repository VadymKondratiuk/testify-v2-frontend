export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: "Single Choice" | "Multiple Choice" | "Text Answer";
  points: number;
  text: string;
  correctTextAnswer?: string;
  acceptedTextAnswers?: string[];
  tags: string[];
  options: Option[];
}

export type TestDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface TestData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: string;
  difficulty: TestDifficulty;
  passingScore: number;
  timeLimit: number | string;
  questions: Question[];
}

export interface CategoryOption {
  id: string;
  name: string;
}
