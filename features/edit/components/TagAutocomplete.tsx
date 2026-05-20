import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { normalizeTagName, searchTags, type TagSuggestion } from "@/features/edit/tags.api";

interface TagAutocompleteProps {
  selectedTags: string[];
  disabled?: boolean;
  onAddTag: (tag: string) => void;
}

const debounceMs = 250;

export function TagAutocomplete({
  selectedTags,
  disabled = false,
  onAddTag,
}: TagAutocompleteProps) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const closeTimerRef = useRef<number | null>(null);
  const normalizedValue = normalizeTagName(value);
  const selectedTagSet = useMemo(
    () => new Set(selectedTags.map(normalizeTagName)),
    [selectedTags],
  );
  const filteredSuggestions = useMemo(
    () => suggestions.filter((tag) => !selectedTagSet.has(normalizeTagName(tag.name))),
    [selectedTagSet, suggestions],
  );
  const canCreateTag = Boolean(normalizedValue) && !selectedTagSet.has(normalizedValue);

  useEffect(() => {
    if (!isOpen || disabled) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsLoading(true);

      searchTags(normalizedValue, controller.signal)
        .then((items) => {
          setSuggestions(items);
          setActiveIndex(0);
        })
        .catch((error) => {
          if (!axios.isCancel(error) && !controller.signal.aborted) {
            setSuggestions([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, debounceMs);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [disabled, isOpen, normalizedValue]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const addTag = (tag: string) => {
    const normalizedTag = normalizeTagName(tag);

    if (!normalizedTag || selectedTagSet.has(normalizedTag)) {
      return;
    }

    onAddTag(normalizedTag);
    setValue("");
    setSuggestions([]);
    setActiveIndex(0);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (disabled) {
      return;
    }

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    setIsOpen(true);
  };

  const handleBlur = () => {
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 120);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        Math.min(current + 1, Math.max(filteredSuggestions.length - 1, 0)),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const activeSuggestion = filteredSuggestions[activeIndex];
      if (isOpen && activeSuggestion) {
        addTag(activeSuggestion.name);
        return;
      }

      if (canCreateTag) {
        addTag(normalizedValue);
      }
    }
  };

  return (
    <div className="relative min-w-[8rem]">
      <input
        type="text"
        value={value}
        placeholder={selectedTags.length === 0 ? "Add tags..." : "Add tag..."}
        disabled={disabled}
        onBlur={handleBlur}
        onChange={(event) => {
          setValue(event.target.value);
          setIsOpen(true);
        }}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className="w-32 bg-transparent text-[0.85rem] font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none disabled:cursor-not-allowed disabled:text-[#64748B]"
      />

      {isOpen && !disabled && (filteredSuggestions.length > 0 || canCreateTag || isLoading) && (
        <div className="absolute left-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xl">
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-2 text-[0.82rem] font-medium text-[#64748B]">
              <Loader2 size={14} className="animate-spin" />
              Searching...
            </div>
          ) : (
            <>
              {filteredSuggestions.map((tag, index) => (
                <button
                  key={tag.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => addTag(tag.name)}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[0.86rem] font-medium transition-colors ${
                    activeIndex === index
                      ? "bg-[#EEF2FF] text-[#3730A3]"
                      : "text-[#334155] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <span>#{tag.name}</span>
                  <span className="flex items-center gap-2 text-[0.72rem] text-[#94A3B8]">
                    {tag.usageCount} q.
                    {activeIndex === index && <Check size={13} />}
                  </span>
                </button>
              ))}

              {canCreateTag && (
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => addTag(normalizedValue)}
                  className="flex w-full items-center gap-2 border-t border-[#E2E8F0] px-3 py-2 text-left text-[0.86rem] font-semibold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
                >
                  <Plus size={14} />
                  Create #{normalizedValue}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
