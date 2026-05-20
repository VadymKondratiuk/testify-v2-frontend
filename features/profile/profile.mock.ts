import { BrainCircuit, Clock, Target, TrendingUp } from "lucide-react";
import { RecommendationData, RecentTest, StatData, UserProfile } from "@/features/profile/profile.types";

export const userData: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
};

export const userStats: StatData[] = [
  { icon: Target, label: "Tests Taken", value: "24", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: TrendingUp, label: "Average Score", value: "82%", color: "text-green-600", bg: "bg-green-50" },
  { icon: BrainCircuit, label: "Skills Mastered", value: "12", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Clock, label: "Hours Spent", value: "38h", color: "text-amber-600", bg: "bg-amber-50" },
];

export const recommendations: RecommendationData[] = [
  { id: "r1", testId: "r1", type: "gap", title: "Advanced PostgreSQL Triggers", description: "You scored 45% in this specific topic last week." },
  { id: "r2", testId: "r2", type: "next", title: "NestJS Microservices Architecture", description: "Ready to advance after mastering REST APIs." },
];

export const recentHistory: RecentTest[] = [
  { id: "h1", title: "React Hooks Deep Dive", date: "Today", score: "92%", passed: true },
  { id: "h2", title: "Database Optimization", date: "Yesterday", score: "65%", passed: false },
  { id: "h3", title: "Figma UI Patterns", date: "Mar 12", score: "100%", passed: true },
];
