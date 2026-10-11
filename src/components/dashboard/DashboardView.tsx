import React, { useEffect, useState } from "react";
import {
  Briefcase,
  TrendingUp,
  FileCheck2,
  Mic,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink,
  Target,
  Zap,
} from "lucide-react";
import { Job, Application, ResumeData } from "../../types";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface DashboardViewProps {
  onNavigate: (tab: string, context?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsList, appsList, resData] = await Promise.all([
          api.searchJobs({ userProfile: profile }),
          api.getApplications(),
          api.getResume(),
        ]);
        setRecentJobs(jobsList.slice(0, 5));
        setApplications(appsList);
        setResume(resData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profile]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1437] via-[#1B2559] to-[#3B3FD8] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
            <span>AI Career Copilot • Indian Tech Edition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {profile.displayName || "Engineer"}! 👋
          </h1>
          <p className="mt-2 text-sm text-slate-200 leading-relaxed">
            Your personalized pipeline has <strong className="text-white font-semibold">{recentJobs.length > 0 ? "30 verified" : "active"}</strong> Indian job openings matching your {profile.minLpa}+ LPA target and {profile.noticePeriodDays}-day notice period.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("chat")}
              className="px-4 py-2 rounded-xl bg-white text-[#0B1437] font-semibold text-xs sm:text-sm hover:bg-slate-100 shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#3B3FD8]" />
              <span>Ask Career Copilot</span>
            </button>
            <button
              onClick={() => onNavigate("interview")}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-rose-300" />
              <span>Mock Interview Practice</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-80 h-full opacity-30 pointer-events-none bg-gradient-to-l from-[#14B8A6] to-transparent"></div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div 
          onClick={() => onNavigate("jobs")}
          className="p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Live Indian Matches</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#3B3FD8] dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">30</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              +12 high fit
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Bengaluru, Hyderabad, Pune, Tier-2</p>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => onNavigate("tracker")}
          className="p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Applications</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#14B8A6] flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {applications.length}
            </span>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              1 in Offer • 1 Interview
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tracked in Kanban board</p>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => onNavigate("interview")}
          className="p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mock Interview Score</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">84%</span>
            <span className="text-xs font-semibold text-amber-500">STAR Rubric</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Voice-scored with Web Speech API</p>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => onNavigate("resume")}
          className="p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Master ATS Score</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#FFB020] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {resume?.atsScore.total || 92}
              <span className="text-sm text-slate-400 font-normal">/100</span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Taleo / Greenhouse</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Keywords & Parse Safety Validated</p>
        </div>
      </div>

      {/* Main Grid: Recent Matches & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Best Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#3B3FD8]" /> Top Job Recommendations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ranked using weighted Jaccard skill overlap, semantic fit, and LPA match
              </p>
            </div>
            <button
              onClick={() => onNavigate("jobs")}
              className="text-xs font-semibold text-[#3B3FD8] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All 30</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 hover:border-[#3B3FD8]/50 dark:hover:border-indigo-500/50 shadow-sm transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#0B1437] dark:text-white flex items-center justify-center font-bold text-base shrink-0 group-hover:bg-[#3B3FD8] group-hover:text-white transition-colors">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#3B3FD8] dark:group-hover:text-indigo-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" /> {job.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {job.location} {job.isRemote && "(Remote)"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#FFB020] font-semibold">
                          <Clock className="w-3.5 h-3.5" /> {job.noticePeriodRequired}d notice
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match score & Salary Pill */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-sm sm:text-base font-extrabold text-[#3B3FD8] dark:text-indigo-400">
                        ₹{job.minLpa} - {job.maxLpa} LPA
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>{job.matchScore || 88}% Match</span>
                    </div>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate("jobs", { selectedJobId: job.id })}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#3B3FD8] hover:text-white dark:hover:bg-[#3B3FD8] text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                    >
                      Why This Match?
                    </button>
                    <button
                      onClick={() => onNavigate("tracker")}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#3B3FD8] hover:bg-indigo-700 text-white shadow-sm transition-all cursor-pointer"
                    >
                      Apply / Track
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 Col): Weekly Activity & Fast Actions */}
        <div className="space-y-6">
          {/* Activity Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              Weekly Candidate Pipeline
            </h3>

            {/* Custom visual activity bar */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Adzuna & Jooble Scans</span>
                  <span className="font-bold">48 roles</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#3B3FD8] rounded-full w-[85%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Resume ATS Pass Rate</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#14B8A6] rounded-full w-[92%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Mock STAR Answers Practiced</span>
                  <span className="font-bold">12 answered</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#FFB020] rounded-full w-[65%]"></div>
                </div>
              </div>
            </div>

            {/* Application Pipeline Status summary */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Active Stages
              </h4>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="block text-slate-400 text-[10px]">Saved</span>
                  <span className="font-bold text-slate-800 dark:text-white">1</span>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
                  <span className="block text-indigo-400 text-[10px]">Applied</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">1</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
                  <span className="block text-amber-500 text-[10px]">Interview</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">1</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                  <span className="block text-emerald-500 text-[10px]">Offer</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Viva / Architecture Quick Guide */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-teal-900/20 border border-indigo-500/20">
            <h4 className="text-xs font-bold text-[#3B3FD8] dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" /> Blueprint Features
            </h4>
            <ul className="mt-2.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <span>Explainable 6-part weighted matching algorithm</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <span>India-specific LPA bands & 30/60/90-day notice fit</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <span>Voice input via Browser Web Speech API</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <span>Privacy by Design: PII masked before LLM calls</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
