import { Lightbulb } from "lucide-react";

interface ResultInsightsProps {
  improvements: string[];
  recommendation?: string;
}

export const ResultInsights = ({
  improvements,
  recommendation,
}: ResultInsightsProps) => {
  const hasDetectedFocusAreas = improvements.length > 0;
  const focusAreas = hasDetectedFocusAreas
    ? improvements
    : ["Knowledge retention", "Next-level practice"];

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-6 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2 text-[#4F46E5]">
          <Lightbulb size={20} />
          <h2 className="font-[family-name:var(--font-sora)] text-[1.1rem] font-bold">
            Study recommendation
          </h2>
        </div>
        <p className="text-[0.95rem] leading-relaxed text-[#3730A3]">
          {recommendation ||
            "You are solid on core syntax and array behavior. The biggest score gain is likely from revisiting async execution order: microtasks, macrotasks, and Promise aggregation methods."}
        </p>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="font-[family-name:var(--font-sora)] text-[1.05rem] font-bold text-[#0F172A]">
          Focus Areas
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {focusAreas.map((item) => (
            <span
              key={item}
              className={
                hasDetectedFocusAreas
                  ? "rounded-lg bg-[#FEF2F2] px-3 py-1.5 text-[0.82rem] font-semibold text-[#B91C1C]"
                  : "rounded-lg bg-[#EEF2FF] px-3 py-1.5 text-[0.82rem] font-semibold text-[#3730A3]"
              }
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
