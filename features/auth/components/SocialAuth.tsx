import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';

export function SocialAuth() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button type="button" className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] text-[0.84rem] font-medium hover:bg-[#F5F7FF] hover:border-[#CBD5E1] shadow-[0_1px_2px_rgba(15,26,53,0.05)] transition-all duration-[0.18s] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2">
          <SiGoogle size={16} color="#4285F4" />
          Google
        </button>
        <button type="button" className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] text-[0.84rem] font-medium hover:bg-[#F5F7FF] hover:border-[#CBD5E1] shadow-[0_1px_2px_rgba(15,26,53,0.05)] transition-all duration-[0.18s] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2">
          <SiGithub size={16} color="#24292E" />
          GitHub
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        <span className="text-[0.75rem] font-medium text-[#94A3B8] tracking-wide uppercase">or</span>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>
    </>
  );
}