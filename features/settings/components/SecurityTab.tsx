// src/components/settings/SecurityTab.tsx
"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { InputGroup, SaveButton } from "./SharedUI";
import { getSettingsErrorMessage, updateSettingsPassword } from "@/features/settings/settings.api";

interface SecurityTabProps {
  userId: string;
}

export function SecurityTab({ userId }: SecurityTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setIsSaving(true);

    try {
      await updateSettingsPassword(userId, { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus("Password updated.");
    } catch (requestError) {
      setError(getSettingsErrorMessage(requestError, "Unable to update password."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck size={24} className="text-[#10B981]" />
        <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem]">
          Password & Security
        </h2>
      </div>

      <div className="flex flex-col gap-5 max-w-md">
        <InputGroup label="Current Password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" required />
        <InputGroup label="New Password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="New password" required />
        <InputGroup label="Confirm New Password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" required />
      </div>

      {(status || error) && (
        <p className={`mt-5 text-sm font-medium ${error ? "text-red-600" : "text-emerald-600"}`}>
          {error ?? status}
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <SaveButton disabled={isSaving} label={isSaving ? "Updating..." : "Update Password"} />
      </div>
    </form>
  );
}
