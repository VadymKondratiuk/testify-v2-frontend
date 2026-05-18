// src/components/profile/RecentHistoryWidget.tsx
import Link from "next/link";
import { History, CheckCircle2, XCircle } from "lucide-react";
import { RecentTest } from "@/features/profile/profile.types";

interface RecentHistoryWidgetProps {
  history: RecentTest[];
}

export function RecentHistoryWidget({ history }: RecentHistoryWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.1rem] flex items-center gap-2">
          <History size={18} className="text-[#64748B]" />
          Recent Tests
        </h3>
        <Link href="/history" className="text-[0.8rem] text-[#4F46E5] hover:underline font-medium">
          View All
        </Link>
      </div>
      
      <div className="flex flex-col gap-4">
        {history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b border-[#F1F5F9] last:border-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3">
                {item.passed ? (
                  <CheckCircle2 size={18} className="shrink-0 text-[#10B981]" />
                ) : (
                  <XCircle size={18} className="shrink-0 text-[#EF4444]" />
                )}
                <div className="min-w-0">
                  <div className="truncate text-[0.9rem] font-semibold text-[#0F172A]">{item.title}</div>
                  <div className="text-[0.75rem] text-[#94A3B8]">{item.date}</div>
                </div>
              </div>
              <div className={`shrink-0 font-bold text-[0.9rem] ${item.passed ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {item.score}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-6 text-center text-[0.9rem] font-medium text-[#64748B]">
            No completed tests yet.
          </div>
        )}
      </div>
    </div>
  );
}
