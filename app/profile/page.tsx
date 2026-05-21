"use client";

// src/app/profile/page.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2 } from "lucide-react";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { StatCard } from "@/features/profile/components/StatCard";
import { RecommendationsWidget } from "@/features/profile/components/RecommendationsWidget";
import { LearningGoalsWidget } from "@/features/profile/components/LearningGoalsWidget";
import { UserProfileCard } from "@/features/profile/components/UserProfileCard";
import { RecentHistoryWidget } from "@/features/profile/components/RecentHistoryWidget";
import {
  getProfileDashboardData,
  type ProfileDashboardData,
} from "@/features/profile/profile.api";
import { useAuthStore } from "@/features/auth/auth.store";
import { trackRecommendationEvent } from "@/features/recommendations/recommendations.api";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    return Array.isArray(message)
      ? message.join(" ")
      : (message ?? "Unable to load profile data.");
  }

  return error instanceof Error
    ? error.message
    : "Unable to load profile data.";
}

export default function ProfilePage() {
  const currentUser = useAuthStore((state) => state.user);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const [profileData, setProfileData] = useState<ProfileDashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthReady) return;

    let ignore = false;

    getProfileDashboardData(currentUser)
      .then((data) => {
        if (!ignore) {
          setProfileData(data);
          setError(null);
          data.recommendations.forEach((recommendation) => {
            void trackRecommendationEvent({
              testId: recommendation.testId,
              placement: "profile",
              eventType: "recommendation_shown",
              source: "profile_next_steps",
              metadata: {
                type: recommendation.type,
                matchedTags: recommendation.matchedTags ?? [],
                goalMatches: recommendation.goalMatches ?? [],
                weaknessDetails: recommendation.weaknessDetails ?? [],
              },
            });
          });
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [currentUser, isAuthReady]);

  if (isLoading || !isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FF] px-5 text-[#0F172A]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[#4F46E5]" />
          <span className="font-semibold">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] pb-20">
        <ProfileHeader />
        <div className="mx-auto mt-8 w-full max-w-md px-5">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#EF4444]">
              <AlertTriangle size={28} />
            </div>
            <h2 className="mb-3 font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0F172A]">
              Profile unavailable
            </h2>
            <p className="mb-6 text-[#64748B]">
              {error ?? "Unable to load your profile."}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-xl bg-[#4F46E5] px-6 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#4338CA]"
            >
              Back to catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      <ProfileHeader />
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profileData.stats.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>

          <LearningGoalsWidget goals={profileData.learningGoals} />

          <RecommendationsWidget
            recommendations={profileData.recommendations}
          />
        </div>

        <div className="flex flex-col gap-8">
          <UserProfileCard user={profileData.user} />
          <RecentHistoryWidget history={profileData.recentHistory} />
        </div>
      </div>
    </div>
  );
}
