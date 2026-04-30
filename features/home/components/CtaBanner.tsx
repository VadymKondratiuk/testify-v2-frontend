import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";

export default function CtaBanner() {
  return (
    <div
      aria-label="Call to action"
      className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12 px-5 md:px-8 lg:px-12 py-16 lg:py-20
        bg-[radial-gradient(ellipse_at_90%_50%,rgba(245,158,11,0.12)_0%,transparent_55%),linear-gradient(135deg,#4F46E5_0%,#3730A3_100%)]"
    >
      {/* Decorative rings */}
      <div className="pointer-events-none absolute w-120 h-120 rounded-full border border-[rgba(255,255,255,0.06)] -top-50 -right-30" />
      <div className="pointer-events-none absolute w-55 h-55 rounded-full border border-[rgba(245,158,11,0.18)] -bottom-22.5 left-65" />

      {/* Text */}
      <div className="relative z-10">
        <h2 className="font-(family-name:--font-sora) text-[2rem] font-extrabold text-white tracking-[-0.04em] leading-[1.12]">
          Ready to challenge yourself?
        </h2>
        <p className="text-[rgba(255,255,255,0.82)] text-[0.97rem] leading-[1.65] mt-3">
          Take the first step towards mastery. Join thousands of learners already using Testify to validate and expand their skills.
        </p>
      </div>

      {/* Actions */}
      <div className="relative z-10 flex flex-wrap gap-3">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#0C1A35] font-(family-name:--font-sora) font-bold text-[1rem] px-8 py-3.5 rounded-[10px] border border-[#F59E0B] hover:border-[#D97706]
            shadow-[0_4px_16px_rgba(245,158,11,0.44)] hover:shadow-[0_8px_24px_rgba(245,158,11,0.52)]
            hover:-translate-y-0.5 transition-all duration-[0.22s] ease-in-out whitespace-nowrap"
        >
          Get Started Free
          <ArrowRight size={18} strokeWidth={2.5} />
        </Link>

        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-transparent hover:bg-[rgba(255,255,255,0.12)] text-white font-(family-name:--font-sora) font-semibold text-[1rem] px-8 py-3.5 rounded-[10px]
            border border-[rgba(255,255,255,0.35)] hover:border-[rgba(255,255,255,0.65)]
            transition-all duration-[0.22s] ease-in-out whitespace-nowrap"
        >
          <LayoutGrid size={18} strokeWidth={1.8} />
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}