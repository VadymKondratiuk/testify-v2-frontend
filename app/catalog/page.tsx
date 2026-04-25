import { LayoutGrid, List, X } from "lucide-react";
import Link from "next/link";

import SidebarFilters from "@/components/catalog/SidebarFilters";
import TestCard, { TestCardData } from "@/components/catalog/TestCard";
import Pagination from "@/components/catalog/Pagination";

// ── Mock data ─────────────────────────────────────────────────
const testCards: TestCardData[] = [
  {
    id: 1,
    category: "IT & Programming",
    title: "Python Basics",
    difficulty: "Beginner",
    duration: "30 mins",
    questions: 20,
    description:
      "Covers variables, loops, and functions. A great starting point for Python learners.",
    rating: 4.2,
  },
  {
    id: 2,
    category: "Mathematics",
    title: "Algebra Fundamentals",
    difficulty: "Intermediate",
    duration: "45 mins",
    questions: 25,
    description: "Covers linear equations, inequalities, and polynomials.",
    rating: 4.8,
  },
  {
    id: 3,
    category: "Languages",
    title: "English: Upper-Intermediate",
    difficulty: "Intermediate",
    duration: "20 mins",
    questions: 15,
    description: "Grammar, reading comprehension, and vocabulary exercises.",
    rating: 3.5,
  },
  {
    id: 4,
    category: "IT & Programming",
    title: "SQL for Beginners",
    difficulty: "Beginner",
    duration: "25 mins",
    questions: 18,
    description: "SELECT, JOIN, WHERE and GROUP BY clauses explained clearly.",
    rating: 4.0,
  },
  {
    id: 5,
    category: "Science",
    title: "General Chemistry",
    difficulty: "Advanced",
    duration: "60 mins",
    questions: 40,
    description: "Periodic table, bonds, reactions, and stoichiometry.",
    rating: 4.5,
  },
  {
    id: 6,
    category: "History",
    title: "World War II Overview",
    difficulty: "Intermediate",
    duration: "35 mins",
    questions: 22,
    description: "Key events, battles, and political outcomes of WWII.",
    rating: 4.9,
  },
  {
    id: 7,
    category: "IT & Programming",
    title: "JavaScript DOM",
    difficulty: "Intermediate",
    duration: "40 mins",
    questions: 28,
    description: "Events, selectors, manipulation, and async patterns.",
    rating: 4.3,
  },
  {
    id: 8,
    category: "Mathematics",
    title: "Statistics 101",
    difficulty: "Beginner",
    duration: "30 mins",
    questions: 20,
    description: "Mean, median, variance, distributions, probability basics.",
    rating: 3.8,
  },
  {
    id: 9,
    category: "IT & Programming",
    title: "Linux Command Line",
    difficulty: "Advanced",
    duration: "50 mins",
    questions: 35,
    description: "Processes, file system, networking, and shell scripting.",
    rating: 4.7,
  },
];

// ── Active filter tags ────────────────────────────────────────
const activeFilters = ["IT & Programming", "11–30 Questions"];

// ── Page component ────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FF] font-['DM_Sans',sans-serif] text-slate-900 antialiased">
      {/* Breadcrumb */}
      <div className="h-11 flex items-center gap-2 px-12 bg-white border-b border-slate-200 text-[0.8rem] shrink-0">
        <Link href="/" className="font-medium text-indigo-600 no-underline hover:underline">
          Home
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-medium text-slate-700">Test Catalog</span>
      </div>

      {/* Page body */}
      <div className="flex-1 flex items-stretch px-12 gap-0">
        <SidebarFilters />

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-5 pt-7 pb-12 pl-8 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white border border-slate-200 rounded-xl px-4.5 py-3 shadow-[0_1px_2px_rgba(15,26,53,0.05)]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-['Sora',sans-serif] text-[1rem] font-bold tracking-[-0.02em] text-slate-900">
                Browse Available Tests
              </span>
              <span className="text-[0.78rem] font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                132 results
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[0.82rem]">
              <label htmlFor="sort" className="font-medium text-slate-700 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                className="border-[1.5px] border-slate-300 rounded-md bg-white text-[0.82rem] font-medium text-slate-900 py-1.75 pl-3 pr-8 cursor-pointer appearance-none outline-none focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2364748B'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                <option>Most Popular</option>
                <option>Newest First</option>
                <option>Highest Rated</option>
                <option>Shortest First</option>
                <option>A → Z</option>
              </select>

              {/* View toggle */}
              <div className="flex border-[1.5px] border-slate-300 rounded-md overflow-hidden">
                <button
                  title="Grid view"
                  className="flex items-center justify-center border-none border-r border-slate-200 bg-indigo-600 text-white px-3 py-1.5 cursor-pointer transition-colors duration-200"
                  aria-pressed="true"
                >
                  <LayoutGrid size={15} strokeWidth={2} />
                </button>
                <button
                  title="List view"
                  className="flex items-center justify-center border-none bg-white text-slate-400 px-3 py-1.5 cursor-pointer transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                  aria-pressed="false"
                >
                  <List size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter tags */}
          <div className="flex items-center gap-2 flex-wrap" aria-label="Active filters">
            <span className="text-[0.78rem] font-medium text-slate-400">Filters:</span>
            {activeFilters.map((filter) => (
              <div
                key={filter}
                className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full text-[0.76rem] font-medium"
              >
                {filter}
                <button
                  aria-label={`Remove ${filter} filter`}
                  className="text-indigo-400 cursor-pointer flex items-center transition-opacity duration-200 hover:opacity-100 opacity-60"
                >
                  <X size={11} strokeWidth={3} />
                </button>
              </div>
            ))}
            <Link
              href="#"
              className="text-[0.78rem] font-medium text-slate-400 no-underline ml-1 transition-colors duration-200 hover:text-red-500"
            >
              Clear all
            </Link>
          </div>

          {/* Cards grid */}
          <section aria-label="Test cards">
            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
              {testCards.map((card) => (
                <TestCard key={card.id} card={card} />
              ))}
            </div>
          </section>

          {/* Pagination */}
          <Pagination totalResults={132} totalPages={15} resultsPerPage={9} />
        </main>
      </div>
    </div>
  );
}