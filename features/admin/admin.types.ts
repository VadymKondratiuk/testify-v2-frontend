import type { Role } from "@/features/auth/auth.rbac";

export type AdminUserStatus = "active" | "blocked";
export type AdminTestStatus = "published" | "unpublished" | "archived";
export type AdminCategoryStatus = "active" | "hidden";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AdminUserStatus;
  testsCreated: number;
  attempts: number;
  joinedAt: string;
}

export interface AdminTest {
  id: string;
  title: string;
  author: string;
  category: string;
  status: AdminTestStatus;
  questionsCount: number;
  completions: number;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  testsCount: number;
  status: AdminCategoryStatus;
  updatedAt: string;
}
