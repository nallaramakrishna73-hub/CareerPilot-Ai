import React, { useState } from "react";
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { mockCompanies } from "../../data/mockCompanies";
import { CompanyIntel } from "../../types";

export const CompanyIntelView: React.FC = () => {
  const companyKeys = Object.keys(mockCompanies);
  const [selectedCompanyKey, setSelectedCompanyKey] = useState<string>("Razorpay");
  const [searchQuery, setSearchQuery] = useState("");

  const company: CompanyIntel = mockCompanies[selectedCompanyKey] || mockCompanies["Razorpay"];

  const filteredCompanyKeys = companyKeys.filter((k) =>
    k.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#3B3FD8]" /> Company Intelligence & Culture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Grounded intelligence on Indian tech employers with funding history, AmbitionBox scores, and cited sources.
          </p>
        </div>

        {/* Company Quick Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {companyKeys.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedCompanyKey(name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCompanyKey === name
                  ? "bg-[#3B3FD8] text-white shadow-md shadow-indigo-600/30"
                  : "bg-white dark:bg-[#111C44] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Company Card Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B1437] to-[#3B3FD8] text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {company.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Verified Intelligence
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {company.industry} • Founded {company.foundedYear}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {company.headquarters}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {company.size}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-[#3B3FD8] dark:text-indigo-400">
                  <TrendingUp className="w-3.5 h-3.5" /> {company.fundingStage} ({company.totalFunding})
                </span>
              </div>
            </div>
          </div>

          {/* AmbitionBox & Glassdoor Score */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">AmbitionBox</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ★ {company.ambitionBoxScore}
              </span>
              <span className="text-[10px] text-slate-400 block">out of 5.0</span>
            </div>
            <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Culture Index</span>
              <span className="text-xl font-extrabold text-[#3B3FD8] dark:text-indigo-400">
                {company.cultureRating}
              </span>
              <span className="text-[10px] text-slate-400 block">Work-Life: {company.workLifeBalance}</span>
            </div>
          </div>
        </div>

        {/* Tech Stack Bar */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Engineering Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {company.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Green Flags vs Red Flags (Blueprint requirement) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Green Flags */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Culture Green Flags (Pros)
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {company.greenFlagNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flag Hints */}
          <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Work Dynamics & Considerations
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {(company.redFlagNotes || ["High paced environment with sprint milestones."]).map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Funding Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#3B3FD8]" /> Funding Milestones & Investors
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {company.fundingTimeline.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#3B3FD8] dark:text-indigo-400">
                    {item.round}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.year}</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {item.amount}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Lead: {item.leadInvestor}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sources & Citations */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Citations:</span>
            {company.sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3B3FD8] dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>{s.title}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
          <span className="text-[10px] text-slate-400">
            Source Grounding: Tracxn, AmbitionBox, NPCI Public Reports
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompanyIntelView;
