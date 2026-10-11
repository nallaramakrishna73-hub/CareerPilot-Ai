import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  Menu
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenMobileMenu?: () => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenMobileMenu,
  onNavigate,
  activeTab,
}) => {
  const { user, profile, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "New Match Found", text: "Swiggy posted Backend Engineer role (18-28 LPA)", time: "10m ago", read: false },
    { id: 2, title: "Interview Reminder", text: "System Design round with Razorpay in 2 days", time: "2h ago", read: false },
    { id: 3, title: "ATS Optimization Ready", text: "Your resume score improved to 92/100", time: "1d ago", read: true },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B1437]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand visible on mobile, sidebar handles desktop */}
        <div className="lg:hidden">
          <Logo size="sm" showWordmark={true} />
        </div>

        {/* Search Bar / Quick Action */}
        <div className="hidden md:flex items-center relative w-72 lg:w-96">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles, skills, LPA or companies..."
            onClick={() => onNavigate("jobs")}
            className="w-full pl-10 pr-4 py-2 text-xs lg:text-sm rounded-xl bg-slate-100 dark:bg-slate-850/80 dark:bg-[#111C44] border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:border-[#3B3FD8] text-slate-800 dark:text-slate-100 transition-all placeholder:text-slate-400"
          />
          <kbd className="hidden lg:inline-block absolute right-3 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Market Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Indian Tech Market: 30+ Active Openings</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 relative text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFB020] rounded-full ring-2 ring-white dark:ring-[#0B1437]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#3B3FD8]" /> Alerts & Updates
                </h4>
                <span className="text-[11px] font-medium text-slate-400">2 unread</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto mt-1">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.text}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate("tracker");
                  }}
                  className="text-xs font-medium text-[#3B3FD8] dark:text-indigo-400 hover:underline"
                >
                  View Application Timeline
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#3B3FD8] to-[#14B8A6] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "R"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {profile.displayName || "Candidate"}
              </p>
              <p className="text-[10px] text-slate-400">
                {profile.isGuest ? "Demo Mode" : "Firebase User"}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50">
              <div className="px-2 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                <p className="font-semibold text-xs text-slate-900 dark:text-white">{profile.displayName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{profile.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <ShieldCheck className="w-3 h-3" />
                    {profile.isGuest ? "Guest Access" : "Firebase Auth"}
                  </span>
                  <span className="text-[10px] text-slate-400">{profile.minLpa}+ LPA target</span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate("privacy");
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" /> Privacy & Consent Center
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate("resume");
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#3B3FD8]" /> Master Resume Profile
                </button>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
