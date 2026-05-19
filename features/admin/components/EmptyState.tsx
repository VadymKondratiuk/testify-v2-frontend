import { Search } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center px-5 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
        <Search size={22} />
      </div>
      <h3 className="font-[family-name:var(--font-sora)] text-base font-bold text-[#0F172A]">{title}</h3>
      <p className="mt-2 max-w-md text-sm font-medium leading-6 text-[#64748B]">{description}</p>
    </div>
  );
}
