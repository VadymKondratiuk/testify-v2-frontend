import type { AdminTab, AdminTabItem } from "@/features/admin/admin-ui.types";

interface AdminTabsProps {
  activeTab: AdminTab;
  tabs: readonly AdminTabItem[];
  onTabChange: (tab: AdminTab) => void;
}

export function AdminTabs({ activeTab, tabs, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 p-2">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md px-4 text-[0.9rem] font-semibold transition-colors ${
              isActive
                ? "bg-white text-[#4F46E5] shadow-sm ring-1 ring-slate-200"
                : "text-[#64748B] hover:bg-white hover:text-[#0F172A]"
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
