"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { AuthContainer } from "@/features/auth/components/AuthContainer";
import { SocialAuth } from "@/features/auth/components/SocialAuth";
import { AuthInput } from "@/features/auth/components/AuthInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Тут буде логіка авторизації
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
        
        <button type="submit" className="cursor-pointer mt-1 w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-(family-name:--font-sora) font-semibold text-[0.93rem] px-6 py-3 rounded-[10px] shadow-[0_4px_16px_rgba(79,70,229,0.38)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.48)] hover:-translate-y-0.5 transition-all duration-[0.18s] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2">
          Log In
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </form>
    </AuthContainer>
  );
}