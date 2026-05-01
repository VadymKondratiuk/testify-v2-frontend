"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockTest } from "@/shared/mocks/test.mocks";
import { Question, TestData } from "@/shared/types/test.types";

import { TestSidebar } from "@/features/take/components/TestSidebar";
import { TestBoard } from "@/features/take/components/TestBoard";

type AnswersState = Record<string, string | string[]>;

interface TakeTestPageProps {
  params: Promise<{ id: string }>;
}

function getInitialTimeLeft(test: TestData) {
  return Number(test.timeLimit) * 60;
}

export default function TakeTestPage({ params }: TakeTestPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const testData = mockTest;

  // --- Стейт тесту ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  
  // --- НАДІЙНИЙ ТАЙМЕР ---
  // Фіксуємо точний час завершення тесту (поточний час + тривалість)
  const [endTime] = useState(() => Date.now() + getInitialTimeLeft(testData) * 1000);
  // Стейт для відображення секунд на екрані
  const [timeLeft, setTimeLeft] = useState(() => getInitialTimeLeft(testData));

  const answeredCount = Object.values(answers).filter((ans) => 
    Array.isArray(ans) ? ans.length > 0 : Boolean(ans)
  ).length;

  const handleSubmit = useCallback(
    (force = false) => {
      const hasUnansweredQuestions = answeredCount !== testData.questions.length;

      if (!force && hasUnansweredQuestions) {
        window.alert(
          `You have answered ${answeredCount} of ${testData.questions.length} questions. Some questions are still unanswered.`
        );
        const confirmed = window.confirm("Submit the test anyway?");
        if (!confirmed) return;
      }

      console.log("Submitted test answers:", { testId: id, answers });
      router.replace(`/results/res-${id}`); 
    },
    [answeredCount, answers, id, testData.questions.length, router],
  );

  // Ефект для таймера, який вираховує час відносно фіксованого endTime
  useEffect(() => {
    const timerId = window.setInterval(() => {
      const now = Date.now();
      // Вираховуємо залишок. Math.max(0, ...) гарантує, що час не піде в мінус
      const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));

      setTimeLeft(remainingSeconds);

      // Якщо час вийшов - зупиняємо інтервал і робимо примусовий сабміт
      if (remainingSeconds <= 0) {
        window.clearInterval(timerId);
        handleSubmit(true);
      }
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [endTime, handleSubmit]);

  const handleOptionSelect = (question: Question, optionId: string) => {
    setAnswers((prev) => {
      if (question.type === "Single Choice") {
        return { ...prev, [question.id]: optionId };
      }

      const prevVal = prev[question.id];
      const selectedOpts = Array.isArray(prevVal) ? prevVal : [];
      const nextOpts = selectedOpts.includes(optionId)
        ? selectedOpts.filter((optId) => optId !== optionId)
        : [...selectedOpts, optionId];

      return { ...prev, [question.id]: nextOpts };
    });
  };

  return (
    // Змінено класи для центрування всього блоку на екрані
    <div className="min-h-screen bg-[#F5F7FF] text-[#0F172A]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-6 lg:flex-row lg:px-8">
        
        <TestSidebar 
          title={testData.title}
          questions={testData.questions}
          currentIndex={currentIndex}
          answers={answers}
          answeredCount={answeredCount}
          onNavigate={setCurrentIndex}
          onSubmit={() => handleSubmit(false)}
        />

        <TestBoard 
          question={testData.questions[currentIndex]}
          currentIndex={currentIndex}
          totalQuestions={testData.questions.length}
          timeLeft={timeLeft}
          answers={answers}
          onOptionSelect={handleOptionSelect}
          onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          onNext={() => setCurrentIndex((prev) => Math.min(prev + 1, testData.questions.length - 1))}
          onSubmit={() => handleSubmit(false)}
        />
        
      </div>
    </div>
  );
}