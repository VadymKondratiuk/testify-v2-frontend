// src/app/history/page.tsx
"use client";

import { useState } from "react";
import { mockHistory } from "@/features/history/history.mock";
import { HistoryHeader } from "@/features/history/components/HistoryHeader";
import { HistoryControls } from "@/features/history/components/HistoryControls";
import { HistoryCard } from "@/features/history/components/HistoryCard";
import { HistoryEmptyState } from "@/features/history/components/HistoryEmptyState";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

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
