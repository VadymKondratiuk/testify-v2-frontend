export interface TestResultAnswer {
  questionId: string;
  selectedOptionIds: string[];
  earnedPoints: number;
  timeSpentSeconds: number;
  note?: string;
}

export interface TestResultData {
  id: string;
  testId: string;
  submittedAt: string;
  startedAt: string;
  totalTimeSeconds: number;
  answers: TestResultAnswer[];
  strengths: string[];
  improvements: string[];
}
