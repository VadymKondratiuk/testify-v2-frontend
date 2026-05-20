// src/components/creator-studio/QuestionCard.tsx
import { GripVertical, Trash2, Plus, CheckCircle2, X } from "lucide-react"; 
import { Question } from "@/shared/types/test.types";
import { TagAutocomplete } from "@/features/edit/components/TagAutocomplete";
import { useRef, useEffect } from "react";

interface QuestionCardProps {
  question: Question;
  index: number;
  onRemove: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  onUpdateConfig: (id: string, field: "type" | "points", value: Question["type"] | number) => void;
  onUpdateCorrectTextAnswer: (id: string, correctTextAnswer: string) => void;
  onAddAcceptedTextAnswer: (id: string) => void;
  onUpdateAcceptedTextAnswer: (id: string, index: number, value: string) => void;
  onRemoveAcceptedTextAnswer: (id: string, index: number) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, optionId: string) => void;
  onUpdateOptionText: (questionId: string, optionId: string, text: string) => void;
  onToggleCorrect: (questionId: string, optionId: string) => void;
  onAddTag: (questionId: string, tag: string) => void;
  onRemoveTag: (questionId: string, tag: string) => void; 
  disabled?: boolean;
}

export function QuestionCard({
  question, index, onRemove, onUpdateText, onUpdateConfig,
  onUpdateCorrectTextAnswer, onAddAcceptedTextAnswer, onUpdateAcceptedTextAnswer,
  onRemoveAcceptedTextAnswer, onAddOption, onRemoveOption, onUpdateOptionText, onToggleCorrect,
  onAddTag, onRemoveTag, disabled = false
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

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#4F46E5]/40 focus-within:border-[#4F46E5] transition-all group">
      
      <div className="bg-[#F8FAFC] px-4 py-2 flex items-center justify-between border-b border-[#E2E8F0]">
        <button disabled={disabled} className="cursor-grab text-[#94A3B8] hover:text-[#0F172A] disabled:cursor-not-allowed disabled:hover:text-[#94A3B8]">
          <GripVertical size={16} />
        </button>
        <button disabled={disabled} onClick={() => onRemove(question.id)} className="cursor-pointer text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1.5 hover:bg-red-50 rounded-lg disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#94A3B8]">
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
              disabled={disabled}
              onChange={(e) => onUpdateText(question.id, e.target.value)}
              className="w-full text-[1.1rem] font-medium text-[#0F172A] placeholder-[#94A3B8] bg-transparent border-b-2 border-transparent hover:border-[#E2E8F0] focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-4 focus:ring-offset-white rounded-md p-1 resize-none transition-all overflow-hidden disabled:cursor-not-allowed disabled:text-[#475569] disabled:hover:border-transparent"
            />
            
            {/* ── БЛОК ТЕГІВ ── */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {question.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-1 rounded-md text-[0.8rem] font-semibold border border-[#C7D2FE]">
                  #{tag}
                  <button 
                    disabled={disabled}
                    onClick={() => onRemoveTag(question.id, tag)}
                    className="hover:bg-[#C7D2FE] p-0.5 rounded transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </span>
              ))}
              <TagAutocomplete
                selectedTags={question.tags}
                disabled={disabled}
                onAddTag={(tag) => onAddTag(question.id, tag)}
              />
            </div>

          </div>
        </div>

        {question.type === "Text Answer" ? (
          <div className="ml-8 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <label className="mb-2 block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[#64748B]">
              Correct answer
            </label>
            <input
              type="text"
              value={question.correctTextAnswer ?? ""}
              disabled={disabled}
              onChange={(e) => onUpdateCorrectTextAnswer(question.id, e.target.value)}
              placeholder="Correct text answer"
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[0.95rem] font-medium text-[#0F172A] placeholder-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
            />
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[#64748B]">
                  Accepted alternatives
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onAddAcceptedTextAnswer(question.id)}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-[#C7D2FE] bg-white px-2.5 py-1.5 text-[0.8rem] font-semibold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:border-[#E2E8F0] disabled:text-[#94A3B8] disabled:hover:bg-white"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              {(question.acceptedTextAnswers ?? []).map((acceptedAnswer, acceptedIndex) => (
                <div key={acceptedIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={acceptedAnswer}
                    disabled={disabled}
                    onChange={(e) => onUpdateAcceptedTextAnswer(question.id, acceptedIndex, e.target.value)}
                    placeholder="Alternative accepted answer"
                    className="min-w-0 flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[0.9rem] font-medium text-[#0F172A] placeholder-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                  />
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onRemoveAcceptedTextAnswer(question.id, acceptedIndex)}
                    className="cursor-pointer shrink-0 rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-red-50 hover:text-[#EF4444] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#94A3B8]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
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
                disabled={disabled}
              />
            ))}
            
            <button 
              disabled={disabled}
              onClick={() => onAddOption(question.id)}
              className="cursor-pointer flex items-center gap-2 text-[#4F46E5] font-medium text-[0.9rem] hover:underline w-fit mt-2 disabled:cursor-not-allowed disabled:text-[#94A3B8] disabled:hover:no-underline"
            >
              <Plus size={16} /> Add Option
            </button>
          </div>
        )}
      </div>
      
      {/* Footer Settings */}
      <div className="bg-[#F8FAFC] px-6 py-3 border-t border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select 
            value={question.type}
            disabled={disabled}
            onChange={(e) => onUpdateConfig(question.id, "type", e.target.value as Question["type"])}
            className="cursor-pointer bg-white border border-[#E2E8F0] text-[#334155] text-[0.85rem] font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
          >
            <option value="Single Choice">Single Choice</option>
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="Text Answer">Text Answer</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.85rem] font-medium text-[#64748B]">Points:</span>
          <input 
            type="number" 
            min="1"
            value={question.points} 
            disabled={disabled}
            onChange={(e) => onUpdateConfig(question.id, "points", parseInt(e.target.value) || 1)}
            className="w-16 text-center border border-[#E2E8F0] rounded-lg py-1 text-[0.9rem] font-semibold text-[#0F172A] focus:outline-none focus:border-[#4F46E5] disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#64748B]" 
          />
        </div>
      </div>
    </div>
  );
}

// Мікро-компонент залишається тут, бо він належить тільки QuestionCard
interface OptionRowProps {
  text: string;
  isCorrect: boolean;
  inputType: "radio" | "checkbox";
  canRemove: boolean;
  onTextChange: (text: string) => void;
  onToggleCorrect: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

function OptionRow({ text, isCorrect, inputType, canRemove, onTextChange, onToggleCorrect, onRemove, disabled = false }: OptionRowProps) {
  return (
    <div className="flex items-center gap-3 group/option">
      <button 
        disabled={disabled}
        onClick={onToggleCorrect}
        className={`cursor-pointer w-5 h-5 flex items-center justify-center shrink-0 transition-colors disabled:cursor-not-allowed ${
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
        disabled={disabled}
        onChange={(e) => onTextChange(e.target.value)}
        className={`flex-1 text-[0.95rem] font-medium border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-colors disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#64748B] ${
          isCorrect 
            ? "border-[#10B981]/40 bg-[#10B981]/5 text-[#0F172A]" 
            : "border-[#E2E8F0] focus:border-[#4F46E5] bg-white text-[#1E293B]"
        }`}
      />
      
      {canRemove ? (
        <button 
          disabled={disabled}
          onClick={onRemove}
          className="cursor-pointer text-[#94A3B8] hover:text-[#EF4444] opacity-0 group-hover/option:opacity-100 transition-opacity p-1 disabled:cursor-not-allowed disabled:hover:text-[#94A3B8]"
        >
          <Trash2 size={16} />
        </button>
      ) : (
        <div className="w-[24px]"></div>
      )}
    </div>
  );
}
