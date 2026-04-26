// src/components/profile/ProfileHeader.tsx
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-5 md:px-8 lg:px-12 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link 
            href="/catalog" 
            className="w-fit flex items-center gap-2 text-[#64748B] hover:text-[#4F46E5] text-[0.85rem] font-medium transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>
          <h1 className="font-[family-name:var(--font-sora)] text-[1.8rem] font-bold text-[#0F172A] tracking-[-0.03em]">
            Profile Overview
          </h1>
          <p className="text-[#64748B] text-[0.95rem] mt-1">
            Track your progress and discover your next learning steps.
          </p>
        </div>
        
        <Link 
          href="/catalog"
          className="cursor-pointer shrink-0 flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-3 rounded-xl font-semibold text-[0.95rem] shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all"
        >
          <Play size={16} fill="currentColor" />
          Take a New Test
        </Link>
      </div>
    </div>
  );
}