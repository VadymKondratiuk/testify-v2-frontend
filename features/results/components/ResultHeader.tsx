import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { formatDate } from "../result.utils";

interface ResultHeaderProps {
  testId: string;
  title: string;
  passed: boolean;
  attemptId: string;
  submittedAt: string;
}

export const ResultHeader = ({ testId, title, passed, attemptId, submittedAt }: ResultHeaderProps) => {
  return (
    <section className="border-b border-[#E2E8F0] bg-white px-5 py-6 shadow-sm md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <Link
          href={`/tests/${testId}`}
          className="flex w-fit items-center gap-2 text-[0.9rem] font-semibold text-[#64748B] transition-colors hover:text-[#4F46E5]"
        >
          <ArrowLeft size={18} />
          Back to test
        </Link>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-lg px-3 py-1 text-[0.8rem] font-bold ${passed ? "bg-[#D1FAE5] text-[#047857]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}>
                {passed ? "Passed" : "Needs review"}
              </span>
              <span className="rounded-lg bg-[#EEF2FF] px-3 py-1 text-[0.8rem] font-bold text-[#4F46E5]">
                Attempt #{attemptId.split("-").at(-1)}
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-[2rem] font-bold leading-tight text-[#0F172A] md:text-[2.5rem]">
              {title} Results
            </h1>
            <p className="mt-2 max-w-2xl text-[1rem] leading-relaxed text-[#64748B]">
              Submitted on {formatDate(submittedAt)}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/tests/${testId}/take`}
              className="flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-[0.92rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#4338CA]"
            >
              <RotateCcw size={18} />
              Retake
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};