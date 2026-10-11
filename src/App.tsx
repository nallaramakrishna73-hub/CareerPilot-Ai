import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AuthPage from "./components/auth/AuthPage";

// Screen Views
import DashboardView from "./components/dashboard/DashboardView";
import ChatView from "./components/chat/ChatView";
import JobsView from "./components/jobs/JobsView";
import ResumeStudioView from "./components/resume/ResumeStudioView";
import CompanyIntelView from "./components/company/CompanyIntelView";
import InterviewCoachView from "./components/interview/InterviewCoachView";
import TrackerView from "./components/tracker/TrackerView";
import AnalyticsView from "./components/analytics/AnalyticsView";
import PrivacyCenterView from "./components/privacy/PrivacyCenterView";
import JobAlertsView from "./components/alerts/JobAlertsView";
import CalendarView from "./components/calendar/CalendarView";
import DocsAndBlogView from "./components/docs/DocsAndBlogView";

function MainApp() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [navContext, setNavContext] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dark mode state: default to dark for rich tech aesthetic
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("careerpilot_darkmode");
    if (saved !== null) return saved === "true";
    return true; // Default dark mode matching brand (#0B1437)
  });

  useEffect(() => {
    localStorage.setItem("careerpilot_darkmode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleNavigate = (tab: string, context?: any) => {
    setActiveTab(tab);
    if (context) setNavContext(context);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D24] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#3B3FD8] border-t-[#14B8A6] rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold tracking-wider text-slate-300">
          Initializing CareerPilot AI...
        </p>
      </div>
    );
  }

  // If user is not authenticated and not a demo guest, show full Auth Page
  const isAuthenticated = !!user || profile.isGuest === true;
  if (!isAuthenticated) {
    return <AuthPage onSuccess={() => setActiveTab("dashboard")} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#070D24] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onNavigate={handleNavigate}
          activeTab={activeTab}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && <DashboardView onNavigate={handleNavigate} />}
          {activeTab === "chat" && <ChatView />}
          {activeTab === "jobs" && (
            <JobsView
              onNavigateToTracker={() => handleNavigate("tracker")}
              initialJobId={navContext?.selectedJobId}
            />
          )}
          {activeTab === "resume" && <ResumeStudioView />}
          {activeTab === "company" && <CompanyIntelView />}
          {activeTab === "interview" && <InterviewCoachView />}
          {activeTab === "tracker" && <TrackerView />}
          {activeTab === "alerts" && <JobAlertsView />}
          {activeTab === "calendar" && <CalendarView />}
          {activeTab === "analytics" && <AnalyticsView />}
          {activeTab === "privacy" && <PrivacyCenterView />}
          {activeTab === "docs" && <DocsAndBlogView />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
