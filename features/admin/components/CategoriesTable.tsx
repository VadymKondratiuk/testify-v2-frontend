import type { FormEvent } from "react";
import { Archive, MoreHorizontal } from "lucide-react";
import type { AdminCategory } from "@/features/admin/admin.types";
import { ActionButton } from "./ActionButton";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";

interface CategoriesTableProps {
  categories: AdminCategory[];
  pendingAction: string | null;
  hasActiveFilters: boolean;
  newCategoryName: string;
  editingCategoryId: string | null;
  editingCategoryName: string;
  onNewCategoryNameChange: (value: string) => void;
  onCreateCategory: (event: FormEvent<HTMLFormElement>) => void;
  onStartEditingCategory: (category: AdminCategory) => void;
  onEditingCategoryNameChange: (value: string) => void;
  onUpdateCategory: (categoryId: string) => void;
  onCancelEditingCategory: () => void;
  onDeleteCategory: (category: AdminCategory) => void;
}

export function CategoriesTable({
  categories,
  pendingAction,
  hasActiveFilters,
  newCategoryName,
  editingCategoryId,
  editingCategoryName,
  onNewCategoryNameChange,
  onCreateCategory,
  onStartEditingCategory,
  onEditingCategoryNameChange,
  onUpdateCategory,
  onCancelEditingCategory,
  onDeleteCategory,
}: CategoriesTableProps) {
  return (
    <div>
      <form onSubmit={onCreateCategory} className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row">
        <input
          value={newCategoryName}
          onChange={(event) => onNewCategoryNameChange(event.target.value)}
          placeholder="New category name"
          className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium outline-none transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
        <button
          type="submit"
          disabled={pendingAction === "category-create" || !newCategoryName.trim()}
          className="h-11 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Category
        </button>
      </form>

      {categories.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No categories match your filters" : "No categories yet"}
          description={hasActiveFilters ? "Try changing the search query or usage filter." : "Create the first category using the form above."}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="bg-white text-xs uppercase tracking-[0.08em] text-[#64748B]">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Tests</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Updated</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-4">
                    {editingCategoryId === category.id ? (
                      <input
                        value={editingCategoryName}
                        onChange={(event) => onEditingCategoryNameChange(event.target.value)}
                        className="h-9 w-full rounded-md border border-[#CBD5E1] bg-white px-2 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#4F46E5]"
                        aria-label={`Edit ${category.name}`}
                      />
                    ) : (
                      <span className="font-[family-name:var(--font-sora)] text-[0.95rem] font-bold leading-snug tracking-[-0.02em] text-[#0F172A]">
                        {category.name}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#475569]">{category.testsCount}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={category.status} />
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#64748B]">{category.updatedAt}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {editingCategoryId === category.id ? (
                        <>
                          <button
                            type="button"
                            disabled={pendingAction === `category-update-${category.id}`}
                            onClick={() => onUpdateCategory(category.id)}
                            className="rounded-md px-3 py-2 text-sm font-semibold text-[#4F46E5] hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={onCancelEditingCategory}
                            className="rounded-md px-3 py-2 text-sm font-semibold text-[#64748B] hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <ActionButton
                            icon={<MoreHorizontal size={16} />}
                            tone="primary"
                            onClick={() => onStartEditingCategory(category)}
                            title="Rename this category."
                          >
                            Edit
                          </ActionButton>
                          <ActionButton
                            icon={<Archive size={16} />}
                            tone="danger"
                            disabled={pendingAction === `category-delete-${category.id}`}
                            onClick={() => onDeleteCategory(category)}
                            title="Delete this category if it has no tests."
                          >
                            Delete
                          </ActionButton>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
