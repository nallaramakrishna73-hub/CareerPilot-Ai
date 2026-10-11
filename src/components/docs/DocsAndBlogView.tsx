import React, { useState } from "react";
import {
  Code2,
  BookOpen,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Play,
  Terminal,
  ShieldCheck,
  Server,
  Layers,
  Database,
  Lock,
  ArrowRight,
  FileText,
  Calendar,
  User,
} from "lucide-react";

interface ApiEndpoint {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  tag: "Jobs" | "Resume" | "Interview" | "Company" | "Alerts" | "Agent" | "Calendar";
  summary: string;
  description: string;
  sampleRequest?: any;
  sampleResponse: any;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/v1/jobs/search",
    tag: "Jobs",
    summary: "Unified Multi-Source Job Search",
    description: "Aggregates jobs across Adzuna, JSearch, and Jooble with LPA normalisation, notice-period filtering, and explainable match scoring.",
    sampleRequest: {
      q: "Backend Engineer",
      city: "Hyderabad",
      min_lpa: 15,
      notice_period_max: 30,
      wfh: true,
    },
    sampleResponse: {
      status: "success",
      total: 30,
      results: [
        {
          id: "job-2",
          title: "Backend Platform Engineer (Go / Node.js)",
          company: "Swiggy",
          location: "Hyderabad",
          salary: { min_lpa: 18, max_lpa: 28, confidence: "high" },
          notice_period: 30,
          match_score: 92,
          match_breakdown: {
            skill_overlap: 85,
            semantic_similarity: 80,
            experience_fit: 95,
            salary_fit: 100,
            location_fit: 100,
            notice_fit: 100,
          },
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/api/v1/agent/chat",
    tag: "Agent",
    summary: "LangGraph Conversational Career Copilot (SSE Streaming)",
    description: "Stateful agent endpoint orchestrating parallel tool fan-out across Job Search, Resume Analyzer, and AmbitionBox culture intelligence.",
    sampleRequest: {
      message: "Find me backend roles in Hyderabad, 12+ LPA, 30 days notice",
      stream: true,
    },
    sampleResponse: {
      delta: "Based on your profile with 2.5 years experience...",
      tool_calls: [
        { name: "job_search", args: { city: "Hyderabad", min_lpa: 12, notice: 30 } },
      ],
      citations: [
        { title: "Adzuna India Index", url: "https://www.adzuna.in" },
      ],
    },
  },
  {
    method: "POST",
    path: "/api/v1/resumes/{id}/analyze",
    tag: "Resume",
    summary: "Evaluate ATS Score & Keyword Gap",
    description: "Evaluates resume text against Taleo/Greenhouse parser rules using a 6-part rubric (Keyword coverage, Structure, Parse safety, Quantified impact, Links, Readability).",
    sampleResponse: {
      ats_score: 92,
      rubric: {
        keyword_coverage: 26,
        structure: 19,
        parse_safety: 14,
        quantified_impact: 14,
        links_quality: 10,
        readability: 9,
      },
      matched_keywords: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      missing_keywords: ["Kafka", "Kubernetes"],
    },
  },
  {
    method: "POST",
    path: "/api/v1/interviews/{id}/answer",
    tag: "Interview",
    summary: "Mock Interview STAR Rubric Scoring",
    description: "Evaluates spoken or written response on 1 to 5 scale for Relevance, Structure (STAR), Technical Depth, and Clarity with examiner justification.",
    sampleRequest: {
      question: "How do you design an idempotent payment API?",
      user_answer: "In my previous project, we implemented an Idempotency-Key header in Redis...",
    },
    sampleResponse: {
      scores: {
        relevance: 4,
        structure_star: 4,
        technical_depth: 4,
        clarity: 4,
        overall: 82,
      },
      quoted_justification: "Implemented an Idempotency-Key header in Redis...",
      feedback: "Strong technical grasp of distributed caching and database transactions.",
      improvement_tip: "Mention exact error handling for expired Redis keys.",
    },
  },
  {
    method: "POST",
    path: "/api/v1/alerts",
    tag: "Alerts",
    summary: "Create Celery-Scheduled Job Alert",
    description: "Registers search query for automated periodic Celery Beat scans. Dispatches matching roles via Twilio SMS or Resend Email.",
    sampleRequest: {
      title: "Pune & Hyderabad Backend",
      min_lpa: 16,
      channel: "Both",
      destination: "nallaramakrishna73@gmail.com",
      frequency: "Instant",
    },
    sampleResponse: {
      id: "alert-101",
      status: "active",
      scheduled_interval: "*/30 * * * *",
    },
  },
];

export const DocsAndBlogView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"docs" | "blog">("docs");
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[0]);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<any>(null);

  const generateCurl = (ep: ApiEndpoint) => {
    let curl = `curl -X ${ep.method} "https://careerpilot-api.run.app${ep.path}" \\\n  -H "Authorization: Bearer <FIREBASE_JWT>" \\\n  -H "Content-Type: application/json"`;
    if (ep.sampleRequest) {
      curl += ` \\\n  -d '${JSON.stringify(ep.sampleRequest, null, 2)}'`;
    }
    return curl;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(generateCurl(selectedEndpoint));
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleExecute = () => {
    setExecuting(true);
    setExecutionOutput(null);
    setTimeout(() => {
      setExecutionOutput(selectedEndpoint.sampleResponse);
      setExecuting(false);
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#3B3FD8]" /> Technical Documentation & Blog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track B Deliverables: Interactive REST OpenAPI Explorer & HR-Tech Engineering Whitepaper.
          </p>
        </div>

        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setActiveTab("docs");
              setExecutionOutput(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "docs"
                ? "bg-[#3B3FD8] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Interactive API Docs</span>
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "blog"
                ? "bg-[#3B3FD8] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Technical Blog Post</span>
          </button>
        </div>
      </div>

      {activeTab === "docs" ? (
        /* ================= TAB 1: INTERACTIVE OPENAPI EXPLORER ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Endpoint Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              REST Endpoints (/api/v1)
            </span>
            {API_ENDPOINTS.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedEndpoint(ep);
                  setExecutionOutput(null);
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-2.5 ${
                  selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method
                    ? "bg-white dark:bg-[#111C44] border-[#3B3FD8] shadow-md shadow-indigo-600/10"
                    : "bg-slate-50 dark:bg-[#0B1437] border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 uppercase ${
                    ep.method === "GET"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : ep.method === "POST"
                      ? "bg-indigo-100 text-[#3B3FD8] dark:bg-indigo-950 dark:text-indigo-300"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {ep.method}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate">
                    {ep.path}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{ep.summary}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Endpoint Details & Interactive Try It Out */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase ${
                      selectedEndpoint.method === "GET"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-indigo-100 text-[#3B3FD8] dark:bg-indigo-950 dark:text-indigo-300"
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mt-1.5">
                  {selectedEndpoint.summary}
                </h3>
              </div>

              <button
                onClick={handleExecute}
                disabled={executing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3B3FD8] to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer self-start sm:self-center"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{executing ? "Sending..." : "Try it out (Execute)"}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedEndpoint.description}
            </p>

            {/* cURL Snippet */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  cURL Request
                </span>
                <button
                  onClick={handleCopyCurl}
                  className="text-xs text-[#3B3FD8] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedCurl ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCurl ? "Copied" : "Copy cURL"}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
                {generateCurl(selectedEndpoint)}
              </pre>
            </div>

            {/* Live Response Box */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Response Payload (200 OK)
              </span>
              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-800 max-h-80">
                {JSON.stringify(executionOutput || selectedEndpoint.sampleResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* ================= TAB 2: TECHNICAL BLOG POST ================= */
        <article className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-slate-800 dark:text-slate-200 leading-relaxed">
          {/* Blog Meta */}
          <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-[#3B3FD8] dark:text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
              <span>HR-Tech Engineering Whitepaper • Track B Deliverable</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Building an Honest, Privacy-First Career Copilot for the Indian Job Market
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5" /> Ramakrishna Janhvi
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> 11 October 2026
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                12-min read
              </span>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              1. The Indian Tech Hiring Conundrum
            </h2>
            <p className="text-xs sm:text-sm">
              The Indian software job market is defined by structural dynamics unseen in Western HR systems:
              universal compensation benchmarking in <strong>Lakhs Per Annum (LPA)</strong>, strict mandatory{" "}
              <strong>notice periods of 30, 60, or 90 days</strong>, extreme applicant volume (often 1,500+ applicants per opening),
              and an emerging geographic shift towards Tier-2 tech hubs like Warangal, Nirmal, Kochi, and Indore alongside traditional Tier-1 metros (Bengaluru, Hyderabad, Pune).
            </p>
            <p className="text-xs sm:text-sm">
              Most generic AI copilots fail because they ignore notice period filters, cannot parse Indian salary strings such as <em>"18-28 LPA"</em> or <em>"50k/month"</em>, and hallucinate advice without citing verified sources. CareerPilot AI was engineered as a conversational copilot solving this exact dilemma.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              2. The 6-Part Explainable Matching Mathematics
            </h2>
            <p className="text-xs sm:text-sm">
              Rather than treating matchmaking as an ungrounded black box, CareerPilot calculates an explainable score (0 to 100) using a multi-objective formula:
            </p>
            <pre className="p-4 rounded-2xl bg-slate-900 text-amber-300 text-xs font-mono overflow-x-auto border border-slate-800">
{`match = 100 * ( 0.40 * skill_overlap
             + 0.20 * semantic_similarity
             + 0.15 * experience_fit
             + 0.10 * salary_fit
             + 0.10 * location_fit
             + 0.05 * notice_fit )`}
            </pre>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
              <li><strong>Skill Overlap (40%):</strong> Weighted Jaccard index where hard required skills weigh 2x against nice-to-have skills.</li>
              <li><strong>Semantic Similarity (20%):</strong> Cosine similarity comparing candidate summaries against job descriptions.</li>
              <li><strong>Experience Fit (15%):</strong> 1.0 within target range with linear decay outside (floor 0.2).</li>
              <li><strong>Salary Fit (10%):</strong> Normalized overlap of candidate target LPA against employer band.</li>
              <li><strong>Location Fit (10%):</strong> Preferred city match or remote flexibility match.</li>
              <li><strong>Notice Fit (5%):</strong> Candidate notice period alignment (1.0 for ≤30 days).</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              3. Privacy by Design & DPDP Act India 2023 Compliance
            </h2>
            <p className="text-xs sm:text-sm">
              HR tech platforms frequently suffer from data breaches and unchecked telemarketing spam. CareerPilot enforces four non-negotiable security controls:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800">
                <strong className="text-[#3B3FD8] block mb-1">PII Masking at Gateway</strong>
                Email addresses, phone numbers, and physical residential addresses are redacted using regular expression filters before text reaches generative LLM tokenizers.
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800">
                <strong className="text-[#14B8A6] block mb-1">AES-256 Storage & GDPR Purge</strong>
                Resumes are encrypted at rest. Users can export their full data dossier in JSON or trigger a hard cryptographic deletion in compliance with India's DPDP Act.
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              4. Why Not Scrape Naukri? Ethical Multi-Source Aggregation
            </h2>
            <p className="text-xs sm:text-sm">
              During viva discussions, interviewers often ask: <em>"Why doesn't the system scrape Naukri directly?"</em>.
              Modern engineering ethics dictate respecting web terms of service and robot restrictions. Personal automated scraping of closed portals risks account bans, IP blacklisting, and stale data.
            </p>
            <p className="text-xs sm:text-sm">
              Instead, CareerPilot utilizes <strong>official APIs (Adzuna India, JSearch, Jooble)</strong> combined with high-precision deep links into Naukri, TimesJobs, and Foundit with URL-encoded query parameters. This provides 100% legal reliability, sub-200ms latency, and zero service downtime.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              5. Conclusion & Project Roadmap
            </h2>
            <p className="text-xs sm:text-sm">
              By coupling LangGraph stateful multi-tool agents with localized Indian hiring models, CareerPilot AI transforms a chaotic job search into a structured, confident journey. The platform proves that AI copilots can be simultaneously helpful, explainable, and respectful of candidate privacy.
            </p>
          </div>
        </article>
      )}
    </div>
  );
};

export default DocsAndBlogView;
