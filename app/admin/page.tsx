"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import { BadgeCheck, Ban, Boxes, FolderKanban, Users } from "lucide-react";
import {
  createAdminCategory,
  deleteAdminCategory,
  deleteAdminTest,
  getAdminDashboardData,
  updateAdminCategory,
  updateAdminTestPublication,
  updateAdminUserRole,
} from "@/features/admin/admin.api";
import type { AdminCategory, AdminTest, AdminUser } from "@/features/admin/admin.types";
import type {
  AdminTab,
  CategoryUsageFilter,
  ConfirmationState,
  TestStatusFilter,
  UserRoleFilter,
} from "@/features/admin/admin-ui.types";
import { AdminFilters } from "@/features/admin/components/AdminFilters";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { AdminTabs } from "@/features/admin/components/AdminTabs";
import { CategoriesTable } from "@/features/admin/components/CategoriesTable";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { StatCard } from "@/features/admin/components/StatCard";
import { TestsTable } from "@/features/admin/components/TestsTable";
import { UsersTable } from "@/features/admin/components/UsersTable";
import type { Role } from "@/features/auth/auth.rbac";

const tabs = [
  { id: "users", label: "User Management", icon: Users },
  { id: "tests", label: "Test Management", icon: FolderKanban },
  { id: "categories", label: "Category Management", icon: Boxes },
] as const;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<UserRoleFilter>("all");
  const [testStatusFilter, setTestStatusFilter] = useState<TestStatusFilter>("all");
  const [categoryUsageFilter, setCategoryUsageFilter] = useState<CategoryUsageFilter>("all");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tests, setTests] = useState<AdminTest[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAdminDashboardData();

        if (!isMounted) return;

        setUsers(data.users);
        setTests(data.tests);
        setCategories(data.categories);
      } catch (requestError) {
        if (!isMounted) return;

        const message =
          requestError instanceof AxiosError && requestError.response?.status === 403
            ? "Your account does not have permission to load admin data."
            : "Could not load admin dashboard data. Please try again.";

        setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(
    () => ({
      users: users.length,
      publishedTests: tests.filter((test) => test.status === "published").length,
      categories: categories.filter((category) => category.status === "active").length,
      blockedUsers: users.filter((user) => user.status === "blocked").length,
    }),
    [categories, tests, users],
  );

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const matchesSearch = [user.name, user.email, user.role].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    );
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;

    return matchesSearch && matchesRole;
  });
  const filteredTests = tests.filter((test) => {
    const matchesSearch = [test.title, test.author, test.category, test.status].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    );
    const matchesStatus = testStatusFilter === "all" || test.status === testStatusFilter;

    return matchesSearch && matchesStatus;
  });
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = [category.name, category.status].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    );
    const matchesUsage =
      categoryUsageFilter === "all" ||
      (categoryUsageFilter === "with-tests" && category.testsCount > 0) ||
      (categoryUsageFilter === "empty" && category.testsCount === 0);

    return matchesSearch && matchesUsage;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setUserRoleFilter("all");
    setTestStatusFilter("all");
    setCategoryUsageFilter("all");
  };

  const runAction = async (actionId: string, action: () => Promise<void>, successMessage: string) => {
    setPendingAction(actionId);
    setActionError(null);
    setActionMessage(null);

    try {
      await action();
      setActionMessage(successMessage);
    } catch (requestError) {
      const message =
        requestError instanceof AxiosError &&
        requestError.response?.data &&
        typeof requestError.response.data === "object" &&
        "message" in requestError.response.data &&
        typeof requestError.response.data.message === "string"
          ? requestError.response.data.message
          : "Action failed. Please try again.";

      setActionError(message);
    } finally {
      setPendingAction(null);
    }
  };

  const handleConfirmAction = () => {
    if (!confirmation) return;

    const currentConfirmation = confirmation;

    void runAction(
      currentConfirmation.actionId,
      async () => {
        await currentConfirmation.onConfirm();
        setConfirmation(null);
      },
      currentConfirmation.successMessage,
    );
  };

  const handleRoleChange = (userId: string, role: Role) => {
    void runAction(
      `user-role-${userId}`,
      async () => {
        const updatedUser = await updateAdminUserRole(userId, role);
        setUsers((currentUsers) => currentUsers.map((user) => (user.id === userId ? updatedUser : user)));
      },
      "User role updated.",
    );
  };

  const handleToggleTestPublication = (test: AdminTest) => {
    const nextIsPublished = test.status !== "published";

    void runAction(
      `test-publish-${test.id}`,
      async () => {
        const updatedTest = await updateAdminTestPublication(test.id, nextIsPublished);
        setTests((currentTests) => currentTests.map((item) => (item.id === test.id ? updatedTest : item)));
      },
      nextIsPublished ? "Test published." : "Test unpublished.",
    );
  };

  const handleDeleteTest = (test: AdminTest) => {
    setConfirmation({
      title: "Delete test?",
      body: `"${test.title}" will be permanently removed. Tests with completed attempts may be protected by the server.`,
      confirmLabel: "Delete Test",
      actionId: `test-delete-${test.id}`,
      successMessage: "Test deleted.",
      onConfirm: async () => {
        await deleteAdminTest(test.id);
        setTests((currentTests) => currentTests.filter((item) => item.id !== test.id));
      },
    });
  };

  const handleCreateCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) return;

    void runAction(
      "category-create",
      async () => {
        const category = await createAdminCategory(trimmedName);
        setCategories((currentCategories) => [...currentCategories, category].sort((a, b) => a.name.localeCompare(b.name)));
        setNewCategoryName("");
      },
      "Category created.",
    );
  };

  const startEditingCategory = (category: AdminCategory) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleUpdateCategory = (categoryId: string) => {
    const trimmedName = editingCategoryName.trim();

    if (!trimmedName) return;

    void runAction(
      `category-update-${categoryId}`,
      async () => {
        const updatedCategory = await updateAdminCategory(categoryId, trimmedName);
        setCategories((currentCategories) =>
          currentCategories.map((category) => (category.id === categoryId ? updatedCategory : category)),
        );
        setEditingCategoryId(null);
        setEditingCategoryName("");
      },
      "Category updated.",
    );
  };

  const handleDeleteCategory = (category: AdminCategory) => {
    setConfirmation({
      title: "Delete category?",
      body: `"${category.name}" will be removed if it has no tests. Categories with tests cannot be deleted.`,
      confirmLabel: "Delete Category",
      actionId: `category-delete-${category.id}`,
      successMessage: "Category deleted.",
      onConfirm: async () => {
        await deleteAdminCategory(category.id);
        setCategories((currentCategories) => currentCategories.filter((item) => item.id !== category.id));
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#F5F7FF] px-5 py-8 font-['DM_Sans',sans-serif] text-[#0F172A] antialiased md:px-8 lg:px-12">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <AdminHeader />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Users" value={String(summary.users)} tone="bg-indigo-50 text-indigo-600" />
          <StatCard icon={BadgeCheck} label="Published tests" value={String(summary.publishedTests)} tone="bg-emerald-50 text-emerald-600" />
          <StatCard icon={Boxes} label="Active categories" value={String(summary.categories)} tone="bg-sky-50 text-sky-600" />
          <StatCard icon={Ban} label="Blocked users" value={String(summary.blockedUsers)} tone="bg-red-50 text-red-500" />
        </div>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <AdminTabs activeTab={activeTab} tabs={tabs} onTabChange={setActiveTab} />
          <AdminFilters
            activeTab={activeTab}
            searchQuery={searchQuery}
            userRoleFilter={userRoleFilter}
            testStatusFilter={testStatusFilter}
            categoryUsageFilter={categoryUsageFilter}
            onSearchChange={setSearchQuery}
            onResetFilters={resetFilters}
            onUserRoleFilterChange={setUserRoleFilter}
            onTestStatusFilterChange={setTestStatusFilter}
            onCategoryUsageFilterChange={setCategoryUsageFilter}
          />

          {error && <div className="border-b border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{error}</div>}
          {actionError && (
            <div className="border-b border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{actionError}</div>
          )}
          {actionMessage && (
            <div className="border-b border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
              {actionMessage}
            </div>
          )}

          {isLoading && (
            <div className="grid gap-3 p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-14 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && activeTab === "users" && (
            <UsersTable
              users={filteredUsers}
              pendingAction={pendingAction}
              hasActiveFilters={searchQuery.trim().length > 0 || userRoleFilter !== "all"}
              onRoleChange={handleRoleChange}
            />
          )}

          {!isLoading && activeTab === "tests" && (
            <TestsTable
              tests={filteredTests}
              pendingAction={pendingAction}
              hasActiveFilters={searchQuery.trim().length > 0 || testStatusFilter !== "all"}
              onTogglePublication={handleToggleTestPublication}
              onDelete={handleDeleteTest}
            />
          )}

          {!isLoading && activeTab === "categories" && (
            <CategoriesTable
              categories={filteredCategories}
              pendingAction={pendingAction}
              hasActiveFilters={searchQuery.trim().length > 0 || categoryUsageFilter !== "all"}
              newCategoryName={newCategoryName}
              editingCategoryId={editingCategoryId}
              editingCategoryName={editingCategoryName}
              onNewCategoryNameChange={setNewCategoryName}
              onCreateCategory={handleCreateCategory}
              onStartEditingCategory={startEditingCategory}
              onEditingCategoryNameChange={setEditingCategoryName}
              onUpdateCategory={handleUpdateCategory}
              onCancelEditingCategory={() => setEditingCategoryId(null)}
              onDeleteCategory={handleDeleteCategory}
            />
          )}
        </section>
      </section>

      {confirmation && (
        <ConfirmDialog
          confirmation={confirmation}
          pendingAction={pendingAction}
          onCancel={() => setConfirmation(null)}
          onConfirm={handleConfirmAction}
        />
      )}
    </main>
  );
}
