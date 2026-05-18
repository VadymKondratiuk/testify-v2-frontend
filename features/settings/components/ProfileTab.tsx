// src/components/settings/ProfileTab.tsx
"use client";

import { useEffect, useState } from "react";
import { Camera, User } from "lucide-react";
import { InputGroup, SaveButton } from "./SharedUI";
import { getSettingsErrorMessage, updateSettingsProfile, type SettingsUser } from "@/features/settings/settings.api";

interface ProfileTabProps {
  user: SettingsUser;
  onUserUpdated: (user: SettingsUser) => void;
}

export function ProfileTab({ user, onUserUpdated }: ProfileTabProps) {
  const [name, setName] = useState(user.name ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user.name ?? "");
  }, [user.name]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    setIsSaving(true);

    try {
      const updatedUser = await updateSettingsProfile(user.id, {
        name: name.trim() || undefined,
      });

      onUserUpdated(updatedUser);
      setStatus("Profile settings saved.");
    } catch (requestError) {
      setError(getSettingsErrorMessage(requestError, "Unable to save profile settings."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            <button type="button" className="cursor-pointer px-3 py-1.5 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] text-[0.8rem] font-medium rounded-lg transition-colors">
              Upload
            </button>
            <button type="button" className="cursor-pointer px-3 py-1.5 text-[#EF4444] text-[0.8rem] font-medium hover:bg-red-50 rounded-lg transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputGroup label="Full Name" value={name} onChange={(event) => setName(event.target.value)} />
        <InputGroup label="Email Address" type="email" value={user.email} disabled />
        <div className="sm:col-span-2">
          <InputGroup label="Role" value={user.role} disabled />
        </div>
      </div>

      {(status || error) && (
        <p className={`mt-5 text-sm font-medium ${error ? "text-red-600" : "text-emerald-600"}`}>
          {error ?? status}
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <SaveButton disabled={isSaving} label={isSaving ? "Saving..." : "Save Changes"} />
      </div>
    </form>
  );
}
