"use client";

// src/app/creator-studio/[testId]/stats/page.tsx
import axios from "axios";
import { use, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Clock, Loader2, Target, Users } from "lucide-react";
import { StatsHeader } from "@/features/stats/components/StatsHeader";
import { OverviewCards } from "@/features/stats/components/OverviewCards";
import { ScoreChart } from "@/features/stats/components/ScoreChart";
import { ToughestQuestions } from "@/features/stats/components/ToughestQuestions";
import { ResultsTable } from "@/features/stats/components/ResultsTable";
import { api } from "@/shared/api/axios";
import type { ResultData, ScoreDistributionData } from "@/features/stats/stats.types";

type ScoreBucket = "0-20" | "21-40" | "41-60" | "61-80" | "81-100";

type AnalyticsOverview = {
  test: {
    id: string;
    title: string;
  };
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  averageTimeSpent: number;
  scoreDistribution: Record<ScoreBucket, number>;
  toughestQuestions: {
    id: string;
    text: string;
    correctPercentage: number;
  }[];
};

type AnalyticsAttemptsResponse = {
  items: {
    id: string;
    student: {
      name?: string | null;
      email: string;
    };
    scorePercentage: number;
    isPassed: boolean;
    timeSpent: {
      minutes: number;
    };
    completedAt: string | null;
  }[];
};

interface TestStatsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const bucketLabels: Record<ScoreBucket, string> = {
  "0-20": "0-20%",
  "21-40": "21-40%",
  "41-60": "41-60%",
  "61-80": "61-80%",
  "81-100": "81-100%",
};

function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

function formatMinutes(value: number) {
  if (value < 1 && value > 0) {
    return "<1m";
  }

  return `${Math.round(value)}m`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not completed";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    return Array.isArray(message) ? message.join(" ") : message ?? "Failed to load test statistics.";
  }

  return "Failed to load test statistics.";
}

function mapScoreDistribution(distribution: AnalyticsOverview["scoreDistribution"]): ScoreDistributionData[] {
  return (Object.keys(bucketLabels) as ScoreBucket[]).map((bucket) => ({
    range: bucketLabels[bucket],
    students: distribution[bucket] ?? 0,
  }));
}

function mapResult(attempt: AnalyticsAttemptsResponse["items"][number]): ResultData {
  return {
    id: attempt.id,
    student: attempt.student.name?.trim() || attempt.student.email,
    score: Math.round(attempt.scorePercentage),
    time: formatMinutes(attempt.timeSpent.minutes),
    date: formatDate(attempt.completedAt),
    status: attempt.isPassed ? "passed" : "failed",
  };
}

export default function TestStatsPage({ params }: TestStatsPageProps) {
  const { id } = use(params);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [results, setResults] = useState<ResultData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOverviewLoading, setIsOverviewLoading] = useState(true);
  const [isResultsLoading, setIsResultsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadOverview = async () => {
      setIsOverviewLoading(true);
      setError(null);

      try {
        const { data } = await api.get<AnalyticsOverview>(`/analytics/tests/${id}/overview`, {
          signal: controller.signal,
        });
        setOverview(data);
      } catch (requestError) {
        if (axios.isCancel(requestError) || controller.signal.aborted) return;
        setError(getErrorMessage(requestError));
      } finally {
        if (!controller.signal.aborted) {
          setIsOverviewLoading(false);
        }
      }
    };

    void loadOverview();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    const debounceId = window.setTimeout(() => {
      setIsResultsLoading(true);

      api
        .get<AnalyticsAttemptsResponse>(`/analytics/tests/${id}/attempts`, {
          params: {
            limit: 100,
            search: searchQuery.trim() || undefined,
          },
          signal: controller.signal,
        })
        .then(({ data }) => {
          setResults(data.items.map(mapResult));
        })
        .catch((requestError) => {
          if (axios.isCancel(requestError) || controller.signal.aborted) return;
          setError(getErrorMessage(requestError));
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsResultsLoading(false);
          }
        });
    }, 250);

    return () => {
      window.clearTimeout(debounceId);
      controller.abort();
    };
  }, [id, searchQuery]);

  const statsOverview = useMemo(() => {
    if (!overview) return [];

    return [
      { title: "Total Attempts", value: overview.totalAttempts, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
      { title: "Average Score", value: formatPercentage(overview.averageScore), icon: BarChart3, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
      { title: "Completion Rate", value: formatPercentage(overview.completionRate), icon: Target, color: "text-purple-600", bg: "bg-purple-100" },
      { title: "Avg. Time Spent", value: formatMinutes(overview.averageTimeSpent), icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
    ];
  }, [overview]);

  const scoreDistribution = useMemo(
    () => mapScoreDistribution(overview?.scoreDistribution ?? { "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 }),
    [overview],
  );

  const toughestQuestions = useMemo(
    () => overview?.toughestQuestions.map((question) => ({
      id: question.id,
      text: question.text,
      successRate: Math.round(question.correctPercentage),
    })) ?? [],
    [overview],
  );

  if (error && !overview) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center px-5">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#EF4444]">
            <AlertTriangle size={28} />
          </div>
          <h1 className="mb-3 font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0F172A]">
            Statistics unavailable
          </h1>
          <p className="text-[#64748B]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FF] flex flex-col">
      <StatsHeader testTitle={overview?.test.title ?? "Test statistics"} />

      <main className="flex-1 p-5 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 pb-20">
        {isOverviewLoading ? (
          <div className="flex items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-8 text-[#64748B] shadow-sm">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#4F46E5]" />
            Loading statistics...
          </div>
        ) : (
          <OverviewCards data={statsOverview} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ScoreChart data={scoreDistribution} />
          <ToughestQuestions testId={id} questions={toughestQuestions} />
        </div>

        <ResultsTable
          results={results}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isResultsLoading}
        />
      </main>
    </div>
  );
}
