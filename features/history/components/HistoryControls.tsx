// src/components/history/HistoryControls.tsx
import { Search } from "lucide-react";

interface HistoryControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: "all" | "passed" | "failed";
  setFilter: (filter: "all" | "passed" | "failed") => void;
}

export function HistoryControls({ searchQuery, setSearchQuery, filter, setFilter }: HistoryControlsProps) {
  const filterOptions = ["all", "passed", "failed"] as const;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search tests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 w-full sm:w-auto bg-white rounded-xl border border-[#E2E8F0]">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`cursor-pointer px-4 py-2.5 rounded-lg text-[0.85rem] font-medium capitalize transition-colors flex-1 sm:flex-none ${
              filter === f
                ? "bg-[#F5F7FF] text-[#4F46E5] shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}