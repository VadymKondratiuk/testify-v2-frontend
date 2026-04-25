import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative grid grid-cols-1 md:grid-cols-2 gap-14 items-center min-h-150 px-5 md:px-8 lg:px-12
        bg-[radial-gradient(ellipse_at_12%_55%,rgba(79,70,229,0.22)_0%,transparent_52%),radial-gradient(ellipse_at_88%_20%,rgba(245,158,11,0.10)_0%,transparent_45%),linear-gradient(145deg,#0C1A35_0%,#152A55_55%,#1D3461_100%)]"
    >
      {/* Text column */}
      <div className="flex flex-col gap-7 py-16 md:py-20">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 w-fit bg-[rgba(79,70,229,0.22)] border border-[rgba(79,70,229,0.38)] text-[#E0E7FF] px-4 py-1.5 rounded-full text-[0.73rem] font-semibold uppercase tracking-[0.09em]">
          <span className="inline-block w-1.75 h-1.75 rounded-full bg-[#F59E0B] animate-[blink_2.4s_ease-in-out_infinite]" />
          Knowledge Testing Platform
        </span>

        {/* Heading */}
        <h1 className="font-(family-name:--font-sora) text-[clamp(2.1rem,4vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-white">
          A platform to
          <br />
          test your knowledge
        </h1>

        {/* Sub-copy */}
        <p className="text-[rgba(255,255,255,0.82)] text-[1.02rem] leading-[1.75] max-w-112.5">
          Pass tests, analyze your results, and receive personalized learning recommendations. 
          Our smart algorithms identify your knowledge gaps and guide you to mastery. 
          Build skills. Track progress. Prove your expertise.
        </p>

        {/* CTA */}
        <div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#0C1A35] font-(family-name:--font-sora) font-bold text-[1rem] tracking-[-0.01em] px-9 py-3.75 rounded-[10px] shadow-[0_4px_16px_rgba(245,158,11,0.42)] hover:shadow-[0_8px_28px_rgba(245,158,11,0.52)] hover:-translate-y-0.5 transition-all duration-[0.22s] ease-in-out whitespace-nowrap"
          >
            Start Testing
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Illustration placeholder */}
      <div className="h-full min-h-100 py-12">
        <div className="h-full min-h-80 flex flex-col items-center justify-center rounded-3xl bg-[rgba(255,255,255,0.04)] border border-dashed border-[rgba(255,255,255,0.14)] relative overflow-hidden">
          {/* Decorative diagonal lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[200%] h-px bg-[rgba(255,255,255,0.07)] top-1/2 -left-1/2 rotate-18" />
            <div className="absolute w-[200%] h-px bg-[rgba(255,255,255,0.07)] top-1/2 -left-1/2 rotate-[-18deg]" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-[rgba(255,255,255,0.45)]">
            <Zap size={48} className="text-[rgba(79,70,229,0.5)]" />
            <span className="bg-[rgba(255,255,255,0.09)] text-[rgba(255,255,255,0.65)] px-3.5 py-1.5 border border-[rgba(255,255,255,0.18)] rounded-md text-[0.76rem] tracking-[0.4px] backdrop-blur-sm">
              Hero Illustration
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}