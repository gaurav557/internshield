import { z } from 'zod';
import { analyzeRisk, type RiskInput } from './risk';
const resultSchema = z.object({ score: z.number().int().min(0).max(100), level: z.enum(['LOW','MEDIUM','HIGH']), reasons: z.array(z.string().max(400)).max(12), checks: z.array(z.object({ label: z.string(), result: z.string(), severity: z.enum(['good','warning','danger']) })).max(12) });

/** Uses OpenAI only when an API key is explicitly configured; otherwise falls back to transparent local rules. */
export async function analyzeWithAI(input: RiskInput) {
  if (!process.env.OPENAI_API_KEY) return { ...analyzeRisk(input), provider: 'LOCAL_RULES' as const };
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are an internship listing risk triage assistant. Analyze only the supplied text and metadata. Do not claim to have verified company registration, website ownership, legal status, or external reputation. Never state that fraud is proven. Produce JSON with score (integer 0-100), level (LOW/MEDIUM/HIGH), reasons (array of concise evidence-based strings), checks (array of {label,result,severity} where severity is good/warning/danger). Penalize requests for money, OTPs, passwords, urgency, unrealistic pay, vague role details, missing website or registration information. A missing field is an unknown, not proof of fraud.' },
          { role: 'user', content: JSON.stringify(input) }
        ]
      }),
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== 'string') throw new Error('AI response was empty');
    const parsed = resultSchema.safeParse(JSON.parse(content));
    if (!parsed.success) throw new Error('AI response did not match the expected format');
    return { ...parsed.data, provider: 'OPENAI' as const };
  } catch {
    return { ...analyzeRisk(input), provider: 'LOCAL_RULES_FALLBACK' as const };
  }
}
