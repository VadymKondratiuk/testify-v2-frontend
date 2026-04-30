// src/components/catalog/ActiveFilterTags.tsx
import { X } from "lucide-react";

export default function ActiveFilterTags({ filters }: { filters: any }) {
  if (!filters.hasActiveFilters && !filters.searchQuery) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap min-h-[32px]">
      {filters.hasActiveFilters && <span className="text-[0.78rem] font-medium text-slate-400">Filters:</span>}
      
      {filters.selectedCategories.map((cat: string) => (
        <div key={cat} className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium">
          {cat} <button onClick={() => filters.setSelectedCategories((p: string[]) => p.filter(c => c !== cat))} className="text-indigo-400 hover:text-indigo-600"><X size={11} strokeWidth={3} /></button>
        </div>
      ))}

      {filters.selectedDifficulty !== "All Levels" && (
        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium">
          {filters.selectedDifficulty} <button onClick={() => filters.setSelectedDifficulty("All Levels")} className="text-orange-400 hover:text-orange-600"><X size={11} strokeWidth={3} /></button>
        </div>
      )}

      {filters.selectedDurations.map((dur: string) => (
        <div key={dur} className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium">
          {dur} <button onClick={() => filters.setSelectedDurations((p: string[]) => p.filter(d => d !== dur))} className="text-emerald-400 hover:text-emerald-600"><X size={11} strokeWidth={3} /></button>
        </div>
      ))}

      {filters.selectedQuestionRanges.map((q: string) => (
        <div key={q} className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium">
          {q} <button onClick={() => filters.setSelectedQuestionRanges((p: string[]) => p.filter(item => item !== q))} className="text-blue-400 hover:text-blue-600"><X size={11} strokeWidth={3} /></button>
        </div>
      ))}

      {filters.selectedRating !== "Any" && (
        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[0.76rem] font-medium">
          {filters.selectedRating} <button onClick={() => filters.setSelectedRating("Any")} className="text-amber-400 hover:text-amber-600"><X size={11} strokeWidth={3} /></button>
        </div>
      )}

      <button onClick={filters.handleClearAll} className="text-[0.78rem] font-medium text-slate-400 hover:text-red-500 ml-1 transition-colors">Clear all</button>
    </div>
  );
}