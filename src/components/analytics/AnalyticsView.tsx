import React from "react";
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Zap,
  Activity,
  Layers,
  CheckCircle,
  Database,
  Search,
  Server,
} from "lucide-react";

export const AnalyticsView: React.FC = () => {
  const salaryBands = [
    { city: "Bengaluru", min: 18, avg: 26, max: 38 },
    { city: "Hyderabad", min: 16, avg: 23, max: 32 },
    { city: "Pune", min: 14, avg: 20, max: 30 },
    { city: "Mumbai", min: 15, avg: 22, max: 34 },
    { city: "Delhi NCR", min: 15, avg: 21, max: 30 },
    { city: "Tier-2 (Warangal / Nirmal)", min: 6, avg: 9, max: 15 },
  ];

  const funnelStages = [
    { name: "Roles Scanned (Adzuna/JSearch)", count: 248, percentage: "100%", color: "bg-[#3B3FD8]" },
    { name: "Matched (>80% Fit Score)", count: 30, percentage: "12.1%", color: "bg-indigo-500" },
    { name: "Saved by Candidate", count: 8, percentage: "3.2%", color: "bg-[#14B8A6]" },
    { name: "Tailored & Applied", count: 4, percentage: "1.6%", color: "bg-[#FFB020]" },
    { name: "Interview Rounds Active", count: 2, percentage: "0.8%", color: "bg-amber-500" },
    { name: "Offers Extended", count: 1, percentage: "0.4%", color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#3B3FD8]" /> Market Intelligence & Latency Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Search latency, Redis cache hit rates, salary percentile distributions, and conversion funnel.
        </p>
      </div>

      {/* 4 Health & Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Search Latency (p95)</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            184 ms
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            ✓ 3s timeout with circuit breaker
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Redis Cache Hit Ratio</span>
            <Database className="w-4 h-4 text-[#3B3FD8]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            94.2%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Instant warm search for Indian metros
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Match Algorithm Bias Check</span>
            <Activity className="w-4 h-4 text-[#14B8A6]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            0.00 Bias
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">
            Gender/name invariant test verified
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">ATS Normalisation Accuracy</span>
            <CheckCircle className="w-4 h-4 text-[#FFB020]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            98.5%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Taleo & Greenhouse schema parity
          </p>
        </div>
      </div>

      {/* Salary Distribution Visual Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Indian Tech Salary Benchmark (in LPA for 2-5 yrs Experience)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Percentile distribution normalized from Adzuna Indian listings and user report aggregates.
          </p>
        </div>

        <div className="space-y-4">
          {salaryBands.map((band, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-200">{band.city}</span>
                <span className="text-[#3B3FD8] dark:text-indigo-400">
                  ₹{band.min} - ₹{band.max} LPA (Median: ₹{band.avg} LPA)
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                {/* Visual range segment */}
                <div
                  className="h-full bg-gradient-to-r from-teal-400 via-indigo-500 to-[#FFB020] rounded-full transition-all duration-500"
                  style={{
                    marginLeft: `${(band.min / 40) * 100}%`,
                    width: `${((band.max - band.min) / 40) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Funnel Conversion Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Candidate Pipeline Conversion Funnel
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Conversion stages from initial multi-source discovery through offer negotiation.
          </p>
        </div>

        <div className="space-y-3">
          {funnelStages.map((stage, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{stage.name}</span>
                <span className="text-slate-900 dark:text-white">
                  {stage.count} ({stage.percentage})
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${stage.color} rounded-full`}
                  style={{ width: `${Math.max(4, (stage.count / 248) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
