import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import { fetchReflection } from "../lib/reflect";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";
import ReflectionResponse from "../components/ReflectionResponse";

const BARRIER_OPTIONS = [
  "Awareness", "Energy", "Competing priorities", "Guilt", "Time", "Resources",
];

// rampT for progress bar: step 4 intro = 0.2, step 4 domain screens = 0.4
const RAMP_INTRO = 0.2;
const RAMP_DOMAIN = 0.4;

export default function Step4CoherenceDiagnostic() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro"); // "intro" | "domain" | "reflection"
  const [domainIndex, setDomainIndex] = useState(0);
  const [reflectionText, setReflectionText] = useState(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);

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
    const entry = diagnostic[i] || { gap: "", barriers: [], barrierNotes: "" };
    const current = Array.isArray(entry.barriers) ? entry.barriers : [];
    const next = current.includes(barrier)
      ? current.filter((b) => b !== barrier)
      : [...current, barrier];
    setField(i, "barriers", next);
  }

  const current = diagnostic[domainIndex] || { gap: "", barriers: [], barrierNotes: "" };
  const currentBarriers = Array.isArray(current.barriers) ? current.barriers : [];
  const canAdvanceDomain = current.gap.trim() !== "" && (currentBarriers.length > 0 || current.barrierNotes.trim() !== "");

  function handleDomainNext() {
    if (domainIndex < activeDomains.length - 1) {
      setDomainIndex(domainIndex + 1);
    } else {
      setPhase("reflection");
      setReflectionLoading(true);
      fetchReflection("step4", {
        northStarFeeling: journey.northStarFeeling,
        domains: activeDomains.map((domain, i) => {
          const diag = journey.coherenceDiagnostic[i] || {};
          return { domain, gap: diag.gap, barriers: diag.barriers, barrierNotes: diag.barrierNotes };
        }),
      }).then((text) => {
        setReflectionText(text);
        setReflectionLoading(false);
      });
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
        <div style={styles.reflectionBox}>
          {reflectionLoading ? (
            <p style={styles.reflectionLoading}>Reading what you shared...</p>
          ) : reflectionText ? (
            <p style={styles.reflectionText}>{reflectionText}</p>
          ) : (
            <p style={styles.reflectionFallback}>
              Read back what you named. What pattern do you see across all of it?
            </p>
          )}
        </div>

        <ReflectionResponse
          resonance={journey.step4ReflectionResonance}
          note={journey.step4ReflectionNote}
          onResonance={(val) => update({ step4ReflectionResonance: val })}
          onNote={(val) => update({ step4ReflectionNote: val })}
          yesAck="That's worth holding onto."
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
      <p style={styles.domainCount}>Domain {domainIndex + 1} of {activeDomains.length}</p>
      <h3 style={styles.domainName}>{domain}</h3>

      <p style={styles.pacingLine}>
        This is probably the hardest question in the whole sequence. Be honest. Not harsh, just honest.
      </p>
      <label style={styles.label}>
        What does your {domain} actually look like right now?
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
          const selected = currentBarriers.includes(opt);
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

      {currentBarriers.length > 3 && (
        <p style={styles.narrowingNudge}>
          You've named several things getting in the way. Which one or two are doing the most work?
          Moving on one or two real barriers tends to open more than spreading attention across all of them.
        </p>
      )}

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
  reflectionBox: {
    background: "rgba(94,15,61,0.04)",
    border: "1px solid rgba(94,15,61,0.18)",
    borderRadius: "6px",
    padding: "1.25rem 1.5rem",
    marginBottom: "1.5rem",
    minHeight: "4rem",
  },
  reflectionText: { color: "var(--color-text)", lineHeight: "1.8", margin: 0, fontStyle: "italic", fontSize: "1rem" },
  reflectionLoading: { color: "var(--color-text)", opacity: 0.45, fontStyle: "italic", margin: 0, fontSize: "0.95rem" },
  reflectionFallback: { color: "var(--color-text)", opacity: 0.6, fontStyle: "italic", margin: 0, fontSize: "0.95rem" },
  pacingLine: { color: "var(--color-text)", opacity: 0.7, fontStyle: "italic", marginBottom: "0.5rem", fontSize: "0.95rem", lineHeight: "1.5" },
  narrowingNudge: {
    background: "rgba(228,74,36,0.06)",
    border: "1px solid rgba(228,74,36,0.2)",
    borderRadius: "6px",
    padding: "0.75rem 1rem",
    marginBottom: "0.75rem",
    color: "var(--color-text)",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  },
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
    padding: "0.75rem 2rem", background: "var(--color-plum)", color: "#fff",
    border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  nextDisabled: { background: "rgba(44,35,29,0.25)", cursor: "not-allowed" },
};
