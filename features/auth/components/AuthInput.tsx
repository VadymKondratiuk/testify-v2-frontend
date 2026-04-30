"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface AuthInputProps {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: LucideIcon;
  forgotPasswordHref?: string;
}

export function AuthInput({ id, label, type, value, onChange, placeholder, icon: Icon, forgotPasswordHref }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[0.82rem] font-semibold text-[#334155] tracking-[0.01em]">
          {label}
        </label>
        {forgotPasswordHref && (
          <Link href={forgotPasswordHref} className="cursor-pointer text-[0.78rem] font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline underline-offset-2 transition-colors duration-[0.18s]">
            Forgot password?
          </Link>
        )}
      </div>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" strokeWidth={1.8} />
        <input
          id={id}
          type={currentType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-11 py-2.5 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-[0.9rem] placeholder:text-[#CBD5E1] hover:border-[#CBD5E1] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] focus:bg-white transition-all duration-[0.18s]"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors focus:outline-none focus:text-[#4F46E5]"
          >
            {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
          </button>
        )}
      </div>
    </div>
  );
}