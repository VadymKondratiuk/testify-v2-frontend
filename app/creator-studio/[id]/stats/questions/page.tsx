"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Users } from "lucide-react";

// ── МОКОВІ ДАНІ (Розширена статистика по питаннях) ──
const detailedQuestions = [
  {
    id: "q5",
    text: "What happens when a Promise is rejected but lacks a catch block?",
    totalAnswers: 412,
    options: [
      { id: "o1", text: "It fails silently without any errors", percent: 15, isCorrect: false },
      { id: "o2", text: "Uncaught (in promise) Error is thrown in the console", percent: 32, isCorrect: true },
      { id: "o3", text: "The promise is resolved as undefined automatically", percent: 40, isCorrect: false },
      { id: "o4", text: "The browser tab crashes instantly", percent: 13, isCorrect: false },
    ]
  },
  {
    id: "q2",
    text: "Explain the difference between microtasks and macrotasks in the Event Loop.",
    totalAnswers: 410,
    options: [
      { id: "o1", text: "Microtasks execute after macrotasks", percent: 25, isCorrect: false },
      { id: "o2", text: "Microtasks have higher priority and execute before the next macrotask", percent: 45, isCorrect: true },
      { id: "o3", text: "They are the exact same thing in ES6", percent: 20, isCorrect: false },
      { id: "o4", text: "Macrotasks are used only for Promises", percent: 10, isCorrect: false },
    ]
  },
  {
    id: "q8",
    text: "Which of the following are valid ways to declare a variable in modern ES6 JavaScript?",
    totalAnswers: 405,
    options: [
      { id: "o1", text: "let and const", percent: 85, isCorrect: true },
      { id: "o2", text: "var only", percent: 5, isCorrect: false },
      { id: "o3", text: "def and let", percent: 8, isCorrect: false },
      { id: "o4", text: "variable", percent: 2, isCorrect: false },
    ]
  }
];

export default function QuestionAnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FF] flex flex-col pb-20">
      
      {/* ── HEADER ── */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-[#E2E8F0] px-5 md:px-8 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          <Link 
            href="/creator-studio/101/stats" 
            className="w-fit flex items-center gap-2 text-[#64748B] hover:text-[#4F46E5] text-[0.85rem] font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
            <div>
              <h1 className="font-[family-name:var(--font-sora)] text-[1.5rem] font-bold text-[#0F172A]">
                Question Analytics
              </h1>
              <p className="text-[#64748B] text-[0.95rem] mt-1">
                Detailed breakdown of how students answered each question.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 p-5 md:p-8 max-w-4xl mx-auto w-full flex flex-col gap-8 mt-4">
        
        {detailedQuestions.map((question, qIdx) => (
          <div key={question.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
            
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <h3 className="font-semibold text-[#0F172A] text-[1.1rem] leading-relaxed">
                <span className="text-[#94A3B8] mr-2">Q{qIdx + 1}.</span>
                {question.text}
              </h3>
              <div className="shrink-0 flex items-center gap-1.5 bg-[#F1F5F9] px-3 py-1.5 rounded-lg text-[#64748B] text-[0.8rem] font-medium">
                <Users size={14} />
                {question.totalAnswers} responses
              </div>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-3">
              {question.options.map((option) => {
                const isCorrect = option.isCorrect;
                // Знаходимо, чи це дистрактор (неправильна відповідь, яку обрало багато людей)
                const isDistractor = !isCorrect && option.percent > 25; 

                return (
                  <div 
                    key={option.id} 
                    className={`relative overflow-hidden border rounded-xl p-4 flex items-center justify-between gap-4 transition-colors z-10
                      ${isCorrect ? 'border-[#10B981]/30' : isDistractor ? 'border-orange-200' : 'border-[#E2E8F0]'}
                    `}
                  >
                    {/* Background Progress Bar */}
                    <div 
                      className={`absolute left-0 top-0 bottom-0 -z-10 transition-all duration-1000 ease-out
                        ${isCorrect ? 'bg-[#10B981]/10' : isDistractor ? 'bg-orange-50' : 'bg-[#F8FAFC]'}
                      `}
                      style={{ width: `${option.percent}%` }}
                    />

                    {/* Option Text & Icon */}
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle2 size={20} className="text-[#10B981] shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#CBD5E1] shrink-0" />
                      )}
                      <span className={`text-[0.95rem] ${isCorrect ? 'text-[#065F46] font-medium' : 'text-[#334155]'}`}>
                        {option.text}
                      </span>
                    </div>

                    {/* Percentage */}
                    <div className={`font-bold text-[1rem] shrink-0
                      ${isCorrect ? 'text-[#10B981]' : isDistractor ? 'text-orange-500' : 'text-[#64748B]'}
                    `}>
                      {option.percent}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Insight (Опціональна крута фіча) */}
            {question.options.some(o => !o.isCorrect && o.percent > 30) && (
              <div className="mt-6 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl p-4 flex gap-3 text-[#4F46E5] text-[0.85rem]">
                <div className="shrink-0 mt-0.5">💡</div>
                <p>
                  <strong>Insight:</strong> 40% of students chose the third option. This suggests a common misconception about how promises resolve implicitly. Consider adding a lesson on this specific case.
                </p>
              </div>
            )}

          </div>
        ))}

      </main>
    </div>
  );
}