// src/components/settings/NotificationsTab.tsx
"use client";
import { useState } from "react";
import { SaveButton } from "./SharedUI";

export function NotificationsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem] mb-6">
        Email Notifications
      </h2>
      
      <div className="flex flex-col gap-4">
        <ToggleRow title="Smart Recommendations" desc="Get weekly emails with personalized topics to study based on your gaps." defaultChecked />
        <ToggleRow title="Test Results" desc="Receive an email immediately after completing a test." defaultChecked />
        <ToggleRow title="Platform Updates" desc="News about new features and catalog additions." />
      </div>

      <div className="mt-8 flex justify-end">
        <SaveButton label="Save Preferences" />
      </div>
    </div>
  );
}

// Мікро-компонент тільки для цієї вкладки
function ToggleRow({ title, desc, defaultChecked = false }: any) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0">
      <div className="pr-4">
        <h3 className="font-semibold text-[#0F172A] text-[0.95rem]">{title}</h3>
        <p className="text-[#64748B] text-[0.85rem] mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${checked ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}