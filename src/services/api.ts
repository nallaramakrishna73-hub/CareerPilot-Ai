import {
  Job,
  Application,
  ResumeData,
  CompanyIntel,
  InterviewSession,
  InterviewTurn,
  UserProfile,
  PrivacyConsents,
  JobMatchBreakdown,
} from "../types";
import { mockJobs } from "../data/mockJobs";
import { getCompanyIntelByName } from "../data/mockCompanies";
import { calculateJobMatch, evaluateResumeAts } from "./algorithms";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Default candidate resume data for initial preview
const defaultCandidateResume: ResumeData = {
  id: "resume-default",
  fileName: "Ramakrishna_Janhvi_FullStack_Resume.pdf",
  uploadDate: "11 Oct 2026",
  parsedName: "Ramakrishna Janhvi",
  parsedEmail: "nallaramakrishna73@gmail.com",
  parsedPhone: "+91 98480 12345",
  parsedLocation: "Hyderabad, India",
  experienceYears: 2.5,
  skills: [
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "PostgreSQL",
    "REST APIs",
    "Tailwind CSS",
    "Redis",
    "Docker",
    "Git",
    "Next.js",
  ],
  summary:
    "Product-minded Full Stack Engineer with 2.5+ years building scalable web apps and backend services. Experience with TypeScript, React, Node.js, and high-concurrency PostgreSQL databases. Passionate about developer tooling and fintech platforms.",
  experienceBullets: [
    "Engineered merchant payment checkout flows reducing gateway checkout drop-offs by 24% across 80,000 monthly transactions.",
    "Architected REST and WebSocket microservices using Node.js and Redis caching, cutting average p95 response latency from 320ms to 95ms.",
    "Migrated frontend monolith to modern React + TypeScript with component library, improving lighthouse performance score from 68 to 94.",
    "Integrated automated CI/CD pipeline using GitHub Actions and Docker, reducing deployment cycle times by 40%.",
  ],
  education: "B.Tech in Computer Science & Engineering (2020-2024), 8.6 CGPA",
  atsScore: {
    keywordCoverage: 26,
    structureSections: 19,
    parseSafety: 14,
    quantifiedImpact: 14,
    linksQuality: 10,
    readability: 9,
    total: 92,
    matchedKeywords: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs", "Redis", "Docker", "Git"],
    missingKeywords: ["Kafka", "Kubernetes", "AWS DynamoDB"],
    improvementSuggestions: [
      "Include experience with distributed streaming tools like Apache Kafka or AWS SQS.",
      "Add explicit certifications or cloud badges (e.g., AWS Cloud Practitioner).",
    ],
  },
};

// Initial default tracker applications
const defaultApplications: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Senior Full Stack Engineer (Node.js & React)",
    company: "Razorpay",
    location: "Bengaluru",
    lpa: "22-34 LPA",
    status: "Interview",
    appliedDate: "08 Oct 2026",
    followUpDate: "14 Oct 2026",
    notes: "Passed coding round (Concurrency & Rate Limiter in Node.js). Scheduled for High-Level System Design round on Wednesday.",
    interviewRounds: ["Screening: Passed", "Machine Coding: Passed", "System Design: Upcoming"],
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Backend Platform Engineer (Go / Node.js)",
    company: "Swiggy",
    location: "Hyderabad",
    lpa: "18-28 LPA",
    status: "Applied",
    appliedDate: "09 Oct 2026",
    followUpDate: "16 Oct 2026",
    notes: "Applied with tailored resume highlighting Redis geospatial caching and logistics order routing.",
    interviewRounds: ["Resume Shortlist: Under Review"],
  },
  {
    id: "app-3",
    jobId: "job-6",
    jobTitle: "API Platform Developer",
    company: "Postman",
    location: "Hyderabad",
    lpa: "20-32 LPA",
    status: "Saved",
    appliedDate: "10 Oct 2026",
    followUpDate: "12 Oct 2026",
    notes: "Great culture fit. Need to tailor resume to emphasize open-source OpenAPI tooling and developer SDKs.",
  },
  {
    id: "app-4",
    jobId: "job-10",
    jobTitle: "React Frontend Engineer",
    company: "Freshworks",
    location: "Hyderabad",
    lpa: "14-22 LPA",
    status: "Offer",
    appliedDate: "28 Sep 2026",
    followUpDate: "15 Oct 2026",
    notes: "Received official letter for 18.5 LPA fixed + 2.5 LPA variable. Evaluating negotiation strategy using CareerPilot salary benchmark.",
  },
];

export const api = {
  // === JOBS SERVICE ===
  async searchJobs(params: {
    q?: string;
    cities?: string[];
    minExp?: number;
    maxExp?: number;
    minLpa?: number;
    maxLpa?: number;
    noticePeriod?: number;
    wfhOnly?: boolean;
    sort?: "match" | "salary" | "recent";
    userProfile?: UserProfile;
    skills?: string[];
  }): Promise<Job[]> {
    if (BASE_URL) {
      try {
        const query = new URLSearchParams();
        if (params.q) query.append("q", params.q);
        if (params.minLpa) query.append("min_lpa", params.minLpa.toString());
        const res = await fetch(`${BASE_URL}/api/v1/jobs/search?${query.toString()}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend jobs/search unreachable, using smart client fallback", e);
      }
    }

    let results = [...mockJobs];

    if (params.q) {
      const q = params.q.toLowerCase();
      results = results.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.department.toLowerCase().includes(q)
      );
    }

    if (params.cities && params.cities.length > 0) {
      results = results.filter((j) => {
        if (params.cities?.includes("Tier-2")) {
          if (j.cityTier === "Tier-2") return true;
        }
        return params.cities?.includes(j.location);
      });
    }

    if (params.minLpa !== undefined) {
      results = results.filter((j) => j.maxLpa >= params.minLpa!);
    }

    if (params.maxLpa !== undefined) {
      results = results.filter((j) => j.minLpa <= params.maxLpa!);
    }

    if (params.minExp !== undefined) {
      results = results.filter((j) => j.maxExp >= params.minExp!);
    }

    if (params.noticePeriod !== undefined && params.noticePeriod > 0) {
      results = results.filter((j) => j.noticePeriodRequired >= params.noticePeriod!);
    }

    if (params.wfhOnly) {
      results = results.filter((j) => j.isRemote);
    }

    // Calculate match scores for all results
    const profile = params.userProfile || {
      uid: "user",
      email: "user@domain.com",
      displayName: "Candidate",
      targetRoles: ["Full Stack Developer", "Backend Engineer"],
      preferredCities: ["Hyderabad", "Bengaluru"],
      minLpa: 12,
      noticePeriodDays: 30,
      wfhPreference: true,
      experienceYears: 2.5,
      careerGoal: "Full stack engineering in high scale startups",
    };

    const candidateSkills = params.skills || defaultCandidateResume.skills;

    results = results.map((job) => {
      const match = calculateJobMatch(job, profile, candidateSkills);
      return {
        ...job,
        matchScore: match.score,
        matchBreakdown: match.breakdown,
      };
    });

    if (params.sort === "salary") {
      results.sort((a, b) => b.maxLpa - a.maxLpa);
    } else if (params.sort === "recent") {
      results.sort((a, b) => a.postedAt.localeCompare(b.postedAt));
    } else {
      results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return results;
  },

  async getJobById(id: string): Promise<Job | null> {
    const job = mockJobs.find((j) => j.id === id);
    return job || null;
  },

  // === RESUME STUDIO ===
  async getResume(): Promise<ResumeData> {
    const saved = localStorage.getItem("careerpilot_resume");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultCandidateResume;
  },

  async saveResume(resume: ResumeData): Promise<void> {
    localStorage.setItem("careerpilot_resume", JSON.stringify(resume));
  },

  async uploadAndParseResume(file: File): Promise<ResumeData> {
    // Simulated realistic ATS parsing
    const fileName = file.name;
    const existing = await this.getResume();
    const updated: ResumeData = {
      ...existing,
      fileName,
      uploadDate: "Just now",
      atsScore: evaluateResumeAts(
        `${existing.summary} ${existing.experienceBullets.join(" ")} ${existing.skills.join(" ")}`
      ),
    };
    await this.saveResume(updated);
    return updated;
  },

  // === APPLICATIONS TRACKER ===
  async getApplications(): Promise<Application[]> {
    const saved = localStorage.getItem("careerpilot_applications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultApplications;
  },

  async saveApplications(apps: Application[]): Promise<void> {
    localStorage.setItem("careerpilot_applications", JSON.stringify(apps));
  },

  async addApplication(app: Omit<Application, "id">): Promise<Application> {
    const apps = await this.getApplications();
    const newApp: Application = {
      ...app,
      id: "app-" + Date.now(),
    };
    const updated = [newApp, ...apps];
    await this.saveApplications(updated);
    return newApp;
  },

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application[]> {
    const apps = await this.getApplications();
    const updated = apps.map((a) => (a.id === id ? { ...a, ...updates } : a));
    await this.saveApplications(updated);
    return updated;
  },

  async deleteApplication(id: string): Promise<Application[]> {
    const apps = await this.getApplications();
    const updated = apps.filter((a) => a.id !== id);
    await this.saveApplications(updated);
    return updated;
  },

  // === COMPANY INTEL ===
  async getCompanyIntel(companyName: string): Promise<CompanyIntel> {
    return getCompanyIntelByName(companyName);
  },

  // === PRIVACY & CONSENT ===
  async getConsents(): Promise<PrivacyConsents> {
    const saved = localStorage.getItem("careerpilot_consents");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      resumeStorage: true,
      aiProcessingConsent: true,
      jobAlertsEmail: true,
      analyticsCollection: true,
      policyVersion: "v1.2 (Oct 2026)",
      lastUpdated: "11 Oct 2026",
    };
  },

  async saveConsents(consents: PrivacyConsents): Promise<void> {
    localStorage.setItem("careerpilot_consents", JSON.stringify(consents));
  },

  async exportUserData(): Promise<string> {
    const profile = localStorage.getItem("careerpilot_profile");
    const resume = localStorage.getItem("careerpilot_resume");
    const apps = localStorage.getItem("careerpilot_applications");
    const consents = localStorage.getItem("careerpilot_consents");

    const bundle = {
      exportTimestamp: new Date().toISOString(),
      compliance: "GDPR / DPDP India Compliant Data Export",
      profile: profile ? JSON.parse(profile) : null,
      resume: resume ? JSON.parse(resume) : null,
      applications: apps ? JSON.parse(apps) : null,
      consents: consents ? JSON.parse(consents) : null,
    };

    return JSON.stringify(bundle, null, 2);
  },

  async deleteUserData(): Promise<void> {
    localStorage.removeItem("careerpilot_profile");
    localStorage.removeItem("careerpilot_resume");
    localStorage.removeItem("careerpilot_applications");
    localStorage.removeItem("careerpilot_consents");
    localStorage.removeItem("careerpilot_interview_sessions");
  },
};
