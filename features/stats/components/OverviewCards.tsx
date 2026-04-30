// src/components/creator-studio/stats/OverviewCards.tsx
import { LucideIcon } from "lucide-react";

interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface OverviewCardsProps {
  data: StatItem[];
}

export function OverviewCards({ data }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex items-center gap-5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-[0.85rem] font-medium text-[#64748B]">{stat.title}</p>
            <p className="font-[family-name:var(--font-sora)] text-[1.5rem] font-bold text-[#0F172A] mt-1">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}