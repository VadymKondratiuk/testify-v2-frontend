import { Archive, Eye } from "lucide-react";
import type { AdminTest } from "@/features/admin/admin.types";
import { ActionButton } from "./ActionButton";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";

interface TestsTableProps {
  tests: AdminTest[];
  pendingAction: string | null;
  hasActiveFilters: boolean;
  onTogglePublication: (test: AdminTest) => void;
  onDelete: (test: AdminTest) => void;
}

export function TestsTable({
  tests,
  pendingAction,
  hasActiveFilters,
  onTogglePublication,
  onDelete,
}: TestsTableProps) {
  if (tests.length === 0) {
    return (
      <EmptyState
        title={hasActiveFilters ? "No tests match your filters" : "No tests yet"}
        description={hasActiveFilters ? "Try changing the search query or status filter." : "Tests created by teachers will appear here."}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-left">
        <thead className="bg-white text-xs uppercase tracking-[0.08em] text-[#64748B]">
          <tr className="border-b border-slate-200">
            <th className="px-5 py-4 font-semibold">Test</th>
            <th className="px-5 py-4 font-semibold">Author</th>
            <th className="px-5 py-4 font-semibold">Category</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold">Questions</th>
            <th className="px-5 py-4 font-semibold">Completions</th>
            <th className="px-5 py-4 font-semibold">Updated</th>
            <th className="px-5 py-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tests.map((test) => (
            <tr key={test.id} className="transition-colors hover:bg-slate-50">
              <td className="px-5 py-4">
                <div className="font-[family-name:var(--font-sora)] text-[0.95rem] font-bold leading-snug tracking-[-0.02em] text-[#0F172A]">
                  {test.title}
                </div>
              </td>
              <td className="px-5 py-4 text-sm font-semibold text-[#64748B]">{test.author}</td>
              <td className="px-5 py-4">
                <span className="inline-flex rounded-md bg-indigo-50 px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#4F46E5]">
                  {test.category}
                </span>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={test.status} />
              </td>
              <td className="px-5 py-4 text-sm font-semibold text-[#475569]">{test.questionsCount}</td>
              <td className="px-5 py-4 text-sm font-semibold text-[#475569]">{test.completions}</td>
              <td className="px-5 py-4 text-sm font-semibold text-[#64748B]">{test.updatedAt}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <ActionButton
                    icon={<Eye size={16} />}
                    tone="primary"
                    className="w-[112px]"
                    disabled={pendingAction === `test-publish-${test.id}`}
                    onClick={() => onTogglePublication(test)}
                    title={test.status === "published" ? "Hide this test from the catalog." : "Make this test visible in the catalog."}
                  >
                    {test.status === "published" ? "Unpublish" : "Publish"}
                  </ActionButton>
                  <ActionButton
                    icon={<Archive size={16} />}
                    tone="danger"
                    className="w-[86px]"
                    disabled={pendingAction === `test-delete-${test.id}`}
                    onClick={() => onDelete(test)}
                    title="Delete this test if the server allows it."
                  >
                    Delete
                  </ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
