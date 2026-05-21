import { api } from "@/shared/api/axios";

export type LearningGoalDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type LearningGoalStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export type LearningGoalTag = {
  id: string;
  name: string;
};

export type LearningGoalCategory = {
  id: string;
  name: string;
};

export type LearningGoal = {
  id: string;
  title: string;
  targetScore: number;
  targetDifficulty: LearningGoalDifficulty | null;
  deadline: string | null;
  status: LearningGoalStatus;
  currentScore: number;
  progressPercentage: number;
  completedTests: number;
  category: LearningGoalCategory | null;
  tags: LearningGoalTag[];
  recommendationHint: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateLearningGoalInput = {
  title?: string;
  categoryId?: string;
  targetDifficulty?: LearningGoalDifficulty;
  targetScore?: number;
  deadline?: string;
  tagIds?: string[];
};

type LearningGoalsResponse = {
  items: LearningGoal[];
};

type CategoriesResponse = {
  items: LearningGoalCategory[];
};

export async function getLearningGoals() {
  const { data } = await api.get<LearningGoalsResponse>("/learning-goals/my");

  return data.items;
}

export async function createLearningGoal(input: CreateLearningGoalInput) {
  const { data } = await api.post<LearningGoal>("/learning-goals", input);

  return data;
}

export async function updateLearningGoal(
  goalId: string,
  input: Partial<CreateLearningGoalInput> & { status?: LearningGoalStatus },
) {
  const { data } = await api.patch<LearningGoal>(
    `/learning-goals/${goalId}`,
    input,
  );

  return data;
}

export async function archiveLearningGoal(goalId: string) {
  const { data } = await api.delete<LearningGoal>(`/learning-goals/${goalId}`);

  return data;
}

export async function getLearningGoalCategories() {
  const { data } = await api.get<CategoriesResponse>("/categories", {
    params: {
      limit: 100,
      sortBy: "name",
      sortOrder: "asc",
    },
  });

  return data.items;
}
