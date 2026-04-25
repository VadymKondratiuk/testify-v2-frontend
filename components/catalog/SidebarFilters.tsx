"use client";

import { Search, RotateCcw } from "lucide-react";

const categories = [
  { label: "IT & Programming", count: 42, checked: true },
  { label: "Mathematics", count: 18, checked: false },
  { label: "Languages", count: 31, checked: false },
  { label: "Science", count: 24, checked: false },
  { label: "History", count: 15, checked: false },
];

const difficultyOptions = ["All Levels", "Beginner", "Intermediate", "Advanced / Pro"];

const questionRanges = [
  { label: "1 – 10 q.", checked: false },
  { label: "11 – 30 q.", checked: true },
  { label: "31 – 50 q.", checked: false },
  { label: "50+ q.", checked: false },
];

const ratingOptions = ["Any", "3★ & above", "4★ & above", "5★ only"];

// ── Reusable sub-components ───────────────────────────────────

function FilterGroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Sora',sans-serif] text-[0.72rem] font-bold uppercase tracking-[0.09em] text-slate-700 pb-2.5 border-b border-slate-200">
      {children}
    </div>
  );
}

function CheckboxOption({
  label,
  count,
  defaultChecked,
}: {
  label: string;
  count?: number;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 text-[0.85rem] text-slate-700 cursor-pointer px-2 py-1.25 rounded-md transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600 group">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="
          appearance-none w-4 h-4 shrink-0 border-[1.5px] border-slate-300 rounded
          bg-white cursor-pointer transition-all duration-200
          checked:bg-indigo-600 checked:border-indigo-600
          relative
        "
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-[0.72rem] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  );
}

function RadioOption({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 text-[0.85rem] text-slate-700 cursor-pointer px-2 py-1.25 rounded-md transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600">
      <input
        type="radio"
        name={name}
        defaultChecked={defaultChecked}
        className="
          appearance-none w-4 h-4 shrink-0 border-[1.5px] border-slate-300 rounded-full
          bg-white cursor-pointer transition-all duration-200
          checked:border-indigo-600
          relative
        "
      />
      <span className="flex-1">{label}</span>
    </label>
  );
}

// ── Main component ────────────────────────────────────────────

export default function SidebarFilters() {
  return (
    <aside
      aria-label="Filters"
      className="w-65 shrink-0 border-r border-slate-200 px-6 pt-8 pb-12 flex flex-col gap-8 bg-white"
    >
      {/* Search */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="search"
          className="text-[0.68rem] font-bold uppercase tracking-[0.09em] text-slate-500"
        >
          Search Tests
        </label>
        <div className="flex border-[1.5px] border-slate-300 rounded-md overflow-hidden transition-all duration-200 focus-within:border-indigo-600 focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]">
          <input
            id="search"
            type="text"
            placeholder="Search tests…"
            className="flex-1 border-none outline-none text-[0.85rem] px-3 py-2.25 bg-white text-slate-900 placeholder-slate-400 min-w-0"
          />
          <button
            aria-label="Search"
            className="border-none border-l border-slate-200 bg-indigo-50 px-3.5 cursor-pointer text-indigo-600 transition-colors duration-200 hover:bg-indigo-100 flex items-center"
          >
            <Search size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Category</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <CheckboxOption
              key={cat.label}
              label={cat.label}
              count={cat.count}
              defaultChecked={cat.checked}
            />
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Difficulty</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {difficultyOptions.map((opt, i) => (
            <RadioOption key={opt} label={opt} name="diff" defaultChecked={i === 0} />
          ))}
        </div>
      </div>

      {/* Duration range (visual placeholder) */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Duration</FilterGroupTitle>
        <div className="border border-slate-200 bg-slate-50 rounded-md px-3.5 py-3 text-[0.8rem] font-medium text-slate-700 text-center">
          <div className="mb-2">10 min — 45 min</div>
          <div className="relative h-1 bg-indigo-100 rounded-full my-2.5">
            <div className="absolute left-[20%] right-[30%] top-0 h-full bg-indigo-600 rounded-full" />
            <div className="absolute w-3.5 h-3.5 border-2 border-indigo-600 rounded-full bg-white shadow-sm -top-1.25 left-[calc(20%-7px)]" />
            <div className="absolute w-3.5 h-3.5 border-2 border-indigo-600 rounded-full bg-white shadow-sm -top-1.25 right-[calc(30%-7px)]" />
          </div>
          <div className="flex justify-between text-[0.72rem] text-slate-400 font-medium mt-1">
            <span>5 min</span>
            <span>60 min</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Questions</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {questionRanges.map((q) => (
            <CheckboxOption key={q.label} label={q.label} defaultChecked={q.checked} />
          ))}
        </div>
      </div>

      {/* Min Rating */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Min. Rating</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {ratingOptions.map((opt, i) => (
            <RadioOption key={opt} label={opt} name="rating" defaultChecked={i === 0} />
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-slate-500 border border-slate-200 rounded-md px-3.5 py-1.75 transition-all duration-200 hover:text-red-600 hover:border-red-400 hover:bg-red-50 cursor-pointer bg-transparent">
          <RotateCcw size={13} strokeWidth={2.5} />
          Reset all filters
        </button>
      </div>
    </aside>
  );
}