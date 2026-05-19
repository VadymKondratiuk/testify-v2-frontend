import { api } from "@/shared/api/axios";
import type { Role } from "@/features/auth/auth.rbac";
import type { AdminCategory, AdminTest, AdminUser } from "./admin.types";

interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  _count: {
    tests: number;
    attempts: number;
  };
}

interface BackendTest {
  id: string;
  title: string;
  isPublished: boolean;
  updatedAt: string;
  author?: {
    name?: string | null;
    email: string;
  } | null;
  category?: {
    name: string;
  } | null;
  _count: {
    questions: number;
    attempts: number;
  };
}

interface BackendCategory {
  id: string;
  name: string;
  updatedAt: string;
  _count: {
    tests: number;
  };
}

export interface AdminDashboardData {
  users: AdminUser[];
  tests: AdminTest[];
  categories: AdminCategory[];
}

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const mapUser = (user: BackendUser): AdminUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: "active",
  testsCreated: user._count.tests,
  attempts: user._count.attempts,
  joinedAt: formatDate(user.createdAt),
});

const mapTest = (test: BackendTest): AdminTest => ({
  id: test.id,
  title: test.title,
  author: test.author?.name || test.author?.email || "Unknown author",
  category: test.category?.name ?? "Uncategorized",
  status: test.isPublished ? "published" : "unpublished",
  questionsCount: test._count.questions,
  completions: test._count.attempts,
  updatedAt: formatDate(test.updatedAt),
});

const mapCategory = (category: BackendCategory): AdminCategory => ({
  id: category.id,
  name: category.name,
  testsCount: category._count.tests,
  status: "active",
  updatedAt: formatDate(category.updatedAt),
});

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [usersResponse, testsResponse, categoriesResponse] = await Promise.all([
    api.get<PaginatedResponse<BackendUser>>("/users", {
      params: { limit: 100, sortBy: "createdAt", sortOrder: "desc" },
    }),
    api.get<PaginatedResponse<BackendTest>>("/tests", {
      params: { limit: 100, sortBy: "updatedAt", sortOrder: "desc" },
    }),
    api.get<PaginatedResponse<BackendCategory>>("/categories", {
      params: { limit: 100, sortBy: "name", sortOrder: "asc" },
    }),
  ]);

  return {
    users: usersResponse.data.items.map(mapUser),
    tests: testsResponse.data.items.map(mapTest),
    categories: categoriesResponse.data.items.map(mapCategory),
  };
}

export async function updateAdminUserRole(userId: string, role: Role) {
  const response = await api.patch<BackendUser>(`/users/${userId}`, { role });

  return mapUser(response.data);
}

export async function updateAdminTestPublication(testId: string, isPublished: boolean) {
  const response = await api.patch<BackendTest>(`/tests/${testId}/publish`, { isPublished });

  return mapTest(response.data);
}

export async function deleteAdminTest(testId: string) {
  await api.delete(`/tests/${testId}`);
}

export async function createAdminCategory(name: string) {
  const response = await api.post<BackendCategory>("/categories", { name });

  return mapCategory(response.data);
}

export async function updateAdminCategory(categoryId: string, name: string) {
  const response = await api.patch<BackendCategory>(`/categories/${categoryId}`, { name });

  return mapCategory(response.data);
}

export async function deleteAdminCategory(categoryId: string) {
  await api.delete(`/categories/${categoryId}`);
}
