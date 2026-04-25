"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  ChevronRight,
} from "lucide-react";

// Мокові дані, які пізніше будуть приходити з твого NestJS бекенду
const mockHistory = [
  {
    id: "1",
    title: "React Hooks Deep Dive",
    category: "Frontend",
    date: "24 Apr, 2026",
    score: 92,
    totalQuestions: 25,
    correctAnswers: 23,
    timeSpent: "18m 45s",
    status: "passed",
  },
  {
    id: "2",
    title: "Database Optimization & Indexing",
    category: "PostgreSQL",
    date: "22 Apr, 2026",
    score: 45,
    totalQuestions: 20,
    correctAnswers: 9,
    timeSpent: "25m 10s",
    status: "failed",
  },
  {
    id: "3",
    title: "Figma UI Patterns",
    category: "Design",
    date: "15 Apr, 2026",
    score: 100,
    totalQuestions: 15,
    correctAnswers: 15,
    timeSpent: "10m 20s",
    status: "passed",
  },
  {
    id: "4",
    title: "NestJS Microservices Architecture",
    category: "Backend",
    date: "10 Apr, 2026",
    score: 68,
    totalQuestions: 30,
    correctAnswers: 20,
    timeSpent: "35m 00s",
    status: "failed",
  },
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

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[#E2E8F0] px-5 md:px-8 lg:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/catalog"
            className="w-fit flex items-center gap-2 text-[#64748B] hover:text-[#4F46E5] text-[0.85rem] font-medium transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>
          <h1 className="font-[family-name:var(--font-sora)] text-[1.8rem] font-bold text-[#0F172A] tracking-[-0.03em]">
            Test History
          </h1>
          <p className="text-[#64748B] text-[0.95rem] mt-1">
            Review your past performance and analyze your mistakes.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8 lg:px-12 mt-8">

        {/* ── Controls: Search & Filter ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto bg-white rounded-xl border border-[#E2E8F0]">
            {(["all", "passed", "failed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`cursor-pointer px-4 py-2.5 rounded-lg text-[0.85rem] font-medium capitalize transition-colors flex-1 sm:flex-none ${
                  filter === f
                    ? "bg-[#F5F7FF] text-[#4F46E5] shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── History List ── */}
        <div className="flex flex-col gap-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 hover:border-[#CBD5E1] transition-colors"
              >

                {/* ── Left: Status Icon — shrink-0 so it never compresses ── */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  test.status === "passed" ? "bg-green-50 text-[#10B981]" : "bg-red-50 text-[#EF4444]"
                }`}>
                  {test.status === "passed" ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                </div>

                {/* ── Middle: Text content — flex-1 min-w-0 allows truncation instead of overflow ── */}
                <div className="flex-1 min-w-0">
                  {/* Category pill + Date — whitespace-nowrap prevents these from wrapping mid-label */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="whitespace-nowrap text-[0.7rem] font-bold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                      {test.category}
                    </span>
                    <span className="whitespace-nowrap flex items-center gap-1 text-[0.75rem] text-[#94A3B8] font-medium">
                      <Calendar size={12} />
                      {test.date}
                    </span>
                  </div>

                  {/* Title — truncate keeps long titles on one line instead of wrapping into the score column */}
                  <h3 className="truncate font-semibold text-[#0F172A] text-[1.1rem] leading-tight mb-2">
                    {test.title}
                  </h3>

                  {/* Meta row — whitespace-nowrap on each stat badge */}
                  <div className="flex items-center gap-4 text-[0.85rem] text-[#64748B]">
                    <span className="whitespace-nowrap flex items-center gap-1.5">
                      <Clock size={14} />
                      {test.timeSpent}
                    </span>
                    <span className="whitespace-nowrap flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      {test.correctAnswers} / {test.totalQuestions} correct
                    </span>
                  </div>
                </div>

                {/* ── Right: Score + Button — shrink-0 so it's never compressed by the middle column ── */}
                {/* On mobile: horizontal row with a top separator. On desktop: horizontal row, no separator. */}
                <div className="shrink-0 flex flex-row items-center justify-between md:justify-end gap-6 border-t border-[#E2E8F0] md:border-0 pt-4 md:pt-0">
                  {/* Score */}
                  <div className="flex items-center gap-2">
                    <span className="text-[0.75rem] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        Score
                    </span>
                    <span className={`font-[family-name:var(--font-sora)] text-[1.5rem] font-bold leading-none ${
                        test.status === "passed" ? "text-[#10B981]" : "text-[#EF4444]"
                    }`}>
                        {test.score}%
                    </span>
                  </div>

                  {/* View Details — shown for ALL tests regardless of pass/fail */}
                  <button className="cursor-pointer whitespace-nowrap flex items-center gap-1.5 bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] hover:text-[#4338CA] px-4 py-2 rounded-lg font-medium text-[0.85rem] transition-colors">
                    View Details <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center flex flex-col items-center justify-center">
              <Filter size={40} className="text-[#CBD5E1] mb-4" />
              <h3 className="font-semibold text-[#0F172A] text-[1.1rem]">No tests found</h3>
              <p className="text-[#64748B] text-[0.9rem] mt-1">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}