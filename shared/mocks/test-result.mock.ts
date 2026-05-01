import { TestResultData } from "@/shared/types/test-result.types";

export const mockTestResult: TestResultData = {
  id: "attempt-101-001",
  testId: "101",
  startedAt: "2026-05-01T09:15:00.000Z",
  submittedAt: "2026-05-01T09:37:42.000Z",
  totalTimeSeconds: 1362,
  answers: [
    {
      questionId: "q1",
      selectedOptionIds: ["o1"],
      earnedPoints: 1,
    },
    {
      questionId: "q2",
      selectedOptionIds: ["o4", "o5", "o7"],
      earnedPoints: 2,
    },
    {
      questionId: "q3",
      selectedOptionIds: ["o8"],
      earnedPoints: 0,
    },
    {
      questionId: "q4",
      selectedOptionIds: ["o12"],
      earnedPoints: 1,
    },
    {
      questionId: "q5",
      selectedOptionIds: ["o15", "o16"],
      earnedPoints: 0,
    },
    {
      questionId: "q6",
      selectedOptionIds: ["o20", "o21"],
      earnedPoints: 2,
    },
    {
      questionId: "q7",
      selectedOptionIds: [],
      earnedPoints: 0,
    },
  ],
  strengths: ["Closures", "Variable declarations", "Array mutations"],
  improvements: ["Event loop priorities", "Promise concurrency methods", "Temporal Dead Zone"],
};
