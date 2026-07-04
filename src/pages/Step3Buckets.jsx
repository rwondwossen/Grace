import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";
import NorthStarWord from "../components/NorthStarWord";

const EXTRA_EXAMPLES = [
  {
    feeling: "present",
    text: "When I wanted to feel present, I kept coming back to parenting and creative work. Those were the two places where I was always distracted, always half-elsewhere.",
  },
  {
    feeling: "strong",
    text: "When I wanted to feel strong, it pointed to my finances and my physical health. Both had been on pause for so long I'd started pretending they weren't there.",
  },
  {
    feeling: "alive",
    text: "When I wanted to feel alive, I realised it was about my friendships and how I spent my evenings. I'd optimised for productivity and slowly stopped doing anything just because I loved it.",
  },
];

export default function Step3Buckets() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [stuckOpen, setStuckOpen] = useState(false);
  const [phase, setPhase] = useState("generate"); // "generate" | "narrow"

  const allDomains = journey.allDomains.length >= 2 ? journey.allDomains : ["", ""];
  const filled = allDomains.filter((d) => d.trim() !== "");

  // Narrowing state — kept is a set of indices into filled
  const [kept, setKept] = useState(null); // null until narrowing phase

  function setDomain(i, val) {
    const next = [...allDomains];
    next[i] = val;
    update({ allDomains: next });
  }

  function addDomain() {
    update({ allDomains: [...allDomains, ""] });
  }

  function removeDomain(i) {
    if (allDomains.length > 2) {
      update({ allDomains: allDomains.filter((_, idx) => idx !== i) });
    }
  }

  function handleGenerate() {
    const filledDomains = allDomains.filter((d) => d.trim() !== "");
    if (filledDomains.length >= 5) {
      setKept(new Set(filledDomains.map((_, i) => i)));
      setPhase("narrow");
    } else {
      update({ domains: filledDomains });
      navigate("/step/4");
    }
  }

  function toggleKept(i) {
    setKept((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  function handleNarrowContinue() {
    const filledDomains = allDomains.filter((d) => d.trim() !== "");
    const keptDomains = filledDomains.filter((_, i) => kept.has(i));
    update({ domains: keptDomains.length > 0 ? keptDomains : filledDomains });
    navigate("/step/4");
  }

  const feeling = journey.northStarFeeling || "the feeling you named";
  const canGenerate = filled.length >= 2;

  if (phase === "narrow") {
    const filledDomains = allDomains.filter((d) => d.trim() !== "");
    return (
      <Shell
        title="The Buckets"
        footer={
          <>
            <button onClick={() => setPhase("generate")} style={styles.back}>Back</button>
            <button onClick={handleNarrowContinue} style={styles.next}>
              Continue with {kept && kept.size > 0 ? kept.size : filledDomains.length}{kept && kept.size === filledDomains.length ? " (all)" : ""}
            </button>
          </>
        }
      >
        <StepNav current={3} />
        <div style={styles.narrowBox}>
          <p style={styles.narrowCopy}>
            You've named {filledDomains.length}. You can keep all of them, but part of what pulls us out
            of the feeling we're after is trying to tend to everything at once. Most people find that
            three or four areas, given real attention, do more than {filledDomains.length} half-tended.
            Which few would most move you toward feeling <NorthStarWord>{feeling}</NorthStarWord>?
          </p>
          <div style={styles.narrowList}>
            {filledDomains.map((domain, i) => (
              <button
                key={i}
                onClick={() => toggleKept(i)}
                style={{
                  ...styles.narrowChip,
                  ...(kept.has(i) ? styles.narrowChipKept : styles.narrowChipDeselected),
                }}
              >
                {kept.has(i) ? "✓ " : ""}{domain}
              </button>
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      title="The Buckets"
      footer={
        <>
          <button onClick={() => navigate("/step/2")} style={styles.back}>Back</button>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{ ...styles.next, ...(!canGenerate ? styles.nextDisabled : {}) }}
          >
            Continue
          </button>
        </>
      }
    >
      <StepNav current={3} />

      <p style={styles.question}>
        You can't tend to everything at once, and trying to is part of what pulls us out of feeling{" "}
        <NorthStarWord>{feeling}</NorthStarWord>. So if <NorthStarWord>{feeling}</NorthStarWord> is what you're after, which few
        areas of your life would most support that feeling if you gave them real attention?
      </p>

      <div style={styles.examples}>
        <p style={styles.exampleItem}>
          "When I wanted to feel <strong>grounded</strong>, I realised it meant tending to my body
          and my finances, the two things I'd been ignoring that kept me anxious."
        </p>
        <p style={styles.exampleItem}>
          "When I wanted to feel <strong>free</strong>, it came down to my work and my friendships.
          I'd built a life that looked full but left no room to breathe."
        </p>
      </div>

      <button
        onClick={() => setStuckOpen((o) => !o)}
        style={styles.stuckToggle}
        aria-expanded={stuckOpen}
      >
        {stuckOpen ? "Hide examples ↑" : "Feeling stuck? ↓"}
      </button>

      {stuckOpen && (
        <div style={styles.stuckPanel}>
          {EXTRA_EXAMPLES.map((ex, i) => (
            <p key={i} style={styles.exampleItem}>
              "When I wanted to feel <strong>{ex.feeling}</strong>, {ex.text.split(", ").slice(1).join(", ")}"
            </p>
          ))}
        </div>
      )}

      <div style={styles.inputs}>
        {allDomains.map((domain, i) => (
          <div key={i} style={styles.domainRow}>
            <input
              style={styles.input}
              type="text"
              placeholder={`Area ${i + 1} (e.g. creative, relational, financial...)`}
              value={domain}
              onChange={(e) => setDomain(i, e.target.value)}
            />
            {allDomains.length > 2 && (
              <button onClick={() => removeDomain(i)} style={styles.remove} aria-label="Remove">✕</button>
            )}
          </div>
        ))}
      </div>

      <button onClick={addDomain} style={styles.add}>+ Add another area</button>
    </Shell>
  );
}

const styles = {
  question: { fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "1.5rem", color: "var(--color-text)" },
  examples: {
    background: "rgba(228,74,36,0.06)",
    border: "1px solid rgba(228,74,36,0.2)",
    borderRadius: "6px",
    padding: "1rem 1.25rem",
    marginBottom: "1rem",
  },
  exampleItem: {
    color: "var(--color-text)",
    opacity: 0.85,
    lineHeight: "1.6",
    margin: "0 0 0.75rem",
    fontSize: "0.95rem",
  },
  stuckToggle: {
    background: "none",
    border: "none",
    color: "var(--color-accent-deep)",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "0",
    marginBottom: "0.5rem",
    textDecoration: "underline",
  },
  stuckPanel: {
    background: "rgba(228,74,36,0.06)",
    border: "1px solid rgba(228,74,36,0.2)",
    borderRadius: "6px",
    padding: "1rem 1.25rem",
    marginBottom: "1rem",
  },
  inputs: { marginTop: "1.5rem", marginBottom: "0.5rem" },
  domainRow: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" },
  input: {
    flex: 1,
    padding: "0.65rem 0.75rem",
    fontSize: "1rem",
    border: "1.5px solid rgba(44,35,29,0.25)",
    borderRadius: "4px",
    boxSizing: "border-box",
    background: "#fff",
  },
  remove: { background: "none", border: "none", cursor: "pointer", color: "var(--color-text)", opacity: 0.5, fontSize: "1rem" },
  add: {
    background: "none",
    border: "1.5px dashed var(--color-accent)",
    color: "var(--color-accent-deep)",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    display: "block",
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
  narrowBox: {
    background: "rgba(228,74,36,0.06)",
    border: "1px solid rgba(228,74,36,0.2)",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "0.5rem",
  },
  narrowCopy: { lineHeight: "1.7", marginBottom: "1.25rem", color: "var(--color-text)" },
  narrowList: { display: "flex", flexWrap: "wrap", gap: "0.6rem" },
  narrowChip: {
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.95rem",
    border: "1.5px solid var(--color-accent)",
  },
  narrowChipKept: { background: "var(--color-accent)", color: "#fff" },
  narrowChipDeselected: { background: "var(--color-paper)", color: "var(--color-accent-deep)" },
};
