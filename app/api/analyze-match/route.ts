import { NextResponse } from 'next/server';
import { cohereClient } from '@/lib/cohere';
import { cohereAnalysisPrompt } from '@/lib/cohere-prompts';
import { buildFallbackAnalysis } from '@/lib/scoring';

export async function POST(req: Request) {
  const { resumeText, jobDescription } = await req.json();

  if (!resumeText || !jobDescription) {
    return NextResponse.json({ error: 'Missing resumeText or jobDescription' }, { status: 400 });
  }

  if (!process.env.COHERE_API_KEY) {
    return NextResponse.json(buildFallbackAnalysis(resumeText, jobDescription));
  }

  try {
    const prompt = `${cohereAnalysisPrompt}\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}`;
    const response = await cohereClient.generate({
      model: 'command',
      prompt,
      maxTokens: 400,
      temperature: 0.3,
    });

    const text = response.generations?.[0]?.text || '';
    return NextResponse.json({ raw: text });
  } catch {
    return NextResponse.json(buildFallbackAnalysis(resumeText, jobDescription));
  }
}
