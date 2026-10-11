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
  JobAlert,
  AlertNotificationLog,
  CalendarEvent,
  IndianPlatformLink,
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

  // === JOB ALERTS SERVICE ===
  async getAlerts(): Promise<JobAlert[]> {
    const saved = localStorage.getItem("careerpilot_alerts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const defaultAlerts: JobAlert[] = [
      {
        id: "alert-1",
        title: "Hyderabad & Bengaluru Senior Backend (16+ LPA)",
        keywords: "Node.js, PostgreSQL, Distributed Systems",
        cities: ["Hyderabad", "Bengaluru"],
        minLpa: 16,
        noticePeriodMax: 30,
        wfhOnly: false,
        channel: "Both",
        destination: "nallaramakrishna73@gmail.com / +91 98480 12345",
        frequency: "Instant",
        active: true,
        createdAt: "09 Oct 2026",
        lastTriggeredAt: "Today at 02:30 PM",
        matchedCount: 8,
      },
      {
        id: "alert-2",
        title: "Immediate Joiner / Tier-2 IT Hubs (15-30d notice)",
        keywords: "Full Stack, React, Node.js",
        cities: ["Warangal", "Nirmal", "Pune"],
        minLpa: 8,
        noticePeriodMax: 30,
        wfhOnly: true,
        channel: "Email",
        destination: "nallaramakrishna73@gmail.com",
        frequency: "Daily Digest",
        active: true,
        createdAt: "10 Oct 2026",
        lastTriggeredAt: "Yesterday at 09:00 AM",
        matchedCount: 5,
      },
    ];
    localStorage.setItem("careerpilot_alerts", JSON.stringify(defaultAlerts));
    return defaultAlerts;
  },

  async saveAlerts(alerts: JobAlert[]): Promise<void> {
    localStorage.setItem("careerpilot_alerts", JSON.stringify(alerts));
  },

  async createAlert(alertData: Omit<JobAlert, "id" | "createdAt" | "matchedCount">): Promise<JobAlert> {
    const alerts = await this.getAlerts();
    const newAlert: JobAlert = {
      ...alertData,
      id: "alert-" + Date.now(),
      createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      matchedCount: Math.floor(Math.random() * 6) + 3,
    };
    const updated = [newAlert, ...alerts];
    await this.saveAlerts(updated);
    return newAlert;
  },

  async toggleAlert(id: string): Promise<JobAlert[]> {
    const alerts = await this.getAlerts();
    const updated = alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a));
    await this.saveAlerts(updated);
    return updated;
  },

  async deleteAlert(id: string): Promise<JobAlert[]> {
    const alerts = await this.getAlerts();
    const updated = alerts.filter((a) => a.id !== id);
    await this.saveAlerts(updated);
    return updated;
  },

  async getAlertLogs(): Promise<AlertNotificationLog[]> {
    const saved = localStorage.getItem("careerpilot_alert_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const defaultLogs: AlertNotificationLog[] = [
      {
        id: "log-1",
        alertId: "alert-1",
        title: "Swiggy Logistics: Backend Platform Engineer (18-28 LPA)",
        channel: "Both",
        destination: "nallaramakrishna73@gmail.com / +91 98480 12345",
        timestamp: "Today at 02:30 PM",
        jobsCount: 2,
        snippet: "New opening matched: 92% fit score, 30 days notice required in Hyderabad (Remote-friendly).",
        status: "Delivered",
      },
      {
        id: "log-2",
        alertId: "alert-1",
        title: "Razorpay Payments: Senior Full Stack Engineer (22-34 LPA)",
        channel: "Email",
        destination: "nallaramakrishna73@gmail.com",
        timestamp: "Yesterday at 06:15 PM",
        jobsCount: 1,
        snippet: "95% match with your master resume. Core skills: React, Node.js, PostgreSQL.",
        status: "Delivered",
      },
      {
        id: "log-3",
        alertId: "alert-2",
        title: "Daily Digest: 3 Tier-2 & Remote Full Stack Openings",
        channel: "SMS",
        destination: "+91 98480 12345",
        timestamp: "Yesterday at 09:00 AM",
        jobsCount: 3,
        snippet: "Kakatiya Tech Labs (Warangal) and Godavari Digital (Nirmal) are hiring immediate joiners.",
        status: "Delivered",
      },
    ];
    localStorage.setItem("careerpilot_alert_logs", JSON.stringify(defaultLogs));
    return defaultLogs;
  },

  async triggerAlertNow(alertId: string): Promise<AlertNotificationLog> {
    const alerts = await this.getAlerts();
    const alert = alerts.find((a) => a.id === alertId);
    const logs = await this.getAlertLogs();

    const newLog: AlertNotificationLog = {
      id: "log-" + Date.now(),
      alertId: alertId,
      title: `⚡ Manual Dispatch: ${alert ? alert.title : "Matching Jobs"}`,
      channel: alert?.channel || "Both",
      destination: alert?.destination || "nallaramakrishna73@gmail.com",
      timestamp: "Just now",
      jobsCount: Math.floor(Math.random() * 4) + 2,
      snippet: `Dispatched instant digest containing 3 live openings meeting ${alert?.minLpa || 15}+ LPA criteria via Twilio SMS and Resend Email service.`,
      status: "Delivered",
    };

    const updatedLogs = [newLog, ...logs];
    localStorage.setItem("careerpilot_alert_logs", JSON.stringify(updatedLogs));

    // Update alert's last triggered
    if (alert) {
      alert.lastTriggeredAt = "Just now";
      await this.saveAlerts(alerts);
    }

    return newLog;
  },

  // === CALENDAR & INTERVIEW SCHEDULING SERVICE ===
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const saved = localStorage.getItem("careerpilot_calendar_events");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const defaultEvents: CalendarEvent[] = [
      {
        id: "cal-1",
        applicationId: "app-1",
        title: "High-Level System Design Round (Razorpay)",
        company: "Razorpay",
        eventType: "Interview Round",
        date: "2026-10-14",
        time: "16:00",
        durationMinutes: 60,
        locationOrUrl: "https://meet.google.com/abc-razorpay-tech",
        notes: "Prepare Rate Limiter, Redis caching, and double-entry ledger database schema.",
        completed: false,
      },
      {
        id: "cal-2",
        title: "Mock Interview: STAR Behavioral & Outage Debugging",
        company: "CareerPilot AI",
        eventType: "Mock Practice",
        date: "2026-10-12",
        time: "11:00",
        durationMinutes: 45,
        locationOrUrl: "In-App Voice Coach",
        notes: "Targeting 85%+ score on 4-pillar rubric (Relevance, STAR structure, Tech Depth, Clarity).",
        completed: false,
      },
      {
        id: "cal-3",
        applicationId: "app-2",
        title: "Follow-up with Recruiter on Resume Review (Swiggy)",
        company: "Swiggy",
        eventType: "Follow-up Reminder",
        date: "2026-10-16",
        time: "10:30",
        durationMinutes: 15,
        locationOrUrl: "LinkedIn / Email",
        notes: "Send respectful 5-day polite check-in email referencing application id SW-4981.",
        completed: false,
      },
      {
        id: "cal-4",
        applicationId: "app-4",
        title: "Freshworks Offer Letter Decision Deadline",
        company: "Freshworks",
        eventType: "Offer Deadline",
        date: "2026-10-18",
        time: "17:00",
        durationMinutes: 30,
        locationOrUrl: "HR Call",
        notes: "Evaluate counter-offer negotiation using CareerPilot Indian LPA benchmark (target: 21 LPA).",
        completed: false,
      },
    ];
    localStorage.setItem("careerpilot_calendar_events", JSON.stringify(defaultEvents));
    return defaultEvents;
  },

  async saveCalendarEvents(events: CalendarEvent[]): Promise<void> {
    localStorage.setItem("careerpilot_calendar_events", JSON.stringify(events));
  },

  async addCalendarEvent(eventData: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
    const events = await this.getCalendarEvents();
    const newEvent: CalendarEvent = {
      ...eventData,
      id: "cal-" + Date.now(),
    };
    const updated = [...events, newEvent];
    await this.saveCalendarEvents(updated);
    return newEvent;
  },

  async updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent[]> {
    const events = await this.getCalendarEvents();
    const updated = events.map((e) => (e.id === id ? { ...e, ...updates } : e));
    await this.saveCalendarEvents(updated);
    return updated;
  },

  async deleteCalendarEvent(id: string): Promise<CalendarEvent[]> {
    const events = await this.getCalendarEvents();
    const updated = events.filter((e) => e.id !== id);
    await this.saveCalendarEvents(updated);
    return updated;
  },

  generateGoogleCalendarUrl(event: CalendarEvent): string {
    // Format dates in UTC YYYYMMDDTHHMMSSZ (assuming Indian Standard Time IST UTC+5:30)
    const [year, month, day] = event.date.split("-").map(Number);
    const [hours, mins] = event.time.split(":").map(Number);
    // Create Date object in local context
    const startDate = new Date(year, month - 1, day, hours, mins);
    const endDate = new Date(startDate.getTime() + event.durationMinutes * 60000);

    const pad = (n: number) => (n < 10 ? "0" + n : n.toString());
    const toIsoCompact = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const dates = `${toIsoCompact(startDate)}/${toIsoCompact(endDate)}`;
    const details = encodeURIComponent(
      `Company: ${event.company}\nType: ${event.eventType}\nPrep Notes: ${event.notes}\nMeeting Link: ${event.locationOrUrl}\n\nScheduled via CareerPilot AI`
    );
    const text = encodeURIComponent(`[CareerPilot] ${event.title}`);
    const location = encodeURIComponent(event.locationOrUrl);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  },

  generateIcsFile(event: CalendarEvent): void {
    const [year, month, day] = event.date.split("-").map(Number);
    const [hours, mins] = event.time.split(":").map(Number);
    const startDate = new Date(year, month - 1, day, hours, mins);
    const endDate = new Date(startDate.getTime() + event.durationMinutes * 60000);

    const pad = (n: number) => (n < 10 ? "0" + n : n.toString());
    const toIsoCompact = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CareerPilot AI//Job Search Copilot//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${event.id}@careerpilot.ai`,
      `DTSTAMP:${toIsoCompact(new Date())}`,
      `DTSTART:${toIsoCompact(startDate)}`,
      `DTEND:${toIsoCompact(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.notes} - Company: ${event.company}`,
      `LOCATION:${event.locationOrUrl}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // === INDIAN JOB PLATFORMS LINK-OUT GENERATOR ===
  getIndianPlatformLinks(params: { role: string; city: string; expYears?: number; minLpa?: number }): IndianPlatformLink[] {
    const q = encodeURIComponent(params.role || "Full Stack Developer");
    const city = encodeURIComponent(params.city || "Hyderabad");
    const exp = params.expYears || 2;

    return [
      {
        platform: "Naukri",
        logoColor: "#0A46F4",
        searchUrl: `https://www.naukri.com/${q.toLowerCase()}-jobs-in-${city.toLowerCase()}?k=${q}&l=${city}&experience=${exp}`,
        tip: "India's highest recruiter reach. Best for active recruiter search indexing and fast responses.",
      },
      {
        platform: "TimesJobs",
        logoColor: "#C91F26",
        searchUrl: `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=${q}&txtLocation=${city}`,
        tip: "Popular for established Indian MNCs, banking tech divisions, and IT services firms.",
      },
      {
        platform: "Foundit (Monster)",
        logoColor: "#6C19E8",
        searchUrl: `https://www.foundit.in/srp/results?query=${q}&locations=${city}`,
        tip: "Strong in Bangalore, Hyderabad, and Pune tech mid-market startups and product companies.",
      },
      {
        platform: "Shine",
        logoColor: "#009688",
        searchUrl: `https://www.shine.com/job-search/${q.toLowerCase()}-jobs-in-${city.toLowerCase()}`,
        tip: "Good for rapid phone screen calls and verified consultancies across North and South India.",
      },
      {
        platform: "Freshersworld",
        logoColor: "#FF5722",
        searchUrl: `https://www.freshersworld.com/jobs/jobsearch/${q.toLowerCase()}-jobs-in-${city.toLowerCase()}`,
        tip: "Tailored for freshers, 0-2 yrs candidates, off-campus drives, and Tier-2 engineering graduates.",
      },
    ];
  },

  // === INDIAN LPA SALARY BREAKDOWN CALCULATOR ===
  calculateIndianSalaryBreakdown(ctcLpa: number, variablePercent: number = 10) {
    const totalRupees = ctcLpa * 100000;
    const variableAmount = (totalRupees * variablePercent) / 100;
    const fixedCtc = totalRupees - variableAmount;

    // Standard Indian salary structuring
    const basicAnnual = fixedCtc * 0.40; // 40% of fixed
    const hraAnnual = basicAnnual * 0.40; // 40% of basic
    const specialAllowanceAnnual = fixedCtc - basicAnnual - hraAnnual;

    // Monthly EPF deduction (12% of basic, capped or full)
    const employeePfMonthly = Math.round((basicAnnual / 12) * 0.12);
    const professionalTaxMonthly = 200; // Standard in Telangana & Karnataka

    // New Tax Regime (FY 2026-27 under Section 115BAC):
    // Standard deduction: ₹75,000
    const taxableIncome = Math.max(0, fixedCtc - 75000 - (employeePfMonthly * 12));
    let annualTax = 0;
    if (taxableIncome > 1500000) {
      annualTax = 150000 + (taxableIncome - 1500000) * 0.30;
    } else if (taxableIncome > 1200000) {
      annualTax = 90000 + (taxableIncome - 1200000) * 0.20;
    } else if (taxableIncome > 900000) {
      annualTax = 45000 + (taxableIncome - 900000) * 0.15;
    } else if (taxableIncome > 600000) {
      annualTax = 15000 + (taxableIncome - 600000) * 0.10;
    } else if (taxableIncome > 300000) {
      annualTax = (taxableIncome - 300000) * 0.05;
    }
    // 4% Health & Education cess
    annualTax = Math.round(annualTax * 1.04);
    const monthlyTds = Math.round(annualTax / 12);

    const monthlyGross = Math.round(fixedCtc / 12);
    const monthlyInHand = Math.max(0, monthlyGross - employeePfMonthly - professionalTaxMonthly - monthlyTds);

    return {
      ctcLpa,
      fixedCtcLpa: Math.round((fixedCtc / 100000) * 10) / 10,
      variableAmountAnnual: Math.round(variableAmount),
      monthlyGross,
      monthlyInHand,
      employeePfMonthly,
      professionalTaxMonthly,
      monthlyTds,
      annualTax,
    };
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
