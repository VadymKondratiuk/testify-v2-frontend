// src/types/profile.ts
import { LucideIcon } from "lucide-react";

export interface StatData {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bg: string;
}

export interface RecommendationData {
  id: string;
  testId: string;
  type: "gap" | "next";
  title: string;
  description: string;
  matchedTags?: string[];
}

export interface RecentTest {
  id: string;
  title: string;
  date: string;
  score: string;
  passed: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string; // на майбутнє
}
