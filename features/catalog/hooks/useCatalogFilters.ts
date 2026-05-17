import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import axios from "axios";
import { api } from "@/shared/api/axios";
import { TestCardData, type Difficulty } from "@/shared/types/testCardData.types";
import { type CatalogSort } from "@/features/catalog/catalog.consts";

const RESULTS_PER_PAGE = 9;

type BackendDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type BackendCategory = {
  id: string;
  name: string;
  _count?: {
    tests?: number;
  };
};

type BackendTest = {
  id: string;
  title: string;
  description?: string | null;
  difficulty: BackendDifficulty;
  timeLimit?: number | null;
  averageRating?: number | null;
  category?: {
    id: string;
    name: string;
  } | null;
  _count?: {
    questions?: number;
    attempts?: number;
    ratings?: number;
  };
};

type PaginatedResponse<T> = {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
};

export type CategoryOption = {
  id: string;
  label: string;
  count: number;
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Failed to load catalog.";
  }

  return "Failed to load catalog.";
}

function toUiDifficulty(difficulty: BackendDifficulty): Difficulty {
  switch (difficulty) {
    case "ADVANCED":
      return "Advanced";
    case "INTERMEDIATE":
      return "Intermediate";
    case "BEGINNER":
    default:
      return "Beginner";
  }
}

function toBackendDifficulty(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "BEGINNER";
    case "Intermediate":
      return "INTERMEDIATE";
    case "Advanced / Pro":
      return "ADVANCED";
    default:
      return null;
  }
}

function toDurationFilter(duration: string) {
  switch (duration) {
    case "< 15 mins":
      return "under_15";
    case "15 - 30 mins":
      return "15_30";
    case "31 - 60 mins":
      return "31_60";
    case "> 60 mins":
      return "over_60";
    default:
      return null;
  }
}

function toQuestionCountFilter(range: string) {
  switch (range) {
    case "1 - 10 q.":
      return "1_10";
    case "11 - 30 q.":
      return "11_30";
    case "31 - 50 q.":
      return "31_50";
    case "50+ q.":
      return "over_50";
    default:
      return null;
  }
}

function toRatingFilter(rating: string) {
  switch (rating) {
    case "3+ stars":
      return "3_plus";
    case "4+ stars":
      return "4_plus";
    case "5 stars only":
      return "5";
    default:
      return "any";
  }
}

function mapBackendTest(test: BackendTest): TestCardData {
  const duration = test.timeLimit ? `${test.timeLimit} mins` : "No limit";

  return {
    id: test.id,
    category: test.category?.name ?? "Uncategorized",
    title: test.title,
    difficulty: toUiDifficulty(test.difficulty),
    duration,
    questions: test._count?.questions ?? 0,
    description: test.description ?? "No description provided.",
    rating: test.averageRating ?? 0,
  };
}

function compact<T>(values: (T | null)[]) {
  return values.filter((value): value is T => value !== null);
}

export function useCatalogFilters() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<CatalogSort>("most_popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedQuestionRanges, setSelectedQuestionRanges] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState("Any");
  const [currentPage, setCurrentPage] = useState(1);

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [filteredTests, setFilteredTests] = useState<TestCardData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prepareForNewQuery = useCallback(() => {
    setCurrentPage(1);
    setIsLoading(true);
    setError(null);
  }, []);

  const updateSearchQuery = useCallback((value: string) => {
    if (value.trim() !== debouncedSearchQuery) {
      prepareForNewQuery();
    }

    setSearchQuery(value);
  }, [debouncedSearchQuery, prepareForNewQuery]);

  const updateSortBy = useCallback((value: CatalogSort) => {
    prepareForNewQuery();
    setSortBy(value);
  }, [prepareForNewQuery]);

  const updateSelectedCategories = useCallback<Dispatch<SetStateAction<string[]>>>(
    (value) => {
      prepareForNewQuery();
      setSelectedCategories(value);
    },
    [prepareForNewQuery],
  );

  const updateSelectedDifficulty = useCallback((value: string) => {
    prepareForNewQuery();
    setSelectedDifficulty(value);
  }, [prepareForNewQuery]);

  const updateSelectedDurations = useCallback<Dispatch<SetStateAction<string[]>>>(
    (value) => {
      prepareForNewQuery();
      setSelectedDurations(value);
    },
    [prepareForNewQuery],
  );

  const updateSelectedQuestionRanges = useCallback<Dispatch<SetStateAction<string[]>>>(
    (value) => {
      prepareForNewQuery();
      setSelectedQuestionRanges(value);
    },
    [prepareForNewQuery],
  );

  const updateSelectedRating = useCallback((value: string) => {
    prepareForNewQuery();
    setSelectedRating(value);
  }, [prepareForNewQuery]);

  const updateCurrentPage = useCallback((value: number) => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(value);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextSearchQuery = searchQuery.trim();

      if (nextSearchQuery !== debouncedSearchQuery) {
        setDebouncedSearchQuery(nextSearchQuery);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [debouncedSearchQuery, searchQuery]);

  useEffect(() => {
    let ignore = false;

    api
      .get<PaginatedResponse<BackendCategory>>("/categories", {
        params: {
          limit: 100,
          sortBy: "name",
          sortOrder: "asc",
        },
      })
      .then(({ data }) => {
        if (ignore) return;

        setCategoryOptions(
          data.items.map((category) => ({
            id: category.id,
            label: category.name,
            count: category._count?.tests ?? 0,
          })),
        );
      })
      .catch(() => {
        if (!ignore) {
          setCategoryOptions([]);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const difficulties = toBackendDifficulty(selectedDifficulty);
    const durations = compact(selectedDurations.map(toDurationFilter));
    const questionCounts = compact(selectedQuestionRanges.map(toQuestionCountFilter));

    api
      .get<PaginatedResponse<BackendTest>>("/tests", {
        signal: controller.signal,
        params: {
          page: currentPage,
          limit: RESULTS_PER_PAGE,
          isPublished: true,
          sort: sortBy,
          search: debouncedSearchQuery || undefined,
          categoryIds: selectedCategories.length ? selectedCategories.join(",") : undefined,
          difficulties: difficulties ?? undefined,
          durations: durations.length ? durations.join(",") : undefined,
          questionCounts: questionCounts.length ? questionCounts.join(",") : undefined,
          rating: toRatingFilter(selectedRating),
        },
      })
      .then(({ data }) => {
        setFilteredTests(data.items.map(mapBackendTest));
        setTotalResults(data.meta.total);
        setTotalPages(Math.max(1, data.meta.pageCount));
      })
      .catch((requestError) => {
        if (axios.isCancel(requestError) || controller.signal.aborted) return;

        setFilteredTests([]);
        setTotalResults(0);
        setTotalPages(1);
        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [
    currentPage,
    debouncedSearchQuery,
    selectedCategories,
    selectedDifficulty,
    selectedDurations,
    selectedQuestionRanges,
    selectedRating,
    sortBy,
  ]);

  const selectedCategoryLabels = useMemo(() => {
    const labels = new Map(categoryOptions.map((category) => [category.id, category.label]));
    return selectedCategories.map((id) => ({ id, label: labels.get(id) ?? id }));
  }, [categoryOptions, selectedCategories]);

  const handleClearAll = () => {
    setIsLoading(true);
    setError(null);
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedDifficulty("All Levels");
    setSelectedDurations([]);
    setSelectedQuestionRanges([]);
    setSelectedRating("Any");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedDurations.length > 0 ||
    selectedQuestionRanges.length > 0 ||
    selectedDifficulty !== "All Levels" ||
    selectedRating !== "Any";

  return {
    viewMode,
    setViewMode,
    sortBy,
    setSortBy: updateSortBy,
    searchQuery,
    setSearchQuery: updateSearchQuery,
    selectedCategories,
    setSelectedCategories: updateSelectedCategories,
    selectedCategoryLabels,
    selectedDifficulty,
    setSelectedDifficulty: updateSelectedDifficulty,
    selectedDurations,
    setSelectedDurations: updateSelectedDurations,
    selectedQuestionRanges,
    setSelectedQuestionRanges: updateSelectedQuestionRanges,
    selectedRating,
    setSelectedRating: updateSelectedRating,
    categoryOptions,
    filteredTests,
    totalResults,
    totalPages,
    currentPage,
    setCurrentPage: updateCurrentPage,
    resultsPerPage: RESULTS_PER_PAGE,
    isLoading,
    error,
    handleClearAll,
    hasActiveFilters,
  };
}

export type CatalogFilters = ReturnType<typeof useCatalogFilters>;
