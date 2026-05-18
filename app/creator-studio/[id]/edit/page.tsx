"use client";

import { useEffect, useState } from "react";
import { ListChecks, Settings, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { BuilderHeader } from "@/features/edit/components/BuilderHeader";
import { QuestionCard } from "@/features/edit/components/QuestionCard";
import { TestSettings } from "@/features/edit/components/TestSettings";
import { api } from "@/shared/api/axios";
import { CategoryOption, Question, TestData } from "@/shared/types/test.types";

type QuestionConfigValue = Question["type"] | number;
type TestSettingValue = TestData[keyof TestData];

interface TestApiResponse {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  timeLimit: number | null;
  category: {
    id: string;
    name: string;
  } | null;
}

interface QuestionApiResponse {
  id: string;
  text: string;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TEXT_ANSWER";
  points: number;
  tags: Array<{
    id: string;
    name: string;
  }>;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
}

interface CategoriesApiResponse {
  items: CategoryOption[];
}

const emptyTest: TestData = {
  id: "",
  title: "",
  description: "",
  category: "",
  passingScore: 60,
  timeLimit: "",
  questions: [],
};

const mapQuestionType = (type: QuestionApiResponse["type"]): Question["type"] => {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return "Multiple Choice";
    case "TEXT_ANSWER":
      return "Text Answer";
    case "SINGLE_CHOICE":
    default:
      return "Single Choice";
  }
};

const mapTestData = (test: TestApiResponse, questions: QuestionApiResponse[]): TestData => ({
  id: test.id,
  title: test.title,
  description: test.description ?? "",
  category: test.category?.name ?? "",
  passingScore: test.passingScore,
  timeLimit: test.timeLimit ?? "",
  questions: questions.map((question) => ({
    id: question.id,
    type: mapQuestionType(question.type),
    points: question.points,
    text: question.text,
    tags: question.tags.map((tag) => tag.name),
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text,
      isCorrect: option.isCorrect,
    })),
  })),
});

export default function TestBuilderPage() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"questions" | "settings">("settings");
  const [testData, setTestData] = useState<TestData>(emptyTest);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadTest = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [testResponse, questionsResponse, categoriesResponse] = await Promise.all([
          api.get<TestApiResponse>(`/tests/${params.id}`, { signal: controller.signal }),
          api.get<QuestionApiResponse[]>("/questions", {
            params: { testId: params.id },
            signal: controller.signal,
          }),
          api.get<CategoriesApiResponse>("/categories", {
            params: { limit: 100 },
            signal: controller.signal,
          }),
        ]);

        setTestData(mapTestData(testResponse.data, questionsResponse.data));
        setCategories(categoriesResponse.data.items);
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load test data. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadTest();

    return () => {
      controller.abort();
    };
  }, [params.id]);

  const updateSetting = (field: keyof TestData, value: TestSettingValue) => {
    setTestData({ ...testData, [field]: value });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type: "Single Choice",
      points: 1,
      text: "",
      tags: [],
      options: [
        { id: `o${Date.now()}-1`, text: "Option 1", isCorrect: false },
        { id: `o${Date.now()}-2`, text: "Option 2", isCorrect: false },
      ],
    };
    setTestData({ ...testData, questions: [...testData.questions, newQuestion] });
  };

  const removeQuestion = (questionId: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.filter((q) => q.id !== questionId),
    });
  };

  const updateQuestionText = (questionId: string, newText: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map((q) =>
        q.id === questionId ? { ...q, text: newText } : q,
      ),
    });
  };

  const updateQuestionConfig = (
    questionId: string,
    field: "type" | "points",
    value: QuestionConfigValue,
  ) => {
    setTestData({
      ...testData,
      questions: testData.questions.map((q) => {
        if (q.id !== questionId) return q;

        if (field === "type" && value === "Single Choice" && q.type === "Multiple Choice") {
          let hasCorrect = false;
          const resetOptions = q.options.map((opt) => {
            if (opt.isCorrect && !hasCorrect) {
              hasCorrect = true;
              return opt;
            }
            return { ...opt, isCorrect: false };
          });
          return { ...q, [field]: value, options: resetOptions };
        }

        return { ...q, [field]: value };
      }),
    });
  };

  const addQuestionTag = (questionId: string, tag: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map((q) =>
        q.id === questionId ? { ...q, tags: [...q.tags, tag] } : q,
      ),
    });
  };

  const removeQuestionTag = (questionId: string, tagToRemove: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map((q) =>
        q.id === questionId ? { ...q, tags: q.tags.filter((t) => t !== tagToRemove) } : q,
      ),
    });
  };

  const addOption = (questionId: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map((q) => {
        if (q.id !== questionId) return q;
        const newOption = {
          id: `o${Date.now()}`,
          text: `Option ${q.options.length + 1}`,
          isCorrect: false,
        };
        return { ...q, options: [...q.options, newOption] };
      }),
    });
  };

  const removeOption = (questionId: string, optionId: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map((q) => {
        if (q.id !== questionId) return q;
        if (q.options.length <= 2) return q;
        return { ...q, options: q.options.filter((o) => o.id !== optionId) };
      }),
    });
  };

  const updateOptionText = (questionId: string, optionId: string, newText: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: q.options.map((o) => (o.id === optionId ? { ...o, text: newText } : o)),
        };
      }),
    });
  };

  const toggleCorrectOption = (questionId: string, optionId: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map((q) => {
        if (q.id !== questionId) return q;

        const updatedOptions = q.options.map((o) => {
          if (q.type === "Single Choice") {
            return { ...o, isCorrect: o.id === optionId };
          }

          return o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o;
        });

        return { ...q, options: updatedOptions };
      }),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-8 py-6 text-[#64748B] shadow-sm">
          Loading test...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center px-5">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white px-8 py-6 text-center shadow-sm">
          <h1 className="font-[family-name:var(--font-sora)] text-[1.2rem] font-bold text-[#0F172A]">
            Unable to open editor
          </h1>
          <p className="mt-2 text-[#EF4444]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FF] flex flex-col">
      <div className="sticky top-[72px] z-30 flex flex-col w-full shadow-sm">
        <BuilderHeader
          title={testData.title}
          onTitleChange={(e) => updateSetting("title", e.target.value)}
        />

        <div className="bg-white border-b border-[#E2E8F0] px-5 md:px-8 flex justify-center">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab("settings")}
              className={`cursor-pointer flex items-center gap-2 py-4 border-b-2 font-medium text-[0.95rem] transition-colors ${
                activeTab === "settings"
                  ? "border-[#4F46E5] text-[#4F46E5]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Settings size={18} />
              Test Settings
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`cursor-pointer flex items-center gap-2 py-4 border-b-2 font-medium text-[0.95rem] transition-colors ${
                activeTab === "questions"
                  ? "border-[#4F46E5] text-[#4F46E5]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <ListChecks size={18} />
              Questions ({testData.questions.length})
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 p-5 md:p-8">
        <div className="max-w-3xl mx-auto pb-20">
          {activeTab === "questions" ? (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {testData.questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  onRemove={removeQuestion}
                  onUpdateText={updateQuestionText}
                  onUpdateConfig={updateQuestionConfig}
                  onAddOption={addOption}
                  onRemoveOption={removeOption}
                  onUpdateOptionText={updateOptionText}
                  onToggleCorrect={toggleCorrectOption}
                  onAddTag={addQuestionTag}
                  onRemoveTag={removeQuestionTag}
                />
              ))}
              <button
                onClick={addQuestion}
                className="cursor-pointer flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[#CBD5E1] rounded-2xl text-[#64748B] hover:text-[#4F46E5] hover:border-[#4F46E5] hover:bg-[#EEF2FF] font-semibold text-[1rem] transition-all"
              >
                <Plus size={20} /> Add New Question
              </button>
            </div>
          ) : (
            <TestSettings data={testData} onChange={updateSetting} categories={categories} />
          )}
        </div>
      </main>
    </div>
  );
}
