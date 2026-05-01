"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { AuthContainer } from "@/features/auth/components/AuthContainer";
import { SocialAuth } from "@/features/auth/components/SocialAuth";
import { AuthInput } from "@/features/auth/components/AuthInput";
import {
  ROLES,
  canAccessPath,
  getPostLoginRedirect,
  type Role,
} from "@/shared/auth/rbac";
import { setClientSession } from "@/shared/auth/client-session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setClientSession(role);

    const nextPath = new URLSearchParams(window.location.search).get("next");
    const fallbackPath = getPostLoginRedirect(role);
    const targetPath =
      nextPath &&
      nextPath.startsWith("/") &&
      !nextPath.startsWith("//") &&
      canAccessPath({ isAuthenticated: true, role }, nextPath)
        ? nextPath
        : fallbackPath;

    router.replace(targetPath);
    router.refresh();
  };

  return (
    <AuthContainer
      title="Welcome back"
      subtitle="Log in to continue your learning journey."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/register"
    >
      <SocialAuth />
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <AuthInput id="email" label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" icon={Mail} />
        <AuthInput id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" icon={Lock} forgotPasswordHref="#" />
        <label className="flex flex-col gap-1.5">
          <span className="text-[0.85rem] font-semibold text-[#334155]">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="h-12 w-full rounded-[10px] border border-[#CBD5E1] bg-white px-4 text-[0.95rem] font-medium text-[#0F172A] outline-none transition-colors focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
          >
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="cursor-pointer mt-1 w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-(family-name:--font-sora) font-semibold text-[0.93rem] px-6 py-3 rounded-[10px] shadow-[0_4px_16px_rgba(79,70,229,0.38)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.48)] hover:-translate-y-0.5 transition-all duration-[0.18s] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2">
          Log In
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </form>
    </AuthContainer>
  );
}

