import Link from "next/link";
import { Clock, HelpCircle, Star, BookOpen, ArrowRight } from "lucide-react";
import { TestCardData } from "../../../shared/types/testCardData.types";
import { difficultyStyles } from "../catalog.consts";

// ── Star rating renderer ──────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className="flex items-center gap-0.5 text-amber-600 text-[0.75rem] font-medium">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={12} fill="currentColor" strokeWidth={0} />
      ))}
      {hasHalf && (
        <Star key="half" size={12} fill="currentColor" strokeWidth={0} className="opacity-50" />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={12} fill="none" strokeWidth={1.5} className="opacity-40" />
      ))}
      <span className="ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

// ── Main component ────────────────────────────────────────────
export default function TestCard({ 
  card, 
  viewMode = "grid" 
}: { 
  card: TestCardData;
  viewMode?: "grid" | "list";
}) {
  const { id, category, title, difficulty, duration, questions, description, rating } = card;

  return (
    <article className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 flex
      ${viewMode === "grid" ? "flex-col" : "flex-col sm:flex-row"}
    `}>
      {/* Thumbnail */}
      <div className={`${viewMode === "grid" ? "w-full" : "w-full sm:w-[220px] shrink-0"}`}>
        {/* Додано h-full для CardThumbnail, щоб він розтягувався в режимі list */}
        <div className="h-[120px] sm:h-full min-h-[120px] bg-indigo-50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bg-indigo-100 h-px w-[200%] top-1/2 left-[-50%]" style={{ transform: "rotate(18deg)" }} />
            <div className="absolute bg-indigo-100 h-px w-[200%] top-1/2 left-[-50%]" style={{ transform: "rotate(-18deg)" }} />
          </div>
          <span className="relative z-10 flex items-center gap-1.5 bg-white text-slate-400 text-[0.72rem] px-3 py-1 border border-slate-200 rounded-md">
            <BookOpen size={12} strokeWidth={2} />
            {category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={`px-4 pt-4 pb-[18px] flex flex-col gap-2.5 flex-1 ${viewMode === "list" ? "justify-center" : ""}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[0.67rem] font-bold uppercase tracking-[0.08em] text-indigo-600 mb-1.5">
              {category}
            </div>
            <h2 className="font-['Sora',sans-serif] text-[1.05rem] font-bold text-slate-900 tracking-[-0.02em] leading-snug">
              {title}
            </h2>
          </div>
        </div>

        {/* Meta tags */}
        <div className="flex flex-wrap gap-1.5 my-1">
          <span className={`text-[0.67rem] font-semibold px-2.5 py-[3px] rounded-full tracking-[0.02em] whitespace-nowrap ${difficultyStyles[difficulty]}`}>
            {difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-[0.67rem] font-semibold px-2.5 py-[3px] rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
            <Clock size={10} strokeWidth={2.5} />
            {duration}
          </span>
          <span className="inline-flex items-center gap-1 text-[0.67rem] font-semibold px-2.5 py-[3px] rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
            <HelpCircle size={10} strokeWidth={2.5} />
            {questions} questions
          </span>
        </div>

        <p className="text-[0.8rem] leading-[1.65] text-slate-500 flex-1 line-clamp-2">{description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-1">
          <StarRating rating={rating} />
          <Link
            href={`/tests/${id}`}
            className="inline-flex items-center gap-1 text-[0.76rem] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-3 py-1.5 no-underline transition-all duration-200 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white hover:-translate-y-px"
          >
            Take Test
            <ArrowRight size={12} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}