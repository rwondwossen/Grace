import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import StepNav from "../components/StepNav";

const BARRIER_OPTIONS = [
  "Awareness", "Time", "Resources", "Energy", "Competing priorities", "Identity",
];

export default function Step4CoherenceDiagnostic() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();

  const activeDomains = journey.domains.filter((d) => d.trim() !== "");

  const diagnostic = activeDomains.map((_, i) =>
    journey.coherenceDiagnostic[i] || { gap: "", barrier: "" }
  );

  function setField(i, field, val) {
    const next = [...diagnostic];
    next[i] = { ...next[i], [field]: val };
    update({ coherenceDiagnostic: next });
  }

  const canAdvance = diagnostic.every((d) => d.gap.trim() !== "" && d.barrier.trim() !== "");

  return (
    <div style={styles.page}>
      <StepNav current={4} />
      <h2 style={styles.stepTitle}>The Coherence Diagnostic</h2>
      <p style={styles.instruction}>
        Before setting a single goal — an honest pause.
        In the domains you've named, what is your life currently showing?
        What is standing in the way?
      </p>
      <p style={styles.tone}>The gap is not a failure. It's the most useful information you have.</p>

      {activeDomains.map((domain, i) => (
        <div key={i} style={styles.domainBlock}>
          <h3 style={styles.domainName}>{domain}</h3>

          <label style={styles.label}>
            What does your life currently show in your <em>{domain}</em> life?
          </label>
          <textarea
            style={styles.textarea}
            placeholder="What's the gap between what you say matters and how you're actually living it?"
            value={diagnostic[i].gap}
            onChange={(e) => setField(i, "gap", e.target.value)}
            rows={3}
          />

          <label style={styles.label}>What is standing in the way?</label>
          <div style={styles.barrierOptions}>
            {BARRIER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setField(i, "barrier", opt)}
                style={{
                  ...styles.barrierBtn,
                  ...(diagnostic[i].barrier === opt ? styles.barrierSelected : {}),
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          <input
            style={styles.barrierCustom}
            type="text"
            placeholder="Or describe it in your own words…"
            value={BARRIER_OPTIONS.includes(diagnostic[i].barrier) ? "" : diagnostic[i].barrier}
            onChange={(e) => setField(i, "barrier", e.target.value)}
          />
        </div>
      ))}

      <div style={styles.row}>
        <button onClick={() => navigate("/step/3")} style={styles.back}>Back</button>
        <button
          onClick={() => navigate("/step/5")}
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
  tone: { fontStyle: "italic", color: "#555", marginBottom: "2rem" },
  domainBlock: {
    border: "1px solid #e0e0e0", borderRadius: "6px",
    padding: "1.25rem", marginBottom: "1.5rem",
  },
  domainName: { fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", color: "#2d6a4f" },
  label: { display: "block", fontWeight: "500", marginBottom: "0.4rem" },
  textarea: {
    width: "100%", padding: "0.65rem", fontSize: "0.95rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box", resize: "vertical",
  },
  barrierOptions: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" },
  barrierBtn: {
    padding: "0.4rem 0.9rem", border: "1.5px solid #2d6a4f",
    borderRadius: "4px", background: "white", color: "#2d6a4f",
    cursor: "pointer", fontSize: "0.85rem",
  },
  barrierSelected: { background: "#2d6a4f", color: "white" },
  barrierCustom: {
    width: "100%", padding: "0.6rem", fontSize: "0.9rem",
    border: "1.5px solid #ccc", borderRadius: "4px", boxSizing: "border-box",
  },
  row: { display: "flex", gap: "1rem", marginTop: "1rem" },
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
