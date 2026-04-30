// src/app/creator-studio/page.tsx
"use client";

import { useState } from "react";
import { CreatorStudioHeader } from "@/features/creator-studio/components/CreatorStudioHeader";
import { TestSearch } from "@/features/creator-studio/components/TestSearch";
import { TestCard } from "@/features/creator-studio/components/TestCard";
import { EmptyState } from "@/features/creator-studio/components/EmptyState";
import { myTestsMock } from "@/features/creator-studio/creator-studio.mock";

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