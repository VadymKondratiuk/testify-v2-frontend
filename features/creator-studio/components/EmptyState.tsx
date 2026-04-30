// src/components/creator-studio/EmptyState.tsx
import { FileText } from "lucide-react";

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export function EmptyState({ hasSearchQuery }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#E2E8F0] p-16 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-[#EEF2FF] rounded-full flex items-center justify-center mb-4">
        <FileText size={28} className="text-[#4F46E5]" />
      </div>
      <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.2rem]">No tests found</h3>
      <p className="text-[#64748B] text-[0.95rem] mt-2 max-w-md">
        {hasSearchQuery 
          ? "Try adjusting your search query." 
          : "You haven't created any tests yet. Click the button above to build your first test."}
      </p>
    </div>
  );
}