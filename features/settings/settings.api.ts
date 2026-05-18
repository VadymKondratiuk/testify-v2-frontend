import axios from "axios";
import { api } from "@/shared/api/axios";
import type { AuthUser } from "@/features/auth/auth.service";

export type SettingsUser = AuthUser & {
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateProfilePayload = {
  name?: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export async function getSettingsUser(userId: string) {
  const response = await api.get<SettingsUser>(`/users/${userId}`);

  return response.data;
}

export async function updateSettingsProfile(userId: string, data: UpdateProfilePayload) {
  const response = await api.patch<SettingsUser>(`/users/${userId}`, data);

  return response.data;
}

export async function updateSettingsPassword(userId: string, data: UpdatePasswordPayload) {
  const response = await api.patch<SettingsUser>(`/users/${userId}/password`, data);

  return response.data;
}

export function getSettingsErrorMessage(error: unknown, fallback = "Unable to save settings.") {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    return Array.isArray(message) ? message.join(" ") : message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
