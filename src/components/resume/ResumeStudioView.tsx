import React, { useState, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  Check,
  RefreshCw,
  Linkedin,
  ShieldAlert,
  Layers,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { ResumeData, Job } from "../../types";
import { api } from "../../services/api";
import { tailorResumeWithAI } from "../../services/gemini";
import { mockJobs } from "../../data/mockJobs";
import confetti from "canvas-confetti";

export const ResumeStudioView: React.FC = () => {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tailoring, setTailoring] = useState(false);
  const [targetJob, setTargetJob] = useState<Job>(mockJobs[0]);
  const [tailoredData, setTailoredData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    setLoading(true);
    try {
      const data = await api.getResume();
      setResume(data);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const updated = await api.uploadAndParseResume(file);
      setResume(updated);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = async () => {
    if (!resume || !targetJob) return;
    setTailoring(true);
    try {
      const tailored = await tailorResumeWithAI(resume, targetJob);
      setTailoredData(tailored);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    } finally {
      setTailoring(false);
    }
  };

  const handleCopyTailored = () => {
    if (!tailoredData) return;
    const text = `${tailoredData.roleTarget}\n\nSUMMARY:\n${tailoredData.summary}\n\nKEY ACHIEVEMENTS:\n${tailoredData.tailoredBullets.map((b: string) => `• ${b}`).join("\n")}\n\nCORE SKILLS:\n${tailoredData.suggestedKeywords.join(", ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !resume) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 border-3 border-[#3B3FD8] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Loading Master Resume & ATS Parser...
        </p>
      </div>
    );
  }

  const ats = resume.atsScore;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#3B3FD8]" /> ATS Resume Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explainable ATS scoring (Taleo / Greenhouse format), keyword gap analysis, and JD-tailored versions.
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B3FD8] hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all">
          <UploadCloud className="w-4 h-4" />
          <span>Upload PDF / DOCX</span>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>

      {/* Top ATS Score Dashboard Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Big Score Gauge */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1437] via-[#111C44] to-[#1B2559] text-white border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFB020]">
                Taleo / Workday Benchmark
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Encrypted at rest (AES-256)
              </span>
            </div>

            <div className="flex items-center gap-5 my-3">
              <div className="relative w-24 h-24 rounded-full border-6 border-[#14B8A6] flex items-center justify-center shrink-0 bg-[#0B1437] shadow-inner">
                <span className="text-3xl font-extrabold text-white">{ats.total}</span>
                <span className="text-[10px] text-slate-400 absolute bottom-3">/100</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {ats.total >= 85 ? "Excellent Pass Rate" : "Needs Optimization"}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Active file: <strong className="text-amber-300 font-semibold">{resume.fileName}</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Parsed: {resume.parsedName} ({resume.experienceYears} yrs exp)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-300">
            {ats.improvementSuggestions[0] || "Ready for high-volume recruiter applications."}
          </div>
        </div>

        {/* Right (2 Cols): 6-Part ATS Rubric Breakdown (Blueprint Section 6.2) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>6-Part ATS Rubric Breakdown</span>
            <span className="text-xs font-normal text-slate-400">Total: {ats.total}/100</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
            {/* 1. Keyword coverage */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-200">Keyword Coverage</span>
                <span className="text-[#3B3FD8] dark:text-indigo-400">{ats.keywordCoverage}/30</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#3B3FD8] rounded-full"
                  style={{ width: `${(ats.keywordCoverage / 30) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">Synonyms & technical skills mapped</span>
            </div>

            {/* 2. Structure and sections */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-200">Structure & Sections</span>
                <span className="text-[#14B8A6]">{ats.structureSections}/20</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#14B8A6] rounded-full"
                  style={{ width: `${(ats.structureSections / 20) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">Summary, Skills, Exp, Education</span>
            </div>

            {/* 3. Parse safety */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-200">Parse Safety</span>
                <span className="text-emerald-500">{ats.parseSafety}/15</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(ats.parseSafety / 15) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">No layout-breaking multi-columns</span>
            </div>

            {/* 4. Quantified impact */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-200">Quantified Impact</span>
                <span className="text-[#FFB020]">{ats.quantifiedImpact}/15</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#FFB020] rounded-full"
                  style={{ width: `${(ats.quantifiedImpact / 15) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">Bullets with metrics, % and outcomes</span>
            </div>

            {/* 5. Links and contact quality */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-200">Contact & Links</span>
                <span className="text-indigo-400">{ats.linksQuality}/10</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full"
                  style={{ width: `${(ats.linksQuality / 10) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">Phone, GitHub, LinkedIn well-formed</span>
            </div>

            {/* 6. Length and readability */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-200">Readability & Tense</span>
                <span className="text-teal-400">{ats.readability}/10</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full"
                  style={{ width: `${(ats.readability / 10) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">Standard font, 1-2 pages, consistent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Gap List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
          <span>Keyword Gap Analysis</span>
          <span className="text-xs text-slate-400 font-normal">
            Based on active Indian tech role descriptions
          </span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Matched Keywords */}
          <div className="flex-1 space-y-2">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Matched In Resume ({ats.matchedKeywords.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ats.matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="flex-1 space-y-2">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Missing High-Value Keywords ({ats.missingKeywords.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ats.missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                >
                  + {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Original vs AI Tailored View (Prompt & Blueprint specification) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3B3FD8]" /> Side-by-Side Tailored Resume Studio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Align your bullets and summary for a specific company's tech stack without fabricating experience.
            </p>
          </div>

          {/* Job Selector for Tailoring */}
          <div className="flex items-center gap-2">
            <select
              value={targetJob.id}
              onChange={(e) => {
                const j = mockJobs.find((m) => m.id === e.target.value);
                if (j) setTargetJob(j);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3B3FD8]"
            >
              {mockJobs.slice(0, 8).map((job) => (
                <option key={job.id} value={job.id}>
                  {job.company} - {job.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleTailor}
              disabled={tailoring}
              className="px-4 py-2 rounded-xl bg-[#3B3FD8] hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {tailoring ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Tailoring...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
                  <span>Generate Tailored Version</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Resume Panel */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Original Master Version
              </span>
              <span className="text-xs text-slate-400">Baseline ATS: 92%</span>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Executive Summary
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-[#111C44] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                {resume.summary}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Key Experience Bullets
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {resume.experienceBullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#111C44] border border-slate-200/80 dark:border-slate-800 leading-relaxed"
                  >
                    • {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Tailored Version Panel */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-teal-50/50 dark:from-[#111C44] dark:to-[#16215B] border border-[#3B3FD8]/30 dark:border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B3FD8] dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" /> Tailored for {targetJob.company}
              </span>
              {tailoredData && (
                <button
                  onClick={handleCopyTailored}
                  className="text-xs font-semibold text-[#3B3FD8] dark:text-indigo-300 hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy All"}</span>
                </button>
              )}
            </div>

            {tailoredData ? (
              <>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white mb-1">
                    Optimized Summary (Role Target: {tailoredData.roleTarget})
                  </h4>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-white/80 dark:bg-[#0B1437] p-3 rounded-xl border border-indigo-200 dark:border-slate-700 font-medium">
                    {tailoredData.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white mb-1">
                    Tailored Impact Bullets
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200">
                    {tailoredData.tailoredBullets.map((bullet: string, i: number) => (
                      <li
                        key={i}
                        className="p-2.5 rounded-xl bg-white/80 dark:bg-[#0B1437] border border-indigo-200 dark:border-slate-700 leading-relaxed font-medium"
                      >
                        ✓ {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="p-8 text-center my-8">
                <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3 opacity-60" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  Ready to tailor for {targetJob.company}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Click 'Generate Tailored Version' above to synthesize JD-specific keywords and STAR bullet points.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LinkedIn Optimization Tips Card (Prompt requirement) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0077B5]/15 text-[#0077B5] flex items-center justify-center shrink-0">
            <Linkedin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              LinkedIn Profile Strategy for Indian Recruiters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Optimize your headline for search algorithms: <em>"Full Stack Engineer | React, Node.js, Distributed Systems | 30 Days Notice"</em>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              "Full Stack Engineer | Node.js, React, TypeScript, PostgreSQL | Building scalable fintech & consumer tech | Notice Period: 30 Days | Bengaluru & Hyderabad"
            );
            alert("Copied optimized LinkedIn headline to clipboard!");
          }}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0077B5] hover:text-white dark:hover:bg-[#0077B5] text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
        >
          Copy Recommended Headline
        </button>
      </div>
    </div>
  );
};

export default ResumeStudioView;
