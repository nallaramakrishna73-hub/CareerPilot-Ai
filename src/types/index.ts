export type JobLocation = 'Bengaluru' | 'Hyderabad' | 'Pune' | 'Mumbai' | 'Delhi NCR' | 'Warangal' | 'Nirmal' | 'Remote';

export type NoticePeriod = 15 | 30 | 60 | 90;

export interface JobMatchBreakdown {
  skillOverlap: number; // 40%
  semanticSimilarity: number; // 20%
  experienceFit: number; // 15%
  salaryFit: number; // 10%
  locationFit: number; // 10%
  noticeFit: number; // 5%
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: JobLocation;
  cityTier: 'Tier-1' | 'Tier-2';
  isRemote: boolean;
  minLpa: number;
  maxLpa: number;
  minExp: number;
  maxExp: number;
  noticePeriodRequired: NoticePeriod;
  skills: string[];
  niceToHaveSkills?: string[];
  description: string;
  source: 'Adzuna' | 'JSearch' | 'Jooble' | 'Direct';
  externalUrl: string;
  postedAt: string;
  department: string;
  matchScore?: number;
  matchBreakdown?: JobMatchBreakdown;
}

export type ApplicationStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  lpa: string;
  status: ApplicationStatus;
  appliedDate: string;
  followUpDate?: string;
  notes: string;
  interviewRounds?: string[];
}

export interface AtsScoreBreakdown {
  keywordCoverage: number; // max 30
  structureSections: number; // max 20
  parseSafety: number; // max 15
  quantifiedImpact: number; // max 15
  linksQuality: number; // max 10
  readability: number; // max 10
  total: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  improvementSuggestions: string[];
}

export interface ResumeData {
  id: string;
  fileName: string;
  uploadDate: string;
  parsedName: string;
  parsedEmail: string;
  parsedPhone: string;
  parsedLocation: string;
  experienceYears: number;
  skills: string[];
  summary: string;
  experienceBullets: string[];
  education: string;
  atsScore: AtsScoreBreakdown;
  tailoredVersion?: {
    summary: string;
    tailoredBullets: string[];
    suggestedKeywords: string[];
    roleTarget: string;
  };
}

export interface CompanyIntel {
  id: string;
  name: string;
  industry: string;
  headquarters: string;
  foundedYear: number;
  size: string;
  fundingStage: string;
  totalFunding: string;
  cultureRating: number; // e.g. 4.2 out of 5
  ambitionBoxScore: number;
  workLifeBalance: number;
  salaryCompetitiveness: 'High' | 'Average' | 'Competitive';
  techStack: string[];
  redFlagNotes?: string[];
  greenFlagNotes: string[];
  fundingTimeline: {
    round: string;
    amount: string;
    year: string;
    leadInvestor: string;
  }[];
  sources: { title: string; url: string; confidence: 'Verified' | 'Estimated' }[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Behavioral' | 'System Design' | 'Coding / Core CS' | 'Scenario';
  expectedConcepts: string[];
}

export interface InterviewTurn {
  id: string;
  question: string;
  userAnswer: string;
  timestamp: string;
  scores: {
    relevance: number; // 1-5
    structureStar: number; // 1-5
    technicalDepth: number; // 1-5
    clarity: number; // 1-5
    overall: number; // 0-100
  };
  quotedJustification: string;
  feedback: string;
  improvementTip: string;
  speechMetrics?: {
    wordCount: number;
    fillerWordsDetected: string[];
    wordsPerMinute: number;
  };
}

export interface InterviewSession {
  id: string;
  role: string;
  experienceLevel: 'Fresher (0-1 yrs)' | 'Mid-Level (2-4 yrs)' | 'Senior (5+ yrs)';
  startedAt: string;
  turns: InterviewTurn[];
  overallSummary?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolCalls?: {
    toolName: 'Job Search' | 'Resume Studio' | 'Company Intel' | 'Salary Benchmark' | 'Interview Coach';
    summary: string;
    data?: any;
  }[];
  sources?: { title: string; url?: string; note?: string }[];
  isStreaming?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  targetRoles: string[];
  preferredCities: JobLocation[];
  minLpa: number;
  noticePeriodDays: NoticePeriod;
  wfhPreference: boolean;
  experienceYears: number;
  careerGoal: string;
  isGuest?: boolean;
}

export interface PrivacyConsents {
  resumeStorage: boolean;
  aiProcessingConsent: boolean;
  jobAlertsEmail: boolean;
  analyticsCollection: boolean;
  policyVersion: string;
  lastUpdated: string;
}
