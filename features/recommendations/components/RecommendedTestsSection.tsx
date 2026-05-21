import { Sparkles } from "lucide-react";
import TestCard from "@/features/catalog/components/TestCard";
import {
  trackRecommendationEvent,
  type RecommendationPlacement,
  type RecommendedTest,
} from "@/features/recommendations/recommendations.api";

interface RecommendedTestsSectionProps {
  tests: RecommendedTest[];
  placement: RecommendationPlacement;
  source?: string;
  isLoading?: boolean;
}

export function RecommendedTestsSection({
  tests,
  placement,
  source = "recommended_tests_section",
  isLoading = false,
}: RecommendedTestsSectionProps) {
  if (!isLoading && tests.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-indigo-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,26,53,0.05)]">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex items-center gap-2 text-indigo-600">
            <Sparkles size={18} />
            <h2 className="font-['Sora',sans-serif] text-[1.05rem] font-bold text-slate-900">
              Recommended for you
            </h2>
          </div>
          <p className="text-[0.85rem] text-slate-500">
            Based on your recent answers, weak tags, and learning level.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[280px] rounded-2xl border border-slate-200 bg-slate-50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {tests.map((test) => (
            <div key={test.id} className="flex flex-col gap-2">
              <TestCard
                card={test}
                href={`/tests/${test.id}?recommended=1&placement=${placement}&source=${source}`}
                onTakeTestClick={() => {
                  void trackRecommendationEvent({
                    testId: test.id,
                    placement,
                    eventType: "recommendation_clicked",
                    source,
                    metadata: {
                      recommendationType: test.recommendationType,
                      matchedTags: test.matchedTags,
                      goalMatches: test.goalMatches,
                      weaknessDetails: test.weaknessDetails,
                    },
                  });
                }}
              />
              <p className="rounded-lg bg-indigo-50 px-3 py-2 text-[0.78rem] font-medium leading-relaxed text-indigo-700">
                {test.reason}
              </p>
              {test.weaknessDetails.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {test.weaknessDetails.slice(0, 3).map((detail) => (
                    <span
                      key={detail.tagId}
                      className="rounded-md border border-red-100 bg-red-50 px-2 py-1 text-[0.7rem] font-semibold text-red-700"
                      title={`${detail.correctCount} correct, ${detail.wrongCount} wrong answers`}
                    >
                      {detail.tag} / mastery{" "}
                      {Math.round(detail.masteryScore * 100)}%
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
