const QUOTES = [
  { text: "The things that make you feel most alive are often the things you are neglecting.", attribution: "Parker J. Palmer" },
  { text: "I am large, I contain multitudes.", attribution: "Walt Whitman" },
  { text: "If I didn't define myself for myself, I would be crunched into other people's fantasies for me and eaten alive.", attribution: "Audre Lorde" },
  { text: "You are your best thing.", attribution: "Toni Morrison" },
  { text: "Beware the barrenness of a busy life.", attribution: "Socrates" },
];

const QUOTE_KEYS = ["quote1Resonance", "quote2Resonance", "quote3Resonance", "quote4Resonance", "quote5Resonance"];

const STEP1_SYSTEM = `You are generating a short reflection for someone who has just rated how much five provocations resonated with them, on a scale of Deeply, Somewhat, Not really. Each provocation is tagged with an underlying tension. Only tensions rated Deeply or Somewhat are included below — tensions rated Not really have been excluded because they don't apply to this person. Your job is to notice which tensions scored highest and name what seems alive for this person right now, in two to three sentences.

Rules:
- Do not explain the quotes or reference them directly
- Do not say "your responses suggest" or "this indicates"
- Do not diagnose or label
- If one tension clearly stands out, name that
- If two or three tensions scored high, name what's present across them without forcing them into a single story
- Tone: warm, specific, an invitation, not a verdict`;

function buildStep1Prompt(data) {
  const lines = (data.tensions || [])
    .map((t) => `- ${t.tension}: ${t.rating}`)
    .join("\n");
  return lines;
}

const STEP4_SYSTEM = `You are generating a short reflection for someone who has just described several life domains they want to focus on, what each currently looks like, and what's standing in the way for each. Write one short reflection per domain, one to two sentences, naming the gap honestly and specifically. Do not force a connection or pattern across domains that isn't actually there — barriers can be genuinely different from domain to domain. If the same barrier does show up in more than one domain, you can note that, but don't manufacture a pattern.

Rules:
- Do not say "your responses suggest" or "this indicates"
- Do not diagnose or moralize about the barrier
- Tone: honest pause, not verdict. A wise friend naming what's true, not a therapist or a coach.
- Quote or closely echo the person's own words for what their domain currently looks like, don't replace their language with generic descriptions
- Each reflection must be short enough to sit in a table row, one to two sentences maximum

Return ONLY a JSON object where each key is the exact domain name and each value is the reflection string for that domain. No other text, no markdown, no explanation.`;

function buildStep4Prompt(data) {
  const domainLines = (data.domains || []).map(d => {
    const barriers = [...(d.barriers || []), d.barrierNotes].filter(Boolean).join(", ") || "none named";
    return `Domain: ${d.domain}\nWhat it looks like now: ${d.gap || "not described"}\nWhat's in the way: ${barriers}`;
  }).join("\n\n");
  return domainLines;
}

function buildStep5Prompt(data) {
  const domainLines = (data.domains || []).map(d => {
    const barriers = [...(d.barriers || []), d.barrierNotes].filter(Boolean).join(", ") || "none named";
    const commits = (d.commitments || []).filter(Boolean).join("; ") || "none yet";
    return `${d.domain}:\n  Gap: ${d.gap || "not described"}\n  Barriers: ${barriers}\n  Commitments: ${commits}`;
  }).join("\n\n");
  return `A person wants to feel "${data.northStarFeeling || "better"}". They diagnosed what's not working in several areas of their life, then made commitments to address it.\n\n${domainLines}\n\nFor each area, write 1-2 sentences: does what they committed to actually address what they named? Be honest — not harsh, but not a cheerleader either. One closing sentence that's specific to this person across everything. Keep the whole response under 150 words.`;
}

module.exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: null }),
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { type, data } = parsed;

  let prompt, systemPrompt;
  if (type === "step1") { prompt = buildStep1Prompt(data); systemPrompt = STEP1_SYSTEM; }
  else if (type === "step4") { prompt = buildStep4Prompt(data); systemPrompt = STEP4_SYSTEM; }
  else if (type === "step5") prompt = buildStep5Prompt(data);
  else return { statusCode: 400, body: "Unknown reflection type" };

  try {
    const body = {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    };
    if (systemPrompt) body.system = systemPrompt;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    const raw = result.content?.[0]?.text || null;

    let payload;
    if (type === "step4") {
      try {
        payload = { structured: JSON.parse(raw) };
      } catch {
        payload = { structured: null };
      }
    } else {
      payload = { text: raw };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: null, error: e.message }),
    };
  }
};
