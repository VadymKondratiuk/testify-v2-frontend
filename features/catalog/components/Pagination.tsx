"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
  resultsPerPage?: number;
}

export default function Pagination({
  currentPage: initialPage = 1,
  totalPages = 15,
  totalResults = 132,
  resultsPerPage = 9,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  // Логіка побудови сторінок залишається незмінною
  const getPageNumbers = (): (number | "…")[] => {
    const pages: (number | "…")[] = [1];
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Оновлені класи для сучасного UI
  const btnBase = "flex items-center justify-center h-9 px-3 rounded-lg text-[0.9rem] font-medium transition-colors cursor-pointer select-none";
  const btnNumber = "min-w-[36px] px-1 text-[#64748B] hover:bg-[#EEF2FF] hover:text-[#4F46E5]";
  const btnActive = "bg-[#4F46E5] text-white shadow-md shadow-indigo-500/20 hover:bg-[#4338CA] hover:text-white";
  const btnPrevNext = "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]";
  const btnDisabled = "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-[#64748B]";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[#E2E8F0]">
      
      <span className="text-[0.85rem] font-medium text-[#94A3B8] order-2 sm:order-1">
        Showing <span className="text-[#0F172A]">{startResult}–{endResult}</span> of <span className="text-[#0F172A]">{totalResults}</span> tests
      </span>

      <nav
        className="flex items-center gap-1 order-1 sm:order-2"
        role="navigation"
        aria-label="Pagination"
      >
        {/* Prev */}
        <button
          className={`${btnBase} ${btnPrevNext} ${currentPage === 1 ? btnDisabled : ""}`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} className="mr-1" />
          Prev
        </button>

        {/* Page numbers */}
        <div className="flex items-center mx-2 gap-1">
          {pageNumbers.map((page, idx) =>
            page === "…" ? (
              <div
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center w-9 h-9 text-[#94A3B8]"
                aria-hidden="true"
              >
                <MoreHorizontal size={16} />
              </div>
            ) : (
              <button
                key={page}
                className={`${btnBase} ${btnNumber} ${currentPage === page ? btnActive : ""}`}
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          className={`${btnBase} ${btnPrevNext} ${currentPage === totalPages ? btnDisabled : ""}`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          aria-label="Next page"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </nav>
      
    </div>
  );
}