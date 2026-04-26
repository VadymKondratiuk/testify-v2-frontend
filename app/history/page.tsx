// src/app/history/page.tsx
"use client";

import { useState } from "react";
import { HistoryItem } from "@/types/history";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { HistoryControls } from "@/components/history/HistoryControls";
import { HistoryCard } from "@/components/history/HistoryCard";
import { HistoryEmptyState } from "@/components/history/HistoryEmptyState";

// МОКОВІ ДАНІ
const mockHistory: HistoryItem[] = [
  { id: "1", title: "React Hooks Deep Dive", category: "Frontend", date: "24 Apr, 2026", score: 92, totalQuestions: 25, correctAnswers: 23, timeSpent: "18m 45s", status: "passed" },
  { id: "2", title: "Database Optimization & Indexing", category: "PostgreSQL", date: "22 Apr, 2026", score: 45, totalQuestions: 20, correctAnswers: 9, timeSpent: "25m 10s", status: "failed" },
  { id: "3", title: "Figma UI Patterns", category: "Design", date: "15 Apr, 2026", score: 100, totalQuestions: 15, correctAnswers: 15, timeSpent: "10m 20s", status: "passed" },
  { id: "4", title: "NestJS Microservices Architecture", category: "Backend", date: "10 Apr, 2026", score: 68, totalQuestions: 30, correctAnswers: 20, timeSpent: "35m 00s", status: "failed" },
];

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