// src/components/settings/SecurityTab.tsx
import { ShieldCheck } from "lucide-react";
import { InputGroup, SaveButton } from "./SharedUI";

export function SecurityTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck size={24} className="text-[#10B981]" />
        <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem]">
          Password & Security
        </h2>
      </div>

      <div className="flex flex-col gap-5 max-w-md">
        <InputGroup label="Current Password" type="password" placeholder="••••••••" />
        <InputGroup label="New Password" type="password" placeholder="••••••••" />
        <InputGroup label="Confirm New Password" type="password" placeholder="••••••••" />
      </div>

      <div className="mt-8 flex justify-end">
        <SaveButton label="Update Password" />
      </div>
    </div>
  );
}