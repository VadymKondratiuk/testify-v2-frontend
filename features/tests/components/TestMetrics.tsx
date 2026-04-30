import { Clock, BarChart, ListChecks, Star } from 'lucide-react';

interface TestMetricsProps {
  duration: string;
  difficulty: string;
  questions: number;
  rating: number;
}

export const TestMetrics = ({ duration, difficulty, questions, rating }: TestMetricsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-y border-[#E2E8F0] py-6">
      <div className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-xl text-center">
        <Clock className="w-6 h-6 text-[#4F46E5] mb-2" />
        <span className="text-sm text-[#64748B] mb-0.5">Duration</span>
        <span className="font-semibold text-[#0F172A]">{duration}</span>
      </div>
      
      <div className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-xl text-center">
        <BarChart className="w-6 h-6 text-[#4F46E5] mb-2" />
        <span className="text-sm text-[#64748B] mb-0.5">Difficulty</span>
        <span className="font-semibold text-[#0F172A]">{difficulty}</span>
      </div>

      <div className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-xl text-center">
        <ListChecks className="w-6 h-6 text-[#4F46E5] mb-2" />
        <span className="text-sm text-[#64748B] mb-0.5">Questions</span>
        <span className="font-semibold text-[#0F172A]">{questions}</span>
      </div>

      <div className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-xl text-center">
        <Star className="w-6 h-6 text-[#4F46E5] mb-2" />
        <span className="text-sm text-[#64748B] mb-0.5">Rating</span>
        <span className="font-semibold text-[#0F172A]">{rating} / 5.0</span>
      </div>
    </div>
  );
};