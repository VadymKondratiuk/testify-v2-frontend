import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { SkillProgressItem } from "@/shared/types/test-result.types";

interface SkillProgressPanelProps {
  items: SkillProgressItem[];
}

function formatPercent(value: number) {
  const percentage = Math.max(0, Math.min(100, Math.round(value * 100)));

  return `${percentage}%`;
}

function formatDelta(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${Math.round(value * 100)}%`;
}

function getProgressStyle(result: SkillProgressItem["result"]) {
  switch (result) {
    case "improved":
      return {
        icon: TrendingUp,
        label: "Improved",
        badge: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
        iconClass: "text-[#10B981]",
      };
    case "declined":
      return {
        icon: TrendingDown,
        label: "Needs review",
        badge: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
        iconClass: "text-[#EF4444]",
      };
    case "stable":
    default:
      return {
        icon: Minus,
        label: "Stable",
        badge: "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
        iconClass: "text-[#64748B]",
      };
  }
}

export function SkillProgressPanel({ items }: SkillProgressPanelProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-[family-name:var(--font-sora)] text-[1.2rem] font-bold text-[#0F172A]">
            Skill Progress
          </h2>
          <p className="mt-1 text-[0.9rem] text-[#64748B]">
            Tag mastery changes captured from this test attempt.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.slice(0, 6).map((item) => {
          const style = getProgressStyle(item.result);
          const Icon = style.icon;

          return (
            <article
              key={item.tagId}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-[#0F172A]">
                    #{item.tag}
                  </h3>
                  <p className="mt-1 text-[0.78rem] font-medium text-[#64748B]">
                    {item.correctCountAfter} correct / {item.wrongCountAfter} wrong
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[0.72rem] font-bold ${style.badge}`}
                >
                  <Icon size={13} className={style.iconClass} />
                  {style.label}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-[0.8rem] font-semibold text-[#64748B]">
                  {formatPercent(item.masteryBefore)}
                </div>
                <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-full rounded-full bg-[#4F46E5]"
                    style={{ width: formatPercent(item.masteryAfter) }}
                  />
                </div>
                <div className="text-[0.8rem] font-bold text-[#0F172A]">
                  {formatPercent(item.masteryAfter)}
                </div>
              </div>

              <div className="mt-3 text-[0.78rem] font-semibold text-[#64748B]">
                Delta:{" "}
                <span
                  className={
                    item.masteryDelta > 0
                      ? "text-[#047857]"
                      : item.masteryDelta < 0
                        ? "text-[#B91C1C]"
                        : "text-[#475569]"
                  }
                >
                  {formatDelta(item.masteryDelta)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
