import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import { fetchReflection } from "../lib/reflect";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";

const BARRIER_OPTIONS = [
  "Awareness", "Energy", "Competing priorities", "Guilt", "Time", "Resources",
];

const RAMP_INTRO = 0.2;
const RAMP_DOMAIN = 0.4;

const FALLBACK_REFLECTION = "Take a look at what you've named. What's surfacing for you?";

export default function Step4CoherenceDiagnostic() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro"); // "intro" | "domain" | "reflection"
  const [domainIndex, setDomainIndex] = useState(0);
  const [reflections, setReflections] = useState(null); // object keyed by domain name
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [continueReady, setContinueReady] = useState(false);
  const continueTimerRef = useRef(null);

  // Hard guard: Continue button on reflection screen is disabled for 1.5s after entering
  // the phase to prevent phantom taps from the previous screen's Continue button
  useEffect(() => {
    if (phase === "reflection") {
      setContinueReady(false);
      continueTimerRef.current = setTimeout(() => setContinueReady(true), 1500);
    }
    return () => clearTimeout(continueTimerRef.current);
  }, [phase]);

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
      }).then((result) => {
        setReflections(result);
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
    if (reflectionLoading) {
      return (
        <Shell
          title="The Coherence Diagnostic"
          footer={
            <button onClick={() => { setDomainIndex(activeDomains.length - 1); setPhase("domain"); }} style={styles.back}>Back</button>
          }
        >
          <StepNav current={4} rampT={RAMP_DOMAIN} />
          <p style={styles.reflectionLoading}>Reading what you shared...</p>
        </Shell>
      );
    }

    const showFallback = !reflections;

    return (
      <Shell
        title="The Coherence Diagnostic"
        footer={
          <>
            <button onClick={() => { setDomainIndex(activeDomains.length - 1); setPhase("domain"); }} style={styles.back}>Back</button>
            <button
              onClick={() => continueReady && navigate("/step/5")}
              disabled={!continueReady}
              style={{ ...styles.next, ...(!continueReady ? styles.nextDisabled : {}) }}
            >Continue</button>
          </>
        }
      >
        <StepNav current={4} rampT={RAMP_DOMAIN} />

        {showFallback ? (
          <p style={styles.fallback}>{FALLBACK_REFLECTION}</p>
        ) : (
          <table style={styles.table}>
            <tbody>
              {activeDomains.map((domain, i) => {
                const diag = diagnostic[i] || {};
                const barriers = [
                  ...(Array.isArray(diag.barriers) ? diag.barriers : []),
                  diag.barrierNotes,
                ].filter(Boolean).join(", ");
                const aiText = (reflections && reflections[domain]) || null;

                return (
                  <tr key={i} style={i < activeDomains.length - 1 ? styles.trBorder : {}}>
                    <td style={styles.tdDomain}>{domain}</td>
                    <td style={styles.tdContent}>
                      <p style={styles.gapText}>{diag.gap || "—"}</p>
                      {barriers ? <p style={styles.barriersText}>{barriers}</p> : null}
                      {aiText ? <p style={styles.aiReflection}>{aiText}</p> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div style={styles.surfacingBlock}>
          <label style={styles.surfacingLabel}>What's surfacing for you?</label>
          <textarea
            style={styles.surfacingField}
            placeholder="Anything you're noticing..."
            value={journey.step4SurfacingNote}
            onChange={(e) => update({ step4SurfacingNote: e.target.value })}
            rows={3}
          />
        </div>
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
        placeholder="Any texture the categories don't capture..."
        value={current.barrierNotes}
        onChange={(e) => setField(domainIndex, "barrierNotes", e.target.value)}
        rows={2}
      />
    </Shell>
  );
}

const styles = {
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
  fallback: { color: "var(--color-text)", opacity: 0.6, fontStyle: "italic", marginBottom: "1.5rem", fontSize: "0.95rem" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" },
  trBorder: { borderBottom: "1px solid rgba(94,15,61,0.12)" },
  tdDomain: {
    fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "0.95rem",
    color: "var(--color-accent-deep)", verticalAlign: "top",
    paddingRight: "1rem", paddingTop: "1rem", paddingBottom: "1rem",
    width: "28%", whiteSpace: "nowrap",
  },
  tdContent: { verticalAlign: "top", paddingTop: "1rem", paddingBottom: "1rem" },
  gapText: { margin: "0 0 0.3rem", fontSize: "0.92rem", color: "var(--color-text)", lineHeight: "1.6" },
  barriersText: { margin: "0 0 0.5rem", fontSize: "0.82rem", color: "var(--color-text)", opacity: 0.55 },
  reflectionLoading: { margin: 0, fontSize: "0.88rem", color: "var(--color-text)", opacity: 0.4, fontStyle: "italic" },
  aiReflection: { margin: 0, fontSize: "0.9rem", color: "var(--color-plum)", fontStyle: "italic", lineHeight: "1.6" },
  surfacingBlock: { marginTop: "0.5rem" },
  surfacingLabel: { display: "block", fontWeight: 600, marginBottom: "0.4rem", color: "var(--color-text)" },
  surfacingField: {
    width: "100%", padding: "0.65rem", fontSize: "0.95rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    boxSizing: "border-box", resize: "vertical", background: "#fff",
  },
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
