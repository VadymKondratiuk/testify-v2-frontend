import Link from 'next/link';
import { ArrowLeft, MapPinOff } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#F5F7FF] px-5 py-12">
      <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-sm border border-[#E2E8F0] flex flex-col items-center max-w-md text-center">
        
        {/* Іконка */}
        <div className="w-20 h-20 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-6 text-[#4F46E5]">
          <MapPinOff size={40} strokeWidth={1.5} />
        </div>
        
        {/* Текст */}
        <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold text-[#0F172A] mb-3 tracking-tight">
          Page Not Found
        </h2>
        
        <p className="text-[#64748B] text-[1.05rem] leading-relaxed mb-8">
          We couldn't find the page you're looking for. It might have been moved, deleted, or the URL is incorrect.
        </p>
        
        {/* Кнопка повернення */}
        <Link 
          href="/catalog"
          className="group flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3.5 rounded-xl font-semibold text-[0.95rem] shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all w-full"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Back to Catalog
        </Link>
        
      </div>
    </div>
  );
}