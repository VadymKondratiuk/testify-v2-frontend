import { X } from "lucide-react";
import type { CatalogFilters } from "@/features/catalog/hooks/useCatalogFilters";

export default function ActiveFilterTags({ filters }: { filters: CatalogFilters }) {
  if (!filters.hasActiveFilters && !filters.searchQuery) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap min-h-[32px]">
      {filters.hasActiveFilters && (
        <span className="text-[0.78rem] font-medium text-slate-400">Filters:</span>
      )}

      {filters.selectedCategoryLabels.map((category) => (
        <div
          key={category.id}
          className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium"
        >
          {category.label}
          <button
            type="button"
            onClick={() => filters.setSelectedCategories((prev) => prev.filter((id) => id !== category.id))}
            className="text-indigo-400 hover:text-indigo-600"
            aria-label={`Remove ${category.label} filter`}
          >
            <X size={11} strokeWidth={3} />
          </button>
        </div>
      ))}

      {filters.selectedDifficulty !== "All Levels" && (
        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium">
          {filters.selectedDifficulty}
          <button
            type="button"
            onClick={() => filters.setSelectedDifficulty("All Levels")}
            className="text-orange-400 hover:text-orange-600"
            aria-label="Remove difficulty filter"
          >
            <X size={11} strokeWidth={3} />
          </button>
        </div>
      )}

      {filters.selectedDurations.map((duration) => (
        <div
          key={duration}
          className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium"
        >
          {duration}
          <button
            type="button"
            onClick={() => filters.setSelectedDurations((prev) => prev.filter((item) => item !== duration))}
            className="text-emerald-400 hover:text-emerald-600"
            aria-label={`Remove ${duration} filter`}
          >
            <X size={11} strokeWidth={3} />
          </button>
        </div>
      ))}

      {filters.selectedQuestionRanges.map((range) => (
        <div
          key={range}
          className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium"
        >
          {range}
          <button
            type="button"
            onClick={() => filters.setSelectedQuestionRanges((prev) => prev.filter((item) => item !== range))}
            className="text-blue-400 hover:text-blue-600"
            aria-label={`Remove ${range} filter`}
          >
            <X size={11} strokeWidth={3} />
          </button>
        </div>
      ))}

      {filters.selectedRating !== "Any" && (
        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium">
          {filters.selectedRating}
          <button
            type="button"
            onClick={() => filters.setSelectedRating("Any")}
            className="text-amber-400 hover:text-amber-600"
            aria-label="Remove rating filter"
          >
            <X size={11} strokeWidth={3} />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={filters.handleClearAll}
        className="text-[0.78rem] font-medium text-slate-400 hover:text-red-500 ml-1 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
