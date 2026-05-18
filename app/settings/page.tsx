// src/app/settings/page.tsx
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import { SettingsTabType } from "@/features/settings/settings.types";
import { SettingsHeader } from "@/features/settings/components/SettingsHeader";
import { SettingsSidebar } from "@/features/settings/components/SettingsSidebar";
import { ProfileTab } from "@/features/settings/components/ProfileTab";
import { SecurityTab } from "@/features/settings/components/SecurityTab";
import { getSettingsErrorMessage, getSettingsUser, type SettingsUser } from "@/features/settings/settings.api";

function getLoadErrorMessage(error: unknown) {
  return getSettingsErrorMessage(error, "Unable to load account settings.");
}

export default function SettingsPage() {
  const currentUser = useAuthStore((state) => state.user);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const setUser = useAuthStore((state) => state.setUser);
  const [activeTab, setActiveTab] = useState<SettingsTabType>("profile");
  const [settingsUser, setSettingsUser] = useState<SettingsUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthReady) return;

    if (!currentUser?.id) {
      setSettingsUser(null);
      setIsLoading(false);
      setLoadError("You need to be logged in to manage settings.");
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    getSettingsUser(currentUser.id)
      .then((user) => {
        if (!isMounted) return;

        setSettingsUser(user);
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      })
      .catch((error) => {
        if (!isMounted || axios.isCancel(error)) return;
        setLoadError(getLoadErrorMessage(error));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, isAuthReady, setUser]);

  const handleUserUpdated = (user: SettingsUser) => {
    setSettingsUser(user);
    setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      <SettingsHeader />

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10">
            {isLoading && <div className="text-[#64748B] font-medium">Loading settings...</div>}

            {!isLoading && loadError && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {loadError}
              </div>
            )}

            {!isLoading && !loadError && settingsUser && (
              <>
                {activeTab === "profile" && <ProfileTab user={settingsUser} onUserUpdated={handleUserUpdated} />}
                {activeTab === "security" && <SecurityTab userId={settingsUser.id} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
