// src/app/creator-studio/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreatorStudioHeader } from "@/features/creator-studio/components/CreatorStudioHeader";
import { TestSearch } from "@/features/creator-studio/components/TestSearch";
import { TestCard } from "@/features/creator-studio/components/TestCard";
import { EmptyState } from "@/features/creator-studio/components/EmptyState";
import type { MyTestsApiResponse, TestSummary } from "@/features/creator-studio/creator-studio.types";
import { api } from "@/shared/api/axios";

const formatUpdatedAt = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const mapTestSummary = (test: MyTestsApiResponse["items"][number]): TestSummary => ({
  id: test.id,
  title: test.title,
  status: test.isPublished ? "published" : "draft",
  questionsCount: test._count.questions,
  completions: test._count.attempts,
  updatedAt: formatUpdatedAt(test.updatedAt),
});

const getDeleteErrorMessage = (requestError: unknown) => {
  if (!(requestError instanceof AxiosError)) {
    return "Could not remove the test. Please try again.";
  }

  const data = requestError.response?.data;

  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "Could not remove the test. Please try again.";
};

export default function CreatorStudioPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [totalTests, setTotalTests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [testToDelete, setTestToDelete] = useState<TestSummary | null>(null);
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadTests = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const requestParams = {
          limit: 100,
          search: searchQuery.trim() || undefined,
          sortBy: "updatedAt",
          sortOrder: "desc",
        };

        const firstPage = await api.get<MyTestsApiResponse>("/tests/my", {
          params: {
            ...requestParams,
            page: 1,
          },
          signal: controller.signal,
        });

        const remainingPages = Array.from(
          { length: Math.max(firstPage.data.meta.pageCount - 1, 0) },
          (_, index) => index + 2,
        );

        const restPages = await Promise.all(
          remainingPages.map((page) =>
            api.get<MyTestsApiResponse>("/tests/my", {
              params: {
                ...requestParams,
                page,
              },
              signal: controller.signal,
            }),
          ),
        );

        const allItems = [
          ...firstPage.data.items,
          ...restPages.flatMap((response) => response.data.items),
        ];

        setTests(allItems.map(mapTestSummary));
        setTotalTests(firstPage.data.meta.total);
      } catch (requestError) {
        if (requestError instanceof AxiosError && requestError.code === "ERR_CANCELED") {
          return;
        }

        setError("Не вдалося завантажити ваші тести. Спробуйте оновити сторінку.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    const debounceId = window.setTimeout(loadTests, 250);

    return () => {
      window.clearTimeout(debounceId);
      controller.abort();
    };
  }, [searchQuery]);

  const handleCreateTest = async () => {
    setIsCreatingTest(true);
    setCreateError(null);

    try {
      const response = await api.post<{ id: string }>("/tests", {
        title: "Untitled Test",
        isPublished: false,
      });

      router.push(`/creator-studio/${response.data.id}/edit`);
    } catch {
      setCreateError("Could not create a new test. Please try again.");
      setIsCreatingTest(false);
    }
  };

  const openDeleteDialog = (test: TestSummary) => {
    setTestToDelete(test);
    setDeleteError(null);
  };

  const closeDeleteDialog = () => {
    if (deletingTestId) {
      return;
    }

    setTestToDelete(null);
    setDeleteError(null);
  };

  const handleDeleteTest = async () => {
    if (!testToDelete) {
      return;
    }

    setDeletingTestId(testToDelete.id);
    setDeleteError(null);

    try {
      await api.delete(`/tests/${testToDelete.id}`);
      setTests((currentTests) => currentTests.filter((test) => test.id !== testToDelete.id));
      setTotalTests((currentTotal) => Math.max(currentTotal - 1, 0));
      setTestToDelete(null);
    } catch (requestError) {
      setDeleteError(getDeleteErrorMessage(requestError));
    } finally {
      setDeletingTestId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      
      <CreatorStudioHeader isCreating={isCreatingTest} onCreateTest={handleCreateTest} />

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 mt-8">
        
        <TestSearch value={searchQuery} onChange={setSearchQuery} />

        {createError && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[0.9rem] font-medium text-red-600">
            {createError}
          </div>
        )}

        <div className="mb-5 text-[0.85rem] font-medium text-[#64748B]">
          {isLoading ? "Loading tests..." : `${totalTests} tests found`}
        </div>

        {error ? (
          <div className="bg-white rounded-2xl border border-red-100 p-8 text-center text-red-600 font-semibold">
            {error}
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[214px] rounded-2xl border border-[#E2E8F0] bg-white shadow-sm animate-pulse"
              />
            ))}
          </div>
        ) : tests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                isDeleting={deletingTestId === test.id}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        ) : (
          <EmptyState hasSearchQuery={searchQuery.length > 0} />
        )}

      </div>

      {testToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/35 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-test-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 id="delete-test-title" className="font-[family-name:var(--font-sora)] text-[1.1rem] font-bold text-[#0F172A]">
                    Delete test?
                  </h2>
                  <p className="mt-1 text-[0.9rem] leading-6 text-[#64748B]">
                    Draft tests without activity are deleted permanently. Tests with activity are archived and removed from active lists.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={Boolean(deletingTestId)}
                className="cursor-pointer rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close delete confirmation"
              >
                <X size={18} />
              </button>
            </div>

            {deleteError && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[0.86rem] font-medium text-red-600">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={Boolean(deletingTestId)}
                className="cursor-pointer rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-[#475569] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTest}
                disabled={Boolean(deletingTestId)}
                className="cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingTestId ? "Removing..." : "Yes, remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
