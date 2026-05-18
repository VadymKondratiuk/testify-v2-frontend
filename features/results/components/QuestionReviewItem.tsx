import { AlertCircle } from "lucide-react";
import { Question } from "@/shared/types/test.types";
import { TestResultAnswer } from "@/shared/types/test-result.types";
// Імпортуємо нову функцію
import { getOptionState, getQuestionStatus, QuestionStatus } from "../result.utils";

interface QuestionReviewItemProps {
  index: number;
  question: Question;
  resultAnswer?: TestResultAnswer;
}

// Конфіг для плашок (кольори і текст)
const STATUS_UI: Record<QuestionStatus, { label: string; className: string }> = {
  correct: { label: "Correct", className: "bg-[#D1FAE5] text-[#047857]" },
  partial: { label: "Partially Correct", className: "bg-[#FEF3C7] text-[#D97706]" }, // Жовто-помаранчевий
  incorrect: { label: "Incorrect", className: "bg-[#FEE2E2] text-[#B91C1C]" },
  unanswered: { label: "Unanswered", className: "bg-[#F1F5F9] text-[#475569]" },
};

export const QuestionReviewItem = ({ index, question, resultAnswer }: QuestionReviewItemProps) => {
  const answerData = resultAnswer ?? {
    questionId: question.id,
    selectedOptionIds: [],
    earnedPoints: 0,
  };

  // Визначаємо статус
  const status = getQuestionStatus(question, answerData);
  const currentStatusUI = STATUS_UI[status];

  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-[#F1F5F9] px-3 py-1 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[#475569]">
              Question {index + 1}
            </span>
            <span className="rounded-lg bg-[#EEF2FF] px-3 py-1 text-[0.78rem] font-bold text-[#4F46E5]">
              {/* Тут можна вивести earnedPoints / question.points, якщо бекенд рахує дробові бали */}
              {answerData.earnedPoints} / {question.points} pts
            </span>
            {/* Рендеримо красиву плашку */}
            <span className={`rounded-lg px-3 py-1 text-[0.78rem] font-bold ${currentStatusUI.className}`}>
              {currentStatusUI.label}
            </span>
          </div>
          <h3 className="max-w-4xl text-[1.1rem] font-bold leading-relaxed text-[#0F172A]">{question.text}</h3>
        </div>
      </div>

      {question.type === "Text Answer" ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <p className="mb-2 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[#64748B]">
            Your answer
          </p>
          <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed text-[#334155]">
            {answerData.textAnswer || "No answer provided."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {question.options.map((option) => {
          const state = getOptionState(option, answerData.selectedOptionIds);

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
      )}
    </article>
  );
};
