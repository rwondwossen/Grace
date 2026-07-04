const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

export async function submitJourneyToAirtable(data) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  const fields = {
    "Quote 1 Resonance": data.quote1Resonance,
    "Quote 2 Resonance": data.quote2Resonance,
    "Quote 3 Resonance": data.quote3Resonance,
    "Quote 4 Resonance": data.quote4Resonance,
    "Quote 5 Resonance": data.quote5Resonance,
    "Reflection Resonance": data.reflectionResonance,
    "Reflection Note": data.reflectionNote,

    "Feeling Words": data.feelingWords,
    "North Star Feeling": data.northStarFeeling,

    "All Domains Generated": JSON.stringify(data.allDomains.filter((d) => d.trim() !== "")),
    "Domains Kept": JSON.stringify(data.domains),

    "Coherence Diagnostic": JSON.stringify(data.coherenceDiagnostic),
    "Step 4 Reflection Resonance": data.step4ReflectionResonance,
    "Step 4 Reflection Note": data.step4ReflectionNote,

    "Commitments": JSON.stringify(data.commitments),
    "Step 5 Reflection Resonance": data.step5ReflectionResonance,
    "Step 5 Reflection Note": data.step5ReflectionNote,

    "Drift Chip": data.driftChip,
    "Drift Commitment": data.driftCommitment,

    "What's Clearer": data.whatsClearer,
    "Looking Forward To": data.lookingForwardTo,

    "Submitted At": new Date().toISOString(),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Airtable submission failed");
  }

  return response.json();
}
