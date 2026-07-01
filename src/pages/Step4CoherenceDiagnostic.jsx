import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";
import ReflectionResponse from "../components/ReflectionResponse";

const BARRIER_OPTIONS = [
  "Awareness", "Time", "Resources", "Energy", "Competing priorities", "Identity",
];

// rampT for progress bar: step 4 intro = 0.2, step 4 domain screens = 0.4
const RAMP_INTRO = 0.2;
const RAMP_DOMAIN = 0.4;

export default function Step4CoherenceDiagnostic() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro"); // "intro" | "domain" | "reflection"
  const [domainIndex, setDomainIndex] = useState(0);

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

  const current = diagnostic[domainIndex] || { gap: "", barriers: [], barrierNotes: "" };
  const canAdvanceDomain = current.gap.trim() !== "" && (current.barriers.length > 0 || current.barrierNotes.trim() !== "");

  function handleDomainNext() {
    if (domainIndex < activeDomains.length - 1) {
      setDomainIndex(domainIndex + 1);
    } else {
      setPhase("reflection");
    }
  }

  function handleDomainBack() {
    if (domainIndex > 0) {
      setDomainIndex(domainIndex - 1);
    } else {
      setPhase("intro");
    }
  }

  if (phase === "intro") {
    return (
      <Shell
        title="The Coherence Diagnostic"
        footer={
          <>
            <button onClick={() => navigate("/step/3")} style={styles.back}>Back</button>
            <button onClick={() => setPhase("domain")} style={styles.next}>Continue</button>
          </>
        }
      >
        <StepNav current={4} rampT={RAMP_INTRO} />
        <p style={styles.instruction}>
          You've named the areas that matter. Now comes the harder question: what's actually
          true about them right now. Not what you wish were true. What is. Let's do that next.
        </p>
        <p style={styles.tone}>The gap is not a failure. It's the most useful information you have.</p>
      </Shell>
    );
  }

  if (phase === "reflection") {
    return (
      <Shell
        title="The Coherence Diagnostic"
        footer={
          <>
            <button onClick={() => { setDomainIndex(activeDomains.length - 1); setPhase("domain"); }} style={styles.back}>Back</button>
            <button onClick={() => navigate("/step/5")} style={styles.next}>Continue</button>
          </>
        }
      >
        <StepNav current={4} rampT={RAMP_DOMAIN} />
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
      </Shell>
    );
  }

  const domain = activeDomains[domainIndex];

  return (
    <Shell
      title="The Coherence Diagnostic"
      footer={
        <>
          <button onClick={handleDomainBack} style={styles.back}>Back</button>
          <button
            onClick={handleDomainNext}
            disabled={!canAdvanceDomain}
            style={{ ...styles.next, ...(!canAdvanceDomain ? styles.nextDisabled : {}) }}
          >
            {domainIndex < activeDomains.length - 1 ? "Next" : "Continue"}
          </button>
        </>
      }
    >
      <StepNav current={4} rampT={RAMP_DOMAIN} />
      <p style={styles.domainCount}>{domainIndex + 1} of {activeDomains.length}</p>
      <h3 style={styles.domainName}>{domain}</h3>

      <label style={styles.label}>
        What does your {domain} life actually look like right now?
      </label>
      <textarea
        style={styles.textarea}
        placeholder="Be honest about where things actually are, not where you'd like them to be."
        value={current.gap}
        onChange={(e) => setField(domainIndex, "gap", e.target.value)}
        rows={3}
      />

      <label style={styles.label}>What is standing in the way?</label>
      <div style={styles.barrierOptions}>
        {BARRIER_OPTIONS.map((opt) => {
          const selected = (current.barriers || []).includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggleBarrier(domainIndex, opt)}
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
        value={current.barrierNotes}
        onChange={(e) => setField(domainIndex, "barrierNotes", e.target.value)}
        rows={2}
      />
    </Shell>
  );
}

const styles = {
  instruction: { fontSize: "1.05rem", marginBottom: "0.4rem", color: "var(--color-text)", lineHeight: "1.6" },
  tone: { fontStyle: "italic", color: "var(--color-text)", opacity: 0.7 },
  domainCount: { fontSize: "0.8rem", color: "var(--color-text)", opacity: 0.5, marginBottom: "0.4rem" },
  domainName: { fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 600, marginBottom: "1.25rem", color: "var(--color-accent-deep)" },
  label: { display: "block", fontWeight: 600, marginBottom: "0.4rem", color: "var(--color-text)" },
  textarea: {
    width: "100%", padding: "0.65rem", fontSize: "0.95rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box", resize: "vertical", background: "#fff",
  },
  barrierOptions: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" },
  barrierBtn: {
    padding: "0.4rem 0.9rem",
    border: "1.5px solid var(--color-accent)",
    borderRadius: "4px",
    background: "var(--color-paper)",
    color: "var(--color-accent-deep)",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  barrierSelected: { background: "var(--color-accent)", color: "#fff" },
  notesLabel: { display: "block", fontSize: "0.9rem", color: "var(--color-text)", opacity: 0.75, marginBottom: "0.35rem" },
  notesField: {
    width: "100%", padding: "0.6rem", fontSize: "0.9rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    boxSizing: "border-box", resize: "vertical", background: "#fff",
  },
  placeholder: {
    background: "rgba(44,35,29,0.04)",
    border: "1.5px dashed rgba(44,35,29,0.3)",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "0.5rem",
  },
  placeholderLabel: {
    display: "block", fontSize: "0.7rem", textTransform: "uppercase",
    letterSpacing: "0.08em", color: "var(--color-text)", opacity: 0.5, marginBottom: "0.5rem",
  },
  placeholderText: { color: "var(--color-text)", opacity: 0.7, fontStyle: "italic", margin: 0, lineHeight: "1.6" },
  back: {
    padding: "0.75rem 1.5rem", background: "var(--color-paper)", color: "var(--color-accent-deep)",
    border: "1.5px solid var(--color-accent)", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  next: {
    padding: "0.75rem 2rem", background: "var(--color-accent)", color: "#fff",
    border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  nextDisabled: { background: "rgba(44,35,29,0.25)", cursor: "not-allowed" },
};
