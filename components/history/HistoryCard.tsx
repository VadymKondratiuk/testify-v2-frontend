// src/components/history/HistoryCard.tsx
import { CheckCircle2, XCircle, Calendar, Clock, ChevronRight } from "lucide-react";
import { HistoryItem } from "@/types/history";

interface HistoryCardProps {
  test: HistoryItem;
}

export function HistoryCard({ test }: HistoryCardProps) {
  const isPassed = test.status === "passed";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 hover:border-[#CBD5E1] transition-colors">
      
      {/* ── Left: Status Icon ── */}
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isPassed ? "bg-green-50 text-[#10B981]" : "bg-red-50 text-[#EF4444]"
      }`}>
        {isPassed ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
      </div>

      {/* ── Middle: Text content ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="whitespace-nowrap text-[0.7rem] font-bold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
            {test.category}
          </span>
          <span className="whitespace-nowrap flex items-center gap-1 text-[0.75rem] text-[#94A3B8] font-medium">
            <Calendar size={12} />
            {test.date}
          </span>
        </div>

        <h3 className="truncate font-semibold text-[#0F172A] text-[1.1rem] leading-tight mb-2">
          {test.title}
        </h3>

        <div className="flex items-center gap-4 text-[0.85rem] text-[#64748B]">
          <span className="whitespace-nowrap flex items-center gap-1.5">
            <Clock size={14} />
            {test.timeSpent}
          </span>
          <span className="whitespace-nowrap flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            {test.correctAnswers} / {test.totalQuestions} correct
          </span>
        </div>
      </div>

      {/* ── Right: Score + Button ── */}
      <div className="shrink-0 flex flex-row items-center justify-between md:justify-end gap-6 border-t border-[#E2E8F0] md:border-0 pt-4 md:pt-0">
        <div className="flex items-center gap-2">
          <span className="text-[0.75rem] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Score
          </span>
          <span className={`font-[family-name:var(--font-sora)] text-[1.5rem] font-bold leading-none ${
            isPassed ? "text-[#10B981]" : "text-[#EF4444]"
          }`}>
            {test.score}%
          </span>
        </div>

        <button className="cursor-pointer whitespace-nowrap flex items-center gap-1.5 bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] hover:text-[#4338CA] px-4 py-2 rounded-lg font-medium text-[0.85rem] transition-colors">
          View Details <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}