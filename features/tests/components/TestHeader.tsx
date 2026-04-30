import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

interface TestHeaderProps {
  id: number;
  title: string;
  category: string;
}

export const TestHeader = ({ id, title, category }: TestHeaderProps) => {
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
        
        <Link 
          href={`/tests/${id}/take`}
          className="cursor-pointer shrink-0 flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3.5 rounded-xl font-semibold text-[0.95rem] shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all"
        >
          <Play size={18} fill="currentColor" />
          Start Test Now
        </Link>
      </div>
    </div>
  );
};