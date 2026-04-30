import { BarChart3, Clock, Target, Users } from "lucide-react";
import { ResultData } from "@/features/stats/stats.types";

export const statsOverview = [
  { title: "Total Attempts", value: "412", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Average Score", value: "78%", icon: BarChart3, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
  { title: "Completion Rate", value: "92%", icon: Target, color: "text-purple-600", bg: "bg-purple-100" },
  { title: "Avg. Time Spent", value: "14m", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
];

export const scoreDistribution = [
  { range: "0-20%", students: 12 },
  { range: "21-40%", students: 28 },
  { range: "41-60%", students: 85 },
  { range: "61-80%", students: 154 },
  { range: "81-100%", students: 133 },
];

export const toughestQuestions = [
  { id: "q5", text: "What happens when a Promise is rejected but lacks a catch block?", successRate: 32 },
  { id: "q2", text: "Explain the difference between microtasks and macrotasks in the Event Loop.", successRate: 45 },
  { id: "q8", text: "How does the 'this' keyword behave inside an arrow function?", successRate: 51 },
  { id: "q9", text: "How does the 'this' keyword behave inside an arrow function?", successRate: 51 },
  { id: "q10", text: "How does the 'this' keyword behave inside an arrow function?", successRate: 51 },
  { id: "q11", text: "How does the 'this' keyword behave inside an arrow function?", successRate: 51 },
];

export const allResults: ResultData[] = [
  { id: 1, student: "Oleksandr K.", score: 95, time: "12m", date: "Today, 10:23 AM", status: "passed" },
  { id: 2, student: "Mariia L.", score: 60, time: "20m", date: "Yesterday", status: "failed" },
  { id: 3, student: "Vadym T.", score: 82, time: "15m", date: "2 days ago", status: "passed" },
  { id: 4, student: "Anna P.", score: 100, time: "9m", date: "3 days ago", status: "passed" },
];
