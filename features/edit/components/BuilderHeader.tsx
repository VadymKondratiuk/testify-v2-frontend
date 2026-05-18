// src/components/creator-studio/BuilderHeader.tsx
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Cloud, Eye, Loader2 } from "lucide-react";

type SaveStatus = "saved" | "unsaved" | "saving" | "error";

interface BuilderHeaderProps {
  title: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveStatus: SaveStatus;
  saveMessage: string;
  isPublished: boolean;
  isPublishing: boolean;
  onTogglePublish: () => void;
}

const saveStatusStyles: Record<SaveStatus, string> = {
  saved: "text-[#64748B]",
  unsaved: "text-[#D97706]",
  saving: "text-[#4F46E5]",
  error: "text-[#EF4444]",
};

const saveStatusIcons: Record<SaveStatus, React.ReactNode> = {
  saved: <Cloud size={12} />,
  unsaved: <AlertCircle size={12} />,
  saving: <Loader2 size={12} className="animate-spin" />,
  error: <AlertCircle size={12} />,
};

export function BuilderHeader({
  title,
  onTitleChange,
  saveStatus,
  saveMessage,
  isPublished,
  isPublishing,
  onTogglePublish,
}: BuilderHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0] px-5 md:px-8 py-4 flex items-center justify-between shadow-sm">
{/* ДОДАНО: flex-1, щоб ліва частина зайняла весь вільний простір */}
      <div className="flex items-center gap-6 flex-1">
        
        <Link href="/creator-studio" className="cursor-pointer text-[#64748B] hover:text-[#0F172A] transition-colors p-2 hover:bg-[#F1F5F9] rounded-full shrink-0">
          <ArrowLeft size={20} />
        </Link>
        
        <div className="flex flex-col w-full max-w-[400px]">
          <input 
            type="text" 
            value={title}
            onChange={onTitleChange}
            className="font-[family-name:var(--font-sora)] text-[1.2rem] font-bold text-[#0F172A] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 rounded px-1 -ml-1 border border-transparent hover:border-[#E2E8F0] transition-colors w-full truncate"
          />
          <div className={`flex items-center gap-1.5 text-[0.75rem] mt-0.5 px-1 ${saveStatusStyles[saveStatus]}`}>
            {saveStatusIcons[saveStatus]}
            {saveMessage}
          </div>
        </div>

      </div>

      <div className="flex items-center gap-3">
        <button className="cursor-pointer flex items-center gap-2 px-4 py-2 text-[0.9rem] font-medium text-[#334155] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl transition-colors shadow-sm">
          <Eye size={16} />
          Preview
        </button>
        <button
          type="button"
          onClick={onTogglePublish}
          disabled={isPublishing}
          className="cursor-pointer flex items-center gap-2 px-5 py-2 text-[0.9rem] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-[#4F46E5]"
        >
          {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
          {isPublishing ? "Updating..." : isPublished ? "Unpublish Test" : "Publish Test"}
        </button>
      </div>
    </header>
  );
}
