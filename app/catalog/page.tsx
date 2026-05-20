"use client";

import { LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";
import ActiveFilterTags from "@/features/catalog/components/ActiveFilterTags";
import Pagination from "@/features/catalog/components/Pagination";
import SidebarFilters from "@/features/catalog/components/SidebarFilters";
import TestCard from "@/features/catalog/components/TestCard";
import { SORT_OPTIONS, type CatalogSort } from "@/features/catalog/catalog.consts";
import { useCatalogFilters } from "@/features/catalog/hooks/useCatalogFilters";
import { RecommendedTestsSection } from "@/features/recommendations/components/RecommendedTestsSection";
import { getRecommendedTests, trackRecommendationEvent, type RecommendedTest } from "@/features/recommendations/recommendations.api";

export default function CatalogPage() {
  const filters = useCatalogFilters();
  const [recommendedTests, setRecommendedTests] = useState<RecommendedTest[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    getRecommendedTests("catalog", 3)
      .then((tests) => {
        if (!ignore) {
          setRecommendedTests(tests);
          tests.forEach((test) => {
            void trackRecommendationEvent({
              testId: test.id,
              placement: "catalog",
              eventType: "recommendation_shown",
              source: "catalog_recommended_tests",
              metadata: {
                recommendationType: test.recommendationType,
                matchedTags: test.matchedTags,
                weaknessDetails: test.weaknessDetails,
              },
            });
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setRecommendedTests([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsRecommendationsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FF] font-['DM_Sans',sans-serif] text-slate-900 antialiased">
      <div className="flex-1 flex items-stretch px-12 gap-0">
        <SidebarFilters
          categories={filters.categoryOptions}
          {...filters}
          onReset={filters.handleClearAll}
        />

        <main className="flex-1 flex flex-col gap-5 pt-7 pb-12 pl-8 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white border border-slate-200 rounded-xl px-4.5 py-3 shadow-[0_1px_2px_rgba(15,26,53,0.05)]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-['Sora',sans-serif] text-[1rem] font-bold tracking-[-0.02em] text-slate-900">
                Browse Available Tests
              </span>
              <span className="text-[0.78rem] font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {filters.isLoading ? "Loading..." : `${filters.totalResults} results`}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[0.82rem]">
              <label htmlFor="sort" className="font-medium text-slate-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={filters.sortBy}
                onChange={(event) => filters.setSortBy(event.target.value as CatalogSort)}
                className="border-[1.5px] border-slate-300 rounded-md bg-white py-1.5 pl-3 pr-8 cursor-pointer outline-none focus:border-indigo-600"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex border-[1.5px] border-slate-300 rounded-md overflow-hidden ml-2">
                <button
                  type="button"
                  onClick={() => filters.setViewMode("grid")}
                  className={`p-2 transition-colors ${filters.viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-white text-slate-400"}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => filters.setViewMode("list")}
                  className={`p-2 transition-colors ${filters.viewMode === "list" ? "bg-indigo-600 text-white" : "bg-white text-slate-400"}`}
                  aria-label="List view"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          <ActiveFilterTags filters={filters} />

          <RecommendedTestsSection
            tests={recommendedTests}
            placement="catalog"
            source="catalog_recommended_tests"
            isLoading={isRecommendationsLoading}
          />

          <section aria-label="Test cards" className="relative min-h-[260px]">
            {filters.error ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-[1.1rem] font-semibold text-slate-700">{filters.error}</p>
                <button
                  type="button"
                  onClick={filters.handleClearAll}
                  className="mt-4 text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : filters.isLoading ? (
              <div className={filters.viewMode === "grid" ? "grid gap-5 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]" : "flex flex-col gap-4"}>
                {Array.from({ length: filters.resultsPerPage }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[310px] rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse"
                  />
                ))}
              </div>
            ) : filters.filteredTests.length > 0 ? (
              <div className={filters.viewMode === "grid" ? "grid gap-5 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]" : "flex flex-col gap-4"}>
                {filters.filteredTests.map((card) => (
                  <TestCard key={card.id} card={card} viewMode={filters.viewMode} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-[1.1rem] font-medium">No tests found matching your criteria</p>
                <button
                  type="button"
                  onClick={filters.handleClearAll}
                  className="mt-4 text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>

          {!filters.isLoading && !filters.error && filters.totalResults > 0 && (
            <Pagination
              currentPage={filters.currentPage}
              totalResults={filters.totalResults}
              totalPages={filters.totalPages}
              resultsPerPage={filters.resultsPerPage}
              onPageChange={filters.setCurrentPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
