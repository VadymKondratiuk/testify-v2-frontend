import Link from "next/link";
import { Zap } from "lucide-react";

interface AuthContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthContainer({ title, subtitle, children, footerText, footerLinkText, footerLinkHref }: AuthContainerProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.07)_0%,transparent_70%)]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(to right, #4F46E5 1px, transparent 1px)`, backgroundSize: "64px 64px" }} />
        <div className="absolute top-[15%] right-[12%] w-14 h-14 rounded-2xl border border-[rgba(79,70,229,0.12)] rotate-12" />
        <div className="absolute bottom-[20%] right-[20%] w-10 h-10 rounded-2xl border border-[rgba(26,23,77,0.12)] rotate-6" />

        <div className="absolute top-[60%] left-[8%] w-8 h-8 rounded-2xl border border-[rgba(238,116,89,0.15)] -rotate-6" />

      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 translate-y-2 rounded-2xl bg-[rgba(79,70,229,0.06)] blur-xl" />
        <div className="relative bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_24px_rgba(15,26,53,0.08),0_1px_3px_rgba(15,26,53,0.06)] p-8 sm:p-10">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-[10px] bg-[#4F46E5] flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.35)]">
              <Zap size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-(family-name:--font-sora) font-bold text-[1.2rem] tracking-[-0.04em] text-[#0F172A]">
              Testify<span className="text-[#F59E0B]">.</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="font-(family-name:--font-sora) text-[1.8rem] font-bold text-[#0F172A] tracking-[-0.04em] leading-tight mb-1.5">
              {title}
            </h1>
            <p className="text-[0.88rem] text-[#64748B] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {children}

          {/* Footer link */}
          <p className="mt-6 text-center text-[0.84rem] text-[#64748B]">
            {footerText}{" "}
            <Link href={footerLinkHref} className="cursor-pointer font-semibold text-[#4F46E5] hover:text-[#4338CA] hover:underline underline-offset-2 transition-colors duration-[0.18s]">
              {footerLinkText}
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}