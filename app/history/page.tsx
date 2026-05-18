// src/app/history/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2 } from "lucide-react";
import { getMyCompletedHistory } from "@/features/history/history.api";
import type { HistoryItem } from "@/features/history/history.types";
import { HistoryHeader } from "@/features/history/components/HistoryHeader";
import { HistoryControls } from "@/features/history/components/HistoryControls";
import { HistoryCard } from "@/features/history/components/HistoryCard";
import { HistoryEmptyState } from "@/features/history/components/HistoryEmptyState";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    getMyCompletedHistory()
      .then((items) => {
        if (!ignore) {
          setHistory(items);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load history.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredHistory = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return history.filter((item) => {
      const matchesSearch =
        normalizedSearchQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedSearchQuery) ||
        item.category.toLowerCase().includes(normalizedSearchQuery);
      const matchesFilter = filter === "all" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [filter, history, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FF] px-5 text-[#0F172A]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[#4F46E5]" />
          <span className="font-semibold">Loading test history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] pb-20">
        <HistoryHeader />
        <div className="mx-auto mt-8 w-full max-w-md px-5">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#EF4444]">
              <AlertTriangle size={28} />
            </div>
            <h2 className="mb-3 font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0F172A]">
              History unavailable
            </h2>
            <p className="mb-6 text-[#64748B]">{error}</p>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-xl bg-[#4F46E5] px-6 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#4338CA]"
            >
              Back to profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      <HistoryHeader />

      <div className="max-w-5xl mx-auto px-5 md:px-8 lg:px-12 mt-8">
        <HistoryControls 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
        />

        <div className="flex flex-col gap-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((test) => (
              <HistoryCard key={test.id} test={test} />
            ))
          ) : (
            <HistoryEmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
