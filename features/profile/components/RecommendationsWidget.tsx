// src/components/profile/RecommendationsWidget.tsx
import { BrainCircuit } from "lucide-react";
import { RecommendationData } from "@/features/profile/profile.types";

interface RecommendationsWidgetProps {
  recommendations: RecommendationData[];
}

export function RecommendationsWidget({ recommendations }: RecommendationsWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] flex items-center justify-center">
          <BrainCircuit className="text-[#F59E0B]" size={20} />
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.2rem]">
            Recommended Next Steps
          </h2>
          <p className="text-[#64748B] text-[0.85rem]">Based on your recent performance gaps</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-[#E2E8F0] hover:border-[#4F46E5] hover:bg-[#F8FAFC] transition-colors gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {rec.type === "gap" ? (
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#EF4444] bg-red-50 px-2 py-0.5 rounded-full">
                    Knowledge Gap
                  </span>
                ) : (
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#10B981] bg-green-50 px-2 py-0.5 rounded-full">
                    Next Level
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-[#0F172A]">{rec.title}</h3>
              <p className="text-[#64748B] text-[0.85rem]">{rec.description}</p>
            </div>
            <button className="w-full sm:w-auto px-5 py-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] font-semibold text-[0.9rem] rounded-lg transition-colors whitespace-nowrap">
              Start Topic
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}