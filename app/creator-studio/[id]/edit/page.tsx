"use client";

import { useState } from "react";
import { ListChecks, Settings, Plus } from "lucide-react";
import { TestData, Question } from "@/shared/types/test.types";
import { BuilderHeader } from "@/features/edit/components/BuilderHeader";
import { QuestionCard } from "@/features/edit/components/QuestionCard";
import { TestSettings } from "@/features/edit/components/TestSettings";
import { mockTest } from "@/shared/mocks/test.mocks";

export default function TestBuilderPage() {
  const [activeTab, setActiveTab] = useState<"questions" | "settings">("settings");
  const [testData, setTestData] = useState<TestData>(mockTest);

  // ── ACTIONS ДЛЯ НАЛАШТУВАНЬ ТЕСТУ ──
  const updateSetting = (field: keyof TestData, value: any) => {
    setTestData({ ...testData, [field]: value });
  };

  // ── ACTIONS ДЛЯ ПИТАНЬ ──
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type: "Single Choice",
      points: 1,
      text: "",
      tags: [],
      options: [
        { id: `o${Date.now()}-1`, text: "Option 1", isCorrect: false },
        { id: `o${Date.now()}-2`, text: "Option 2", isCorrect: false }
      ]
    };
    setTestData({ ...testData, questions: [...testData.questions, newQuestion] });
  };

  const removeQuestion = (questionId: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.filter(q => q.id !== questionId)
    });
  };

  const updateQuestionText = (questionId: string, newText: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => 
        q.id === questionId ? { ...q, text: newText } : q
      )
    });
  };

  const updateQuestionConfig = (questionId: string, field: "type" | "points", value: any) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => {
        if (q.id !== questionId) return q;
        
        if (field === "type" && value === "Single Choice" && q.type === "Multiple Choice") {
          let hasCorrect = false;
          const resetOptions = q.options.map(opt => {
            if (opt.isCorrect && !hasCorrect) {
              hasCorrect = true;
              return opt;
            }
            return { ...opt, isCorrect: false };
          });
          return { ...q, [field]: value, options: resetOptions };
        }
        
        return { ...q, [field]: value };
      })
    });
  };

  const addQuestionTag = (questionId: string, tag: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => 
        q.id === questionId ? { ...q, tags: [...q.tags, tag] } : q
      )
    });
  };

  const removeQuestionTag = (questionId: string, tagToRemove: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => 
        q.id === questionId ? { ...q, tags: q.tags.filter(t => t !== tagToRemove) } : q
      )
    });
  };

  // ── ACTIONS ДЛЯ ВАРІАНТІВ ВІДПОВІДЕЙ (OPTIONS) ──
  const addOption = (questionId: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => {
        if (q.id !== questionId) return q;
        const newOption = {
          id: `o${Date.now()}`,
          text: `Option ${q.options.length + 1}`,
          isCorrect: false
        };
        return { ...q, options: [...q.options, newOption] };
      })
    });
  };

  const removeOption = (questionId: string, optionId: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => {
        if (q.id !== questionId) return q;
        if (q.options.length <= 2) return q; 
        return { ...q, options: q.options.filter(o => o.id !== optionId) };
      })
    });
  };

  const updateOptionText = (questionId: string, optionId: string, newText: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: q.options.map(o => o.id === optionId ? { ...o, text: newText } : o)
        };
      })
    });
  };

  const toggleCorrectOption = (questionId: string, optionId: string) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => {
        if (q.id !== questionId) return q;

        const updatedOptions = q.options.map(o => {
          if (q.type === "Single Choice") {
            return { ...o, isCorrect: o.id === optionId };
          } else {
            return o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o;
          }
        });

        return { ...q, options: updatedOptions };
      })
    });
  };

return (
    <div className="min-h-screen bg-[#F5F7FF] flex flex-col">
      <div className="sticky top-[72px] z-30 flex flex-col w-full shadow-sm">
        {/* --- Header --- */}
        <BuilderHeader 
          title={testData.title} 
          onTitleChange={(e) => updateSetting("title", e.target.value)} 
        />
        {/* ── Tabs ── */}
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

      {/* ── Main Canvas ── */}
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
            <TestSettings 
              data={testData} 
              onChange={updateSetting} 
            />
          )}

        </div>
      </main>
    </div>
  );
}