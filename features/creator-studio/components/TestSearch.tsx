// src/components/creator-studio/TestSearch.tsx
import { Search } from "lucide-react";

interface TestSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TestSearch({ value, onChange }: TestSearchProps) {
  return (
    <div className="flex items-center mb-6">
      <div className="relative w-full sm:w-96">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input 
          type="text" 
          placeholder="Search my tests..." 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
        />
      </div>
    </div>
  );
}