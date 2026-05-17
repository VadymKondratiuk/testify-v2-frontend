import { notFound } from "next/navigation";
import { TestHeader } from "@/features/tests/components/TestHeader";
import { TestMetrics } from "@/features/tests/components/TestMetrics";
import { TestRules } from "@/features/tests/components/TestRules";
import { TestCardData, type Difficulty } from "@/shared/types/testCardData.types";

type BackendDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type BackendTest = {
  id: string;
  title: string;
  description?: string | null;
  difficulty: BackendDifficulty;
  timeLimit?: number | null;
  averageRating?: number | null;
  isPublished?: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  _count?: {
    questions?: number;
  };
};

interface TestDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
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

function mapBackendTest(test: BackendTest): TestCardData {
  return {
    id: test.id,
    category: test.category?.name ?? "Uncategorized",
    title: test.title,
    difficulty: toUiDifficulty(test.difficulty),
    duration: test.timeLimit ? `${test.timeLimit} mins` : "No limit",
    questions: test._count?.questions ?? 0,
    description: test.description ?? "No description provided.",
    rating: test.averageRating ?? 0,
  };
}

async function getTestDetails(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/tests/${id}`, {
    cache: "no-store",
  });

  if (response.status === 400 || response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load test details.");
  }

  const test = (await response.json()) as BackendTest;
  if (test.isPublished === false) {
    notFound();
  }

  return mapBackendTest(test);
}

export default async function TestDetailsPage({ params }: TestDetailsPageProps) {
  const { id } = await params;
  const testData = await getTestDetails(id);

  return (
    <div className="w-full min-h-screen bg-[#F5F7FF]">
      <TestHeader
        id={testData.id}
        title={testData.title}
        category={testData.category}
      />

      <div className="max-w-5xl mx-auto w-full py-8 px-5 md:px-8 lg:px-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">About this assessment</h2>
          <p className="text-[#64748B] text-[1.05rem] mb-8 leading-relaxed">
            {testData.description}
          </p>

          <TestMetrics
            duration={testData.duration}
            difficulty={testData.difficulty}
            questions={testData.questions}
            rating={testData.rating}
          />

          <TestRules
            questions={testData.questions}
            duration={testData.duration}
          />
        </div>
      </div>
    </div>
  );
}
