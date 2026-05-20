// src/components/creator-studio/TestCard.tsx
import Link from "next/link";
import { 
  MoreVertical, FileText, Users, Edit3, BarChart2, Trash2, CheckCircle2, Clock
} from "lucide-react";
import { TestStatus, TestSummary } from "@/features/creator-studio/creator-studio.types";

const statusLabels: Record<TestStatus, string> = {
  published: "Published",
  draft: "Unpublished",
};

const getStatusStyles = (status: TestStatus) => {
  switch (status) {
    case 'published': return 'bg-green-50 text-[#10B981]';
    case 'draft': return 'bg-[#FFFBEB] text-[#D97706]';
  }
};

const getStatusIcon = (status: TestStatus) => {
  switch (status) {
    case 'published': return <CheckCircle2 size={14} />;
    case 'draft': return <Clock size={14} />;
  }
};

interface TestCardProps {
  test: TestSummary;
  isDeleting?: boolean;
  onDelete: (test: TestSummary) => void;
}

export function TestCard({ test, isDeleting = false, onDelete }: TestCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] transition-all flex flex-col">
      {/* Card Header */}
      <div className="p-5 pb-0 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.75rem] font-bold uppercase tracking-wider ${getStatusStyles(test.status)}`}>
          {getStatusIcon(test.status)}
          {statusLabels[test.status]}
        </div>
        
        <button className="text-[#94A3B8] hover:text-[#0F172A] transition-colors p-1 rounded-md hover:bg-[#F1F5F9]">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1">
        <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.15rem] leading-tight mb-3 line-clamp-2">
          {test.title}
        </h3>
        
        <div className="flex flex-wrap gap-4 text-[#64748B] text-[0.85rem]">
          <div className="flex items-center gap-1.5">
            <FileText size={16} className="text-[#94A3B8]" />
            <span>{test.questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-[#94A3B8]" />
            <span>{test.completions} taken</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-[#F1F5F9] p-2 flex items-center justify-between bg-[#F8FAFC] rounded-b-2xl">
        <div className="flex items-center gap-1">
          <Link 
            href={`/creator-studio/${test.id}/edit`}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-[0.85rem] font-medium text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg transition-colors"
          >
            <Edit3 size={15} />
            Edit
          </Link>
          
          <Link 
            href={`/creator-studio/${test.id}/stats`}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-[0.85rem] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 rounded-lg transition-colors"
          >
            <BarChart2 size={15} />
            Stats
          </Link>
        </div>
        
        <button
          type="button"
          onClick={() => onDelete(test)}
          disabled={isDeleting}
          className="cursor-pointer p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          title="Remove test"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
