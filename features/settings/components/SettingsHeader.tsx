// src/components/settings/SettingsHeader.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SettingsHeader() {
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-5 md:px-8 lg:px-12 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <Link 
          href="/profile" 
          className="w-fit flex items-center gap-2 text-[#64748B] hover:text-[#4F46E5] text-[0.85rem] font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-sora)] text-[1.8rem] font-bold text-[#0F172A] tracking-[-0.03em]">
            Account Settings
          </h1>
          <p className="text-[#64748B] text-[0.95rem] mt-1">
            Manage your personal information and security preferences.
          </p>
        </div>
      </div>
    </div>
  );
}