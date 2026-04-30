// src/hooks/useCatalogFilters.ts
import { useState, useMemo } from "react";
import { TestCardData } from "@/features/catalog/components/TestCard";

export function useCatalogFilters(initialData: TestCardData[]) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Most Popular");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedQuestionRanges, setSelectedQuestionRanges] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState("Any");

  const categoryOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    initialData.forEach((test) => { counts[test.category] = (counts[test.category] || 0) + 1; });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [initialData]);

  const filteredTests = useMemo(() => {
    const filtered = initialData.filter((test) => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(test.category);
      
      let mappedDiff = selectedDifficulty;
      if (selectedDifficulty === "Advanced / Pro") mappedDiff = "Advanced";
      const matchesDifficulty = selectedDifficulty === "All Levels" || test.difficulty === mappedDiff;

      const durationVal = parseInt(test.duration.match(/\d+/)?.[0] || "0", 10);
      const matchesDuration = selectedDurations.length === 0 || selectedDurations.some(range => {
        if (range === "< 15 mins") return durationVal < 15;
        if (range === "15 – 30 mins") return durationVal >= 15 && durationVal <= 30;
        if (range === "31 – 60 mins") return durationVal >= 31 && durationVal <= 60;
        if (range === "> 60 mins") return durationVal > 60;
        return true;
      });

      const matchesQuestions = selectedQuestionRanges.length === 0 || selectedQuestionRanges.some(range => {
        if (range === "1 – 10 q.") return test.questions >= 1 && test.questions <= 10;
        if (range === "11 – 30 q.") return test.questions >= 11 && test.questions <= 30;
        if (range === "31 – 50 q.") return test.questions >= 31 && test.questions <= 50;
        if (range === "50+ q.") return test.questions >= 50;
        return true;
      });

      let matchesRating = true;
      if (selectedRating === "3★ & above") matchesRating = test.rating >= 3.0;
      if (selectedRating === "4★ & above") matchesRating = test.rating >= 4.0;
      if (selectedRating === "5★ only") matchesRating = test.rating >= 4.9;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration && matchesQuestions && matchesRating;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "Highest Rated": return b.rating - a.rating;
        case "Newest First": return b.id - a.id; 
        case "Shortest First": return parseInt(a.duration) - parseInt(b.duration);
        case "A → Z": return a.title.localeCompare(b.title);
        case "Most Popular": default: return a.id - b.id; 
      }
    });
  }, [initialData, searchQuery, selectedCategories, selectedDifficulty, selectedDurations, selectedQuestionRanges, selectedRating, sortBy]);

  const handleClearAll = () => {
    setSearchQuery(""); setSelectedCategories([]); setSelectedDifficulty("All Levels");
    setSelectedDurations([]); setSelectedQuestionRanges([]); setSelectedRating("Any");
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedDurations.length > 0 || selectedQuestionRanges.length > 0 || selectedDifficulty !== "All Levels" || selectedRating !== "Any";

  return {
    viewMode, setViewMode, sortBy, setSortBy,
    searchQuery, setSearchQuery, selectedCategories, setSelectedCategories,
    selectedDifficulty, setSelectedDifficulty, selectedDurations, setSelectedDurations,
    selectedQuestionRanges, setSelectedQuestionRanges, selectedRating, setSelectedRating,
    categoryOptions, filteredTests, handleClearAll, hasActiveFilters
  };
}