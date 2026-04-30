import { notFound } from 'next/navigation';
// Імпортуй свої мокові дані з правильного шляху
import { mockTestCards } from '@/features/catalog/catalog.mock'; 

// Імпортуємо наші нові дрібні компоненти
import { TestHeader } from '@/features/tests/components/TestHeader';
import { TestMetrics } from '@/features/tests/components/TestMetrics';
import { TestRules } from '@/features/tests/components/TestRules';

interface TestDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TestDetailsPage({ params }: TestDetailsPageProps) {
  const resolvedParams = await params;
  
  const testId = parseInt(resolvedParams.id, 10);
  const testData = mockTestCards.find((t) => t.id === testId);

  if (!testData) {
    notFound(); 
  }

  return (
    <div className="w-full min-h-screen bg-[#F5F7FF]">
      {/* 1. Повноширинний Хедер */}
      <TestHeader 
        id={testData.id} 
        title={testData.title} 
        category={testData.category} 
      />

      {/* 2. Основний контент (обмежений по ширині) */}
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