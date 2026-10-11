import { Job, JobMatchBreakdown, AtsScoreBreakdown, UserProfile } from "../types";

/**
 * Normalizes salary text into min/max LPA and confidence
 * Blueprint Section 6.3
 */
export function normalizeIndianSalary(rawText: string): { minLpa: number; maxLpa: number; confidence: "high" | "estimated" } {
  if (!rawText || rawText.toLowerCase().includes("not disclosed")) {
    return { minLpa: 10, maxLpa: 18, confidence: "estimated" };
  }

  const clean = rawText.toLowerCase().replace(/,/g, "").trim();

  // "12-18 lpa" or "12 to 18 lpa" or "15 lpa"
  const lpaMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:-|to)?\s*(\d+(?:\.\d+)?)?\s*lpa/);
  if (lpaMatch) {
    const min = parseFloat(lpaMatch[1]);
    const max = lpaMatch[2] ? parseFloat(lpaMatch[2]) : min;
    return { minLpa: min, maxLpa: max, confidence: "high" };
  }

  // Monthly values e.g. "50k per month" or "50000/month"
  const monthlyMatch = clean.match(/(\d+(?:\.\d+)?)\s*k?\s*(?:per month|\/month|monthly)/);
  if (monthlyMatch) {
    let monthlyVal = parseFloat(monthlyMatch[1]);
    if (clean.includes("k")) monthlyVal *= 1000;
    const lpa = (monthlyVal * 12) / 100000;
    return { minLpa: Math.round(lpa * 10) / 10, maxLpa: Math.round(lpa * 1.3 * 10) / 10, confidence: "high" };
  }

  // Rupee absolute numbers "600000 - 1000000"
  const rupeeMatch = clean.match(/(\d{6,8})\s*(?:-|to)?\s*(\d{6,8})?/);
  if (rupeeMatch) {
    const min = parseFloat(rupeeMatch[1]) / 100000;
    const max = rupeeMatch[2] ? parseFloat(rupeeMatch[2]) / 100000 : min;
    return { minLpa: min, maxLpa: max, confidence: "high" };
  }

  return { minLpa: 8, maxLpa: 16, confidence: "estimated" };
}

/**
 * Computes Job Match Score (0 to 100)
 * Formula from Blueprint Section 6.1:
 * match = 100 * ( 0.40 * skill_overlap
 *  + 0.20 * semantic_similarity
 *  + 0.15 * experience_fit
 *  + 0.10 * salary_fit
 *  + 0.10 * location_fit
 *  + 0.05 * notice_fit )
 */
export function calculateJobMatch(job: Job, profile: UserProfile, candidateSkills: string[]): { score: number; breakdown: JobMatchBreakdown } {
  const normCandidate = candidateSkills.map((s) => s.toLowerCase().trim());
  const normRequired = job.skills.map((s) => s.toLowerCase().trim());
  const normNice = (job.niceToHaveSkills || []).map((s) => s.toLowerCase().trim());

  // 1. Skill Overlap (Weighted Jaccard: required = 2x, nice-to-have = 1x)
  let matchedPoints = 0;
  let totalPoints = 0;
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  normRequired.forEach((req, idx) => {
    totalPoints += 2;
    if (normCandidate.some((c) => c.includes(req) || req.includes(c))) {
      matchedPoints += 2;
      matchedSkills.push(job.skills[idx]);
    } else {
      missingSkills.push(job.skills[idx]);
    }
  });

  normNice.forEach((nice, idx) => {
    totalPoints += 1;
    if (normCandidate.some((c) => c.includes(nice) || nice.includes(c))) {
      matchedPoints += 1;
      if (!matchedSkills.includes((job.niceToHaveSkills || [])[idx])) {
        matchedSkills.push((job.niceToHaveSkills || [])[idx]);
      }
    }
  });

  const skillOverlap = totalPoints > 0 ? matchedPoints / totalPoints : 0.5;

  // 2. Semantic Similarity (simulated vector cosine similarity based on domain overlap)
  let semanticMatches = 0;
  const keywords = [...normRequired, job.department.toLowerCase(), job.cityTier.toLowerCase()];
  keywords.forEach((kw) => {
    if (profile.careerGoal.toLowerCase().includes(kw) || profile.targetRoles.some((r) => r.toLowerCase().includes(kw))) {
      semanticMatches += 1;
    }
  });
  const semanticSimilarity = Math.min(1.0, 0.45 + (semanticMatches / (keywords.length || 1)) * 0.55);

  // 3. Experience Fit (1.0 inside range, linear decay outside, floor 0.2)
  const exp = profile.experienceYears;
  let experienceFit = 1.0;
  if (exp < job.minExp) {
    const diff = job.minExp - exp;
    experienceFit = Math.max(0.2, 1.0 - diff * 0.3);
  } else if (exp > job.maxExp) {
    const diff = exp - job.maxExp;
    experienceFit = Math.max(0.4, 1.0 - diff * 0.15);
  }

  // 4. Salary Fit (overlap of expected LPA range with job LPA range)
  let salaryFit = 0.5;
  if (profile.minLpa <= job.maxLpa) {
    if (profile.minLpa >= job.minLpa) {
      salaryFit = 1.0;
    } else {
      salaryFit = 0.85;
    }
  } else {
    const diff = profile.minLpa - job.maxLpa;
    salaryFit = Math.max(0.1, 1.0 - diff * 0.15);
  }

  // 5. Location Fit (1.0 preferred city or remote match, 0.6 same tier, 0.3 otherwise)
  let locationFit = 0.3;
  if (job.isRemote && profile.wfhPreference) {
    locationFit = 1.0;
  } else if (profile.preferredCities.includes(job.location)) {
    locationFit = 1.0;
  } else if (job.cityTier === "Tier-1" && profile.preferredCities.some((c) => ["Bengaluru", "Hyderabad", "Pune", "Mumbai", "Delhi NCR"].includes(c))) {
    locationFit = 0.6;
  }

  // 6. Notice Fit (1.0 if notice <= 30 days, 0.7 for 60, 0.4 for 90)
  let noticeFit = 0.4;
  if (profile.noticePeriodDays <= 30) {
    noticeFit = 1.0;
  } else if (profile.noticePeriodDays <= 60) {
    noticeFit = 0.7;
  } else {
    noticeFit = 0.4;
  }
  if (job.noticePeriodRequired >= profile.noticePeriodDays) {
    noticeFit = Math.max(noticeFit, 0.9);
  }

  // Total Score Formula
  const rawScore =
    0.40 * skillOverlap +
    0.20 * semanticSimilarity +
    0.15 * experienceFit +
    0.10 * salaryFit +
    0.10 * locationFit +
    0.05 * noticeFit;

  const score = Math.round(Math.min(100, Math.max(10, rawScore * 100)));

  const explanation = `${matchedSkills.length} of ${job.skills.length} core skills aligned (${matchedSkills.slice(0, 3).join(", ")}). Experience (${profile.experienceYears} yrs) fits role threshold. Location ${job.location} with ${job.minLpa}-${job.maxLpa} LPA band matches target.`;

  return {
    score,
    breakdown: {
      skillOverlap: Math.round(skillOverlap * 100),
      semanticSimilarity: Math.round(semanticSimilarity * 100),
      experienceFit: Math.round(experienceFit * 100),
      salaryFit: Math.round(salaryFit * 100),
      locationFit: Math.round(locationFit * 100),
      noticeFit: Math.round(noticeFit * 100),
      matchedSkills,
      missingSkills,
      explanation,
    },
  };
}

/**
 * Calculates ATS score breakdown according to Section 6.2 rubric
 */
export function evaluateResumeAts(resumeText: string, targetJob?: Job): AtsScoreBreakdown {
  const lower = resumeText.toLowerCase();

  // 1. Keyword coverage vs job description (max 30 pts)
  const defaultKeywords = ["react", "node.js", "typescript", "javascript", "postgresql", "api", "git", "docker", "agile", "testing", "aws", "redux"];
  const targetKeywords = targetJob ? targetJob.skills.map(s => s.toLowerCase()) : defaultKeywords;
  
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  targetKeywords.forEach(kw => {
    if (lower.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordRatio = targetKeywords.length > 0 ? matchedKeywords.length / targetKeywords.length : 0.7;
  const keywordCoverage = Math.round(keywordRatio * 30);

  // 2. Structure and sections (max 20 pts)
  let structureSections = 0;
  if (/contact|email|phone/i.test(lower)) structureSections += 4;
  if (/summary|about|profile/i.test(lower)) structureSections += 3;
  if (/skills|technologies|proficiencies/i.test(lower)) structureSections += 4;
  if (/experience|work history|employment/i.test(lower)) structureSections += 4;
  if (/education|degree|b\.tech|university/i.test(lower)) structureSections += 3;
  if (/projects|portfolio/i.test(lower)) structureSections += 2;
  structureSections = Math.min(20, structureSections);

  // 3. Parse safety (max 15 pts) - check plain text readability
  let parseSafety = 14;
  if (lower.includes("<table") || lower.includes("column")) parseSafety -= 3;

  // 4. Quantified impact (max 15 pts) - numbers, percentages, metrics
  const metricMatches = (resumeText.match(/\b(?:\d+%|\d+x|\$\d+|\d+\+?\s*(?:users|tps|ms|lpa|team|cr|crore|million))\b/gi) || []).length;
  const quantifiedImpact = Math.min(15, Math.max(5, metricMatches * 3));

  // 5. Links and contact quality (max 10 pts)
  let linksQuality = 0;
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)) linksQuality += 3;
  if (/(?:\+91|0)?[6-9]\d{9}/.test(resumeText)) linksQuality += 3;
  if (/github\.com/i.test(lower)) linksQuality += 2;
  if (/linkedin\.com/i.test(lower)) linksQuality += 2;
  linksQuality = Math.min(10, linksQuality);

  // 6. Length and readability (max 10 pts)
  const wordCount = resumeText.trim().split(/\s+/).length;
  let readability = 8;
  if (wordCount >= 250 && wordCount <= 800) readability = 10;
  else if (wordCount < 150) readability = 5;

  const total = Math.min(100, keywordCoverage + structureSections + parseSafety + quantifiedImpact + linksQuality + readability);

  const suggestions: string[] = [];
  if (keywordCoverage < 24) {
    suggestions.push(`Integrate missing high-priority target skills: ${missingKeywords.slice(0, 4).join(", ")}`);
  }
  if (quantifiedImpact < 12) {
    suggestions.push("Quantify bullet points with impact metrics (e.g., 'Reduced API latency by 35%', 'Scaled to 50k DAU').");
  }
  if (!lower.includes("github.com") || !lower.includes("linkedin.com")) {
    suggestions.push("Add clickable, verified LinkedIn and GitHub repository profile URLs in the header.");
  }
  if (structureSections < 18) {
    suggestions.push("Ensure standard headers: Summary, Technical Skills, Professional Experience, Education, Projects.");
  }

  return {
    keywordCoverage,
    structureSections,
    parseSafety,
    quantifiedImpact,
    linksQuality,
    readability,
    total,
    matchedKeywords,
    missingKeywords,
    improvementSuggestions: suggestions,
  };
}
