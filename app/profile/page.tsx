// src/app/profile/page.tsx
import { recommendations, recentHistory, userData, userStats } from "@/features/profile/profile.mock";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { StatCard } from "@/features/profile/components/StatCard";
import { RecommendationsWidget } from "@/features/profile/components/RecommendationsWidget";
import { UserProfileCard } from "@/features/profile/components/UserProfileCard";
import { RecentHistoryWidget } from "@/features/profile/components/RecentHistoryWidget";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      <ProfileHeader />
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userStats.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>

          <RecommendationsWidget recommendations={recommendations} />
        </div>

        <div className="flex flex-col gap-8">
          <UserProfileCard user={userData} />
          <RecentHistoryWidget history={recentHistory} />
        </div>
      </div>
    </div>
  );
}
