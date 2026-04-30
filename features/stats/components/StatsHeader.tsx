// src/components/creator-studio/stats/StatsHeader.tsx
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

interface StatsHeaderProps {
  testTitle: string;
}

export function StatsHeader({ testTitle }: StatsHeaderProps) {
  return (
    <div className="sticky top-[72px] z-30 bg-white border-b border-[#E2E8F0] px-5 md:px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/creator-studio" className="cursor-pointer text-[#64748B] hover:text-[#0F172A] transition-colors p-2 hover:bg-[#F1F5F9] rounded-full">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-sora)] text-[1.2rem] font-bold text-[#0F172A]">
            {testTitle}
          </h1>
          <p className="text-[0.8rem] text-[#64748B] mt-0.5">Statistics & Analytics</p>
        </div>
      </div>

      <button className="cursor-pointer flex items-center gap-2 px-4 py-2 text-[0.9rem] font-medium text-[#334155] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl transition-colors shadow-sm">
        <Download size={16} />
        Export CSV
      </button>
    </div>
  );
}