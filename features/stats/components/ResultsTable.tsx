// src/components/creator-studio/stats/ResultsTable.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface ResultData {
  id: number;
  student: string;
  score: number;
  time: string;
  date: string;
  status: string;
}

interface ResultsTableProps {
  results: ResultData[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = results.filter(res => 
    res.student.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.1rem]">
          All Results ({filteredResults.length})
        </h2>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
          <input 
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#64748B] text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] text-[0.85rem] font-semibold text-[#64748B]">
              <th className="px-6 py-3 font-medium">Student</th>
              <th className="px-6 py-3 font-medium">Score</th>
              <th className="px-6 py-3 font-medium">Time Spent</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-[0.95rem]">
            {filteredResults.length > 0 ? (
              filteredResults.map((res) => (
                <tr key={res.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{res.student}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.8rem] font-bold ${
                      res.score >= 80 ? 'bg-[#10B981]/10 text-[#10B981]' : 
                      res.score >= 60 ? 'bg-orange-100 text-orange-600' : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {res.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#64748B]">{res.time}</td>
                  <td className="px-6 py-4 text-[#64748B] text-[0.9rem]">{res.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="cursor-pointer text-[#4F46E5] hover:text-[#4338CA] font-medium text-[0.9rem] transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#64748B]">
                  No students found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}