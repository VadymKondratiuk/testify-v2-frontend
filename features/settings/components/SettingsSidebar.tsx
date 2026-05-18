// src/components/settings/SettingsSidebar.tsx
"use client";

import { useRouter } from "next/navigation";
import { User, Lock, LogOut } from "lucide-react";
import { AuthService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { SettingsTabType } from "@/features/settings/settings.types";

interface SettingsSidebarProps {
  activeTab: SettingsTabType;
  setActiveTab: (tab: SettingsTabType) => void;
}

export function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    await AuthService.logout();
    clearAuth();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="md:col-span-1 flex flex-col gap-2">
      <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={User} label="Public Profile" />
      <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={Lock} label="Security & Password" />
      
      <div className="h-px bg-[#E2E8F0] my-4" />
      
      <button
        type="button"
        onClick={handleLogout}
        className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl text-[#EF4444] font-medium text-[0.9rem] hover:bg-red-50 transition-colors w-full text-left"
      >
        <LogOut size={18} />
        Log Out
      </button>
    </div>
  );
}

// Мікро-компонент тільки для цього сайдбару
function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[0.95rem] transition-colors w-full text-left
        ${active ? "bg-[#EEF2FF] text-[#4F46E5]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}
    >
      <Icon size={18} className={active ? "text-[#4F46E5]" : "text-[#94A3B8]"} />
      {label}
    </button>
  );
}
