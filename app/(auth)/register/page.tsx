"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import axios from "axios";
import { AuthContainer } from "@/features/auth/components/AuthContainer";
import { SocialAuth } from "@/features/auth/components/SocialAuth";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { AuthService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { canAccessPath, getPostLoginRedirect } from "@/features/auth/auth.rbac";

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user } = await AuthService.register({
        name,
        email,
        password,
      });

      setUser(user);

      const nextPath = new URLSearchParams(window.location.search).get("next");
      const fallbackPath = getPostLoginRedirect(user.role);
      const targetPath =
        nextPath &&
        nextPath.startsWith("/") &&
        !nextPath.startsWith("//") &&
        canAccessPath({ isAuthenticated: true, role: user.role }, nextPath)
          ? nextPath
          : fallbackPath;

      router.replace(targetPath);
      router.refresh();
    } catch (registerError) {
      setError(getErrorMessage(registerError, "Something went wrong while creating the account."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Create an account"
      subtitle="Join Testify to start tracking your knowledge."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    >
      <SocialAuth />

      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        <AuthInput
          id="name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="John Doe"
          icon={User}
          required
        />
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          icon={Mail}
          required
        />
        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          icon={Lock}
          required
        />

        {error && (
          <p className="text-sm font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#4F46E5] px-6 py-3 font-(family-name:--font-sora) text-[0.93rem] font-semibold text-white shadow-[0_4px_16px_rgba(79,70,229,0.38)] transition-all duration-[0.18s] hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-[0_6px_22px_rgba(79,70,229,0.48)] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
          {!isLoading && <ArrowRight size={16} strokeWidth={2.5} />}
        </button>
      </form>
    </AuthContainer>
  );
}
