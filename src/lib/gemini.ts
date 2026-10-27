import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface HazardTriageResult {
  category: string;
  severity: 'P1_CRITICAL' | 'P2_MODERATE' | 'P3_LOW';
  englishSummary: string;
  recommendedAction: string;
  isAiGenerated: boolean;
}

/**
 * Multimodal Hazard Triage using Gemini 1.5 Flash
 */
export async function triageHazardReport(
  rawTranscript: string,
  zone: string,
  sector: string,
  imageBase64?: string
): Promise<HazardTriageResult> {
  // If API key is available, call Gemini
  if (genAI && apiKey) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const prompt = `You are a high-speed industrial safety triage AI operating for UN SDG 8 (Decent Work & Safety).
A blue-collar worker reported a hazard in their native language or broken English at ${sector}, located in "${zone}".
Worker's Voice Transcript: "${rawTranscript}"

Analyze the report (and optional image). Return a JSON object with this exact structure:
{
  "category": "Category name such as Unsecured Scaffolding, Electrical Hazard, Slip Hazard, Chemical Spill, PPE Failure",
  "severity": "P1_CRITICAL" or "P2_MODERATE" or "P3_LOW",
  "englishSummary": "Clear, professional 1-2 sentence English summary for site engineers",
  "recommendedAction": "Immediate safety protocol for site supervisors"
}`;

      const contents: any[] = [prompt];
      if (imageBase64) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          },
        });
      }

      const response = await model.generateContent(contents);
      const text = response.response.text();
      const parsed = JSON.parse(text);

      return {
        category: parsed.category || 'General Safety Hazard',
        severity: ['P1_CRITICAL', 'P2_MODERATE', 'P3_LOW'].includes(parsed.severity)
          ? parsed.severity
          : 'P2_MODERATE',
        englishSummary: parsed.englishSummary || rawTranscript,
        recommendedAction: parsed.recommendedAction || 'Inspect zone immediately.',
        isAiGenerated: true,
      };
    } catch (err) {
      console.warn('Gemini API call failed or timed out, using heuristic safety fallback:', err);
    }
  }

  // Resilient Heuristic Fallback Engine (Ensures 100% demo uptime)
  const lower = rawTranscript.toLowerCase();
  let severity: 'P1_CRITICAL' | 'P2_MODERATE' | 'P3_LOW' = 'P2_MODERATE';
  let category = 'General Safety Hazard';
  let englishSummary = `Safety report logged at ${zone}: "${rawTranscript}"`;
  let recommendedAction = 'Inspect work zone and verify worker safety compliance.';

  if (lower.includes('wire') || lower.includes('electric') || lower.includes('shock') || lower.includes('current') || lower.includes('bijli')) {
    category = 'Exposed Electrical / Electrocution Risk';
    severity = 'P1_CRITICAL';
    englishSummary = `High-voltage hazard reported near ${zone}. Loose exposed wiring or electrical spark reported by frontline staff.`;
    recommendedAction = 'Cut main breaker switch to zone immediately. Deploy certified electrician.';
  } else if (lower.includes('scaffold') || lower.includes('fall') || lower.includes('gir') || lower.includes('paas') || lower.includes('height')) {
    category = 'Unsecured Scaffolding & Fall Hazard';
    severity = 'P1_CRITICAL';
    englishSummary = `Structural stability concern on elevated scaffolding at ${zone}. Worker reported loose clamp and vibration.`;
    recommendedAction = 'Halt all elevated work on pier section. Secure safety harnesses.';
  } else if (lower.includes('slip') || lower.includes('water') || lower.includes('pani') || lower.includes('oil') || lower.includes('floor')) {
    category = 'Slippery Surface / Liquid Spill';
    severity = 'P2_MODERATE';
    englishSummary = `Excess liquid/spill hazard creating slip and fall vulnerability across ${zone}.`;
    recommendedAction = 'Erect caution signage and dispatch housekeeping wet-vac crew.';
  } else if (lower.includes('helmet') || lower.includes('shoe') || lower.includes('boot') || lower.includes('glove') || lower.includes('ppe')) {
    category = 'Missing Mandatory PPE';
    severity = 'P3_LOW';
    englishSummary = `Non-compliance with required personal protective equipment observed in ${zone}.`;
    recommendedAction = 'Issue required PPE equipment from tool crib before shift resumes.';
  }

  return {
    category,
    severity,
    englishSummary,
    recommendedAction,
    isAiGenerated: false,
  };
}

/**
 * Safe Voice: Identity Scrubber
 * Removes personal names, shifts, gates, and identifying markers
 */
export async function scrubFeedbackIdentity(rawText: string): Promise<string> {
  if (genAI && apiKey) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a privacy protection and de-identification agent.
Frontline workers are submitting anonymous feedback about workplace conditions, wages, or supervisors.
Workers fear retaliation if details identify them.

Sanitize this text:
"${rawText}"

Rules:
1. Replace specific supervisor or worker names with generic terms (e.g., "Supervisor", "Colleague").
2. Generalize specific times or locations (e.g. "Gate 3 at 2:15 AM on Tuesday" -> "an entrance gate during late shift").
3. Preserve the core problem, sentiment, and constructive concern.
4. Output ONLY the scrubbed text string with no quotes or preamble.`;

      const response = await model.generateContent(prompt);
      return response.response.text().trim();
    } catch (e) {
      console.warn('Gemini scrubber fallback used');
    }
  }

  // Heuristic scrubber regex fallback
  return rawText
    .replace(/(Ramesh|Suresh|Sharma|Patel|Murugan|Kumar|Singh|Gupta|Verma)/gi, 'Supervisor')
    .replace(/gate\s*\d+/gi, 'site entry gate')
    .replace(/at\s*\d+:\d+\s*(am|pm)?/gi, 'during shift')
    .replace(/on\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, 'recently');
}
