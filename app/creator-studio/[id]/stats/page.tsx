// src/app/creator-studio/[testId]/stats/page.tsx
import { StatsHeader } from "@/features/stats/components/StatsHeader";
import { OverviewCards } from "@/features/stats/components/OverviewCards";
import { ScoreChart } from "@/features/stats/components/ScoreChart";
import { ToughestQuestions } from "@/features/stats/components/ToughestQuestions";
import { ResultsTable } from "@/features/stats/components/ResultsTable";
import { allResults, scoreDistribution, statsOverview, toughestQuestions } from "@/features/stats/stats.mock";

export default function TestStatsPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FF] flex flex-col">
      <StatsHeader testTitle="Advanced JavaScript Concepts" />

      <main className="flex-1 p-5 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 pb-20">
        <OverviewCards data={statsOverview} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ScoreChart data={scoreDistribution} />
          <ToughestQuestions testId="undefined" questions={toughestQuestions} />
        </div>

        <ResultsTable results={allResults} />
      </main>
    </div>
  );
}
