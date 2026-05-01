"use client";

import { use, useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Send,
  Square,
} from "lucide-react";
import { mockTest } from "@/shared/mocks/test.mocks";
import { Question, TestData } from "@/shared/types/test.types";

type AnswersState = Record<string, string | string[]>;

interface TakeTestPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getInitialTimeLeft(test: TestData) {
  return Number(test.timeLimit) * 60;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function hasAnsweredQuestion(answer: string | string[] | undefined) {
  return Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
}

export default function TakeTestPage({ params }: TakeTestPageProps) {
  const { id } = use(params);
  const testData = mockTest;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [timeLeft, setTimeLeft] = useState(() => getInitialTimeLeft(testData));

  const currentQuestion: Question = testData.questions[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === testData.questions.length - 1;
  const answeredCount = Object.values(answers).filter(hasAnsweredQuestion).length;

  const handleSubmit = useCallback(
    (force = false) => {
      const hasUnansweredQuestions = answeredCount !== testData.questions.length;

      if (!force && hasUnansweredQuestions) {
        window.alert(
          `You have answered ${answeredCount} of ${testData.questions.length} questions. Some questions are still unanswered.`,
        );
        const confirmed = window.confirm("Submit the test anyway?");

        if (!confirmed) {
          return;
        }
      }

      console.log("Submitted test answers:", {
        testId: id,
        answers,
      });
    },
    [answeredCount, answers, id, testData.questions.length],
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(timerId);
          handleSubmit(true);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [handleSubmit, timeLeft]);

  const handleSingleChoice = (questionId: string, optionId: string) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: optionId,
    }));
  };

  const handleMultipleChoice = (questionId: string, optionId: string) => {
    setAnswers((previousAnswers) => {
      const previousValue = previousAnswers[questionId];
      const selectedOptions = Array.isArray(previousValue) ? previousValue : [];
      const nextOptions = selectedOptions.includes(optionId)
        ? selectedOptions.filter((selectedId) => selectedId !== optionId)
        : [...selectedOptions, optionId];

      return {
        ...previousAnswers,
        [questionId]: nextOptions,
      };
    });
  };

  const handleOptionSelect = (question: Question, optionId: string) => {
    if (question.type === "Multiple Choice") {
      handleMultipleChoice(question.id, optionId);
      return;
    }

    handleSingleChoice(question.id, optionId);
  };

  const isOptionSelected = (question: Question, optionId: string) => {
    const answer = answers[question.id];

    if (question.type === "Multiple Choice") {
      return Array.isArray(answer) && answer.includes(optionId);
    }

    return answer === optionId;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-[#0F172A]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-6 lg:flex-row lg:px-8">
        <aside className="flex w-full shrink-0 flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:sticky lg:top-24 h-fit min-h-[400px] lg:w-72">
          <div className="mb-5">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
              Test Session
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-sora)] text-[1.15rem] font-bold text-[#0F172A]">
              {testData.title}
            </h1>
          </div>

          <div className="mb-4 flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3 text-[0.9rem]">
            <span className="font-medium text-[#64748B]">Answered</span>
            <span className="font-bold text-[#4F46E5]">
              {answeredCount}/{testData.questions.length}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {testData.questions.map((question, index) => {
              const isCurrent = index === currentIndex;
              const isAnswered = hasAnsweredQuestion(answers[question.id]);

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`cursor-pointer flex aspect-square items-center justify-center rounded-lg border text-[0.9rem] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${
                    isCurrent
                      ? "border-[#4F46E5] bg-[#4F46E5] text-white shadow-sm"
                      : isAnswered
                        ? "border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5] hover:border-[#4F46E5]"
                        : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#94A3B8] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            className="cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#1E293B] lg:mt-auto"
          >
            <Send size={18} />
            Submit Test
          </button>
        </aside>
        <main className="flex h-fit min-w-0 flex-1 flex-col rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <header className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
            <div>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                Question {currentIndex + 1} of {testData.questions.length}
              </p>
              <div className="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-full bg-[#EEF2FF]">
                <div
                  className="h-full rounded-full bg-[#4F46E5] transition-all"
                  style={{ width: `${((currentIndex + 1) / testData.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-2 font-mono text-[1rem] font-bold text-[#4F46E5]">
              <Clock3 size={18} />
              {formatTime(timeLeft)}
            </div>
          </header>

          <section className="flex-1 px-5 py-7 md:px-8 md:py-9">
            <div className="mb-7 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-[#F1F5F9] px-3 py-1 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[#475569]">
                {currentQuestion.type}
              </span>
              <span className="rounded-lg bg-[#EEF2FF] px-3 py-1 text-[0.78rem] font-bold text-[#4F46E5]">
                {currentQuestion.points} {currentQuestion.points === 1 ? "point" : "points"}
              </span>
            </div>

            <h2 className="mb-8 max-w-3xl font-[family-name:var(--font-sora)] text-[1.45rem] font-bold leading-relaxed text-[#0F172A] md:text-[1.75rem]">
              {currentQuestion.text}
            </h2>

            <div className="flex max-w-3xl flex-col gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = isOptionSelected(currentQuestion, option.id);
                const isMultipleChoice = currentQuestion.type === "Multiple Choice";
                const InactiveIcon = isMultipleChoice ? Square : Circle;
                const ActiveIcon = isMultipleChoice ? CheckSquare : CheckCircle2;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(currentQuestion, option.id)}
                    className={`cursor-pointer flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 sm:p-5 ${
                      isSelected
                        ? "border-[#4F46E5] bg-[#EEF2FF] shadow-sm"
                        : "border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <ActiveIcon className="h-5 w-5 text-[#4F46E5]" />
                      ) : (
                        <InactiveIcon className="h-5 w-5 text-[#CBD5E1]" />
                      )}
                    </span>
                    <span className={`text-[1rem] leading-relaxed ${isSelected ? "font-semibold text-[#3730A3]" : "text-[#334155]"}`}>
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <footer className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] px-5 py-4 md:px-8">
            <button
              type="button"
              onClick={() => setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0))}
              disabled={isFirstQuestion}
              className="cursor-pointer flex items-center gap-2 rounded-xl px-4 py-3 text-[0.9rem] font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-35 sm:px-5"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-[0.9rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#1E293B] sm:px-6"
              >
                Submit Test
                <Send size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, testData.questions.length - 1))}
                className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-[0.9rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#4338CA] sm:px-6"
              >
                Next
                <ChevronRight size={18} />
              </button>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
}
