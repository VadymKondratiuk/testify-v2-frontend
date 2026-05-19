import type { ReactNode } from "react";

type ActionButtonTone = "primary" | "danger" | "muted";

const toneClassName: Record<ActionButtonTone, string> = {
  primary: "text-[#4F46E5] hover:bg-indigo-50",
  danger: "text-red-600 hover:bg-red-50",
  muted: "text-[#64748B] hover:bg-slate-100",
};

interface ActionButtonProps {
  children: ReactNode;
  icon: ReactNode;
  className?: string;
  tone?: ActionButtonTone;
  disabled?: boolean;
  title?: string;
  onClick?: () => void;
}

export function ActionButton({
  children,
  icon,
  className = "",
  tone = "muted",
  disabled = false,
  title,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300 ${toneClassName[tone]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
