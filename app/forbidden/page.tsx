import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-[#F5F7FF] px-5 py-12">
      <section className="flex w-full max-w-md flex-col items-center rounded-3xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEF2F2] text-[#EF4444]">
          <ShieldAlert size={34} strokeWidth={1.8} />
        </div>

        <h1 className="mb-3 font-[family-name:var(--font-sora)] text-2xl font-bold tracking-tight text-[#0F172A]">
          Access denied
        </h1>

        <p className="mb-8 text-[0.95rem] leading-relaxed text-[#64748B]">
          Your current role does not include permission to view this page.
        </p>

        <Link
          href="/catalog"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3 text-[0.95rem] font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#4338CA]"
        >
          <ArrowLeft size={18} />
          Back to Catalog
        </Link>
      </section>
    </main>
  );
}

