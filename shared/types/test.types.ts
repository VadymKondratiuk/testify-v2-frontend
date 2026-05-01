export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: "Single Choice" | "Multiple Choice";
  points: number;
  text: string;
  tags: string[]; // 👈 Додали масив тегів
  options: Option[];
}

export interface TestData {
  id: string;
  title: string;
  description: string;
  category: string; // 👈 Додали категорію
  passingScore: number;
  timeLimit: number | string;
  questions: Question[];
}