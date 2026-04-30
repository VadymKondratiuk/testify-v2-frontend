// src/components/settings/ProfileTab.tsx
"use client";
import { useState } from "react";
import { User, Camera } from "lucide-react";
import { InputGroup, SaveButton } from "./SharedUI";

export function ProfileTab() {
  const [name, setName] = useState("Vadym");
  const [email, setEmail] = useState("vadym@example.com");
  const [role, setRole] = useState("Student / Developer");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem] mb-6">
        Profile Information
      </h2>
      
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group cursor-pointer">
          <div className="w-20 h-20 rounded-full bg-[#E0E7FF] border-2 border-[#E2E8F0] flex items-center justify-center overflow-hidden">
            <User size={32} className="text-[#4F46E5]" />
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={20} className="text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-[#0F172A] font-semibold text-[0.95rem]">Profile Picture</h3>
          <p className="text-[#64748B] text-[0.8rem] mt-0.5 mb-2">PNG, JPG up to 5MB.</p>
          <div className="flex gap-3">
            <button className="cursor-pointer px-3 py-1.5 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] text-[0.8rem] font-medium rounded-lg transition-colors">Upload</button>
            <button className="cursor-pointer px-3 py-1.5 text-[#EF4444] text-[0.8rem] font-medium hover:bg-red-50 rounded-lg transition-colors">Remove</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputGroup label="Full Name" value={name} onChange={(e: any) => setName(e.target.value)} />
        <InputGroup label="Email Address" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} disabled />
        <div className="sm:col-span-2">
          <InputGroup label="Headline / Role" value={role} onChange={(e: any) => setRole(e.target.value)} placeholder="e.g. Frontend Developer" />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <SaveButton />
      </div>
    </div>
  );
}