"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation"; 

export default function Header() {
  const pathname = usePathname(); 

  return (
    <header className="sticky top-0 z-[200] h-[70px] flex items-center justify-between gap-6 px-12 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
      {/* Logo */}
      <Link
        href="/"
        className="font-['Sora',sans-serif] font-extrabold text-2xl tracking-[-0.04em] text-indigo-600 no-underline flex-shrink-0 after:content-['.'] after:text-amber-400"
      >
        Testify
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-0.5">
        {[
          { label: "Home", href: "/" }, 
          { label: "Catalog", href: "/catalog" },
          { label: "About Us", href: "/about" },
        ].map(({ label, href }) => {
          const isActive = pathname === href; 

          return (
            <Link
              key={label}
              href={href}
              className={`font-medium text-[0.9rem] px-4 py-2 rounded-md transition-colors duration-200 no-underline ${
                isActive
                  ? "text-indigo-600 bg-indigo-50 font-semibold"
                  : "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-1.5 font-semibold text-[0.85rem] px-5 py-[9px] rounded-md border-[1.5px] border-indigo-600 bg-transparent text-indigo-600 no-underline transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-700"
        >
          Log In
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-1.5 font-semibold text-[0.85rem] px-5 py-[9px] rounded-md border-[1.5px] border-indigo-600 bg-indigo-600 text-white no-underline shadow-[0_4px_16px_rgba(79,70,229,0.28)] transition-all duration-200 hover:bg-indigo-700 hover:border-indigo-700 hover:-translate-y-px"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}