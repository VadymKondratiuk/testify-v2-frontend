import { mockTestResult } from "@/shared/mocks/test-result.mock";
import { mockTest } from "@/shared/mocks/test.mocks";
import { getQuestionStatus } from "@/features/results/result.utils";
import { ResultHeader } from "@/features/results/components/ResultHeader";
import { ResultMetrics } from "@/features/results/components/ResultMetrics";
import { ResultInsights } from "@/features/results/components/ResultInsights";
import { QuestionReviewItem } from "@/features/results/components/QuestionReviewItem";

interface TestResultsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TestResultsPage({ params }: TestResultsPageProps) {
  const { id } = await params;
  const testData = mockTest;
  const resultData = mockTestResult;

  // --- Обчислення метрик ---
  const totalPoints = testData.questions.reduce((sum, question) => sum + question.points, 0);
  const earnedPoints = resultData.answers.reduce((sum, answer) => sum + answer.earnedPoints, 0);
  const score = Math.round((earnedPoints / totalPoints) * 100);
  const passed = score >= testData.passingScore;
  
  const correctCount = testData.questions.filter((question) => {
    const answer = resultData.answers.find((item) => item.questionId === question.id);
    return getQuestionStatus(question, answer) === "correct";
  }).length;

  const averageTimePerQuestion = Math.round(resultData.totalTimeSeconds / testData.questions.length);

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-16">
      <ResultHeader 
        testId={id}
        title={testData.title}
        passed={passed}
        attemptId={resultData.id}
        submittedAt={resultData.submittedAt}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 md:px-8">
        <ResultMetrics 
          score={score}
          earnedPoints={earnedPoints}
          totalPoints={totalPoints}
          correctCount={correctCount}
          totalQuestions={testData.questions.length}
          passingScore={testData.passingScore}
          totalTimeSeconds={resultData.totalTimeSeconds}
          averageTimePerQuestion={averageTimePerQuestion}
        />

        <ResultInsights 
          improvements={resultData.improvements} 
        />

        <section className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-[1.5rem] font-bold text-[#0F172A]">Question Review</h2>
              <p className="mt-1 text-[0.95rem] text-[#64748B]">Compare your selected answers with the correct answers for every question.</p>
            </div>
          </div>

          {testData.questions.map((question, index) => (
            <QuestionReviewItem 
              key={question.id}
              index={index}
              question={question}
              resultAnswer={resultData.answers.find(a => a.questionId === question.id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}