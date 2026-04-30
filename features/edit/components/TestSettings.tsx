// src/components/creator-studio/TestSettings.tsx
import { TestData } from "@/features/edit/edit.types";
import { ChevronDown } from "lucide-react";

interface TestSettingsProps {
  data: TestData;
  onChange: (field: keyof TestData, value: any) => void;
}

export function TestSettings({ data, onChange }: TestSettingsProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 animate-in fade-in duration-300">
      <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem] mb-6">Test Settings</h2>
      
      <div className="flex flex-col gap-6">
        
        {/* НОВЕ ПОЛЕ: Категорія з кастомною іконкою */}
        <div>
          <label className="block text-[0.85rem] font-semibold text-[#334155] mb-2">Category</label>
          <div className="relative">
            <select 
              value={data.category}
              onChange={(e) => onChange("category", e.target.value)}
              className="appearance-none cursor-pointer w-full pl-4 pr-11 py-3 rounded-xl border border-[#E2E8F0] text-[#0F172A] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-colors"
            >
              <option value="" disabled>Select a category...</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Languages">Languages</option>
              <option value="Other">Other</option>
            </select>
            
            {/* Наша кастомна іконка */}
            <ChevronDown 
              size={18} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[0.85rem] font-semibold text-[#334155] mb-2">Description</label>
          <textarea 
            rows={4} 
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Briefly describe what this test is about..."
            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0F172A] font-medium placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[0.85rem] font-semibold text-[#334155] mb-2">Passing Score (%)</label>
            <input 
              type="number" 
              min="0"
              max="100"
              value={data.passingScore} 
              onChange={(e) => {
                let val = parseInt(e.target.value);
                if (isNaN(val)) val = 0;
                if (val > 100) val = 100;
                if (val < 0) val = 0;
                onChange("passingScore", val);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-colors" 
            />
            <p className="text-[0.75rem] text-[#64748B] mt-1.5">Students must score at least {data.passingScore}% to pass.</p>
          </div>

          <div>
            <label className="block text-[0.85rem] font-semibold text-[#334155] mb-2">Time Limit (Minutes)</label>
            <input 
              type="number" 
              min="1"
              max="300"
              value={data.timeLimit} 
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  onChange("timeLimit", '');
                  return;
                }
                let num = parseInt(val);
                if (isNaN(num)) num = 1;
                if (num < 1) num = 1;
                if (num > 300) num = 300;
                onChange("timeLimit", num);
              }}
              placeholder="No limit" 
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#0F172A] font-medium placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-colors" 
            />
            <p className="text-[0.75rem] text-[#64748B] mt-1.5">Leave empty for an untimed test.</p>
          </div>
        </div>
      </div>
    </div>
  );
}