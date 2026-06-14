export type MatchAnalysis = {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
};

export function buildFallbackAnalysis(resumeText: string, jobText: string): MatchAnalysis {
  const resumeWords = new Set(resumeText.toLowerCase().split(/\W+/).filter(Boolean));
  const jobWords = jobText.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
  const overlaps = Array.from(new Set(jobWords.filter((word) => resumeWords.has(word))));
  const gaps = Array.from(new Set(jobWords.filter((word) => !resumeWords.has(word)))).slice(0, 10);

  return {
    score: Math.min(95, overlaps.length * 8 + 35),
    strengths: overlaps.slice(0, 8),
    gaps,
    suggestions: [
      'Use stronger role-specific language in your summary.',
      'Quantify impact where possible.',
      'Tailor your project bullets to the technologies used in the target role.',
    ],
  };
}
