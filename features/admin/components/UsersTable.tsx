import { Ban, UserCog } from "lucide-react";
import type { AdminUser } from "@/features/admin/admin.types";
import { ROLES, type Role } from "@/features/auth/auth.rbac";
import { ActionButton } from "./ActionButton";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";

interface UsersTableProps {
  users: AdminUser[];
  pendingAction: string | null;
  hasActiveFilters: boolean;
  onRoleChange: (userId: string, role: Role) => void;
}

export function UsersTable({ users, pendingAction, hasActiveFilters, onRoleChange }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        title={hasActiveFilters ? "No users match your filters" : "No users yet"}
        description={
          hasActiveFilters
            ? "Try changing the search query or role filter."
            : "Users will appear here after they register on the platform."
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead className="bg-white text-xs uppercase tracking-[0.08em] text-[#64748B]">
          <tr className="border-b border-slate-200">
            <th className="px-5 py-4 font-semibold">User</th>
            <th className="px-5 py-4 font-semibold">Role</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold">Tests</th>
            <th className="px-5 py-4 font-semibold">Attempts</th>
            <th className="px-5 py-4 font-semibold">Joined</th>
            <th className="px-5 py-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-slate-50">
              <td className="px-5 py-4">
                <div className="font-[family-name:var(--font-sora)] text-[0.95rem] font-bold leading-snug tracking-[-0.02em] text-[#0F172A]">
                  {user.name}
                </div>
                <div className="mt-1 text-sm font-medium text-[#64748B]">{user.email}</div>
              </td>
              <td className="px-5 py-4">
                <select
                  value={user.role}
                  disabled={pendingAction === `user-role-${user.id}`}
                  onChange={(event) => onRoleChange(user.id, event.target.value as Role)}
                  className="h-9 rounded-md border border-[#CBD5E1] bg-white px-2 text-sm font-semibold text-[#475569] outline-none transition-colors focus:border-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={`Change role for ${user.name}`}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-5 py-4 text-sm font-semibold text-[#475569]">{user.testsCreated}</td>
              <td className="px-5 py-4 text-sm font-semibold text-[#475569]">{user.attempts}</td>
              <td className="px-5 py-4 text-sm font-semibold text-[#64748B]">{user.joinedAt}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <ActionButton
                    icon={<UserCog size={16} />}
                    tone="primary"
                    title="Use the role dropdown in this row to update access."
                  >
                    Role
                  </ActionButton>
                  <ActionButton
                    icon={<Ban size={16} />}
                    title="User blocking requires backend account status support."
                    disabled
                  >
                    Block
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
