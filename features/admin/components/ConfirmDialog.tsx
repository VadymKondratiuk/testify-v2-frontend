import { AlertTriangle, Trash2 } from "lucide-react";
import type { ConfirmationState } from "@/features/admin/admin-ui.types";

interface ConfirmDialogProps {
  confirmation: ConfirmationState;
  pendingAction: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ confirmation, pendingAction, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/40 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-confirmation-title"
    >
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h2
              id="admin-confirmation-title"
              className="font-[family-name:var(--font-sora)] text-lg font-bold tracking-[-0.03em] text-[#0F172A]"
            >
              {confirmation.title}
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">{confirmation.body}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={pendingAction === confirmation.actionId}
            onClick={onCancel}
            className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pendingAction === confirmation.actionId}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            {pendingAction === confirmation.actionId ? "Working..." : confirmation.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
