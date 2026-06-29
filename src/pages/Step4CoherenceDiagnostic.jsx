import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import StepNav from "../components/StepNav";
import ReflectionResponse from "../components/ReflectionResponse";

const BARRIER_OPTIONS = [
  "Awareness", "Time", "Resources", "Energy", "Competing priorities", "Identity",
];

export default function Step4CoherenceDiagnostic() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();

  const activeDomains = (journey.domains.length > 0 ? journey.domains : journey.allDomains).filter(
    (d) => d.trim() !== ""
  );

  const diagnostic = activeDomains.map((_, i) =>
    journey.coherenceDiagnostic[i] || { gap: "", barriers: [], barrierNotes: "" }
  );

  function setField(i, field, val) {
    const next = diagnostic.map((d) => ({ ...d, barriers: [...d.barriers] }));
    next[i] = { ...next[i], [field]: val };
    update({ coherenceDiagnostic: next });
  }

  function toggleBarrier(i, barrier) {
    const current = diagnostic[i].barriers || [];
    const next = current.includes(barrier)
      ? current.filter((b) => b !== barrier)
      : [...current, barrier];
    setField(i, "barriers", next);
  }

  const canAdvance =
    diagnostic.every((d) => d.gap.trim() !== "" && (d.barriers.length > 0 || d.barrierNotes.trim() !== ""));

  return (
    <div style={styles.page}>
      <StepNav current={4} />
      <h2 style={styles.stepTitle}>The Coherence Diagnostic</h2>
      <p style={styles.instruction}>
        In the areas you've named, what is your life currently showing? And what's standing in the way?
      </p>
      <p style={styles.tone}>The gap is not a failure. It's the most useful information you have.</p>

      {activeDomains.map((domain, i) => (
        <div key={i} style={styles.domainBlock}>
          <h3 style={styles.domainName}>{domain}</h3>

          <label style={styles.label}>
            What does your <em>{domain}</em> life actually look like right now?
          </label>
          <textarea
            style={styles.textarea}
            placeholder="Be honest about where things actually are, not where you'd like them to be."
            value={diagnostic[i].gap}
            onChange={(e) => setField(i, "gap", e.target.value)}
            rows={3}
          />

          <label style={styles.label}>What is standing in the way?</label>
          <div style={styles.barrierOptions}>
            {BARRIER_OPTIONS.map((opt) => {
              const selected = (diagnostic[i].barriers || []).includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleBarrier(i, opt)}
                  style={{ ...styles.barrierBtn, ...(selected ? styles.barrierSelected : {}) }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <label style={styles.notesLabel}>Anything else about what's getting in the way?</label>
          <textarea
            style={styles.notesField}
            placeholder="Any texture the categories don't capture…"
            value={diagnostic[i].barrierNotes}
            onChange={(e) => setField(i, "barrierNotes", e.target.value)}
            rows={2}
          />
        </div>
      ))}

      <div style={styles.placeholder}>
        <span style={styles.placeholderLabel}>AI reflection placeholder</span>
        <p style={styles.placeholderText}>
          [AI reflection appears here — domain by domain, one to two sentences each, naming
          the gap and barrier as the user described them, reflected back with warmth and without
          judgment. One closing sentence on the overall pattern across domains.]
        </p>
      </div>

      <ReflectionResponse
        resonance={journey.step4ReflectionResonance}
        note={journey.step4ReflectionNote}
        onResonance={(val) => update({ step4ReflectionResonance: val })}
        onNote={(val) => update({ step4ReflectionNote: val })}
      />

      <div style={styles.row}>
        <button onClick={() => navigate("/step/3")} style={styles.back}>Back</button>
        <button
          onClick={() => navigate("/step/5")}
          disabled={!canAdvance}
          style={{ ...styles.next, ...(!canAdvance ? styles.nextDisabled : {}) }}
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
  instruction: { fontSize: "1.05rem", marginBottom: "0.4rem" },
  tone: { fontStyle: "italic", color: "#555", marginBottom: "2rem" },
  domainBlock: {
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "1.5rem",
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
    padding: "0.4rem 0.9rem",
    border: "1.5px solid #2d6a4f",
    borderRadius: "4px",
    background: "white",
    color: "#2d6a4f",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  barrierSelected: { background: "#2d6a4f", color: "white" },
  notesLabel: { display: "block", fontSize: "0.9rem", color: "#555", marginBottom: "0.35rem" },
  notesField: {
    width: "100%", padding: "0.6rem", fontSize: "0.9rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    boxSizing: "border-box", resize: "vertical",
  },
  placeholder: {
    background: "#f5f5f5",
    border: "1.5px dashed #bbb",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "0.5rem",
    marginTop: "0.5rem",
  },
  placeholderLabel: {
    display: "block",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#999",
    marginBottom: "0.5rem",
  },
  placeholderText: { color: "#888", fontStyle: "italic", margin: 0, lineHeight: "1.6" },
  row: { display: "flex", gap: "1rem", marginTop: "1.5rem" },
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
