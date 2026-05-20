"use client";

import axios from "axios";
import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/shared/api/axios";
import { trackRecommendationEvent, type RecommendationPlacement } from "@/features/recommendations/recommendations.api";
import { Question, TestData } from "@/shared/types/test.types";

import { TestSidebar } from "@/features/take/components/TestSidebar";
import { TestBoard } from "@/features/take/components/TestBoard";

type AnswersState = Record<string, string | string[]>;

type BackendQuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TEXT_ANSWER";

type BackendTag = {
  id?: string;
  name?: string;
};

type BackendOption = {
  id: string;
  text: string;
  questionId?: string;
};

type BackendQuestion = {
  id: string;
  text: string;
  type: BackendQuestionType;
  points: number;
  tags?: BackendTag[] | string[];
  options: BackendOption[];
};

type BackendTestForTaking = {
  id: string;
  title: string;
  description?: string | null;
  passingScore: number;
  timeLimit?: number | null;
  category?: {
    id: string;
    name: string;
  } | null;
  questions: BackendQuestion[];
};

type StartAttemptResponse = {
  attempt: {
    id: string;
    startedAt: string;
  };
  test: BackendTestForTaking;
};

type SubmitAnswerPayload =
  | { questionId: string; optionIds: string[] }
  | { questionId: string; textAnswer: string };

interface TakeTestPageProps {
  params: Promise<{ id: string }>;
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

function mapTag(tag: BackendTag | string) {
  return typeof tag === "string" ? tag : tag.name ?? tag.id ?? "";
}

function mapTestForTaking(test: BackendTestForTaking): TestData {
  return {
    id: test.id,
    title: test.title,
    description: test.description ?? "",
    category: test.category?.name ?? "Uncategorized",
    categoryId: test.category?.id ?? "",
    passingScore: test.passingScore,
    timeLimit: test.timeLimit ?? 0,
    questions: test.questions
      .map((question) => ({
        id: question.id,
        type: toUiQuestionType(question.type),
        points: question.points,
        text: question.text,
        tags: (question.tags ?? []).map(mapTag).filter(Boolean),
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          isCorrect: false,
        })),
      })),
  };
}

function getInitialTimeLeft(test: TestData) {
  return Number(test.timeLimit) * 60;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    return Array.isArray(message) ? message.join(" ") : message ?? "Failed to load the test session.";
  }

  return "Failed to load the test session.";
}

function buildSubmitAnswers(questions: Question[], answers: AnswersState): SubmitAnswerPayload[] {
  return questions
    .map((question) => {
      const answer = answers[question.id];

      if (question.type === "Text Answer") {
        const textAnswer = typeof answer === "string" ? answer.trim() : "";
        return textAnswer ? { questionId: question.id, textAnswer } : null;
      }

      const optionIds = Array.isArray(answer) ? answer : answer ? [answer] : [];
      return optionIds.length > 0 ? { questionId: question.id, optionIds } : null;
    })
    .filter((answer): answer is SubmitAnswerPayload => answer !== null);
}

export default function TakeTestPage({ params }: TakeTestPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const startRequestedRef = useRef(false);

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startRequestedRef.current) return;
    startRequestedRef.current = true;

    api
      .post<StartAttemptResponse>(`/tests/${id}/attempts/start`)
      .then(({ data }) => {
        const mappedTest = mapTestForTaking(data.test);
        const initialTimeLeft = getInitialTimeLeft(mappedTest);

        if (mappedTest.questions.length === 0) {
          throw new Error("This test has no supported questions to answer.");
        }

        setAttemptId(data.attempt.id);
        setTestData(mappedTest);
        setEndTime(initialTimeLeft > 0 ? Date.now() + initialTimeLeft * 1000 : null);
        setTimeLeft(initialTimeLeft);

        if (searchParams.get("recommended") === "1") {
          const placement = searchParams.get("placement");

          if (placement === "catalog" || placement === "profile" || placement === "result") {
            void trackRecommendationEvent({
              testId: id,
              placement: placement as RecommendationPlacement,
              eventType: "recommendation_started",
              source: searchParams.get("source") ?? "test_take_page",
              metadata: {
                attemptId: data.attempt.id,
              },
            });
          }
        }
      })
      .catch((requestError) => {
        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, searchParams]);

  const answeredCount = Object.values(answers).filter((ans) =>
    Array.isArray(ans) ? ans.length > 0 : Boolean(ans)
  ).length;

  const handleSubmit = useCallback(
    async (force = false) => {
      if (!attemptId || !testData || isSubmitting) return;

      const hasUnansweredQuestions = answeredCount !== testData.questions.length;

      if (!force && hasUnansweredQuestions) {
        window.alert(
          `You have answered ${answeredCount} of ${testData.questions.length} questions. Some questions are still unanswered.`
        );
        const confirmed = window.confirm("Submit the test anyway?");
        if (!confirmed) return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        await api.post(`/attempts/${attemptId}/submit`, {
          answers: buildSubmitAnswers(testData.questions, answers),
        });
        router.replace(`/results/${attemptId}`);
      } catch (submitError) {
        setError(getErrorMessage(submitError));
        setIsSubmitting(false);
      }
    },
    [answeredCount, answers, attemptId, isSubmitting, router, testData],
  );

  useEffect(() => {
    if (!endTime) return;

    const timerId = window.setInterval(() => {
      const remainingSeconds = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        window.clearInterval(timerId);
        handleSubmit(true);
      }
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [endTime, handleSubmit]);

  const handleOptionSelect = (question: Question, optionId: string) => {
    setAnswers((prev) => {
      if (question.type === "Single Choice") {
        return { ...prev, [question.id]: optionId };
      }

      const prevVal = prev[question.id];
      const selectedOpts = Array.isArray(prevVal) ? prevVal : [];
      const nextOpts = selectedOpts.includes(optionId)
        ? selectedOpts.filter((optId) => optId !== optionId)
        : [...selectedOpts, optionId];

      return { ...prev, [question.id]: nextOpts };
    });
  };

  const handleTextAnswerChange = (question: Question, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FF] px-5 text-[#0F172A]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[#4F46E5]" />
          <span className="font-semibold">Starting test session...</span>
        </div>
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FF] px-5 text-[#0F172A]">
        <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#EF4444]">
            <AlertTriangle size={28} />
          </div>
          <h1 className="mb-3 font-[family-name:var(--font-sora)] text-2xl font-bold">
            Test session unavailable
          </h1>
          <p className="mb-6 text-[#64748B]">{error ?? "Unable to start this test."}</p>
          <Link
            href={`/tests/${id}`}
            className="inline-flex items-center justify-center rounded-xl bg-[#4F46E5] px-6 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#4338CA]"
          >
            Back to test details
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentIndex] ?? testData.questions[0];

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-[#0F172A]">
      {error && (
        <div className="border-b border-[#FECACA] bg-[#FEF2F2] px-5 py-3 text-center text-sm font-medium text-[#B91C1C]">
          {error}
        </div>
      )}

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-6 lg:flex-row lg:px-8">
        <TestSidebar
          title={testData.title}
          questions={testData.questions}
          currentIndex={currentIndex}
          answers={answers}
          answeredCount={answeredCount}
          onNavigate={setCurrentIndex}
          onSubmit={() => handleSubmit(false)}
          isSubmitting={isSubmitting}
        />

        <TestBoard
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={testData.questions.length}
          timeLeft={timeLeft}
          answers={answers}
          onOptionSelect={handleOptionSelect}
          onTextAnswerChange={handleTextAnswerChange}
          onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          onNext={() => setCurrentIndex((prev) => Math.min(prev + 1, testData.questions.length - 1))}
          onSubmit={() => handleSubmit(false)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
