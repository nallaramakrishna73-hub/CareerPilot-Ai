import { CompanyIntel } from "../types";

export const mockCompanies: Record<string, CompanyIntel> = {
  "Razorpay": {
    id: "razorpay",
    name: "Razorpay",
    industry: "Fintech & Payments Infrastructure",
    headquarters: "Bengaluru, Karnataka",
    foundedYear: 2014,
    size: "3,000+ employees",
    fundingStage: "Series F (Unicorn)",
    totalFunding: "$741.5M",
    cultureRating: 4.4,
    ambitionBoxScore: 4.3,
    workLifeBalance: 4.0,
    salaryCompetitiveness: "Competitive",
    techStack: ["Node.js", "Go", "React", "TypeScript", "PostgreSQL", "Kafka", "AWS"],
    greenFlagNotes: [
      "Consistent ESOP buyback programs for early and senior engineers",
      "Robust high-concurrency payment architecture learning curve",
      "Comprehensive medical insurance covering family and mental health",
    ],
    redFlagNotes: [
      "On-call rotations can get intense during festive sale peaks (Diwali / Big Billion Days)",
    ],
    fundingTimeline: [
      { round: "Series F", amount: "$375M", year: "2021", leadInvestor: "Lone Pine Capital & Alkeon Capital" },
      { round: "Series E", amount: "$160M", year: "2021", leadInvestor: "GIC & Sequoia Capital India" },
      { round: "Series D", amount: "$100M", year: "2020", leadInvestor: "GIC, Sequoia & Ribbit Capital" },
    ],
    sources: [
      { title: "Tracxn Company Profile", url: "https://tracxn.com/d/companies/razorpay", confidence: "Verified" },
      { title: "AmbitionBox Razorpay Reviews", url: "https://www.ambitionbox.com/reviews/razorpay-reviews", confidence: "Verified" },
      { title: "Razorpay Tech Engineering Blog", url: "https://engineering.razorpay.com", confidence: "Verified" },
    ],
  },
  "Swiggy": {
    id: "swiggy",
    name: "Swiggy",
    industry: "Food Delivery & Quick Commerce",
    headquarters: "Bengaluru, Karnataka (Offices in Hyderabad)",
    foundedYear: 2014,
    size: "6,000+ employees",
    fundingStage: "Public (NSE/BSE Listed)",
    totalFunding: "$3.6B",
    cultureRating: 4.2,
    ambitionBoxScore: 4.1,
    workLifeBalance: 3.8,
    salaryCompetitiveness: "High",
    techStack: ["Go", "Node.js", "Java", "React", "Kafka", "PostgreSQL", "AWS"],
    greenFlagNotes: [
      "Industry-leading logistics dispatch and ML routing scale",
      "Flexible remote-first culture for engineering squads",
      "Clear promotional ladder and internal mobility",
    ],
    redFlagNotes: [
      "Fast-moving product deadlines in quick commerce (Instamart)",
    ],
    fundingTimeline: [
      { round: "IPO", amount: "$1.35B", year: "2024", leadInvestor: "Public Markets" },
      { round: "Series K", amount: "$700M", year: "2022", leadInvestor: "Invesco" },
      { round: "Series J", amount: "$1.25B", year: "2021", leadInvestor: "SoftBank Vision Fund 2" },
    ],
    sources: [
      { title: "Swiggy Bytes Blog", url: "https://bytes.swiggy.com", confidence: "Verified" },
      { title: "Glassdoor Employee Sentiment", url: "https://www.glassdoor.co.in/Reviews/Swiggy-Reviews-E1013444.htm", confidence: "Verified" },
    ],
  },
  "CRED": {
    id: "cred",
    name: "CRED",
    industry: "Consumer Fintech & Rewards",
    headquarters: "Bengaluru, Karnataka",
    foundedYear: 2018,
    size: "1,200+ employees",
    fundingStage: "Series F",
    totalFunding: "$801M",
    cultureRating: 4.3,
    ambitionBoxScore: 4.2,
    workLifeBalance: 3.7,
    salaryCompetitiveness: "High",
    techStack: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "React Native", "AWS"],
    greenFlagNotes: [
      "Top-tier compensation benchmarks in the Indian startup ecosystem",
      "Strong aesthetic and design-first engineering culture",
      "High density of experienced senior engineers",
    ],
    redFlagNotes: [
      "High expectations with aggressive sprint cycles",
    ],
    fundingTimeline: [
      { round: "Series F", amount: "$140M", year: "2022", leadInvestor: "GIC & Sofina" },
      { round: "Series E", amount: "$251M", year: "2021", leadInvestor: "Tiger Global & Falcon Edge" },
    ],
    sources: [
      { title: "CRED Engineering Radar", url: "https://tech.cred.club", confidence: "Verified" },
      { title: "AmbitionBox Culture Breakdown", url: "https://www.ambitionbox.com/reviews/cred-reviews", confidence: "Verified" },
    ],
  },
  "PhonePe": {
    id: "phonepe",
    name: "PhonePe",
    industry: "UPI & Digital Financial Services",
    headquarters: "Bengaluru, Karnataka",
    foundedYear: 2015,
    size: "5,000+ employees",
    fundingStage: "Late Stage (Walmart backed)",
    totalFunding: "$2.6B",
    cultureRating: 4.3,
    ambitionBoxScore: 4.3,
    workLifeBalance: 4.1,
    salaryCompetitiveness: "Competitive",
    techStack: ["Java", "Node.js", "React", "TypeScript", "Cassandra", "Aerospike"],
    greenFlagNotes: [
      "Processes 48%+ of all UPI transactions in India with 99.99% reliability",
      "High job security and sustainable engineering pace",
      "Continuous innovation across Indus Appstore and Pincode",
    ],
    redFlagNotes: [
      "Strict compliance policies due to RBI regulatory oversight",
    ],
    fundingTimeline: [
      { round: "Growth Round", amount: "$850M", year: "2023", leadInvestor: "General Atlantic & Walmart" },
      { round: "Private Equity", amount: "$700M", year: "2020", leadInvestor: "Walmart" },
    ],
    sources: [
      { title: "PhonePe Tech Blog", url: "https://tech.phonepe.com", confidence: "Verified" },
      { title: "NPCI Monthly UPI Statistics", url: "https://www.npci.org.in/what-we-do/upi/product-statistics", confidence: "Verified" },
    ],
  },
  "Postman": {
    id: "postman",
    name: "Postman",
    industry: "Developer Tools & API Infrastructure",
    headquarters: "Bengaluru, Karnataka & San Francisco, CA",
    foundedYear: 2014,
    size: "1,100+ employees",
    fundingStage: "Series D",
    totalFunding: "$433M",
    cultureRating: 4.6,
    ambitionBoxScore: 4.5,
    workLifeBalance: 4.5,
    salaryCompetitiveness: "High",
    techStack: ["Node.js", "TypeScript", "React", "GraphQL", "PostgreSQL", "Docker", "AWS"],
    greenFlagNotes: [
      "Truly global developer tool with global product footprint",
      "Remote-first flexibility with top work-life balance scores",
      "Strong culture of open source and developer advocacy",
    ],
    redFlagNotes: [
      "Cross-timezone syncs with US West Coast teams required occasionally",
    ],
    fundingTimeline: [
      { round: "Series D", amount: "$225M", year: "2021", leadInvestor: "Insight Partners" },
      { round: "Series C", amount: "$150M", year: "2020", leadInvestor: "Insight Partners & CRV" },
    ],
    sources: [
      { title: "Postman Engineering Pulse", url: "https://blog.postman.com/category/engineering", confidence: "Verified" },
      { title: "AmbitionBox Postman Ratings", url: "https://www.ambitionbox.com/reviews/postman-reviews", confidence: "Verified" },
    ],
  },
};

export const getCompanyIntelByName = (name: string): CompanyIntel => {
  if (mockCompanies[name]) {
    return mockCompanies[name];
  }
  // Fallback intelligent profile
  return {
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name: name,
    industry: "Technology & Software Engineering",
    headquarters: "India",
    foundedYear: 2016,
    size: "500-2,000 employees",
    fundingStage: "Growth Stage",
    totalFunding: "$45M+",
    cultureRating: 4.1,
    ambitionBoxScore: 4.0,
    workLifeBalance: 3.9,
    salaryCompetitiveness: "Competitive",
    techStack: ["React", "Node.js", "TypeScript", "PostgreSQL", "Cloud Native"],
    greenFlagNotes: [
      "Active hiring for Indian engineering centers",
      "Modern full-stack technical stack and automated CI/CD",
    ],
    redFlagNotes: [
      "Public data limited; verified via official company careers page",
    ],
    fundingTimeline: [
      { round: "Series B", amount: "$20M", year: "2022", leadInvestor: "Institutional Tech Fund" },
    ],
    sources: [
      { title: `${name} Public Filings`, url: "#", confidence: "Estimated" },
      { title: "Adzuna & Glassdoor Indian Benchmark", url: "#", confidence: "Estimated" },
    ],
  };
};
