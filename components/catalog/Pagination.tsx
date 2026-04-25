"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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

  // Build page numbers to display: always show 1, current area, and last
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

  const btnBase =
    "font-['DM_Sans',sans-serif] text-[0.82rem] font-medium px-3.5 py-2 rounded-md border-[1.5px] border-slate-200 bg-white text-slate-700 cursor-pointer leading-none transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 disabled:text-slate-400 disabled:cursor-default disabled:bg-slate-50 disabled:opacity-60 disabled:hover:border-slate-200";
  const btnActive =
    "bg-indigo-600 border-indigo-600 font-semibold shadow-[0_4px_16px_rgba(79,70,229,0.28)] hover:bg-indigo-600 hover:border-indigo-600 hover:text-white";

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mt-1">
      <nav
        className="flex items-center gap-1"
        role="navigation"
        aria-label="Pagination"
      >
        {/* Prev */}
        <button
          className={btnBase}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          aria-label="Previous page"
        >
          <span className="flex items-center gap-1">
            <ChevronLeft size={14} strokeWidth={2.5} />
            Prev
          </span>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, idx) =>
          page === "…" ? (
            <button
              key={`ellipsis-${idx}`}
              className={`${btnBase} cursor-default hover:bg-white hover:text-slate-700 hover:border-slate-200`}
              disabled
            >
              …
            </button>
          ) : (
            <button
              key={page}
              className={`${btnBase} ${currentPage === page ? btnActive : ""}`}
              onClick={() => setCurrentPage(page)}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          className={btnBase}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          aria-label="Next page"
        >
          <span className="flex items-center gap-1">
            Next
            <ChevronRight size={14} strokeWidth={2.5} />
          </span>
        </button>
      </nav>

      <span className="text-[0.78rem] font-medium text-slate-400">
        Showing {startResult}–{endResult} of {totalResults} tests
      </span>
    </div>
  );
}