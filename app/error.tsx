"use client"; // Це критично важливо для error.tsx

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // Логуємо помилку в консоль (або в систему моніторингу типу Sentry)
  useEffect(() => {
    console.error("Critical Runtime Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F7FF] px-5 text-center text-[#0F172A]">
      <div className="w-full max-w-md rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF2F2] text-[#EF4444]">
          <AlertTriangle size={32} strokeWidth={2} />
        </div>
        
        <h1 className="mb-3 font-[family-name:var(--font-sora)] text-[1.5rem] font-bold leading-tight">
          Oops! Something went wrong
        </h1>
        
        <p className="mb-8 text-[0.95rem] leading-relaxed text-[#64748B]">
          An unexpected error occurred while processing your request. Don't worry, it's not your fault. 
        </p>
        
        <button
          // Функція reset спробує заново відрендерити сегмент, де сталася помилка
          onClick={() => reset()} 
          className="group mx-auto flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3.5 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-[#4338CA]"
        >
          <RefreshCcw size={18} className="transition-transform duration-300 group-hover:rotate-180" />
          Try Again
        </button>

        {/* Опціонально: для дебагу під час розробки (можна прибрати на продакшені) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 rounded-lg bg-[#F8FAFC] p-4 text-left">
            <p className="text-[0.75rem] font-bold text-[#64748B]">Developer details:</p>
            <p className="mt-1 font-mono text-[0.7rem] text-[#EF4444] break-words">
              {error.message}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}