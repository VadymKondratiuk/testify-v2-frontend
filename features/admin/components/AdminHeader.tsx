import { ShieldCheck } from "lucide-react";

export function AdminHeader() {
  return (
    <div>
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#4F46E5]">
          <ShieldCheck size={15} />
          ADMIN
        </div>
        <h1 className="font-[family-name:var(--font-sora)] text-[1.8rem] font-bold tracking-[-0.03em] text-[#0F172A]">
          Admin Dashboard
        </h1>
        <p className="mt-1 max-w-2xl text-[0.95rem] leading-7 text-[#64748B]">
          One place to manage platform users, tests, and categories.
        </p>
      </div>
    </div>
  );
}
