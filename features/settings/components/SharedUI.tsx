// src/components/settings/SharedUI.tsx
import { Save } from "lucide-react";

export function InputGroup({ label, type = "text", value, onChange, placeholder, disabled }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.82rem] font-semibold text-[#334155]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[#0F172A] text-[0.9rem] transition-all
          ${disabled ? "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed" : "bg-white hover:border-[#CBD5E1] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 focus:outline-none"}
        `}
      />
    </div>
  );
}

export function SaveButton({ label = "Save Changes" }) {
  return (
    <button className="cursor-pointer flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold px-6 py-2.5 rounded-[10px] shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all">
      <Save size={16} />
      {label}
    </button>
  );
}