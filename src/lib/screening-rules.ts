import type { AIAnalysis } from "@/db/schema";

interface ScreeningResult {
  qualified: boolean;
  score: number;
  reasons: string[];
  analysis: AIAnalysis;
}

// Automatic qualifiers - any one of these = qualified
const AUTO_QUALIFIERS = {
  peRoles: [
    "operating partner",
    "value creation",
    "portfolio operations",
    "pe operating",
    "private equity operations",
    "portfolio company",
    "operating executive",
  ],
  cSuite: [
    "ceo",
    "cfo",
    "coo",
    "cto",
    "chro",
    "cmo",
    "chief executive",
    "chief financial",
    "chief operating",
    "chief technology",
    "chief human",
    "chief marketing",
  ],
  topConsulting: [
    "mckinsey",
    "bain & company",
    "bain and company",
    "boston consulting",
    "bcg",
    "deloitte",
    "ernst & young",
    "ey ",
    "pwc",
    "pricewaterhousecoopers",
    "kpmg",
    "accenture",
  ],
};

// Strong signals - 2 or more = qualified
const STRONG_SIGNALS = {
  mbaPrograms: [
    "harvard business",
    "stanford gsb",
    "wharton",
    "kellogg",
    "booth",
    "columbia business",
    "mit sloan",
    "haas",
    "tuck",
    "darden",
    "ross",
    "fuqua",
    "yale som",
    "mba",
  ],
  leadershipTitles: [
    "vice president",
    "vp ",
    "svp",
    "senior vice president",
    "director",
    "head of",
    "managing director",
    "partner",
    "principal",
  ],
  functionalAreas: [
    "operations",
    "finance",
    "technology",
    "sales",
    "human resources",
    "hr ",
    "supply chain",
    "procurement",
    "manufacturing",
    "revenue",
    "growth",
    "strategy",
  ],
  industries: [
    "healthcare",
    "software",
    "saas",
    "technology",
    "industrials",
    "manufacturing",
    "business services",
    "consumer",
    "retail",
    "fintech",
    "financial services",
  ],
  keywords: [
    "transformation",
    "turnaround",
    "integration",
    "m&a",
    "merger",
    "acquisition",
    "due diligence",
    "ebitda",
    "margin improvement",
    "cost reduction",
    "revenue growth",
    "operational excellence",
    "lean",
    "six sigma",
    "carve-out",
    "post-merger",
  ],
};

// Disqualifiers
const DISQUALIFIERS = {
  entryLevel: [
    "intern",
    "internship",
    "entry level",
    "junior",
    "associate",
    "analyst",
    "coordinator",
    "assistant",
  ],
  noLeadership: ["individual contributor", "ic role"],
};

function normalizeText(text: string): string {
  return text.toLowerCase().replaceAll(/[^\w\s]/g, " ");
}

function containsAny(text: string, patterns: string[]): boolean {
  const normalized = normalizeText(text);
  return patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
}

function countMatches(text: string, patterns: string[]): number {
  const normalized = normalizeText(text);
  return patterns.filter((pattern) =>
    normalized.includes(pattern.toLowerCase()),
  ).length;
}

function estimateYearsExperience(text: string): number {
  const normalized = normalizeText(text);

  // Look for explicit years mentions
  const yearsPatterns = [
    /(\d+)\+?\s*years?\s*(of)?\s*(experience|exp)/gi,
    /experience\s*[:\-]?\s*(\d+)\+?\s*years?/gi,
  ];

  let maxYears = 0;
  for (const pattern of yearsPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const years = Number.parseInt(match[1], 10);
      if (years > maxYears) maxYears = years;
    }
  }

  // If no explicit mention, estimate from date ranges
  if (maxYears === 0) {
    const yearMatches = normalized.match(/20\d{2}|19\d{2}/g);
    if (yearMatches && yearMatches.length >= 2) {
      const years = yearMatches.map((y) => Number.parseInt(y, 10));
      const range = Math.max(...years) - Math.min(...years);
      maxYears = Math.max(range, 0);
    }
  }

  return maxYears;
}

export function screenResume(resumeText: string): ScreeningResult {
  const reasons: string[] = [];
  let qualified = false;

  // Initialize scores
  let peExposure = 0;
  let seniority = 0;
  let functionalDepth = 0;
  let cultureSignals = 0;

  const strengths: string[] = [];
  const concerns: string[] = [];

  // Check automatic qualifiers
  if (containsAny(resumeText, AUTO_QUALIFIERS.peRoles)) {
    qualified = true;
    peExposure = 9;
    reasons.push("Direct PE operating experience");
    strengths.push("Has worked directly in PE portfolio operations");
  }

  if (containsAny(resumeText, AUTO_QUALIFIERS.cSuite)) {
    qualified = true;
    seniority = 10;
    reasons.push("C-suite executive experience");
    strengths.push("Proven executive leadership at the highest level");
  }

  if (containsAny(resumeText, AUTO_QUALIFIERS.topConsulting)) {
    qualified = true;
    reasons.push("Top-tier consulting background");
    strengths.push("Strategic consulting pedigree");
    functionalDepth = Math.max(functionalDepth, 7);
  }

  // Check strong signals
  let strongSignalCount = 0;

  if (containsAny(resumeText, STRONG_SIGNALS.mbaPrograms)) {
    strongSignalCount++;
    reasons.push("MBA from recognized program");
    strengths.push("Strong academic credentials");
  }

  const yearsExp = estimateYearsExperience(resumeText);
  if (yearsExp >= 10) {
    strongSignalCount++;
    seniority = Math.max(seniority, 8);
    reasons.push(`${yearsExp}+ years of experience`);
    strengths.push("Extensive professional experience");
  } else if (yearsExp >= 7) {
    seniority = Math.max(seniority, 6);
  }

  if (containsAny(resumeText, STRONG_SIGNALS.leadershipTitles)) {
    strongSignalCount++;
    seniority = Math.max(seniority, 7);
    reasons.push("Senior leadership titles");
    strengths.push("Track record of leadership responsibility");
  }

  const functionalMatches = countMatches(
    resumeText,
    STRONG_SIGNALS.functionalAreas,
  );
  if (functionalMatches >= 2) {
    strongSignalCount++;
    functionalDepth = Math.max(
      functionalDepth,
      7 + Math.min(functionalMatches, 3),
    );
    reasons.push("Strong functional expertise");
    strengths.push("Deep functional knowledge in key areas");
  }

  if (containsAny(resumeText, STRONG_SIGNALS.industries)) {
    strongSignalCount++;
    reasons.push("Relevant industry experience");
  }

  const keywordMatches = countMatches(resumeText, STRONG_SIGNALS.keywords);
  if (keywordMatches >= 2) {
    strongSignalCount++;
    cultureSignals = Math.max(cultureSignals, 6 + Math.min(keywordMatches, 4));
    reasons.push("Value creation language and experience");
    strengths.push("Speaks the language of PE value creation");
  }

  // If 2+ strong signals, qualify
  if (strongSignalCount >= 2 && !qualified) {
    qualified = true;
    reasons.push(`${strongSignalCount} strong qualifying signals`);
  }

  // Check disqualifiers
  if (yearsExp < 5 && yearsExp > 0) {
    concerns.push("Less than 5 years of experience");
    if (
      !containsAny(resumeText, AUTO_QUALIFIERS.cSuite) &&
      !containsAny(resumeText, AUTO_QUALIFIERS.peRoles)
    ) {
      qualified = false;
      reasons.length = 0;
      reasons.push("Insufficient experience level");
    }
  }

  if (
    containsAny(resumeText, DISQUALIFIERS.entryLevel) &&
    !containsAny(resumeText, STRONG_SIGNALS.leadershipTitles)
  ) {
    concerns.push("Primarily entry-level or individual contributor roles");
  }

  // Calculate overall score (0-100)
  const rawScore =
    peExposure * 3 + seniority * 3 + functionalDepth * 2 + cultureSignals * 2;
  const normalizedScore = Math.min(Math.round((rawScore / 100) * 100), 100);

  // Ensure minimum scores for qualified candidates
  if (qualified) {
    peExposure = Math.max(peExposure, 5);
    seniority = Math.max(seniority, 5);
    functionalDepth = Math.max(functionalDepth, 5);
    cultureSignals = Math.max(cultureSignals, 5);
  }

  // Final score adjustment
  const finalScore = qualified
    ? Math.max(normalizedScore, 60)
    : Math.min(normalizedScore, 45);

  return {
    qualified,
    score: finalScore,
    reasons,
    analysis: {
      peExposure: Math.min(peExposure, 10),
      seniority: Math.min(seniority, 10),
      functionalDepth: Math.min(functionalDepth, 10),
      cultureSignals: Math.min(cultureSignals, 10),
      strengths,
      concerns,
      reasons,
    },
  };
}
