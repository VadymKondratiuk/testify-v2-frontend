// src/components/profile/StatCard.tsx
import { StatData } from "@/features/profile/profile.types";

interface StatCardProps {
  stat: StatData;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col items-start gap-3">
      <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
        <Icon size={18} className={stat.color} />
      </div>
      <div>
        <div className="text-[1.5rem] font-bold text-[#0F172A] leading-none mb-1">{stat.value}</div>
        <div className="text-[0.8rem] text-[#64748B] font-medium">{stat.label}</div>
      </div>
    </div>
  );
}