import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  X,
  Sliders,
  DollarSign,
  Bookmark,
  Share2,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Job, JobLocation, NoticePeriod, JobMatchBreakdown } from "../../types";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface JobsViewProps {
  onNavigateToTracker?: () => void;
  initialJobId?: string;
}

export const JobsView: React.FC<JobsViewProps> = ({ onNavigateToTracker, initialJobId }) => {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [minLpa, setMinLpa] = useState<number>(profile.minLpa || 10);
  const [maxExp, setMaxExp] = useState<number>(5);
  const [noticePeriod, setNoticePeriod] = useState<number>(profile.noticePeriodDays || 30);
  const [wfhOnly, setWfhOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"match" | "salary" | "recent">("match");

  // "Why This Match" Drawer
  const [selectedDrawerJob, setSelectedDrawerJob] = useState<Job | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const cityOptions = [
    { label: "Bengaluru", value: "Bengaluru" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Pune", value: "Pune" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Delhi NCR", value: "Delhi NCR" },
    { label: "Tier-2 (Warangal / Nirmal)", value: "Tier-2" },
  ];

  const noticeOptions = [15, 30, 60, 90];

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, selectedCities, minLpa, maxExp, noticePeriod, wfhOnly, sortBy, profile]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const results = await api.searchJobs({
        q: searchQuery,
        cities: selectedCities,
        minLpa: minLpa,
        maxExp: maxExp,
        noticePeriod: noticePeriod,
        wfhOnly: wfhOnly,
        sort: sortBy,
        userProfile: profile,
      });
      setJobs(results);

      if (initialJobId) {
        const found = results.find((j) => j.id === initialJobId);
        if (found) setSelectedDrawerJob(found);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((c) => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const handleSaveToTracker = async (job: Job) => {
    try {
      await api.addApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        lpa: `₹${job.minLpa}-${job.maxLpa} LPA`,
        status: "Saved",
        appliedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        notes: `Saved from Unified Search. Match score: ${job.matchScore}%. Notice required: ${job.noticePeriodRequired} days.`,
      });
      setSavedJobIds((prev) => [...prev, job.id]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApply = async (job: Job) => {
    try {
      await api.addApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        lpa: `₹${job.minLpa}-${job.maxLpa} LPA`,
        status: "Applied",
        appliedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        notes: `Direct application submitted for ${job.title}.`,
      });
      setAppliedJobIds((prev) => [...prev, job.id]);
      if (job.externalUrl) {
        window.open(job.externalUrl, "_blank");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#3B3FD8]" /> Unified Indian Job Search
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Aggregated from Adzuna, JSearch, and Direct Portals with LPA normalization and notice-fit scoring.
          </p>
        </div>

        {/* Sort & Quick Counter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{jobs.length}</strong> roles
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3B3FD8]"
          >
            <option value="match">Sort by: Match Fit %</option>
            <option value="salary">Sort by: Highest LPA</option>
            <option value="recent">Sort by: Most Recent</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Filters Panel + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter Panel */}
        <div className="lg:col-span-1 space-y-5 p-5 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#3B3FD8]" /> Filters
            </h3>
            {(selectedCities.length > 0 || searchQuery || wfhOnly || minLpa > 10) && (
              <button
                onClick={() => {
                  setSelectedCities([]);
                  setSearchQuery("");
                  setMinLpa(10);
                  setWfhOnly(false);
                }}
                className="text-[11px] text-[#3B3FD8] dark:text-indigo-400 hover:underline font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Keywords / Role
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="React, Go, Microservices..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#3B3FD8] text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Cities Multi-select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Indian Cities
            </label>
            <div className="space-y-1.5">
              {cityOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(opt.value)}
                    onChange={() => toggleCity(opt.value)}
                    className="w-3.5 h-3.5 rounded text-[#3B3FD8] border-slate-300 dark:border-slate-700 focus:ring-0"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Min Salary in LPA Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Target Salary:</span>
              <span className="text-[#3B3FD8] dark:text-indigo-400 font-bold">
                {minLpa}+ LPA
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={35}
              step={1}
              value={minLpa}
              onChange={(e) => setMinLpa(parseInt(e.target.value))}
              className="w-full accent-[#3B3FD8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹5 LPA</span>
              <span>₹20 LPA</span>
              <span>₹35+ LPA</span>
            </div>
          </div>

          {/* Notice Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Notice Period Match
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {noticeOptions.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setNoticePeriod(days)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    noticePeriod === days
                      ? "bg-[#FFB020] text-[#0B1437] shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* Remote / WFH Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>Work from Home only</span>
              <input
                type="checkbox"
                checked={wfhOnly}
                onChange={(e) => setWfhOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#14B8A6] border-slate-300 dark:border-slate-700 focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Right Job Cards Feed */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 border-3 border-[#3B3FD8] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Running LangGraph Intent Match & LPA Normalisation...
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                No matching roles found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try widening your city selection or lowering your minimum LPA threshold.
              </p>
            </div>
          ) : (
            jobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 hover:border-[#3B3FD8]/50 dark:hover:border-indigo-500/50 shadow-sm transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-indigo-950 text-[#3B3FD8] dark:text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#3B3FD8] dark:group-hover:text-indigo-400 transition-colors">
                            {job.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                          </span>
                          {job.isRemote && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-[#14B8A6] dark:bg-teal-950 dark:text-teal-300">
                              Remote Friendly
                            </span>
                          )}
                          <span>•</span>
                          <span className="text-slate-400">{job.postedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Salary & Match Score Ring */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-base sm:text-xl font-extrabold text-[#3B3FD8] dark:text-indigo-400">
                          ₹{job.minLpa} - {job.maxLpa} LPA
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {job.minExp}-{job.maxExp} yrs exp • {job.noticePeriodRequired}d notice
                        </div>
                      </div>

                      {/* Match Ring */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
                          <Sparkles className="w-3 h-3 text-[#FFB020]" />
                          <span>{job.matchScore || 85}% Fit</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Matched vs Missing Skill Chips (Blueprint rubric) */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 mr-1">Skills:</span>
                      {job.skills.map((skill, idx) => {
                        const isMatched = job.matchBreakdown?.matchedSkills.includes(skill);
                        return (
                          <span
                            key={idx}
                            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium flex items-center gap-1 ${
                              isMatched
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {isMatched && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />}
                            {skill}
                          </span>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDrawerJob(job)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-[#3B3FD8] hover:text-white dark:hover:bg-[#3B3FD8] text-[#3B3FD8] dark:text-indigo-300 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Why this match?
                      </button>

                      <button
                        onClick={() => handleSaveToTracker(job)}
                        disabled={isSaved}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSaved
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                        }`}
                        title="Save to Kanban Tracker"
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>

                      <button
                        onClick={() => handleApply(job)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                          isApplied
                            ? "bg-emerald-600 text-white"
                            : "bg-[#3B3FD8] hover:bg-indigo-700 text-white shadow-indigo-600/30"
                        }`}
                      >
                        <span>{isApplied ? "Applied ✓" : "Apply Now"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* "Why This Match" Score Breakdown Drawer (Blueprint Section 6.1) */}
      {selectedDrawerJob && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#111C44] h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B3FD8] dark:text-indigo-400">
                    Explainable AI Breakdown
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {selectedDrawerJob.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedDrawerJob.company} • {selectedDrawerJob.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDrawerJob(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Total Match Gauge */}
              <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-[#0B1437] dark:to-[#1B2559] border border-indigo-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overall Match Score</span>
                  <div className="text-3xl font-extrabold text-[#3B3FD8] dark:text-indigo-400">
                    {selectedDrawerJob.matchScore}%
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Strong alignment for Indian tech role
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-[#3B3FD8] flex items-center justify-center font-extrabold text-base text-[#3B3FD8] dark:text-white bg-white dark:bg-[#111C44] shadow-sm">
                  {selectedDrawerJob.matchScore}%
                </div>
              </div>

              {/* 6-Part Breakdown Bar Chart (Formula from Blueprint Section 6.1) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rubric Component Breakdown
                </h4>

                {/* 1. Skill Overlap (40%) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-200">
                      Skill Overlap (Weight: 40%)
                    </span>
                    <span className="text-[#3B3FD8] dark:text-indigo-400">
                      {selectedDrawerJob.matchBreakdown?.skillOverlap || 85}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#3B3FD8] rounded-full transition-all duration-500"
                      style={{ width: `${selectedDrawerJob.matchBreakdown?.skillOverlap || 85}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Weighted Jaccard of normalized skills (required skills weigh 2x)
                  </p>
                </div>

                {/* 2. Semantic Similarity (20%) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-200">
                      Semantic Similarity (Weight: 20%)
                    </span>
                    <span className="text-[#14B8A6]">
                      {selectedDrawerJob.matchBreakdown?.semanticSimilarity || 80}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#14B8A6] rounded-full transition-all duration-500"
                      style={{ width: `${selectedDrawerJob.matchBreakdown?.semanticSimilarity || 80}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Cosine similarity of resume embedding against job description
                  </p>
                </div>

                {/* 3. Experience Fit (15%) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-200">
                      Experience Fit (Weight: 15%)
                    </span>
                    <span className="text-[#FFB020]">
                      {selectedDrawerJob.matchBreakdown?.experienceFit || 90}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#FFB020] rounded-full transition-all duration-500"
                      style={{ width: `${selectedDrawerJob.matchBreakdown?.experienceFit || 90}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Candidate exp ({profile.experienceYears} yrs) inside target window ({selectedDrawerJob.minExp}-{selectedDrawerJob.maxExp} yrs)
                  </p>
                </div>

                {/* 4. Salary Fit (10%) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-200">
                      Salary Fit (Weight: 10%)
                    </span>
                    <span className="text-emerald-500">
                      {selectedDrawerJob.matchBreakdown?.salaryFit || 95}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${selectedDrawerJob.matchBreakdown?.salaryFit || 95}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Target {profile.minLpa} LPA overlaps with role range (₹{selectedDrawerJob.minLpa}-{selectedDrawerJob.maxLpa} LPA)
                  </p>
                </div>

                {/* 5. Location Fit (10%) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-200">
                      Location Fit (Weight: 10%)
                    </span>
                    <span className="text-indigo-400">
                      {selectedDrawerJob.matchBreakdown?.locationFit || 100}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                      style={{ width: `${selectedDrawerJob.matchBreakdown?.locationFit || 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    City ({selectedDrawerJob.location}) or Remote preference matched
                  </p>
                </div>

                {/* 6. Notice Fit (5%) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-200">
                      Notice Period Fit (Weight: 5%)
                    </span>
                    <span className="text-teal-400">
                      {selectedDrawerJob.matchBreakdown?.noticeFit || 100}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${selectedDrawerJob.matchBreakdown?.noticeFit || 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Candidate notice ({profile.noticePeriodDays}d) vs Employer threshold ({selectedDrawerJob.noticePeriodRequired}d)
                  </p>
                </div>
              </div>

              {/* Natural Language Explanation Box */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200/80 dark:border-slate-800">
                <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" /> Grounded Summary
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedDrawerJob.matchBreakdown?.explanation}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button
                onClick={() => {
                  handleSaveToTracker(selectedDrawerJob);
                  setSelectedDrawerJob(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Save to Tracker
              </button>
              <button
                onClick={() => {
                  handleApply(selectedDrawerJob);
                  setSelectedDrawerJob(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#3B3FD8] hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsView;
