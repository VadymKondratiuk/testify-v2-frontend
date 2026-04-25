import Link from "next/link";
import { 
  User, 
  BrainCircuit, 
  Target, 
  Clock, 
  TrendingUp,
  History,
  Play,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[#E2E8F0] px-5 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-sora)] text-[1.8rem] font-bold text-[#0F172A] tracking-[-0.03em]">
              My Dashboard
            </h1>
            <p className="text-[#64748B] text-[0.95rem] mt-1">
              Track your progress and discover your next learning steps.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold px-6 py-2.5 rounded-[10px] shadow-[0_4px_12px_rgba(79,70,229,0.25)] transition-all"
          >
            <Play size={16} fill="currentColor" />
            Take a New Test
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT COLUMN (Stats & Recommendations) ── */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Target} label="Tests Taken" value="24" color="text-blue-600" bg="bg-blue-50" />
            <StatCard icon={TrendingUp} label="Average Score" value="82%" color="text-green-600" bg="bg-green-50" />
            <StatCard icon={BrainCircuit} label="Skills Mastered" value="12" color="text-purple-600" bg="bg-purple-50" />
            <StatCard icon={Clock} label="Hours Spent" value="38h" color="text-amber-600" bg="bg-amber-50" />
          </div>

          {/* Smart Recommendations Component */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] flex items-center justify-center">
                <BrainCircuit className="text-[#F59E0B]" size={20} />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.2rem]">
                  Recommended Next Steps
                </h2>
                <p className="text-[#64748B] text-[0.85rem]">Based on your recent performance gaps</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Rec Item 1 */}
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-[#E2E8F0] hover:border-[#4F46E5] hover:bg-[#F8FAFC] transition-colors gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#EF4444] bg-red-50 px-2 py-0.5 rounded-full">Knowledge Gap</span>
                  </div>
                  <h3 className="font-semibold text-[#0F172A]">Advanced PostgreSQL Triggers</h3>
                  <p className="text-[#64748B] text-[0.85rem]">You scored 45% in this specific topic last week.</p>
                </div>
                <button className="w-full sm:w-auto px-5 py-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] font-semibold text-[0.9rem] rounded-lg transition-colors whitespace-nowrap">
                  Start Topic
                </button>
              </div>

              {/* Rec Item 2 */}
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-[#E2E8F0] hover:border-[#4F46E5] hover:bg-[#F8FAFC] transition-colors gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#10B981] bg-green-50 px-2 py-0.5 rounded-full">Next Level</span>
                  </div>
                  <h3 className="font-semibold text-[#0F172A]">NestJS Microservices Architecture</h3>
                  <p className="text-[#64748B] text-[0.85rem]">Ready to advance after mastering REST APIs.</p>
                </div>
                <button className="w-full sm:w-auto px-5 py-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] font-semibold text-[0.9rem] rounded-lg transition-colors whitespace-nowrap">
                  Start Topic
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (Profile & History) ── */}
        <div className="flex flex-col gap-8">
          
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#E0E7FF] border-4 border-white shadow-md flex items-center justify-center mb-4 relative">
              <User size={40} className="text-[#4F46E5]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#10B981] border-2 border-white rounded-full"></div>
            </div>
            <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem]">
              John Doe
            </h2>
            <p className="text-[#64748B] text-[0.9rem] mb-4">john.doe@example.com</p>
            <div className="w-full h-px bg-[#E2E8F0] mb-4" />
            <Link href="/settings" className="w-full py-2 border border-[#E2E8F0] rounded-lg text-[#334155] font-medium text-[0.9rem] hover:bg-[#F8FAFC] transition-colors">
              Edit Profile
            </Link>
          </div>

          {/* Recent History */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.1rem] flex items-center gap-2">
                <History size={18} className="text-[#64748B]" />
                Recent Tests
              </h3>
              <Link href="/history" className="text-[0.8rem] text-[#4F46E5] hover:underline font-medium">View All</Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <HistoryItem title="React Hooks Deep Dive" date="Today" score="92%" passed={true} />
              <HistoryItem title="Database Optimization" date="Yesterday" score="65%" passed={false} />
              <HistoryItem title="Figma UI Patterns" date="Mar 12" score="100%" passed={true} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Мікро-компонент для карток статистики
function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col items-start gap-3">
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <div className="text-[1.5rem] font-bold text-[#0F172A] leading-none mb-1">{value}</div>
        <div className="text-[0.8rem] text-[#64748B] font-medium">{label}</div>
      </div>
    </div>
  );
}

// Мікро-компонент для історії
function HistoryItem({ title, date, score, passed }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        {passed ? (
          <CheckCircle2 size={18} className="text-[#10B981]" />
        ) : (
          <XCircle size={18} className="text-[#EF4444]" />
        )}
        <div>
          <div className="text-[0.9rem] font-semibold text-[#0F172A]">{title}</div>
          <div className="text-[0.75rem] text-[#94A3B8]">{date}</div>
        </div>
      </div>
      <div className={`font-bold text-[0.9rem] ${passed ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
        {score}
      </div>
    </div>
  );
}