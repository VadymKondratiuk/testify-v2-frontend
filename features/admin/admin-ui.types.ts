import type { LucideIcon } from "lucide-react";
import type { AdminTest } from "./admin.types";
import type { Role } from "@/features/auth/auth.rbac";

export type AdminTab = "users" | "tests" | "categories";
export type UserRoleFilter = "all" | Role;
export type TestStatusFilter = "all" | AdminTest["status"];
export type CategoryUsageFilter = "all" | "with-tests" | "empty";

export interface ConfirmationState {
  title: string;
  body: string;
  confirmLabel: string;
  actionId: string;
  successMessage: string;
  onConfirm: () => Promise<void>;
}

export interface AdminTabItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
}
