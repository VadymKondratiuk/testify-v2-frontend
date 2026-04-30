// src/components/catalog/filters/FilterControls.tsx
import React from "react";

export function FilterGroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Sora',sans-serif] text-[0.72rem] font-bold uppercase tracking-[0.09em] text-slate-700 pb-2.5 border-b border-slate-200">
      {children}
    </div>
  );
}

interface CheckboxOptionProps {
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: () => void;
}

export function CheckboxOption({ label, count, checked, onChange }: CheckboxOptionProps) {
  return (
    <label className="flex items-center gap-2.5 text-[0.85rem] text-slate-700 cursor-pointer px-2 py-1.25 rounded-md transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600 group">
      <div className="relative flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="appearance-none w-4 h-4 border-[1.5px] border-slate-300 rounded bg-white cursor-pointer transition-all duration-200 checked:bg-indigo-600 checked:border-indigo-600"
        />
        <svg
          className={`absolute pointer-events-none w-3 h-3 text-white transition-opacity duration-200 ${checked ? "opacity-100" : "opacity-0"}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-[0.72rem] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  );
}

interface RadioOptionProps {
  label: string;
  name: string;
  checked?: boolean;
  onChange?: () => void;
}

export function RadioOption({ label, name, checked, onChange }: RadioOptionProps) {
  return (
    <label className="flex items-center gap-2.5 text-[0.85rem] text-slate-700 cursor-pointer px-2 py-1.25 rounded-md transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="appearance-none w-4 h-4 shrink-0 border-[1.5px] border-slate-300 rounded-full bg-white cursor-pointer transition-all duration-200 checked:border-[5px] checked:border-indigo-600 relative"
      />
      <span className="flex-1">{label}</span>
    </label>
  );
}