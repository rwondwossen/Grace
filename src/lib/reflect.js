export async function fetchReflection(type, data) {
  try {
    const res = await fetch("/.netlify/functions/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.structured !== undefined) return json.structured || null;
    return json.text || null;
  } catch {
    return null;
  }
}
