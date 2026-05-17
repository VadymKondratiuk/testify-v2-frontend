"use client";

import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TestHeaderProps {
  id: string;
  title: string;
  category: string;
}

export const TestHeader = ({ id, title, category }: TestHeaderProps) => {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-[#E2E8F0] px-5 md:px-8 lg:px-12 py-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link 
            href="/catalog" 
            className="w-fit flex items-center gap-2 text-[#64748B] hover:text-[#4F46E5] text-[0.85rem] font-medium transition-colors mb-5"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>
          <div className="text-[0.75rem] font-bold text-indigo-600 uppercase tracking-widest mb-2">
            {category}
          </div>
          <h1 className="font-[family-name:var(--font-sora)] text-[1.8rem] md:text-[2.2rem] font-bold text-[#0F172A] tracking-[-0.03em] leading-tight">
            {title}
          </h1>
        </div>
        
        <button 
          onClick={() => router.replace(`/tests/${id}/take`)}
          className="group relative cursor-pointer shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white px-8 py-3.5 rounded-xl font-bold text-[1rem] shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_25px_rgba(79,70,229,0.45)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
          <Play size={18} fill="currentColor" className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
          <span className="relative z-10">Start Test Now</span>
        </button>
      </div>
    </div>
  );
};
