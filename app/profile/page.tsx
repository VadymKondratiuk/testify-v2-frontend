// src/app/profile/page.tsx
import { Target, TrendingUp, BrainCircuit, Clock } from "lucide-react";
import { StatData, RecommendationData, RecentTest, UserProfile } from "@/types/profile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatCard } from "@/components/profile/StatCard";
import { RecommendationsWidget } from "@/components/profile/RecommendationsWidget";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { RecentHistoryWidget } from "@/components/profile/RecentHistoryWidget";

// ── МОКОВІ ДАНІ ──
const userData: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com"
};

const userStats: StatData[] = [
  { icon: Target, label: "Tests Taken", value: "24", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: TrendingUp, label: "Average Score", value: "82%", color: "text-green-600", bg: "bg-green-50" },
  { icon: BrainCircuit, label: "Skills Mastered", value: "12", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Clock, label: "Hours Spent", value: "38h", color: "text-amber-600", bg: "bg-amber-50" }
];

const recommendations: RecommendationData[] = [
  { id: "r1", type: "gap", title: "Advanced PostgreSQL Triggers", description: "You scored 45% in this specific topic last week." },
  { id: "r2", type: "next", title: "NestJS Microservices Architecture", description: "Ready to advance after mastering REST APIs." }
];

const recentHistory: RecentTest[] = [
  { id: "h1", title: "React Hooks Deep Dive", date: "Today", score: "92%", passed: true },
  { id: "h2", title: "Database Optimization", date: "Yesterday", score: "65%", passed: false },
  { id: "h3", title: "Figma UI Patterns", date: "Mar 12", score: "100%", passed: true }
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      
      <ProfileHeader />
      
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT COLUMN (Stats & Recommendations) ── */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userStats.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>

          <RecommendationsWidget recommendations={recommendations} />
          
        </div>

        {/* ── RIGHT COLUMN (Profile & History) ── */}
        <div className="flex flex-col gap-8">
          
          <UserProfileCard user={userData} />
          <RecentHistoryWidget history={recentHistory} />
          
        </div>
      </div>
    </div>
  );
}