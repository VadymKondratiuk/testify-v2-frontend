import { Send } from "lucide-react";
import { Question } from "@/shared/types/test.types";

interface TestSidebarProps {
  title: string;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string | string[]>;
  answeredCount: number;
  onNavigate: (index: number) => void;
  onSubmit: () => void;
}

export const TestSidebar = ({
  title,
  questions,
  currentIndex,
  answers,
  answeredCount,
  onNavigate,
  onSubmit,
}: TestSidebarProps) => {
  const hasAnswered = (answer: string | string[] | undefined) => {
    return Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
  };

  return (
    <aside className="flex w-full shrink-0 flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:sticky lg:top-24 h-fit min-h-[400px] lg:w-72">
      <div className="mb-5">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
          Test Session
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-sora)] text-[1.15rem] font-bold text-[#0F172A]">
          {title}
        </h1>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3 text-[0.9rem]">
        <span className="font-medium text-[#64748B]">Answered</span>
        <span className="font-bold text-[#4F46E5]">
          {answeredCount}/{questions.length}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = hasAnswered(answers[question.id]);

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onNavigate(index)}
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
        onClick={onSubmit}
        className="cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#1E293B] lg:mt-auto"
      >
        <Send size={18} />
        Submit Test
      </button>
    </aside>
  );
};