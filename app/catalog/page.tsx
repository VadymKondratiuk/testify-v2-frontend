"use client";

import { LayoutGrid, List } from "lucide-react";
import SidebarFilters from "@/features/catalog/components/SidebarFilters";
import TestCard from "@/features/catalog/components/TestCard";
import Pagination from "@/features/catalog/components/Pagination";
import ActiveFilterTags from "@/features/catalog/components/ActiveFilterTags";

// 1. Імпортуємо дані та логіку (хук)
import { mockTestCards } from "@/features/catalog/catalog.mock";
import { useCatalogFilters } from "@/features/catalog/hooks/useCatalogFilters";

export default function DashboardPage() {
  // 2. Ініціалізуємо всю логіку одним рядком
  const filters = useCatalogFilters(mockTestCards);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FF] font-['DM_Sans',sans-serif] text-slate-900 antialiased">
      <div className="flex-1 flex items-stretch px-12 gap-0">
        
        {/* 3. Передаємо весь об'єкт хука в сайдбар */}
        <SidebarFilters 
          categories={filters.categoryOptions}
          {...filters} 
          onReset={filters.handleClearAll}
        />

        <main className="flex-1 flex flex-col gap-5 pt-7 pb-12 pl-8 min-w-0">
          
          {/* Тулбар */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white border border-slate-200 rounded-xl px-4.5 py-3 shadow-[0_1px_2px_rgba(15,26,53,0.05)]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-['Sora',sans-serif] text-[1rem] font-bold tracking-[-0.02em] text-slate-900">Browse Available Tests</span>
              <span className="text-[0.78rem] font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{filters.filteredTests.length} results</span>
            </div>

            <div className="flex items-center gap-2.5 text-[0.82rem]">
              <label htmlFor="sort" className="font-medium text-slate-700">Sort by:</label>
              <select 
                id="sort" value={filters.sortBy} onChange={(e) => filters.setSortBy(e.target.value)}
                className="border-[1.5px] border-slate-300 rounded-md bg-white py-1.5 pl-3 pr-8 cursor-pointer outline-none focus:border-indigo-600"
              >
                <option value="Most Popular">Most Popular</option>
                <option value="Newest First">Newest First</option>
                <option value="Highest Rated">Highest Rated</option>
                <option value="Shortest First">Shortest First</option>
                <option value="A → Z">A → Z</option>
              </select>

              <div className="flex border-[1.5px] border-slate-300 rounded-md overflow-hidden ml-2">
                <button onClick={() => filters.setViewMode("grid")} className={`p-2 transition-colors ${filters.viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-white text-slate-400"}`}><LayoutGrid size={15} /></button>
                <button onClick={() => filters.setViewMode("list")} className={`p-2 transition-colors ${filters.viewMode === "list" ? "bg-indigo-600 text-white" : "bg-white text-slate-400"}`}><List size={15} /></button>
              </div>
            </div>
          </div>

          {/* Теги активних фільтрів */}
          <ActiveFilterTags filters={filters} />

          {/* Зона карток */}
          <section aria-label="Test cards">
            {filters.filteredTests.length > 0 ? (
              <div className={filters.viewMode === "grid" ? "grid gap-5 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]" : "flex flex-col gap-4"}>
                {filters.filteredTests.map((card) => (
                  <TestCard key={card.id} card={card} viewMode={filters.viewMode} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-[1.1rem] font-medium">No tests found matching your criteria</p>
                <button onClick={filters.handleClearAll} className="mt-4 text-indigo-600 font-bold hover:underline cursor-pointer">Reset filters</button>
              </div>
            )}
          </section>

          {/* Пагінація */}
          {filters.filteredTests.length > 0 && <Pagination totalResults={filters.filteredTests.length} totalPages={1} resultsPerPage={9} />}
        </main>
      </div>
    </div>
  );
}