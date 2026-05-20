"use client";

import axios from "axios";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { ListChecks, Settings, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { BuilderHeader } from "@/features/edit/components/BuilderHeader";
import { QuestionCard } from "@/features/edit/components/QuestionCard";
import { TestSettings } from "@/features/edit/components/TestSettings";
import { api } from "@/shared/api/axios";
import { CategoryOption, Question, TestData, TestDifficulty } from "@/shared/types/test.types";

type QuestionConfigValue = Question["type"] | number;
type TestSettingValue = TestData[keyof TestData];
type SaveStatus = "saved" | "unsaved" | "saving" | "error";
type BackendQuestionType = QuestionApiResponse["type"];
type BackendDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

interface TestApiResponse {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  difficulty: BackendDifficulty;
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
  correctTextAnswer?: string | null;
  acceptedTextAnswers?: string[];
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
  categoryId: "",
  difficulty: "Beginner",
  passingScore: 60,
  timeLimit: "",
  questions: [],
};

const buildSaveSnapshot = (test: TestData) =>
  JSON.stringify({
    title: test.title,
    description: test.description,
    categoryId: test.categoryId,
    difficulty: test.difficulty,
    passingScore: test.passingScore,
    timeLimit: test.timeLimit,
  });

const buildQuestionSnapshot = (question: Question) =>
  JSON.stringify({
    text: question.text,
    type: question.type,
    points: question.points,
    correctTextAnswer: question.correctTextAnswer ?? "",
    acceptedTextAnswers: question.acceptedTextAnswers ?? [],
    tags: question.tags,
  });

const buildOptionSnapshot = (option: Question["options"][number]) =>
  JSON.stringify({
    text: option.text,
    isCorrect: option.isCorrect,
  });

const getPublishErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return "Could not publish test";
  }

  const message = error.response?.data?.message;
  const validationErrors = error.response?.data?.errors;

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors[0];
  }

  if (Array.isArray(message)) {
    return message[0] ?? "Could not publish test";
  }

  return typeof message === "string" ? message : "Could not publish test";
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

const mapBackendQuestionType = (type: Question["type"]): BackendQuestionType => {
  switch (type) {
    case "Multiple Choice":
      return "MULTIPLE_CHOICE";
    case "Text Answer":
      return "TEXT_ANSWER";
    case "Single Choice":
    default:
      return "SINGLE_CHOICE";
  }
};

const mapDifficulty = (difficulty: BackendDifficulty): TestDifficulty => {
  switch (difficulty) {
    case "ADVANCED":
      return "Advanced";
    case "INTERMEDIATE":
      return "Intermediate";
    case "BEGINNER":
    default:
      return "Beginner";
  }
};

const mapBackendDifficulty = (difficulty: TestDifficulty): BackendDifficulty => {
  switch (difficulty) {
    case "Advanced":
      return "ADVANCED";
    case "Intermediate":
      return "INTERMEDIATE";
    case "Beginner":
    default:
      return "BEGINNER";
  }
};

const mapApiQuestion = (question: QuestionApiResponse): Question => ({
  id: question.id,
  type: mapQuestionType(question.type),
  points: question.points,
  text: question.text,
  correctTextAnswer: question.correctTextAnswer ?? "",
  acceptedTextAnswers: question.acceptedTextAnswers ?? [],
  tags: question.tags.map((tag) => tag.name),
  options: question.options.map((option) => ({
    id: option.id,
    text: option.text,
    isCorrect: option.isCorrect,
  })),
});

const mapTestData = (test: TestApiResponse, questions: QuestionApiResponse[]): TestData => ({
  id: test.id,
  title: test.title,
  description: test.description ?? "",
  category: test.category?.name ?? "",
  categoryId: test.category?.id ?? "",
  difficulty: mapDifficulty(test.difficulty),
  passingScore: test.passingScore,
  timeLimit: test.timeLimit ?? "",
  questions: questions.map(mapApiQuestion),
});

const rememberSavedQuestions = (
  questions: Question[],
  questionSnapshots: MutableRefObject<Map<string, string>>,
  optionSnapshots: MutableRefObject<Map<string, string>>,
) => {
  questionSnapshots.current = new Map(
    questions.map((question) => [question.id, buildQuestionSnapshot(question)]),
  );
  optionSnapshots.current = new Map(
    questions.flatMap((question) =>
      question.options.map((option) => [option.id, buildOptionSnapshot(option)] as const),
    ),
  );
};

export default function TestBuilderPage() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"questions" | "settings">("settings");
  const [testData, setTestData] = useState<TestData>(emptyTest);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [saveMessage, setSaveMessage] = useState("Saved");
  const lastSavedSnapshotRef = useRef(buildSaveSnapshot(emptyTest));
  const savedQuestionSnapshotsRef = useRef<Map<string, string>>(new Map());
  const savedOptionSnapshotsRef = useRef<Map<string, string>>(new Map());
  const saveRequestIdRef = useRef(0);
  const questionSaveRequestIdRef = useRef(0);
  const isReadOnly = isPublished;

  const savePayload = useMemo(() => ({
    title: testData.title,
    description: testData.description,
    difficulty: mapBackendDifficulty(testData.difficulty),
    passingScore: testData.passingScore,
    timeLimit: testData.timeLimit === "" ? null : Number(testData.timeLimit),
    categoryId: testData.categoryId || null,
  }), [
    testData.title,
    testData.description,
    testData.difficulty,
    testData.passingScore,
    testData.timeLimit,
    testData.categoryId,
  ]);

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

        const loadedTest = mapTestData(testResponse.data, questionsResponse.data);
        setTestData(loadedTest);
        setCategories(categoriesResponse.data.items);
        setIsPublished(testResponse.data.isPublished);
        lastSavedSnapshotRef.current = buildSaveSnapshot(loadedTest);
        rememberSavedQuestions(loadedTest.questions, savedQuestionSnapshotsRef, savedOptionSnapshotsRef);
        setSaveStatus("saved");
        setSaveMessage("Saved");
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

  useEffect(() => {
    if (isLoading || error || isReadOnly) {
      return;
    }

    const snapshot = buildSaveSnapshot(testData);

    if (snapshot === lastSavedSnapshotRef.current) {
      return;
    }

    if (testData.title.trim().length === 0) {
      return;
    }
    const requestId = saveRequestIdRef.current + 1;
    saveRequestIdRef.current = requestId;

    const timeoutId = window.setTimeout(async () => {
      setSaveStatus("saving");
      setSaveMessage("Saving...");

      try {
        await api.patch(`/tests/${params.id}`, savePayload);

        if (saveRequestIdRef.current !== requestId) {
          return;
        }

        lastSavedSnapshotRef.current = snapshot;
        setSaveStatus("saved");
        setSaveMessage("Saved just now");
      } catch {
        if (saveRequestIdRef.current !== requestId) {
          return;
        }

        setSaveStatus("error");
        setSaveMessage("Could not save changes");
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [error, isLoading, isReadOnly, params.id, savePayload, testData]);

  useEffect(() => {
    if (isLoading || error || isReadOnly) {
      return;
    }

    const changedQuestions = testData.questions.filter(
      (question) => buildQuestionSnapshot(question) !== savedQuestionSnapshotsRef.current.get(question.id),
    );
    const changedOptions = testData.questions.flatMap((question) =>
      question.options
        .filter((option) => buildOptionSnapshot(option) !== savedOptionSnapshotsRef.current.get(option.id))
        .map((option) => ({ question, option })),
    );

    if (changedQuestions.length === 0 && changedOptions.length === 0) {
      return;
    }

    const hasInvalidQuestion = changedQuestions.some((question) => question.text.trim().length < 3);
    const hasInvalidOption = changedOptions.some(({ option }) => option.text.trim().length === 0);
    const hasInvalidTextAnswer = changedQuestions.some(
      (question) => question.type === "Text Answer" && !question.correctTextAnswer?.trim(),
    );

    if (hasInvalidQuestion || hasInvalidOption || hasInvalidTextAnswer) {
      return;
    }

    const requestId = questionSaveRequestIdRef.current + 1;
    questionSaveRequestIdRef.current = requestId;

    const timeoutId = window.setTimeout(async () => {
      setSaveStatus("saving");
      setSaveMessage("Saving...");

      try {
        for (const question of changedQuestions) {
          await api.patch<QuestionApiResponse>(`/questions/${question.id}`, {
            text: question.text,
            type: mapBackendQuestionType(question.type),
            points: question.points,
            correctTextAnswer: question.type === "Text Answer" ? question.correctTextAnswer?.trim() : undefined,
            acceptedTextAnswers: question.type === "Text Answer" ? question.acceptedTextAnswers ?? [] : undefined,
            tagNames: question.tags,
          });
        }

        const optionChanges = [...changedOptions].sort((left, right) => {
          if (left.option.isCorrect === right.option.isCorrect) return 0;
          return left.option.isCorrect ? 1 : -1;
        });

        for (const { option } of optionChanges) {
          await api.patch(`/options/${option.id}`, {
            text: option.text,
            isCorrect: option.isCorrect,
          });
        }

        if (questionSaveRequestIdRef.current !== requestId) {
          return;
        }

        for (const question of changedQuestions) {
          savedQuestionSnapshotsRef.current.set(question.id, buildQuestionSnapshot(question));
        }
        for (const { option } of changedOptions) {
          savedOptionSnapshotsRef.current.set(option.id, buildOptionSnapshot(option));
        }

        setSaveStatus("saved");
        setSaveMessage("Saved just now");
      } catch {
        if (questionSaveRequestIdRef.current !== requestId) {
          return;
        }

        setSaveStatus("error");
        setSaveMessage("Could not save changes");
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [error, isLoading, isReadOnly, testData.questions]);

  const updateSetting = (field: keyof TestData, value: TestSettingValue) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({ ...currentTest, [field]: value }));

    if (field === "title" && typeof value === "string" && value.trim().length === 0) {
      setSaveStatus("error");
      setSaveMessage("Title is required");
      return;
    }

    setSaveStatus("unsaved");
    setSaveMessage("Unsaved changes");
  };

  const markUnsaved = () => {
    if (isReadOnly) {
      return;
    }

    setSaveStatus("unsaved");
    setSaveMessage("Unsaved changes");
  };

  const saveCurrentQuestions = async () => {
    const changedQuestions = testData.questions.filter(
      (question) => buildQuestionSnapshot(question) !== savedQuestionSnapshotsRef.current.get(question.id),
    );
    const changedOptions = testData.questions.flatMap((question) =>
      question.options
        .filter((option) => buildOptionSnapshot(option) !== savedOptionSnapshotsRef.current.get(option.id))
        .map((option) => ({ question, option })),
    );

    for (const question of changedQuestions) {
      await api.patch<QuestionApiResponse>(`/questions/${question.id}`, {
        text: question.text,
        type: mapBackendQuestionType(question.type),
        points: question.points,
        correctTextAnswer: question.type === "Text Answer" ? question.correctTextAnswer?.trim() : undefined,
        acceptedTextAnswers: question.type === "Text Answer" ? question.acceptedTextAnswers ?? [] : undefined,
        tagNames: question.tags,
      });
      savedQuestionSnapshotsRef.current.set(question.id, buildQuestionSnapshot(question));
    }

    const optionChanges = [...changedOptions].sort((left, right) => {
      if (left.option.isCorrect === right.option.isCorrect) return 0;
      return left.option.isCorrect ? 1 : -1;
    });

    for (const { option } of optionChanges) {
      await api.patch(`/options/${option.id}`, {
        text: option.text,
        isCorrect: option.isCorrect,
      });
      savedOptionSnapshotsRef.current.set(option.id, buildOptionSnapshot(option));
    }
  };

  const togglePublishTest = async () => {
    if (isPublishing) {
      return;
    }

    setIsPublishing(true);
    setSaveStatus("saving");
    setSaveMessage(isPublished ? "Unpublishing..." : "Publishing...");

    try {
      if (!isPublished) {
        await api.patch(`/tests/${params.id}`, savePayload);
        lastSavedSnapshotRef.current = buildSaveSnapshot(testData);

        await saveCurrentQuestions();
      }
      await api.patch(`/tests/${params.id}/publish`, { isPublished: !isPublished });

      setIsPublished((current) => !current);
      setSaveStatus("saved");
      setSaveMessage(isPublished ? "Unpublished" : "Published");
    } catch (publishError) {
      setSaveStatus("error");
      setSaveMessage(getPublishErrorMessage(publishError));
    } finally {
      setIsPublishing(false);
    }
  };

  const addQuestion = async () => {
    if (isReadOnly) {
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("Creating question...");

    try {
      const questionResponse = await api.post<QuestionApiResponse>("/questions", {
        testId: params.id,
        text: "New question",
        type: "SINGLE_CHOICE",
        points: 1,
        correctTextAnswer: "",
        acceptedTextAnswers: [],
        tagNames: [],
      });
      const [firstOptionResponse, secondOptionResponse] = await Promise.all([
        api.post<{ id: string; text: string; isCorrect: boolean }>("/options", {
          questionId: questionResponse.data.id,
          text: "Option 1",
          isCorrect: true,
        }),
        api.post<{ id: string; text: string; isCorrect: boolean }>("/options", {
          questionId: questionResponse.data.id,
          text: "Option 2",
          isCorrect: false,
        }),
      ]);
      const newQuestion: Question = {
        ...mapApiQuestion(questionResponse.data),
        options: [
          {
            id: firstOptionResponse.data.id,
            text: firstOptionResponse.data.text,
            isCorrect: firstOptionResponse.data.isCorrect,
          },
          {
            id: secondOptionResponse.data.id,
            text: secondOptionResponse.data.text,
            isCorrect: secondOptionResponse.data.isCorrect,
          },
        ],
      };

      savedQuestionSnapshotsRef.current.set(newQuestion.id, buildQuestionSnapshot(newQuestion));
      for (const option of newQuestion.options) {
        savedOptionSnapshotsRef.current.set(option.id, buildOptionSnapshot(option));
      }

      setTestData((currentTest) => ({
        ...currentTest,
        questions: [...currentTest.questions, newQuestion],
      }));
      setSaveStatus("saved");
      setSaveMessage("Saved just now");
    } catch {
      setSaveStatus("error");
      setSaveMessage("Could not create question");
    }
  };

  const removeQuestion = async (questionId: string) => {
    if (isReadOnly) {
      return;
    }

    const questionToRemove = testData.questions.find((question) => question.id === questionId);
    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.filter((q) => q.id !== questionId),
    }));
    setSaveStatus("saving");
    setSaveMessage("Deleting question...");

    try {
      await api.delete(`/questions/${questionId}`);
      savedQuestionSnapshotsRef.current.delete(questionId);
      for (const option of questionToRemove?.options ?? []) {
        savedOptionSnapshotsRef.current.delete(option.id);
      }
      setSaveStatus("saved");
      setSaveMessage("Saved just now");
    } catch {
      if (questionToRemove) {
        setTestData((currentTest) => ({
          ...currentTest,
          questions: [...currentTest.questions, questionToRemove],
        }));
      }
      setSaveStatus("error");
      setSaveMessage("Could not delete question");
    }
  };

  const updateQuestionText = (questionId: string, newText: string) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) =>
        q.id === questionId ? { ...q, text: newText } : q,
      ),
    }));
    if (newText.trim().length < 3) {
      setSaveStatus("error");
      setSaveMessage("Question text must be at least 3 characters");
      return;
    }
    markUnsaved();
  };

  const updateQuestionConfig = async (
    questionId: string,
    field: "type" | "points",
    value: QuestionConfigValue,
  ) => {
    if (isReadOnly) {
      return;
    }

    if (field === "type" && value === "Text Answer") {
      setTestData((currentTest) => ({
        ...currentTest,
        questions: currentTest.questions.map((q) =>
          q.id === questionId ? { ...q, type: "Text Answer", options: [] } : q,
        ),
      }));
      markUnsaved();

      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) => {
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
    }));
    markUnsaved();
  };

  const updateCorrectTextAnswer = (questionId: string, correctTextAnswer: string) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) =>
        q.id === questionId ? { ...q, correctTextAnswer } : q,
      ),
    }));

    if (!correctTextAnswer.trim()) {
      setSaveStatus("error");
      setSaveMessage("Correct text answer is required");
      return;
    }

    markUnsaved();
  };

  const addAcceptedTextAnswer = (questionId: string) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) =>
        q.id === questionId
          ? { ...q, acceptedTextAnswers: [...(q.acceptedTextAnswers ?? []), ""] }
          : q,
      ),
    }));
    markUnsaved();
  };

  const updateAcceptedTextAnswer = (questionId: string, index: number, value: string) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) => {
        if (q.id !== questionId) return q;

        const acceptedTextAnswers = [...(q.acceptedTextAnswers ?? [])];
        acceptedTextAnswers[index] = value;
        return { ...q, acceptedTextAnswers };
      }),
    }));
    markUnsaved();
  };

  const removeAcceptedTextAnswer = (questionId: string, index: number) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              acceptedTextAnswers: (q.acceptedTextAnswers ?? []).filter((_, itemIndex) => itemIndex !== index),
            }
          : q,
      ),
    }));
    markUnsaved();
  };

  const addQuestionTag = (questionId: string, tag: string) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) =>
        q.id === questionId ? { ...q, tags: [...q.tags, tag] } : q,
      ),
    }));
    markUnsaved();
  };

  const removeQuestionTag = (questionId: string, tagToRemove: string) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) =>
        q.id === questionId ? { ...q, tags: q.tags.filter((t) => t !== tagToRemove) } : q,
      ),
    }));
    markUnsaved();
  };

  const addOption = async (questionId: string) => {
    if (isReadOnly) {
      return;
    }

    const question = testData.questions.find((item) => item.id === questionId);
    if (!question || question.type === "Text Answer") return;

    setSaveStatus("saving");
    setSaveMessage("Creating option...");

    try {
      const response = await api.post<{ id: string; text: string; isCorrect: boolean }>("/options", {
        questionId,
        text: `Option ${question.options.length + 1}`,
        isCorrect: false,
      });
      const newOption = {
        id: response.data.id,
        text: response.data.text,
        isCorrect: response.data.isCorrect,
      };

      savedOptionSnapshotsRef.current.set(newOption.id, buildOptionSnapshot(newOption));
      setTestData((currentTest) => ({
        ...currentTest,
        questions: currentTest.questions.map((q) =>
          q.id === questionId ? { ...q, options: [...q.options, newOption] } : q,
        ),
      }));
      setSaveStatus("saved");
      setSaveMessage("Saved just now");
    } catch {
      setSaveStatus("error");
      setSaveMessage("Could not create option");
    }
  };

  const removeOption = async (questionId: string, optionId: string) => {
    if (isReadOnly) {
      return;
    }

    const question = testData.questions.find((item) => item.id === questionId);
    const optionToRemove = question?.options.find((option) => option.id === optionId);
    if (!question || !optionToRemove || question.options.length <= 2) return;

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) => {
        if (q.id !== questionId) return q;
        return { ...q, options: q.options.filter((o) => o.id !== optionId) };
      }),
    }));
    setSaveStatus("saving");
    setSaveMessage("Deleting option...");

    try {
      await api.delete(`/options/${optionId}`);
      savedOptionSnapshotsRef.current.delete(optionId);
      setSaveStatus("saved");
      setSaveMessage("Saved just now");
    } catch {
      setTestData((currentTest) => ({
        ...currentTest,
        questions: currentTest.questions.map((q) =>
          q.id === questionId ? { ...q, options: [...q.options, optionToRemove] } : q,
        ),
      }));
      setSaveStatus("error");
      setSaveMessage("Could not delete option");
    }
  };

  const updateOptionText = (questionId: string, optionId: string, newText: string) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: q.options.map((o) => (o.id === optionId ? { ...o, text: newText } : o)),
        };
      }),
    }));
    if (newText.trim().length === 0) {
      setSaveStatus("error");
      setSaveMessage("Option text is required");
      return;
    }
    markUnsaved();
  };

  const toggleCorrectOption = (questionId: string, optionId: string) => {
    if (isReadOnly) {
      return;
    }

    setTestData((currentTest) => ({
      ...currentTest,
      questions: currentTest.questions.map((q) => {
        if (q.id !== questionId) return q;

        const updatedOptions = q.options.map((o) => {
          if (q.type === "Single Choice") {
            return { ...o, isCorrect: o.id === optionId };
          }

          return o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o;
        });

        return { ...q, options: updatedOptions };
      }),
    }));
    markUnsaved();
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
          saveStatus={saveStatus}
          saveMessage={saveMessage}
          isPublished={isPublished}
          isPublishing={isPublishing}
          onTogglePublish={togglePublishTest}
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
          {isReadOnly && (
            <div className="mb-6 rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] px-5 py-4 text-[0.95rem] font-medium text-[#4338CA]">
              This test is published. Unpublish it to edit settings or questions.
            </div>
          )}

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
                  onUpdateCorrectTextAnswer={updateCorrectTextAnswer}
                  onAddAcceptedTextAnswer={addAcceptedTextAnswer}
                  onUpdateAcceptedTextAnswer={updateAcceptedTextAnswer}
                  onRemoveAcceptedTextAnswer={removeAcceptedTextAnswer}
                  onAddOption={addOption}
                  onRemoveOption={removeOption}
                  onUpdateOptionText={updateOptionText}
                  onToggleCorrect={toggleCorrectOption}
                  onAddTag={addQuestionTag}
                  onRemoveTag={removeQuestionTag}
                  disabled={isReadOnly}
                />
              ))}
              <button
                disabled={isReadOnly}
                onClick={addQuestion}
                className="cursor-pointer flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[#CBD5E1] rounded-2xl text-[#64748B] hover:text-[#4F46E5] hover:border-[#4F46E5] hover:bg-[#EEF2FF] font-semibold text-[1rem] transition-all disabled:cursor-not-allowed disabled:text-[#94A3B8] disabled:hover:border-[#CBD5E1] disabled:hover:bg-transparent"
              >
                <Plus size={20} /> Add New Question
              </button>
            </div>
          ) : (
            <TestSettings data={testData} onChange={updateSetting} categories={categories} disabled={isReadOnly} />
          )}
        </div>
      </main>
    </div>
  );
}
