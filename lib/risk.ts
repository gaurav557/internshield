export type RiskInput = { name?: string; website?: string; description?: string; listingUrl?: string; stipend?: string; registrationNumber?: string };
export type RiskResult = { score: number; level: 'LOW'|'MEDIUM'|'HIGH'; reasons: string[]; checks: { label: string; result: string; severity: 'good'|'warning'|'danger' }[] };
const suspicious = [/pay(ment)?\s+(a\s+)?(fee|deposit|registration)/i, /processing\s+fee/i, /guaranteed\s+(job|placement|selection)/i, /limited\s+seats|apply\s+immediately|urgent/i, /whatsapp\s+(only|number)/i, /no\s+interview/i, /earn\s+\d+\s*(per\s+day|daily)/i, /send\s+(otp|password|bank)/i];
export function analyzeRisk(input: RiskInput): RiskResult {
  let score = 0; const reasons: string[] = []; const checks: RiskResult['checks'] = [];
  const description = input.description || '';
  for (const pattern of suspicious) if (pattern.test(description)) { score += 15; reasons.push(`Potentially deceptive wording detected: “${description.match(pattern)?.[0] || 'suspicious phrase'}”.`); }
  const website = input.website || input.listingUrl || '';
  if (website) {
    try { const url = new URL(website.startsWith('http') ? website : `https://${website}`); if (url.protocol !== 'https:') { score += 12; reasons.push('Website does not use HTTPS.'); } else checks.push({ label: 'Website transport', result: 'HTTPS URL provided', severity: 'good' }); if (/\.(xyz|top|click|work|buzz|tk)$/i.test(url.hostname)) { score += 18; reasons.push('Website uses a domain extension sometimes associated with disposable sites.'); } }
    catch { score += 12; reasons.push('Website URL could not be parsed.'); }
  } else { score += 8; reasons.push('No company website was supplied.'); }
  if (!input.registrationNumber) { score += 8; reasons.push('Company registration number was not provided.'); }
  if (input.stipend && /\b(\d{4,})\s*(per day|\/day|daily)\b/i.test(input.stipend)) { score += 12; reasons.push('Unusually high daily stipend claim should be independently verified.'); }
  if (description.length < 50) { score += 5; reasons.push('Internship description contains very little detail.'); }
  score = Math.min(100, score);
  const level = score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';
  if (!reasons.length) reasons.push('No configured high-risk patterns were detected. This is not proof of legitimacy.');
  checks.push({ label: 'Pattern screening', result: `${reasons.length} finding(s)`, severity: score >= 60 ? 'danger' : score >= 30 ? 'warning' : 'good' });
  checks.push({ label: 'Company registry', result: 'Not connected — manual verification required', severity: 'warning' });
  checks.push({ label: 'External reputation', result: 'Not checked — no external data provider configured', severity: 'warning' });
  return { score, level, reasons, checks };
}
