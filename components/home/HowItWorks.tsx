import { UserPlus, Search, PenLine, CheckCircle, ArrowRight } from "lucide-react";

interface Step {
  num: string;
  title: string;
  desc: string;
  isLast?: boolean;
}

const steps: Step[] = [
  {
    num: "01",
    title: "Create Account",
    desc: "Sign up in seconds to start building your personal learning profile and track your progress.",
  },
  {
    num: "02",
    title: "Choose a Topic",
    desc: "Browse our extensive catalog or use our smart search to find the perfect test for your goals.",
  },
  {
    num: "03",
    title: "Take the Test",
    desc: "Test your knowledge with interactive questions. Take your time or challenge yourself.",
  },
  {
    num: "04",
    title: "Get Recommendations",
    desc: "Receive instant scores, detailed error analysis, and smart recommendations on what to study next.",
    isLast: true,
  },
];

const stepIcons = [UserPlus, Search, PenLine, CheckCircle];

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-title"
      className="bg-white px-5 md:px-8 lg:px-12 pb-20 lg:pb-22"
    >
      {/* Section header */}
      <div className="flex items-center gap-5 pt-16 lg:pt-20">
        <h2
          id="how-title"
          className="font-(family-name:--font-sora) text-[1.8rem] font-bold text-[#0F172A] tracking-[-0.03em] whitespace-nowrap"
        >
          How It Works
        </h2>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {steps.map(({ num, title, desc, isLast }, i) => {
          const Icon = stepIcons[i];
          return (
            <div
              key={num}
              className="relative bg-[#F5F7FF] border border-[#E2E8F0] rounded-2xl p-6 pb-6
                hover:shadow-[0_4px_6px_-1px_rgba(15,26,53,0.10),0_2px_4px_-1px_rgba(15,26,53,0.06)]
                hover:-translate-y-0.5
                transition-all duration-[0.22s] ease-in-out"
            >
              {/* Step number badge */}
              <div className="inline-flex items-center justify-center w-9.5 h-9.5 rounded-md bg-[#4F46E5] shadow-[0_2px_8px_rgba(79,70,229,0.30)] mb-4">
                <span className="font-(family-name:--font-sora) text-[0.8rem] font-bold text-white">
                  {num}
                </span>
              </div>

              {/* Icon */}
              <div className="mb-3">
                <Icon size={20} className="text-[#4F46E5]" strokeWidth={1.8} />
              </div>

              <div className="font-(family-name:--font-sora) text-[0.95rem] font-bold text-[#0F172A] tracking-[-0.01em] mb-2">
                {title}
              </div>
              <p className="text-[0.82rem] leading-[1.65] text-[#334155]">
                {desc}
              </p>

              {/* Arrow connector — hidden on last step and on mobile */}
              {!isLast && (
                <div className="hidden lg:flex absolute -right-3 top-9.5 z-10 items-center justify-center w-6 h-6 rounded-full bg-white border border-[#E2E8F0]">
                  <ArrowRight size={12} className="text-[#CBD5E1]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}