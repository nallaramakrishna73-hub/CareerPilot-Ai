import React from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  FileText,
  Building2,
  Mic,
  Kanban,
  BarChart3,
  ShieldCheck,
  X,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "AI Career Copilot", icon: MessageSquare, badge: "Gemini", badgeColor: "bg-[#3B3FD8]/15 text-[#3B3FD8] dark:text-indigo-300" },
  { id: "jobs", label: "Unified Job Search", icon: Briefcase, badge: "30 Live", badgeColor: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" },
  { id: "resume", label: "Resume Studio", icon: FileText, badge: "ATS 92", badgeColor: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" },
  { id: "company", label: "Company Intel", icon: Building2 },
  { id: "interview", label: "Interview Coach", icon: Mic, badge: "Voice AI", badgeColor: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300" },
  { id: "tracker", label: "Application Tracker", icon: Kanban },
  { id: "analytics", label: "Market Analytics", icon: BarChart3 },
  { id: "privacy", label: "Privacy & Consent", icon: ShieldCheck },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
}) => {
  const { profile } = useAuth();

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0B1437] border-r border-slate-200 dark:border-slate-800 transition-colors">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <Logo size="md" showWordmark={true} />
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          Career Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                isActive
                  ? "bg-[#3B3FD8] text-white shadow-md shadow-indigo-600/25 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#111C44] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-400 dark:text-slate-400 group-hover:text-[#3B3FD8]"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Candidate Persona Card (India-first matching context) */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-[#111C44] dark:to-[#16215B] border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" /> Match Criteria
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFB020]/20 text-[#FFB020] font-bold">
              Active
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target LPA:</span>
              <span className="font-semibold text-[#3B3FD8] dark:text-indigo-400">{profile.minLpa}+ LPA</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Notice:
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{profile.noticePeriodDays} Days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Cities:
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[90px]">
                {profile.preferredCities.slice(0, 2).join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
