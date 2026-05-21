import axios from "axios";
import { BrainCircuit, Clock, Target, TrendingUp } from "lucide-react";
import { api } from "@/shared/api/axios";
import { getLearningGoals } from "@/features/learning-goals/learning-goals.api";
import { getRecommendedTests } from "@/features/recommendations/recommendations.api";
import type { AuthUser } from "@/features/auth/auth.service";
import type {
  LearningGoal,
  RecommendationData,
  RecentTest,
  StatData,
  UserProfile,
} from "@/features/profile/profile.types";

type DashboardResponse = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  stats: {
    testsTaken: number;
    averageScore: number;
    skillsMastered: number;
    hoursSpent: number;
    timeSpent?: {
      value: number;
      unit: "minutes" | "hours";
    };
    totalTimeSpentSeconds: number;
  };
};

type BackendUser = {
  id: string;
  name: string | null;
  email: string;
};

type BackendAttempt = {
  id: string;
  scorePercentage: number;
  isPassed: boolean;
  startedAt: string;
  completedAt: string | null;
  timeSpentSeconds: number;
  test: {
    title: string;
    category?: {
      id: string;
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

export type ProfileDashboardData = {
  user: UserProfile;
  stats: StatData[];
  learningGoals: LearningGoal[];
  recommendations: RecommendationData[];
  recentHistory: RecentTest[];
};

function formatScore(value: number) {
  return `${Math.round(value)}%`;
}

function formatTimeSpent(totalSeconds: number) {
  if (totalSeconds < 3600) {
    return `${Math.round(totalSeconds / 60)}m`;
  }

  const hours = totalSeconds / 3600;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}

function formatRecentDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function toStatsCards(stats: {
  testsTaken: number;
  averageScore: number;
  skillsMastered: number;
  totalTimeSpentSeconds: number;
}): StatData[] {
  return [
    {
      icon: Target,
      label: "Tests Taken",
      value: String(stats.testsTaken),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Average Score",
      value: formatScore(stats.averageScore),
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: BrainCircuit,
      label: "Skills Mastered",
      value: String(stats.skillsMastered),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Clock,
      label: "Time Spent",
      value: formatTimeSpent(stats.totalTimeSpentSeconds),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];
}

function buildStatsFromAttempts(attempts: BackendAttempt[]) {
  const completedAttempts = attempts.filter((attempt) => attempt.completedAt);
  const testsTaken = completedAttempts.length;
  const averageScore =
    testsTaken === 0
      ? 0
      : completedAttempts.reduce(
          (total, attempt) => total + attempt.scorePercentage,
          0,
        ) / testsTaken;
  const masteredCategoryIds = new Set(
    completedAttempts
      .filter((attempt) => attempt.isPassed && attempt.test.category?.id)
      .map((attempt) => attempt.test.category?.id),
  );
  const totalTimeSpentSeconds = completedAttempts.reduce(
    (total, attempt) => total + attempt.timeSpentSeconds,
    0,
  );

  return {
    testsTaken,
    averageScore,
    skillsMastered: masteredCategoryIds.size,
    totalTimeSpentSeconds,
  };
}

function toRecentHistory(attempts: BackendAttempt[]): RecentTest[] {
  return attempts
    .filter((attempt) => attempt.completedAt)
    .slice(0, 3)
    .map((attempt) => ({
      id: attempt.id,
      title: attempt.test.title,
      date: formatRecentDate(attempt.completedAt ?? attempt.startedAt),
      score: formatScore(attempt.scorePercentage),
      passed: attempt.isPassed,
    }));
}

function toProfileRecommendations(
  tests: Awaited<ReturnType<typeof getRecommendedTests>>,
): RecommendationData[] {
  return tests.map((test) => ({
    id: test.id,
    testId: test.id,
    type:
      test.recommendationType === "knowledge_gap"
        ? "gap"
        : test.recommendationType === "learning_goal"
          ? "goal"
          : "next",
    title: test.title,
    description: test.reason,
    matchedTags: test.matchedTags,
    goalMatches: test.goalMatches,
    weaknessDetails: test.weaknessDetails,
  }));
}

function getFallbackUser(currentUser: AuthUser | null): UserProfile {
  return {
    name: getDisplayName(currentUser?.name, currentUser?.email),
    email: currentUser?.email ?? "No email available",
  };
}

function getDisplayName(name?: string | null, email?: string | null) {
  const normalizedName = name?.trim();

  if (normalizedName && normalizedName !== email) {
    return normalizedName;
  }

  return "Testify user";
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    return Array.isArray(message)
      ? message.join(" ")
      : (message ?? "Failed to load profile data.");
  }

  return "Failed to load profile data.";
}

export async function getProfileDashboardData(
  currentUser: AuthUser | null,
): Promise<ProfileDashboardData> {
  const attemptsRequest = api.get<PaginatedResponse<BackendAttempt>>(
    "/attempts/my",
    {
      params: {
        page: 1,
        limit: 100,
        status: "ALL",
      },
    },
  );

  const dashboardRequest = api.get<DashboardResponse>("/users/me/dashboard");
  const userRequest = currentUser?.id
    ? api.get<BackendUser>(`/users/${currentUser.id}`)
    : Promise.reject();
  const learningGoalsRequest = getLearningGoals();
  const recommendationsRequest = getRecommendedTests("profile", 3);
  const [
    attemptsResponse,
    dashboardResponse,
    userResponse,
    learningGoalsResponse,
    recommendationsResponse,
  ] = await Promise.allSettled([
    attemptsRequest,
    dashboardRequest,
    userRequest,
    learningGoalsRequest,
    recommendationsRequest,
  ]);

  if (
    attemptsResponse.status === "rejected" &&
    dashboardResponse.status === "rejected" &&
    userResponse.status === "rejected"
  ) {
    throw new Error(getErrorMessage(attemptsResponse.reason));
  }

  const attempts =
    attemptsResponse.status === "fulfilled"
      ? attemptsResponse.value.data.items
      : [];
  const dashboard =
    dashboardResponse.status === "fulfilled"
      ? dashboardResponse.value.data
      : null;
  const backendUser =
    userResponse.status === "fulfilled" ? userResponse.value.data : null;
  const recommendations =
    recommendationsResponse.status === "fulfilled"
      ? toProfileRecommendations(recommendationsResponse.value)
      : [];
  const learningGoals =
    learningGoalsResponse.status === "fulfilled"
      ? learningGoalsResponse.value
      : [];
  const stats = dashboard?.stats ?? buildStatsFromAttempts(attempts);
  const userSource = backendUser ?? dashboard?.user;
  const user = userSource
    ? {
        name: getDisplayName(userSource.name, userSource.email),
        email: userSource.email,
      }
    : getFallbackUser(currentUser);

  return {
    user,
    stats: toStatsCards(stats),
    learningGoals,
    recommendations,
    recentHistory: toRecentHistory(attempts),
  };
}
