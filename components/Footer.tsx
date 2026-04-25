import Link from "next/link";
import { CodeXml } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0C1A35] px-5 md:px-12 shrink-0">
      {/* Top */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 py-12 border-b border-white/10">
        
        {/* Brand */}
        <div className="footer-brand max-w-md">
          <Link
            href="/"
            className="inline-block mb-3 font-['Sora',sans-serif] font-extrabold text-[1.4rem] tracking-[-0.04em] text-white no-underline after:content-['.'] after:text-amber-400"
          >
            Testify
          </Link>
          <p className="text-[0.85rem] text-white/60 leading-[1.65]">
            System of online knowledge testing with recommendation algorithms. 
            Build skills, track progress, and discover your learning path.
          </p>
        </div>

        {/* Project Links */}
        <div className="flex gap-6 items-center mt-4 md:mt-0">
          <a 
            href="https://github.com/VadymKondratiuk/testify_v2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[0.85rem] font-medium text-white/60 transition-colors duration-200 hover:text-white"
          >
            <CodeXml size={20} />
            <span>Source Code</span>
          </a>
        </div>
        
      </div>

      {/* Bottom */}
      <div className="flex justify-center md:justify-between items-center py-6 flex-wrap gap-4">
        <span className="text-[0.8rem] text-white/40">
          Testify &copy; 2026 — All rights reserved.
        </span>
      </div>
    </footer>
  );
}