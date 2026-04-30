// src/components/history/HistoryHeader.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function HistoryHeader() {
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-5 md:px-8 lg:px-12 py-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/profile"
          className="w-fit flex items-center gap-2 text-[#64748B] hover:text-[#4F46E5] text-[0.85rem] font-medium transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Link>
        <h1 className="font-[family-name:var(--font-sora)] text-[1.8rem] font-bold text-[#0F172A] tracking-[-0.03em]">
          Test History
        </h1>
        <p className="text-[#64748B] text-[0.95rem] mt-1">
          Review your past performance and analyze your mistakes.
        </p>
      </div>
    </div>
  );
}