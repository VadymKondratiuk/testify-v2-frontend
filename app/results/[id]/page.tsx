import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BarChart3,
  CheckCircle2,
  Clock3,
  Lightbulb,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import { mockTestResult } from "@/shared/mocks/test-result.mock";
import { mockTest } from "@/shared/mocks/test.mocks";
import { Option, Question } from "@/shared/types/test.types";
import { TestResultAnswer } from "@/shared/types/test-result.types";

interface TestResultsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function isQuestionCorrect(question: Question, resultAnswer: TestResultAnswer) {
  const correctOptionIds = question.options.filter((option) => option.isCorrect).map((option) => option.id).sort();
  const selectedOptionIds = [...resultAnswer.selectedOptionIds].sort();

  return (
    correctOptionIds.length === selectedOptionIds.length &&
    correctOptionIds.every((optionId, index) => optionId === selectedOptionIds[index])
  );
}

function getOptionState(option: Option, selectedOptionIds: string[]) {
  const isSelected = selectedOptionIds.includes(option.id);

  if (option.isCorrect && isSelected) {
    return {
      icon: <CheckCircle2 size={20} className="text-[#10B981]" />,
      className: "border-[#10B981]/40 bg-[#ECFDF5]",
      label: "Your correct answer",
      labelClassName: "bg-[#D1FAE5] text-[#047857]",
    };
  }

  if (option.isCorrect) {
    return {
      icon: <CheckCircle2 size={20} className="text-[#10B981]" />,
      className: "border-[#10B981]/30 bg-white",
      label: "Correct answer",
      labelClassName: "bg-[#D1FAE5] text-[#047857]",
    };
  }

  if (isSelected) {
    return {
      icon: <XCircle size={20} className="text-[#EF4444]" />,
      className: "border-[#EF4444]/35 bg-[#FEF2F2]",
      label: "Your answer",
      labelClassName: "bg-[#FEE2E2] text-[#B91C1C]",
    };
  }

  return {
    icon: <span className="h-5 w-5 rounded-full border-2 border-[#CBD5E1]" />,
    className: "border-[#E2E8F0] bg-white",
    label: "",
    labelClassName: "",
  };
}

export default async function TestResultsPage({ params }: TestResultsPageProps) {
  const { id } = await params;
  const testData = mockTest;
  const resultData = mockTestResult;

  const totalPoints = testData.questions.reduce((sum, question) => sum + question.points, 0);
  const earnedPoints = resultData.answers.reduce((sum, answer) => sum + answer.earnedPoints, 0);
  const score = Math.round((earnedPoints / totalPoints) * 100);
  const passed = score >= testData.passingScore;
  const correctCount = testData.questions.filter((question) => {
    const answer = resultData.answers.find((item) => item.questionId === question.id);
    return answer ? isQuestionCorrect(question, answer) : false;
  }).length;

  const averageTimePerQuestion = Math.round(resultData.totalTimeSeconds / testData.questions.length);
  const fastestQuestion = [...resultData.answers].sort((a, b) => a.timeSpentSeconds - b.timeSpentSeconds)[0];
  const slowestQuestion = [...resultData.answers].sort((a, b) => b.timeSpentSeconds - a.timeSpentSeconds)[0];

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-16">
      <section className="border-b border-[#E2E8F0] bg-white px-5 py-6 shadow-sm md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          <Link
            href={`/tests/${id}`}
            className="flex w-fit items-center gap-2 text-[0.9rem] font-semibold text-[#64748B] transition-colors hover:text-[#4F46E5]"
          >
            <ArrowLeft size={18} />
            Back to test
          </Link>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-lg px-3 py-1 text-[0.8rem] font-bold ${passed ? "bg-[#D1FAE5] text-[#047857]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}>
                  {passed ? "Passed" : "Needs review"}
                </span>
                <span className="rounded-lg bg-[#EEF2FF] px-3 py-1 text-[0.8rem] font-bold text-[#4F46E5]">
                  Attempt #{resultData.id.split("-").at(-1)}
                </span>
              </div>
              <h1 className="font-[family-name:var(--font-sora)] text-[2rem] font-bold leading-tight text-[#0F172A] md:text-[2.5rem]">
                {testData.title} Results
              </h1>
              <p className="mt-2 max-w-2xl text-[1rem] leading-relaxed text-[#64748B]">
                Submitted on {formatDate(resultData.submittedAt)}. Here is the full breakdown of your answers, correct options, timing, and next study focus.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/tests/${id}/take`}
                className="flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-[0.92rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#4338CA]"
              >
                <RotateCcw size={18} />
                Retake
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 md:px-8">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <Award size={24} />
            </div>
            <p className="text-[0.85rem] font-semibold text-[#64748B]">Score</p>
            <p className="mt-1 font-[family-name:var(--font-sora)] text-[2rem] font-bold text-[#0F172A]">{score}%</p>
            <p className="mt-1 text-[0.85rem] text-[#64748B]">{earnedPoints} of {totalPoints} points</p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#10B981]">
              <Target size={24} />
            </div>
            <p className="text-[0.85rem] font-semibold text-[#64748B]">Correct Questions</p>
            <p className="mt-1 font-[family-name:var(--font-sora)] text-[2rem] font-bold text-[#0F172A]">{correctCount}/{testData.questions.length}</p>
            <p className="mt-1 text-[0.85rem] text-[#64748B]">Passing score: {testData.passingScore}%</p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Clock3 size={24} />
            </div>
            <p className="text-[0.85rem] font-semibold text-[#64748B]">Time Spent</p>
            <p className="mt-1 font-[family-name:var(--font-sora)] text-[2rem] font-bold text-[#0F172A]">{formatDuration(resultData.totalTimeSeconds)}</p>
            <p className="mt-1 text-[0.85rem] text-[#64748B]">Avg. {formatDuration(averageTimePerQuestion)} per question</p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <BarChart3 size={24} />
            </div>
            <p className="text-[0.85rem] font-semibold text-[#64748B]">Pace Insight</p>
            <p className="mt-1 font-[family-name:var(--font-sora)] text-[1.1rem] font-bold text-[#0F172A]">Q{fastestQuestion.questionId.replace("q", "")} fastest</p>
            <p className="mt-1 text-[0.85rem] text-[#64748B]">Q{slowestQuestion.questionId.replace("q", "")} took the longest</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-6 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2 text-[#4F46E5]">
              <Lightbulb size={20} />
              <h2 className="font-[family-name:var(--font-sora)] text-[1.1rem] font-bold">Study recommendation</h2>
            </div>
            <p className="text-[0.95rem] leading-relaxed text-[#3730A3]">
              You are solid on core syntax and array behavior. The biggest score gain is likely from revisiting async execution order: microtasks, macrotasks, and Promise aggregation methods.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-sora)] text-[1.05rem] font-bold text-[#0F172A]">Focus Areas</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {resultData.improvements.map((item) => (
                <span key={item} className="rounded-lg bg-[#FEF2F2] px-3 py-1.5 text-[0.82rem] font-semibold text-[#B91C1C]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-[1.5rem] font-bold text-[#0F172A]">Question Review</h2>
              <p className="mt-1 text-[0.95rem] text-[#64748B]">Compare your selected answers with the correct answers for every question.</p>
            </div>
          </div>

          {testData.questions.map((question, index) => {
            const resultAnswer = resultData.answers.find((answer) => answer.questionId === question.id) ?? {
              questionId: question.id,
              selectedOptionIds: [],
              earnedPoints: 0,
              timeSpentSeconds: 0,
            };
            const isCorrect = isQuestionCorrect(question, resultAnswer);
            const wasAnswered = resultAnswer.selectedOptionIds.length > 0;

            return (
              <article key={question.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-[#F1F5F9] px-3 py-1 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[#475569]">
                        Question {index + 1}
                      </span>
                      <span className="rounded-lg bg-[#EEF2FF] px-3 py-1 text-[0.78rem] font-bold text-[#4F46E5]">
                        {question.points} {question.points === 1 ? "point" : "points"}
                      </span>
                      <span className={`rounded-lg px-3 py-1 text-[0.78rem] font-bold ${isCorrect ? "bg-[#D1FAE5] text-[#047857]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}>
                        {isCorrect ? "Correct" : wasAnswered ? "Incorrect" : "Unanswered"}
                      </span>
                    </div>
                    <h3 className="max-w-4xl text-[1.1rem] font-bold leading-relaxed text-[#0F172A]">{question.text}</h3>
                  </div>

                  <div className="shrink-0 rounded-xl bg-[#F8FAFC] px-4 py-3 text-right">
                    <p className="text-[0.78rem] font-semibold text-[#64748B]">Time</p>
                    <p className="font-mono text-[0.95rem] font-bold text-[#0F172A]">{formatDuration(resultAnswer.timeSpentSeconds)}</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {question.options.map((option) => {
                    const state = getOptionState(option, resultAnswer.selectedOptionIds);

                    return (
                      <div key={option.id} className={`flex items-start justify-between gap-4 rounded-xl border p-4 ${state.className}`}>
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="mt-0.5 shrink-0">{state.icon}</span>
                          <p className="text-[0.95rem] leading-relaxed text-[#334155]">{option.text}</p>
                        </div>
                        {state.label && (
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${state.labelClassName}`}>
                            {state.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {resultAnswer.note && (
                  <div className="mt-4 flex gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-[0.9rem] text-[#475569]">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#4F46E5]" />
                    <p>{resultAnswer.note}</p>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
