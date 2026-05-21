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
  skillProgress: SkillProgressItem[];
}

export interface SkillProgressItem {
  tagId: string;
  tag: string;
  attemptsCountBefore: number;
  attemptsCountAfter: number;
  correctCountBefore: number;
  correctCountAfter: number;
  wrongCountBefore: number;
  wrongCountAfter: number;
  masteryBefore: number;
  masteryAfter: number;
  masteryDelta: number;
  result: "improved" | "declined" | "stable";
}
