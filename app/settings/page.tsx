// src/app/settings/page.tsx
"use client";

import { useState } from "react";
import { SettingsTabType } from "@/types/settings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabType>("profile");

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      
      <SettingsHeader />

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "notifications" && <NotificationsTab />}
          </div>
        </div>
        
      </div>
    </div>
  );
}