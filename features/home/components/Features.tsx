import { Zap, BookOpen, BarChart2, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Fast Results",
    desc: "Get your score instantly after every test session. Review correct answers and understand your mistakes right away to learn faster.",
    tag: "instant feedback",
  },
  {
    icon: BookOpen,
    title: "Wide Catalog",
    desc: "Browse hundreds of topics across all skill levels, from programming basics to advanced languages, or create your own custom tests.",
    tag: "1200+ tests",
  },
  {
    icon: BarChart2,
    title: "Progress Tracking",
    desc: "View your history, stats, and improvement over time. Our system tracks your weak points and recommends areas to focus on.",
    tag: "analytics",
  },
];

export default function Features() {
  return (
    <section
      aria-labelledby="features-title"
      className="bg-[#F5F7FF] px-5 md:px-8 lg:px-12 pb-20 lg:pb-22"
    >
      {/* Section header */}
      <div className="flex items-center gap-5 pt-16 lg:pt-20 pb-0">
        <h2
          id="features-title"
          className="font-(family-name:--font-sora) text-[1.8rem] font-bold text-[#0F172A] tracking-[-0.03em] whitespace-nowrap"
        >
          Key Features
        </h2>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {features.map(({ icon: Icon, title, desc, tag }) => (
          <article
            key={title}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-7 flex flex-col gap-4
              shadow-[0_1px_3px_rgba(15,26,53,0.09),0_1px_2px_rgba(15,26,53,0.06)]
              hover:shadow-[0_20px_25px_-5px_rgba(15,26,53,0.12),0_10px_10px_-5px_rgba(15,26,53,0.04)]
              hover:-translate-y-1.5 hover:border-[#E0E7FF]
              transition-all duration-[0.22s] ease-in-out"
          >
            {/* Icon */}
            <div className="w-14 h-14 shrink-0 rounded-[10px] bg-[#EEF2FF] flex items-center justify-center">
              <Icon size={26} className="text-[#4F46E5]" strokeWidth={1.8} />
            </div>

            {/* Title */}
            <h3 className="font-(family-name:--font-sora) text-[1.05rem] font-bold text-[#0F172A] tracking-[-0.02em]">
              {title}
            </h3>

            {/* Description */}
            <p className="text-[0.88rem] leading-[1.72] text-[#334155] flex-1">
              {desc}
            </p>

            {/* Tag pill */}
            <span className="inline-block w-fit bg-[#EEF2FF] text-[#4F46E5] px-3 py-1 rounded-full text-[0.72rem] font-semibold tracking-[0.04em] mt-auto">
              {tag}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}