import { CheckCircle2, XCircle } from "lucide-react";
import { Option, Question } from "@/shared/types/test.types";
import { TestResultAnswer } from "@/shared/types/test-result.types";

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export type QuestionStatus = "correct" | "incorrect" | "partial" | "unanswered";

export function getQuestionStatus(question: Question, resultAnswer?: TestResultAnswer): QuestionStatus {
  if (question.type === "Text Answer") {
    if (!resultAnswer?.textAnswer?.trim()) {
      return "unanswered";
    }

    return resultAnswer.earnedPoints === question.points ? "correct" : "incorrect";
  }

  if (!resultAnswer || resultAnswer.selectedOptionIds.length === 0) {
    return "unanswered";
  }

  if (resultAnswer.earnedPoints >= question.points) return "correct";
  if (resultAnswer.earnedPoints > 0) return "partial";

  return "incorrect";
}

export function getOptionState(option: Option, selectedOptionIds: string[]) {
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
