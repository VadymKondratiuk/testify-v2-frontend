"use client"; 

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CREATOR_STUDIO_ROLES,
  canRoleAccess,
  type AuthSession,
} from "@/shared/auth/rbac";
import {
  AUTH_SESSION_EVENT,
  clearClientSession,
  getClientSession,
} from "@/shared/auth/client-session";

const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
] as const;

const authenticatedNavItems = [
  { label: "Profile", href: "/profile" },
] as const;

const creatorNavItem = { label: "Creator Studio", href: "/creator-studio" } as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession>({
    isAuthenticated: false,
    role: null,
  });

  useEffect(() => {
    const syncSession = () => setSession(getClientSession());

    syncSession();
    window.addEventListener(AUTH_SESSION_EVENT, syncSession);
    window.addEventListener("focus", syncSession);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, syncSession);
      window.removeEventListener("focus", syncSession);
    };
  }, []);

  const navItems = [
    ...publicNavItems,
    ...(session.isAuthenticated ? authenticatedNavItems : []),
    ...(canRoleAccess(session.role, CREATOR_STUDIO_ROLES) ? [creatorNavItem] : []),
  ];

  const handleLogout = () => {
    clearClientSession();
    router.push("/login");
    router.refresh();
  };

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
        {navItems.map(({ label, href }) => {
          const isActive = href === "/" ? pathname === href : pathname.startsWith(href); 

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

      {/* Auth | Profile */}
      <div className="flex items-center gap-2.5">
        {session.isAuthenticated ? (
          <>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[0.82rem] font-semibold text-slate-700 no-underline transition-colors hover:bg-indigo-50 hover:text-indigo-600"
            >
              <UserCircle size={16} />
              {session.role}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border-[1.5px] border-indigo-600 bg-transparent px-4 py-[9px] text-[0.85rem] font-semibold text-indigo-600 transition-all duration-200 hover:border-indigo-700 hover:bg-indigo-50"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  );
}
