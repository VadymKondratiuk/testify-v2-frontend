"use client";

import React from "react";
import { RotateCcw, Search } from "lucide-react";
import {
  DIFFICULTY_OPTIONS,
  DURATION_RANGES,
  QUESTION_RANGES,
  RATING_OPTIONS,
} from "../catalog.consts";
import {
  CheckboxOption,
  FilterGroupTitle,
  RadioOption,
} from "./FilterControls";
import type { CategoryOption } from "@/features/catalog/hooks/useCatalogFilters";

interface SidebarFiltersProps {
  categories: CategoryOption[];
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
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedDurations,
  setSelectedDurations,
  selectedQuestionRanges,
  setSelectedQuestionRanges,
  selectedRating,
  setSelectedRating,
  onReset,
}: SidebarFiltersProps) {
  const handleToggleArrayItem = (
    item: string,
    setFn: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setFn((prev) =>
      prev.includes(item) ? prev.filter((current) => current !== item) : [...prev, item],
    );
  };

  return (
    <aside
      aria-label="Filters"
      className="w-65 shrink-0 border-r border-slate-200 px-6 pt-8 pb-12 flex flex-col gap-8 bg-white sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="search" className="text-[0.68rem] font-bold uppercase tracking-[0.09em] text-slate-500">
          Search Tests
        </label>
        <div className="flex border-[1.5px] border-slate-300 rounded-md overflow-hidden transition-all duration-200 focus-within:border-indigo-600 focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]">
          <input
            id="search"
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="flex-1 border-none outline-none text-[0.85rem] px-3 py-2.25 bg-white text-slate-900 placeholder-slate-400 min-w-0"
          />
          <button
            type="button"
            className="border-none border-l border-slate-200 bg-indigo-50 px-3.5 cursor-pointer text-indigo-600 transition-colors duration-200 hover:bg-indigo-100 flex items-center"
            aria-label="Search"
          >
            <Search size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Category</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CheckboxOption
                key={category.id}
                label={category.label}
                count={category.count}
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleToggleArrayItem(category.id, setSelectedCategories)}
              />
            ))
          ) : (
            <p className="px-2 text-[0.82rem] text-slate-400">No categories yet</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Difficulty</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {DIFFICULTY_OPTIONS.map((option) => (
            <RadioOption
              key={option}
              label={option}
              name="diff"
              checked={selectedDifficulty === option}
              onChange={() => setSelectedDifficulty(option)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Duration</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {DURATION_RANGES.map((duration) => (
            <CheckboxOption
              key={duration}
              label={duration}
              checked={selectedDurations.includes(duration)}
              onChange={() => handleToggleArrayItem(duration, setSelectedDurations)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Questions</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {QUESTION_RANGES.map((range) => (
            <CheckboxOption
              key={range}
              label={range}
              checked={selectedQuestionRanges.includes(range)}
              onChange={() => handleToggleArrayItem(range, setSelectedQuestionRanges)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FilterGroupTitle>Min. Rating</FilterGroupTitle>
        <div className="flex flex-col gap-1.5">
          {RATING_OPTIONS.map((option) => (
            <RadioOption
              key={option}
              label={option}
              name="rating"
              checked={selectedRating === option}
              onChange={() => setSelectedRating(option)}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
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
