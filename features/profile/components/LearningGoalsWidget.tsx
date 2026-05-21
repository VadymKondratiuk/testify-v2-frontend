"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Loader2,
  Plus,
  Search,
  Target,
  X,
} from "lucide-react";
import {
  archiveLearningGoal,
  createLearningGoal,
  getLearningGoalCategories,
  updateLearningGoal,
  type LearningGoal,
  type LearningGoalCategory,
  type LearningGoalDifficulty,
  type LearningGoalTag,
} from "@/features/learning-goals/learning-goals.api";
import { searchTags, type TagSuggestion } from "@/features/edit/tags.api";

interface LearningGoalsWidgetProps {
  goals: LearningGoal[];
}

const difficultyOptions: Array<{
  value: LearningGoalDifficulty;
  label: string;
}> = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

function formatDifficulty(value: LearningGoalDifficulty | null) {
  return (
    difficultyOptions.find((option) => option.value === value)?.label ??
    "Any level"
  );
}

function formatDeadline(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function LearningGoalsWidget({
  goals: initialGoals,
}: LearningGoalsWidgetProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [categories, setCategories] = useState<LearningGoalCategory[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [targetDifficulty, setTargetDifficulty] =
    useState<LearningGoalDifficulty>("INTERMEDIATE");
  const [targetScore, setTargetScore] = useState(80);
  const [deadline, setDeadline] = useState("");
  const [selectedTags, setSelectedTags] = useState<LearningGoalTag[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<TagSuggestion[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingGoalId, setPendingGoalId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGoals(initialGoals);
  }, [initialGoals]);

  useEffect(() => {
    getLearningGoalCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const search = tagSearch.trim();

    if (search.length < 2) {
      setTagSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      searchTags(search, controller.signal)
        .then((items) => {
          const selectedIds = new Set(selectedTags.map((tag) => tag.id));
          setTagSuggestions(items.filter((item) => !selectedIds.has(item.id)));
        })
        .catch(() => setTagSuggestions([]));
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [selectedTags, tagSearch]);

  const activeGoals = useMemo(
    () => goals.filter((goal) => goal.status !== "ARCHIVED"),
    [goals],
  );

  async function handleCreateGoal() {
    setIsCreating(true);
    setError(null);

    try {
      const goal = await createLearningGoal({
        title: title.trim() || undefined,
        categoryId: categoryId || undefined,
        targetDifficulty,
        targetScore,
        deadline: deadline || undefined,
        tagIds: selectedTags.map((tag) => tag.id),
      });

      setGoals((currentGoals) => [goal, ...currentGoals]);
      setTitle("");
      setCategoryId("");
      setTargetDifficulty("INTERMEDIATE");
      setTargetScore(80);
      setDeadline("");
      setSelectedTags([]);
      setTagSearch("");
      setTagSuggestions([]);
    } catch {
      setError("Unable to create learning goal.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleCompleteGoal(goalId: string) {
    setPendingGoalId(goalId);
    setError(null);

    try {
      const goal = await updateLearningGoal(goalId, { status: "COMPLETED" });
      setGoals((currentGoals) =>
        currentGoals.map((item) => (item.id === goal.id ? goal : item)),
      );
    } catch {
      setError("Unable to update learning goal.");
    } finally {
      setPendingGoalId(null);
    }
  }

  async function handleArchiveGoal(goalId: string) {
    setPendingGoalId(goalId);
    setError(null);

    try {
      await archiveLearningGoal(goalId);
      setGoals((currentGoals) =>
        currentGoals.filter((goal) => goal.id !== goalId),
      );
    } catch {
      setError("Unable to archive learning goal.");
    } finally {
      setPendingGoalId(null);
    }
  }

  function addSelectedTag(tag: TagSuggestion) {
    setSelectedTags((currentTags) => [
      ...currentTags,
      { id: tag.id, name: tag.name },
    ]);
    setTagSearch("");
    setTagSuggestions([]);
  }

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
          <Target className="text-[#4F46E5]" size={20} />
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-sora)] text-[1.2rem] font-bold text-[#0F172A]">
            Learning Goals
          </h2>
          <p className="text-[0.85rem] text-[#64748B]">
            Goals influence your recommendation ranking.
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Goal title"
            className="h-11 rounded-xl border border-[#CBD5E1] px-3 text-[0.9rem] font-medium text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#4F46E5]"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-[0.9rem] font-medium text-[#0F172A] outline-none transition-colors focus:border-[#4F46E5]"
            >
              <option value="">Any category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={targetDifficulty}
              onChange={(event) =>
                setTargetDifficulty(
                  event.target.value as LearningGoalDifficulty,
                )
              }
              className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-[0.9rem] font-medium text-[#0F172A] outline-none transition-colors focus:border-[#4F46E5]"
            >
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="number"
              min={50}
              max={100}
              value={targetScore}
              onChange={(event) => setTargetScore(Number(event.target.value))}
              className="h-11 rounded-xl border border-[#CBD5E1] px-3 text-[0.9rem] font-medium text-[#0F172A] outline-none transition-colors focus:border-[#4F46E5]"
              aria-label="Target score"
            />
            <input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="h-11 rounded-xl border border-[#CBD5E1] px-3 text-[0.9rem] font-medium text-[#0F172A] outline-none transition-colors focus:border-[#4F46E5]"
              aria-label="Deadline"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              value={tagSearch}
              onChange={(event) => setTagSearch(event.target.value)}
              placeholder="Search tags"
              className="h-11 w-full rounded-xl border border-[#CBD5E1] px-9 text-[0.9rem] font-medium text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#4F46E5]"
            />
            {tagSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-12 z-10 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-lg">
                {tagSuggestions.slice(0, 5).map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => addSelectedTag(tag)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-[0.85rem] font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
                  >
                    <span>#{tag.name}</span>
                    <span className="text-[0.72rem] text-[#64748B]">
                      {tag.usageCount}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-h-9 flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-lg bg-[#F1F5F9] px-2.5 py-1.5 text-[0.78rem] font-bold text-[#334155]"
              >
                #{tag.name}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedTags((currentTags) =>
                      currentTags.filter((item) => item.id !== tag.id),
                    )
                  }
                  className="rounded text-[#64748B] hover:text-[#EF4444]"
                  aria-label={`Remove ${tag.name}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCreateGoal}
            disabled={isCreating}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[0.9rem] font-bold text-white transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Add Goal
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-[#FEF2F2] px-3 py-2 text-[0.82rem] font-semibold text-[#B91C1C]">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col border-t border-[#E2E8F0]">
        {activeGoals.length === 0 ? (
          <p className="pt-5 text-[0.9rem] font-medium text-[#64748B]">
            No active goals yet.
          </p>
        ) : (
          activeGoals.map((goal) => {
            const deadlineLabel = formatDeadline(goal.deadline);
            const isPending = pendingGoalId === goal.id;

            return (
              <div
                key={goal.id}
                className="grid gap-4 border-b border-[#E2E8F0] py-5 last:border-b-0 md:grid-cols-[1fr_auto]"
              >
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#0F172A]">
                      {goal.title}
                    </h3>
                    <span className="rounded-md bg-[#EEF2FF] px-2 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-[#4338CA]">
                      {goal.status === "COMPLETED" ? "Completed" : "Active"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[0.78rem] font-semibold text-[#64748B]">
                    <span>{goal.category?.name ?? "Any category"}</span>
                    <span>/</span>
                    <span>{formatDifficulty(goal.targetDifficulty)}</span>
                    <span>/</span>
                    <span>Target {goal.targetScore}%</span>
                    {deadlineLabel && (
                      <>
                        <span>/</span>
                        <span>{deadlineLabel}</span>
                      </>
                    )}
                  </div>
                  {goal.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {goal.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-md bg-[#F8FAFC] px-2 py-1 text-[0.72rem] font-semibold text-[#475569]"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-[0.82rem] font-medium text-[#64748B]">
                    {goal.recommendationHint}
                  </p>
                </div>

                <div className="flex min-w-[180px] flex-col gap-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-[0.78rem] font-bold text-[#475569]">
                      <span>{goal.currentScore}%</span>
                      <span>{goal.progressPercentage}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                      <div
                        className="h-full rounded-full bg-[#4F46E5]"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {goal.status !== "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => handleCompleteGoal(goal.id)}
                        disabled={isPending}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#ECFDF5] px-3 py-2 text-[0.78rem] font-bold text-[#047857] hover:bg-[#D1FAE5] disabled:opacity-60"
                      >
                        <CheckCircle2 size={14} />
                        Done
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleArchiveGoal(goal.id)}
                      disabled={isPending}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#F8FAFC] px-3 py-2 text-[0.78rem] font-bold text-[#475569] hover:bg-[#F1F5F9] disabled:opacity-60"
                    >
                      <Archive size={14} />
                      Hide
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
