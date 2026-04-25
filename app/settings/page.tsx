"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  Camera, 
  Save, 
  LogOut,
  ShieldCheck
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

  // Стани для форми профілю
  const [name, setName] = useState("Vadym");
  const [email, setEmail] = useState("vadym@example.com");
  const [role, setRole] = useState("Student / Developer");

  return (
    <div className="min-h-screen bg-[#F5F7FF] pb-20">
      
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[#E2E8F0] px-5 md:px-8 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <Link 
            href="/dashboard" 
            className="w-fit flex items-center gap-2 text-[#64748B] hover:text-[#4F46E5] text-[0.85rem] font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="font-[family-name:var(--font-sora)] text-[1.8rem] font-bold text-[#0F172A] tracking-[-0.03em]">
              Account Settings
            </h1>
            <p className="text-[#64748B] text-[0.95rem] mt-1">
              Manage your personal information and security preferences.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* ── Sidebar Navigation ── */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <TabButton 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
            icon={User} 
            label="Public Profile" 
          />
          <TabButton 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")} 
            icon={Lock} 
            label="Security & Password" 
          />
          <TabButton 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")} 
            icon={Bell} 
            label="Notifications" 
          />
          
          <div className="h-px bg-[#E2E8F0] my-4" />
          
          <button className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl text-[#EF4444] font-medium text-[0.9rem] hover:bg-red-50 transition-colors w-full text-left">
            <LogOut size={18} />
            Log Out
          </button>
        </div>

        {/* ── Settings Content Area ── */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10">
            
            {/* ── TAB: PROFILE ── */}
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem] mb-6">
                  Profile Information
                </h2>
                
                {/* Avatar Upload */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-[#E0E7FF] border-2 border-[#E2E8F0] flex items-center justify-center overflow-hidden">
                      <User size={32} className="text-[#4F46E5]" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#0F172A] font-semibold text-[0.95rem]">Profile Picture</h3>
                    <p className="text-[#64748B] text-[0.8rem] mt-0.5 mb-2">PNG, JPG up to 5MB.</p>
                    <div className="flex gap-3">
                      <button className="cursor-pointer px-3 py-1.5 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] text-[0.8rem] font-medium rounded-lg transition-colors">
                        Upload
                      </button>
                      <button className="cursor-pointer px-3 py-1.5 text-[#EF4444] text-[0.8rem] font-medium hover:bg-red-50 rounded-lg transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputGroup label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <InputGroup label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                  <div className="sm:col-span-2">
                    <InputGroup label="Headline / Role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend Developer" />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <SaveButton />
                </div>
              </div>
            )}

            {/* ── TAB: SECURITY ── */}
            {activeTab === "security" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck size={24} className="text-[#10B981]" />
                  <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem]">
                    Password & Security
                  </h2>
                </div>

                <div className="flex flex-col gap-5 max-w-md">
                  <InputGroup label="Current Password" type="password" placeholder="••••••••" />
                  <InputGroup label="New Password" type="password" placeholder="••••••••" />
                  <InputGroup label="Confirm New Password" type="password" placeholder="••••••••" />
                </div>

                <div className="mt-8 flex justify-end">
                  <SaveButton label="Update Password" />
                </div>
              </div>
            )}

            {/* ── TAB: NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0F172A] text-[1.3rem] mb-6">
                  Email Notifications
                </h2>
                
                <div className="flex flex-col gap-4">
                  <ToggleRow 
                    title="Smart Recommendations" 
                    desc="Get weekly emails with personalized topics to study based on your gaps." 
                    defaultChecked 
                  />
                  <ToggleRow 
                    title="Test Results" 
                    desc="Receive an email immediately after completing a test." 
                    defaultChecked 
                  />
                  <ToggleRow 
                    title="Platform Updates" 
                    desc="News about new features and catalog additions." 
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <SaveButton label="Save Preferences" />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Допоміжні компоненти для чистоти коду ──

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[0.95rem] transition-colors w-full text-left
        ${active 
          ? "bg-[#EEF2FF] text-[#4F46E5]" 
          : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
        }`}
    >
      <Icon size={18} className={active ? "text-[#4F46E5]" : "text-[#94A3B8]"} />
      {label}
    </button>
  );
}

function InputGroup({ label, type = "text", value, onChange, placeholder, disabled }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.82rem] font-semibold text-[#334155]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[#0F172A] text-[0.9rem] transition-all
          ${disabled ? "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed" : "bg-white hover:border-[#CBD5E1] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 focus:outline-none"}
        `}
      />
    </div>
  );
}

function SaveButton({ label = "Save Changes" }) {
  return (
    <button className="cursor-pointer flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold px-6 py-2.5 rounded-[10px] shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all">
      <Save size={16} />
      {label}
    </button>
  );
}

function ToggleRow({ title, desc, defaultChecked = false }: any) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0">
      <div className="pr-4">
        <h3 className="font-semibold text-[#0F172A] text-[0.95rem]">{title}</h3>
        <p className="text-[#64748B] text-[0.85rem] mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${checked ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}