import { CheckCircle2, CheckSquare, ChevronLeft, ChevronRight, Circle, Clock3, Send, Square } from "lucide-react";
import { Question } from "@/shared/types/test.types";

interface TestBoardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  timeLeft: number;
  answers: Record<string, string | string[]>;
  onOptionSelect: (question: Question, optionId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const TestBoard = ({
  question,
  currentIndex,
  totalQuestions,
  timeLeft,
  answers,
  onOptionSelect,
  onPrev,
  onNext,
  onSubmit,
}: TestBoardProps) => {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const isOptionSelected = (optionId: string) => {
    const answer = answers[question.id];
    if (question.type === "Multiple Choice") {
      return Array.isArray(answer) && answer.includes(optionId);
    }
    return answer === optionId;
  };

  return (
    <main className="flex h-fit min-w-0 flex-1 flex-col rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
      <header className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div>
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
          <div className="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-full bg-[#EEF2FF]">
            <div
              className="h-full rounded-full bg-[#4F46E5] transition-all"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
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
            {question.type}
          </span>
          <span className="rounded-lg bg-[#EEF2FF] px-3 py-1 text-[0.78rem] font-bold text-[#4F46E5]">
            {question.points} {question.points === 1 ? "point" : "points"}
          </span>
        </div>

        <h2 className="mb-8 max-w-3xl font-[family-name:var(--font-sora)] text-[1.45rem] font-bold leading-relaxed text-[#0F172A] md:text-[1.75rem]">
          {question.text}
        </h2>

        <div className="flex max-w-3xl flex-col gap-3">
          {question.options.map((option) => {
            const isSelected = isOptionSelected(option.id);
            const isMultipleChoice = question.type === "Multiple Choice";
            const InactiveIcon = isMultipleChoice ? Square : Circle;
            const ActiveIcon = isMultipleChoice ? CheckSquare : CheckCircle2;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onOptionSelect(question, option.id)}
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
          onClick={onPrev}
          disabled={isFirstQuestion}
          className="cursor-pointer flex items-center gap-2 rounded-xl px-4 py-3 text-[0.9rem] font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-35 sm:px-5"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={onSubmit}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-[0.9rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#1E293B] sm:px-6"
          >
            Submit Test
            <Send size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-[0.9rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#4338CA] sm:px-6"
          >
            Next
            <ChevronRight size={18} />
          </button>
        )}
      </footer>
    </main>
  );
};