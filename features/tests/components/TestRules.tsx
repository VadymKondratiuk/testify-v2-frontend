interface TestRulesProps {
  questions: number;
  duration: string;
}

export const TestRules = ({ questions, duration }: TestRulesProps) => {
  return (
    <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E2E8F0]">
      <h3 className="font-semibold text-[#0F172A] mb-4">Before you begin:</h3>
      <ul className="text-[0.95rem] text-[#64748B] space-y-3 list-disc list-inside marker:text-[#4F46E5]">
        <li>The test consists of <span className="font-medium text-[#0F172A]">{questions}</span> multiple-choice questions.</li>
        <li>You will have exactly <span className="font-medium text-[#0F172A]">{duration}</span> to complete it.</li>
        <li>The timer cannot be paused once started.</li>
        <li>Please ensure you have a stable internet connection.</li>
      </ul>
    </div>
  );
};