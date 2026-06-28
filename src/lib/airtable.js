const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

export async function submitJourneyToAirtable(data) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  const fields = {
    "North Star Feeling": data.northStarFeeling,
    "Feeling Words": data.feelingWords,
    "Quote 1 Resonance": data.quote1Resonance,
    "Quote 2 Resonance": data.quote2Resonance,
    "Domains": JSON.stringify(data.domains),
    "Coherence Diagnostic": JSON.stringify(data.coherenceDiagnostic),
    "Commitments": JSON.stringify(data.commitments),
    "Releasing This Year": data.releasing,
    "Accountability Person": data.accountability,
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
