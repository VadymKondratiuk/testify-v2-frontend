// src/components/creator-studio/stats/ToughestQuestions.tsx
import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";

interface QuestionStat {
  id: string;
  text: string;
  successRate: number;
}

interface ToughestQuestionsProps {
  testId: string; // Додано для формування URL
  questions: QuestionStat[];
}

export function ToughestQuestions({ testId, questions }: ToughestQuestionsProps) {
  // Завжди беремо 3 найскладніші
  const topToughest = [...questions].sort((a, b) => a.successRate - b.successRate).slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6 shrink-0">
        <AlertCircle size={20} className="text-[#EF4444]" />
        <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.1rem]">
          Toughest Questions
        </h2>
      </div>
      
      <div className="flex flex-col gap-6 flex-1">
        {topToughest.map((q, idx) => (
          <div key={q.id}>
            <p className="text-[0.9rem] font-medium text-[#334155] leading-snug mb-3 line-clamp-2">
              <span className="text-[#64748B] mr-2">Q{idx + 1}.</span>
              {q.text}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${q.successRate < 40 ? 'bg-[#EF4444]' : 'bg-orange-400'}`}
                  style={{ width: `${q.successRate}%` }}
                ></div>
              </div>
              <span className="text-[0.8rem] font-bold text-[#64748B] w-10 text-right">
                {q.successRate}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <Link 
        href={`/creator-studio/${testId}/stats/questions`}
        className="mt-6 pt-4 border-t border-[#E2E8F0] shrink-0 cursor-pointer flex items-center justify-center gap-1.5 w-full py-2 text-[0.85rem] font-medium text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg transition-colors"
      >
        View Full Question Analytics <ChevronRight size={16} />
      </Link>
    </div>
  );
}