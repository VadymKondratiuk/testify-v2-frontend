// src/components/catalog/SidebarFilters.tsx
"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { 
  DIFFICULTY_OPTIONS, 
  DURATION_RANGES, 
  QUESTION_RANGES, 
  RATING_OPTIONS 
} from "../constants";
import { 
  FilterGroupTitle, 
  CheckboxOption, 
  RadioOption 
} from "./FilterControls";

interface SidebarFiltersProps {
  categories: { label: string; count: number }[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDifficulty: string;
  setSelectedDifficulty: (val: string) => void;
  selectedDurations: string[];
  setSelectedDurations: React.Dispatch<React.SetStateAction<string[]>>;
  selectedQuestionRanges: string[];
  setSelectedQuestionRanges: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRating: string;
  setSelectedRating: (val: string) => void;
  onReset: () => void;
}

export default function SidebarFilters({
  categories,
  searchQuery, setSearchQuery,
  selectedCategories, setSelectedCategories,
  selectedDifficulty, setSelectedDifficulty,
  selectedDurations, setSelectedDurations,
  selectedQuestionRanges, setSelectedQuestionRanges,
  selectedRating, setSelectedRating,
  onReset
}: SidebarFiltersProps) {

  const handleToggleArrayItem = (
    item: string, 
    setFn: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setFn((prev) => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <aside
      aria-label="Filters"
      className="w-65 shrink-0 border-r border-slate-200 px-6 pt-8 pb-12 flex flex-col gap-8 bg-white sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300"
    >
      {/* Search */}
      <div className="flex flex-col gap-2">
        <label htmlFor="search" className="text-[0.68rem] font-bold uppercase tracking-[0.09em] text-slate-500">Search Tests</label>
        <div className="flex border-[1.5px] border-slate-300 rounded-md overflow-hidden transition-all duration-200 focus-within:border-indigo-600 focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]">
          <input
            id="search" type="text" placeholder="Search tests…"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none outline-none text-[0.85rem] px-3 py-2.25 bg-white text-slate-900 placeholder-slate-400 min-w-0"
          />
          <button className="border-none border-l border-slate-200 bg-indigo-50 px-3.5 cursor-pointer text-indigo-600 transition-colors duration-200 hover:bg-indigo-100 flex items-center">
            <Search size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Category (DYNAMIC) */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Category</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <CheckboxOption
              key={cat.label} label={cat.label} count={cat.count}
              checked={selectedCategories.includes(cat.label)}
              onChange={() => handleToggleArrayItem(cat.label, setSelectedCategories)}
            />
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Difficulty</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <RadioOption
              key={opt} label={opt} name="diff"
              checked={selectedDifficulty === opt}
              onChange={() => setSelectedDifficulty(opt)}
            />
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Duration</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {DURATION_RANGES.map((d) => (
            <CheckboxOption
              key={d} label={d}
              checked={selectedDurations.includes(d)}
              onChange={() => handleToggleArrayItem(d, setSelectedDurations)}
            />
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Questions</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {QUESTION_RANGES.map((q) => (
            <CheckboxOption
              key={q} label={q}
              checked={selectedQuestionRanges.includes(q)}
              onChange={() => handleToggleArrayItem(q, setSelectedQuestionRanges)}
            />
          ))}
        </div>
      </div>

      {/* Min Rating */}
      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Min. Rating</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {RATING_OPTIONS.map((opt) => (
            <RadioOption
              key={opt} label={opt} name="rating"
              checked={selectedRating === opt}
              onChange={() => setSelectedRating(opt)}
            />
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-slate-500 border border-slate-200 rounded-md px-3.5 py-1.75 transition-all duration-200 hover:text-red-600 hover:border-red-400 hover:bg-red-50 cursor-pointer bg-transparent"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
          Reset all filters
        </button>
      </div>
    </aside>
  );
}