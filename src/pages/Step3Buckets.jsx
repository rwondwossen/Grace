import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import StepNav from "../components/StepNav";

export default function Step3Buckets() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();

  const domains = journey.domains.length >= 2 ? journey.domains : ["", ""];

  function setDomain(i, val) {
    const next = [...domains];
    next[i] = val;
    update({ domains: next });
  }

  function addDomain() {
    if (domains.length < 4) update({ domains: [...domains, ""] });
  }

  function removeDomain(i) {
    if (domains.length > 2) {
      const next = domains.filter((_, idx) => idx !== i);
      update({ domains: next });
    }
  }

  const canAdvance = domains.slice(0, 2).every((d) => d.trim() !== "");

  return (
    <div style={styles.page}>
      <StepNav current={3} />
      <h2 style={styles.stepTitle}>The Buckets</h2>
      <p style={styles.instruction}>
        Given that you want to feel <strong>{journey.northStarFeeling || "…"}</strong>,
        which areas of your life would you most need to tend to?
      </p>
      <p style={styles.hint}>Name two to four. Use your own language — not a framework's.</p>

      {domains.map((domain, i) => (
        <div key={i} style={styles.domainRow}>
          <div style={styles.sentence}>
            In order to feel more <em>{journey.northStarFeeling || "___"}</em>, I need to tend to my
          </div>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="text"
              placeholder={`Domain ${i + 1} (e.g. creative, relational, physical...)`}
              value={domain}
              onChange={(e) => setDomain(i, e.target.value)}
            />
            <span style={styles.lifeLabel}> life.</span>
            {domains.length > 2 && (
              <button onClick={() => removeDomain(i)} style={styles.remove}>✕</button>
            )}
          </div>
        </div>
      ))}

      {domains.length < 4 && (
        <button onClick={addDomain} style={styles.add}>+ Add another domain</button>
      )}

      <div style={styles.row}>
        <button onClick={() => navigate("/step/2")} style={styles.back}>Back</button>
        <button
          onClick={() => navigate("/step/4")}
          disabled={!canAdvance}
          style={{ ...styles.next, ...(canAdvance ? {} : styles.nextDisabled) }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "640px", margin: "0 auto", padding: "2rem 1rem" },
  stepTitle: { fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" },
  instruction: { fontSize: "1.05rem", marginBottom: "0.5rem" },
  hint: { color: "#555", marginBottom: "1.5rem" },
  domainRow: { marginBottom: "1.25rem" },
  sentence: { fontSize: "0.9rem", color: "#555", marginBottom: "0.25rem" },
  inputRow: { display: "flex", alignItems: "center", gap: "0.5rem" },
  input: {
    flex: 1, padding: "0.65rem 0.75rem", fontSize: "1rem",
    border: "1.5px solid #ccc", borderRadius: "4px", boxSizing: "border-box",
  },
  lifeLabel: { whiteSpace: "nowrap", color: "#555" },
  remove: {
    background: "none", border: "none", cursor: "pointer",
    color: "#999", fontSize: "1rem",
  },
  add: {
    background: "none", border: "1.5px dashed #2d6a4f", color: "#2d6a4f",
    padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer",
    marginBottom: "2rem", fontSize: "0.9rem",
  },
  row: { display: "flex", gap: "1rem" },
  back: {
    padding: "0.75rem 1.5rem", background: "white", color: "#2d6a4f",
    border: "1.5px solid #2d6a4f", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  next: {
    padding: "0.75rem 2rem", background: "#2d6a4f", color: "white",
    border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  nextDisabled: { background: "#aaa", cursor: "not-allowed" },
};
