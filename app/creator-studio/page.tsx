// src/app/creator-studio/page.tsx
"use client";

import { useState } from "react";
import { TestSummary } from "@/types/creator-studio";
import { CreatorStudioHeader } from "@/components/creator-studio/CreatorStudioHeader";
import { TestSearch } from "@/components/creator-studio/TestSearch";
import { TestCard } from "@/components/creator-studio/TestCard";
import { EmptyState } from "@/components/creator-studio/EmptyState";

// ── МОКОВІ ДАНІ ──
const myTestsMock: TestSummary[] = [
  { id: "101", title: "Advanced JavaScript Concepts", status: "published", questionsCount: 15, completions: 124, updatedAt: "2 hours ago" },
  { id: "102", title: "PostgreSQL Triggers & Functions", status: "draft", questionsCount: 8, completions: 0, updatedAt: "1 day ago" },
  { id: "103", title: "React Performance Optimization", status: "published", questionsCount: 20, completions: 89, updatedAt: "3 days ago" },
  { id: "104", title: "UI/UX Basics for Developers", status: "published", questionsCount: 12, completions: 256, updatedAt: "1 week ago" },
  { id: "106", title: "Introduction to Docker & Containers", status: "closed", questionsCount: 10, completions: 412, updatedAt: "2 months ago" },
  { id: "107", title: "Advanced JavaScript Concepts", status: "published", questionsCount: 15, completions: 124, updatedAt: "2 hours ago" },
  { id: "108", title: "PostgreSQL Triggers & Functions", status: "draft", questionsCount: 8, completions: 0, updatedAt: "1 day ago" },
  { id: "109", title: "React Performance Optimization", status: "published", questionsCount: 20, completions: 89, updatedAt: "3 days ago" },
  { id: "111", title: "UI/UX Basics for Developers", status: "published", questionsCount: 12, completions: 256, updatedAt: "1 week ago" },
  { id: "112", title: "Introduction to Docker & Containers", status: "closed", questionsCount: 10, completions: 412, updatedAt: "2 months ago" },
];

export default function CreatorStudioPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = myTestsMock.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      
      <CreatorStudioHeader />

      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 mt-8">
        
        <TestSearch value={searchQuery} onChange={setSearchQuery} />

        {filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        ) : (
          <EmptyState hasSearchQuery={searchQuery.length > 0} />
        )}

      </div>
    </div>
  );
}