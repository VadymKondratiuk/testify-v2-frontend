// src/components/profile/UserProfileCard.tsx
import Link from "next/link";
import { User } from "lucide-react";
import { UserProfile } from "@/features/profile/types/profile";

interface UserProfileCardProps {
  user: UserProfile;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-[#E0E7FF] border-4 border-white shadow-md flex items-center justify-center mb-4 relative">
        <User size={40} className="text-[#4F46E5]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#10B981] border-2 border-white rounded-full"></div>
      </div>
      <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem]">
        {user.name}
      </h2>
      <p className="text-[#64748B] text-[0.9rem] mb-4">{user.email}</p>
      <div className="w-full h-px bg-[#E2E8F0] mb-4" />
      <Link href="/settings" className="w-full py-2 border border-[#E2E8F0] rounded-lg text-[#334155] font-medium text-[0.9rem] hover:bg-[#F8FAFC] transition-colors block text-center">
        Edit Profile
      </Link>
    </div>
  );
}