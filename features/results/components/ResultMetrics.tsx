import { Award, Clock3, Target } from "lucide-react";
import { formatDuration } from "../result.utils";

interface ResultMetricsProps {
  score: number;
  earnedPoints: number;
  totalPoints: number;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
  totalTimeSeconds: number;
  averageTimePerQuestion: number;
}

export const ResultMetrics = ({
  score,
  earnedPoints,
  totalPoints,
  correctCount,
  totalQuestions,
  passingScore,
  totalTimeSeconds,
  averageTimePerQuestion,
}: ResultMetricsProps) => {
  return (
    // Змінено сітку на 3 колонки
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
        <p className="mt-1 font-[family-name:var(--font-sora)] text-[2rem] font-bold text-[#0F172A]">{correctCount}/{totalQuestions}</p>
        <p className="mt-1 text-[0.85rem] text-[#64748B]">Passing score: {passingScore}%</p>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <Clock3 size={24} />
        </div>
        <p className="text-[0.85rem] font-semibold text-[#64748B]">Time Spent</p>
        <p className="mt-1 font-[family-name:var(--font-sora)] text-[2rem] font-bold text-[#0F172A]">{formatDuration(totalTimeSeconds)}</p>
        <p className="mt-1 text-[0.85rem] text-[#64748B]">Avg. {formatDuration(averageTimePerQuestion)} per question</p>
      </div>
    </section>
  );
};