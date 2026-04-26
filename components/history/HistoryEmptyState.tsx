// src/components/history/HistoryEmptyState.tsx
import { Filter } from "lucide-react";

export function HistoryEmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center flex flex-col items-center justify-center">
      <Filter size={40} className="text-[#CBD5E1] mb-4" />
      <h3 className="font-semibold text-[#0F172A] text-[1.1rem]">No tests found</h3>
      <p className="text-[#64748B] text-[0.9rem] mt-1">Try adjusting your filters or search query.</p>
    </div>
  );
}