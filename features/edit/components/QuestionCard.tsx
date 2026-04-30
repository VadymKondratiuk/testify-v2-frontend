// src/components/creator-studio/QuestionCard.tsx
import { GripVertical, Trash2, Plus, CheckCircle2, X } from "lucide-react"; 
import { Question } from "@/features/edit/edit.types";
import { useRef, useEffect } from "react";

interface QuestionCardProps {
  question: Question;
  index: number;
  onRemove: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  onUpdateConfig: (id: string, field: "type" | "points", value: any) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, optionId: string) => void;
  onUpdateOptionText: (questionId: string, optionId: string, text: string) => void;
  onToggleCorrect: (questionId: string, optionId: string) => void;
  onAddTag: (questionId: string, tag: string) => void;
  onRemoveTag: (questionId: string, tag: string) => void; 
}

export function QuestionCard({
  question, index, onRemove, onUpdateText, onUpdateConfig,
  onAddOption, onRemoveOption, onUpdateOptionText, onToggleCorrect,
  onAddTag, onRemoveTag
}: QuestionCardProps) {

  // 1. Створюємо реф для доступу до DOM-елемента textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 2. Ефект, який автоматично міняє висоту при зміні тексту
  useEffect(() => {
    if (textareaRef.current) {
      // Спочатку скидаємо висоту до 'auto', щоб поле могло зменшуватися при видаленні тексту
      textareaRef.current.style.height = "auto";
      // Встановлюємо висоту відповідно до внутрішнього контенту (scrollHeight)
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [question.text]); // Спрацьовує при кожній зміні тексту питання

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim().toLowerCase();
      if (newTag && !question.tags.includes(newTag)) {
        onAddTag(question.id, newTag);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#4F46E5]/40 focus-within:border-[#4F46E5] transition-all group">
      
      <div className="bg-[#F8FAFC] px-4 py-2 flex items-center justify-between border-b border-[#E2E8F0]">
        <button className="cursor-grab text-[#94A3B8] hover:text-[#0F172A]">
          <GripVertical size={16} />
        </button>
        <button onClick={() => onRemove(question.id)} className="cursor-pointer text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1.5 hover:bg-red-50 rounded-lg">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-5">
          <span className="font-[family-name:var(--font-sora)] font-bold text-[#4F46E5] text-[1.2rem]">
            {index + 1}.
          </span>
          <div className="flex-1">
            <textarea 
              ref={textareaRef}
              rows={1}
              placeholder="Type your question here..."
              value={question.text}
              onChange={(e) => onUpdateText(question.id, e.target.value)}
              className="w-full text-[1.1rem] font-medium text-[#0F172A] placeholder-[#94A3B8] bg-transparent border-b-2 border-transparent hover:border-[#E2E8F0] focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-4 focus:ring-offset-white rounded-md p-1 resize-none transition-all overflow-hidden"
            />
            
            {/* ── БЛОК ТЕГІВ ── */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {question.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-1 rounded-md text-[0.8rem] font-semibold border border-[#C7D2FE]">
                  #{tag}
                  <button 
                    onClick={() => onRemoveTag(question.id, tag)}
                    className="hover:bg-[#C7D2FE] p-0.5 rounded transition-colors"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </span>
              ))}
              <input 
                type="text" 
                placeholder={question.tags.length === 0 ? "Add tags..." : "Add tag..."}
                onKeyDown={handleTagKeyDown}
                className="text-[0.85rem] font-medium text-[#0F172A] placeholder-[#94A3B8] bg-transparent focus:outline-none w-32 ml-1"
              />
            </div>

          </div>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3 pl-8">
          {question.options.map((option) => (
            <OptionRow 
              key={option.id} 
              text={option.text} 
              isCorrect={option.isCorrect} 
              inputType={question.type === "Single Choice" ? "radio" : "checkbox"} 
              canRemove={question.options.length > 2}
              onTextChange={(newText: string) => onUpdateOptionText(question.id, option.id, newText)}
              onToggleCorrect={() => onToggleCorrect(question.id, option.id)}
              onRemove={() => onRemoveOption(question.id, option.id)}
            />
          ))}
          
          <button 
            onClick={() => onAddOption(question.id)}
            className="cursor-pointer flex items-center gap-2 text-[#4F46E5] font-medium text-[0.9rem] hover:underline w-fit mt-2"
          >
            <Plus size={16} /> Add Option
          </button>
        </div>
      </div>
      
      {/* Footer Settings */}
      <div className="bg-[#F8FAFC] px-6 py-3 border-t border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select 
            value={question.type}
            onChange={(e) => onUpdateConfig(question.id, "type", e.target.value)}
            className="cursor-pointer bg-white border border-[#E2E8F0] text-[#334155] text-[0.85rem] font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
          >
            <option value="Single Choice">Single Choice</option>
            <option value="Multiple Choice">Multiple Choice</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.85rem] font-medium text-[#64748B]">Points:</span>
          <input 
            type="number" 
            min="1"
            value={question.points} 
            onChange={(e) => onUpdateConfig(question.id, "points", parseInt(e.target.value) || 1)}
            className="w-16 text-center border border-[#E2E8F0] rounded-lg py-1 text-[0.9rem] font-semibold text-[#0F172A] focus:outline-none focus:border-[#4F46E5]" 
          />
        </div>
      </div>
    </div>
  );
}

// Мікро-компонент залишається тут, бо він належить тільки QuestionCard
function OptionRow({ text, isCorrect, inputType, canRemove, onTextChange, onToggleCorrect, onRemove }: any) {
  return (
    <div className="flex items-center gap-3 group/option">
      <button 
        onClick={onToggleCorrect}
        className={`cursor-pointer w-5 h-5 flex items-center justify-center shrink-0 transition-colors ${
          inputType === 'radio' ? 'rounded-full' : 'rounded'
        } border-2 ${
          isCorrect ? "border-[#10B981] bg-[#10B981]" : "border-[#CBD5E1] group-hover/option:border-[#94A3B8]"
        }`}
      >
        {isCorrect && <CheckCircle2 size={12} className="text-white" />}
      </button>
      
      <input 
        type="text" 
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className={`flex-1 text-[0.95rem] font-medium border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-colors ${
          isCorrect 
            ? "border-[#10B981]/40 bg-[#10B981]/5 text-[#0F172A]" 
            : "border-[#E2E8F0] focus:border-[#4F46E5] bg-white text-[#1E293B]"
        }`}
      />
      
      {canRemove ? (
        <button 
          onClick={onRemove}
          className="cursor-pointer text-[#94A3B8] hover:text-[#EF4444] opacity-0 group-hover/option:opacity-100 transition-opacity p-1"
        >
          <Trash2 size={16} />
        </button>
      ) : (
        <div className="w-[24px]"></div>
      )}
    </div>
  );
}