"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";
import {
  ADMIN_ROLES,
  CREATOR_STUDIO_ROLES,
  canRoleAccess,
} from "@/features/auth/auth.rbac";
import { AuthService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";

const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
] as const;

const creatorNavItem = { label: "Creator Studio", href: "/creator-studio" } as const;
const adminNavItem = { label: "Admin Panel", href: "/admin" } as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const navItems = [
    ...publicNavItems,
    ...(canRoleAccess(user?.role ?? null, CREATOR_STUDIO_ROLES) ? [creatorNavItem] : []),
    ...(canRoleAccess(user?.role ?? null, ADMIN_ROLES) ? [adminNavItem] : []),
  ];

  const handleLogout = async () => {
    await AuthService.logout();
    clearAuth();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-[200] h-[70px] flex items-center justify-between gap-6 px-12 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-8">
        <Link
          href="/catalog"
          className="font-['Sora',sans-serif] font-extrabold text-2xl tracking-[-0.04em] text-indigo-600 no-underline flex-shrink-0 after:content-['.'] after:text-amber-400"
        >
          Testify
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ label, href }) => {
            const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={label}
                href={href}
                className={`font-medium text-[0.9rem] px-3.5 py-2 rounded-md transition-colors duration-200 no-underline ${
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
      </div>

      <div className="flex min-w-[185px] items-center justify-end gap-2.5">
        {!isAuthReady ? (
          <div className="h-9 w-[145px] rounded-md bg-slate-100" aria-hidden="true" />
        ) : isAuthenticated && user ? (
          <>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[0.82rem] font-semibold text-slate-700 no-underline transition-colors hover:bg-indigo-50 hover:text-indigo-600"
            >
              <UserCircle size={16} />
              {user.role}
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
