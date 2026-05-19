import { Search, SlidersHorizontal } from "lucide-react";
import { ROLES } from "@/features/auth/auth.rbac";
import type {
  AdminTab,
  CategoryUsageFilter,
  TestStatusFilter,
  UserRoleFilter,
} from "@/features/admin/admin-ui.types";

interface AdminFiltersProps {
  activeTab: AdminTab;
  searchQuery: string;
  userRoleFilter: UserRoleFilter;
  testStatusFilter: TestStatusFilter;
  categoryUsageFilter: CategoryUsageFilter;
  onSearchChange: (value: string) => void;
  onResetFilters: () => void;
  onUserRoleFilterChange: (value: UserRoleFilter) => void;
  onTestStatusFilterChange: (value: TestStatusFilter) => void;
  onCategoryUsageFilterChange: (value: CategoryUsageFilter) => void;
}

export function AdminFilters({
  activeTab,
  searchQuery,
  userRoleFilter,
  testStatusFilter,
  categoryUsageFilter,
  onSearchChange,
  onResetFilters,
  onUserRoleFilterChange,
  onTestStatusFilterChange,
  onCategoryUsageFilterChange,
}: AdminFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">Filters</p>
        <p className="mt-1 text-sm font-medium text-[#64748B]">
          Narrow the current table without leaving the admin dashboard.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search the active tab"
            className="h-10 w-full rounded-lg border border-[#CBD5E1] bg-white pl-10 pr-3 text-[0.9rem] font-medium text-[#0F172A] outline-none transition-colors focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {activeTab === "users" && (
          <select
            value={userRoleFilter}
            onChange={(event) => onUserRoleFilterChange(event.target.value as UserRoleFilter)}
            className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-[#475569] outline-none focus:border-[#4F46E5]"
            aria-label="Filter users by role"
          >
            <option value="all">All roles</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        )}

        {activeTab === "tests" && (
          <select
            value={testStatusFilter}
            onChange={(event) => onTestStatusFilterChange(event.target.value as TestStatusFilter)}
            className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-[#475569] outline-none focus:border-[#4F46E5]"
            aria-label="Filter tests by status"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        )}

        {activeTab === "categories" && (
          <select
            value={categoryUsageFilter}
            onChange={(event) => onCategoryUsageFilterChange(event.target.value as CategoryUsageFilter)}
            className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-[#475569] outline-none focus:border-[#4F46E5]"
            aria-label="Filter categories by usage"
          >
            <option value="all">All categories</option>
            <option value="with-tests">With tests</option>
            <option value="empty">Empty categories</option>
          </select>
        )}

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-4 text-[0.9rem] font-semibold text-[#475569] transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4F46E5]"
        >
          <SlidersHorizontal size={17} />
          Reset
        </button>
      </div>
    </div>
  );
}
