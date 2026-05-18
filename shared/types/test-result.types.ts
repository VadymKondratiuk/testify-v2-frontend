export interface TestResultAnswer {
  questionId: string;
  selectedOptionIds: string[];
  textAnswer?: string;
  earnedPoints: number;
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
