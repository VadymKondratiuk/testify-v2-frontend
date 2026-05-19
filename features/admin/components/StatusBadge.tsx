import type { AdminCategoryStatus, AdminTestStatus, AdminUserStatus } from "@/features/admin/admin.types";

type Status = AdminUserStatus | AdminTestStatus | AdminCategoryStatus;

const statusClassName: Record<Status, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  blocked: "bg-red-50 text-red-600 ring-red-100",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  unpublished: "bg-amber-50 text-amber-700 ring-amber-100",
  archived: "bg-slate-100 text-[#64748B] ring-slate-200",
  hidden: "bg-slate-100 text-[#64748B] ring-slate-200",
};

const statusLabel: Record<Status, string> = {
  active: "Active",
  blocked: "Blocked",
  published: "Published",
  unpublished: "Unpublished",
  archived: "Archived",
  hidden: "Hidden",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClassName[status]}`}>
      {statusLabel[status]}
    </span>
  );
}
