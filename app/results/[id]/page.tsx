"use client";

import axios from "axios";
import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2 } from "lucide-react";
import { api } from "@/shared/api/axios";
import { Question, TestData, TestDifficulty } from "@/shared/types/test.types";
import { TestResultAnswer, TestResultData } from "@/shared/types/test-result.types";
import { getQuestionStatus } from "@/features/results/result.utils";
import { ResultHeader } from "@/features/results/components/ResultHeader";
import { ResultMetrics } from "@/features/results/components/ResultMetrics";
import { ResultInsights } from "@/features/results/components/ResultInsights";
import { QuestionReviewItem } from "@/features/results/components/QuestionReviewItem";
import { RecommendedTestsSection } from "@/features/recommendations/components/RecommendedTestsSection";
import { getRecommendedTests, trackRecommendationEvent, type RecommendedTest } from "@/features/recommendations/recommendations.api";

type BackendQuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TEXT_ANSWER";
type BackendDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type BackendTag = {
  id?: string;
  name?: string;
};

type BackendQuestion = {
  id: string;
  text: string;
  type: BackendQuestionType;
  points: number;
  correctTextAnswer?: string | null;
  acceptedTextAnswers?: string[];
  tags?: BackendTag[];
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
};

type BackendUserAnswer = {
  questionId: string;
  optionId?: string | null;
  textAnswer?: string | null;
  isCorrect: boolean;
  earnedPoints: number;
  question: BackendQuestion;
};

type BackendAttempt = {
  id: string;
  score: number;
  maxScore: number;
  passingScore: number;
  isPassed: boolean;
  startedAt: string;
  completedAt: string | null;
  studyRecommendation?: string | null;
  focusAreas: string[];
  test: {
    id: string;
    title: string;
    description?: string | null;
    difficulty: BackendDifficulty;
    passingScore: number;
    timeLimit?: number | null;
    category?: {
      id: string;
      name: string;
    } | null;
    questions: BackendQuestion[];
  };
  userAnswers: BackendUserAnswer[];
};

interface TestResultsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function toUiQuestionType(type: BackendQuestionType): Question["type"] {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return "Multiple Choice";
    case "TEXT_ANSWER":
      return "Text Answer";
    case "SINGLE_CHOICE":
    default:
      return "Single Choice";
  }
}

function toUiDifficulty(difficulty: BackendDifficulty): TestDifficulty {
  switch (difficulty) {
    case "ADVANCED":
      return "Advanced";
    case "INTERMEDIATE":
      return "Intermediate";
    case "BEGINNER":
    default:
      return "Beginner";
  }
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    return Array.isArray(message) ? message.join(" ") : message ?? "Failed to load test results.";
  }

  return "Failed to load test results.";
}

function getTotalTimeSeconds(startedAt: string, completedAt: string | null) {
  if (!completedAt) return 0;

  return Math.max(0, Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000));
}

function mapAttempt(attempt: BackendAttempt) {
  const answersByQuestionId = new Map<string, BackendUserAnswer[]>();

  for (const userAnswer of attempt.userAnswers) {
    const answers = answersByQuestionId.get(userAnswer.questionId) ?? [];
    answers.push(userAnswer);
    answersByQuestionId.set(userAnswer.questionId, answers);
  }

  const questions = attempt.test.questions.map((backendQuestion) => ({
    id: backendQuestion.id,
    type: toUiQuestionType(backendQuestion.type),
    points: backendQuestion.points,
    text: backendQuestion.text,
    correctTextAnswer: backendQuestion.correctTextAnswer ?? "",
    acceptedTextAnswers: backendQuestion.acceptedTextAnswers ?? [],
    tags: (backendQuestion.tags ?? []).map((tag) => tag.name ?? tag.id ?? "").filter(Boolean),
    options: (backendQuestion.options ?? []).map((option) => ({
      id: option.id,
      text: option.text,
      isCorrect: option.isCorrect,
    })),
  }));
  const resultAnswers: TestResultAnswer[] = questions.map((question) => {
    const answers = answersByQuestionId.get(question.id) ?? [];
    const selectedOptionIds = answers
      .map((answer) => answer.optionId)
      .filter((optionId): optionId is string => Boolean(optionId));
    const textAnswer = answers.find((answer) => Boolean(answer.textAnswer?.trim()))?.textAnswer?.trim();
    const earnedPoints = answers.length === 0
      ? 0
      : Math.max(...answers.map((answer) => answer.earnedPoints ?? 0));

    return {
      questionId: question.id,
      selectedOptionIds,
      textAnswer,
      earnedPoints,
    };
  });

  const testData: TestData = {
    id: attempt.test.id,
    title: attempt.test.title,
    description: attempt.test.description ?? "",
    category: attempt.test.category?.name ?? "Uncategorized",
    categoryId: attempt.test.category?.id ?? "",
    difficulty: toUiDifficulty(attempt.test.difficulty),
    passingScore: attempt.passingScore,
    timeLimit: attempt.test.timeLimit ?? 0,
    questions,
  };

  const resultData: TestResultData = {
    id: attempt.id,
    testId: attempt.test.id,
    startedAt: attempt.startedAt,
    submittedAt: attempt.completedAt ?? attempt.startedAt,
    totalTimeSeconds: getTotalTimeSeconds(attempt.startedAt, attempt.completedAt),
    answers: resultAnswers,
    strengths: [],
    improvements: attempt.focusAreas,
  };

  return { testData, resultData, recommendation: attempt.studyRecommendation ?? undefined };
}

export default function TestResultsPage({ params }: TestResultsPageProps) {
  const { id } = use(params);
  const [attempt, setAttempt] = useState<BackendAttempt | null>(null);
  const [recommendedTests, setRecommendedTests] = useState<RecommendedTest[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<BackendAttempt>(`/attempts/${id}`)
      .then(({ data }) => {
        setAttempt(data);
      })
      .catch((requestError) => {
        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    let ignore = false;

    getRecommendedTests("result", 3)
      .then((tests) => {
        if (!ignore) {
          setRecommendedTests(tests);
          tests.forEach((test) => {
            void trackRecommendationEvent({
              testId: test.id,
              placement: "result",
              eventType: "recommendation_shown",
              source: "result_recommended_tests",
              metadata: {
                attemptId: id,
                recommendationType: test.recommendationType,
                matchedTags: test.matchedTags,
                weaknessDetails: test.weaknessDetails,
              },
            });
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setRecommendedTests([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsRecommendationsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const mappedResult = useMemo(() => attempt ? mapAttempt(attempt) : null, [attempt]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FF] px-5 text-[#0F172A]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[#4F46E5]" />
          <span className="font-semibold">Loading test results...</span>
        </div>
      </div>
    );
  }

  if (error || !mappedResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FF] px-5 text-[#0F172A]">
        <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#EF4444]">
            <AlertTriangle size={28} />
          </div>
          <h1 className="mb-3 font-[family-name:var(--font-sora)] text-2xl font-bold">
            Results unavailable
          </h1>
          <p className="mb-6 text-[#64748B]">{error ?? "Unable to load these results."}</p>
          <Link
            href="/history"
            className="inline-flex items-center justify-center rounded-xl bg-[#4F46E5] px-6 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#4338CA]"
          >
            Back to history
          </Link>
        </div>
      </div>
    );
  }

  const { testData, resultData, recommendation } = mappedResult;
  const totalPoints = testData.questions.reduce((sum, question) => sum + question.points, 0);
  const earnedPoints = Math.round(resultData.answers.reduce((sum, answer) => sum + answer.earnedPoints, 0) * 100) / 100;
  const score = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  const passed = score >= testData.passingScore;

  const correctCount = testData.questions.filter((question) => {
    const answer = resultData.answers.find((item) => item.questionId === question.id);
    return getQuestionStatus(question, answer) === "correct";
  }).length;

  const averageTimePerQuestion = testData.questions.length === 0
    ? 0
    : Math.round(resultData.totalTimeSeconds / testData.questions.length);

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-16">
      <ResultHeader
        testId={testData.id}
        title={testData.title}
        passed={passed}
        attemptId={resultData.id}
        submittedAt={resultData.submittedAt}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 md:px-8">
        <ResultMetrics
          score={score}
          earnedPoints={earnedPoints}
          totalPoints={totalPoints}
          correctCount={correctCount}
          totalQuestions={testData.questions.length}
          passingScore={testData.passingScore}
          totalTimeSeconds={resultData.totalTimeSeconds}
          averageTimePerQuestion={averageTimePerQuestion}
        />

        <ResultInsights
          improvements={resultData.improvements}
          recommendation={recommendation}
        />

        <RecommendedTestsSection
          tests={recommendedTests}
          placement="result"
          source="result_recommended_tests"
          isLoading={isRecommendationsLoading}
        />

        <section className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-[1.5rem] font-bold text-[#0F172A]">Question Review</h2>
              <p className="mt-1 text-[0.95rem] text-[#64748B]">Compare your selected answers with the correct answers for every question.</p>
            </div>
          </div>

          {testData.questions.map((question, index) => (
            <QuestionReviewItem
              key={question.id}
              index={index}
              question={question}
              resultAnswer={resultData.answers.find((answer) => answer.questionId === question.id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
