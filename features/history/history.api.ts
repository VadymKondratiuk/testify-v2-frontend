import axios from "axios";
import { api } from "@/shared/api/axios";
import type { HistoryItem } from "@/features/history/history.types";

type BackendAttempt = {
  id: string;
  scorePercentage: number;
  isPassed: boolean;
  startedAt: string;
  completedAt: string | null;
  timeSpentSeconds: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  test: {
    title: string;
    category?: {
      name: string;
    } | null;
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatTimeSpent(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function mapAttemptToHistoryItem(attempt: BackendAttempt): HistoryItem {
  return {
    id: attempt.id,
    title: attempt.test.title,
    category: attempt.test.category?.name ?? "Uncategorized",
    date: formatDate(attempt.completedAt ?? attempt.startedAt),
    score: Math.round(attempt.scorePercentage),
    totalQuestions: attempt.totalQuestionsCount,
    correctAnswers: attempt.correctAnswersCount,
    timeSpent: formatTimeSpent(attempt.timeSpentSeconds),
    status: attempt.isPassed ? "passed" : "failed",
    completedAt: attempt.completedAt ?? attempt.startedAt,
  };
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    return Array.isArray(message) ? message.join(" ") : message ?? "Failed to load history.";
  }

  return "Failed to load history.";
}

export async function getMyCompletedHistory() {
  const limit = 100;
  const firstPage = await api
    .get<PaginatedResponse<BackendAttempt>>("/attempts/my", {
      params: { page: 1, limit, status: "ALL" },
    })
    .catch((error) => {
      throw new Error(getErrorMessage(error));
    });

  const pageCount = firstPage.data.meta.pageCount;
  const restPages =
    pageCount > 1
      ? await Promise.all(
          Array.from({ length: pageCount - 1 }, (_, index) =>
            api.get<PaginatedResponse<BackendAttempt>>("/attempts/my", {
              params: { page: index + 2, limit, status: "ALL" },
            }),
          ),
        )
      : [];

  return [firstPage, ...restPages]
    .flatMap((response) => response.data.items)
    .filter((attempt) => attempt.completedAt)
    .map(mapAttemptToHistoryItem)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
}
