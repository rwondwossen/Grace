import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import { fetchReflection } from "../lib/reflect";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";
import ReflectionResponse from "../components/ReflectionResponse";

const QUOTES = [
  { key: "quote1Resonance", text: "The things that make you feel most alive are often the things you are neglecting.", attribution: "Parker J. Palmer" },
  { key: "quote2Resonance", text: "I am large, I contain multitudes.", attribution: "Walt Whitman" },
  { key: "quote3Resonance", text: "If I didn't define myself for myself, I would be crunched into other people's fantasies for me and eaten alive.", attribution: "Audre Lorde" },
  { key: "quote4Resonance", text: "You are your best thing.", attribution: "Toni Morrison" },
  { key: "quote5Resonance", text: "Beware the barrenness of a busy life.", attribution: "Socrates" },
];

const TENSIONS = [
  "neglected joy",
  "pulled in contradictory directions",
  "clarifying self against being othered",
  "self-neglect through responsibility",
  "illusion of busyness",
];

const RESONANCE_OPTIONS = ["Deeply", "Somewhat", "Not really"];
const FALLBACK = "What's standing out for you right now?";

export default function Step1Provocation() {
  const { journey, update, reset } = useJourney();
  useEffect(() => { reset(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const navigate = useNavigate();
  const [phase, setPhase] = useState("quotes"); // "quotes" | "reflection"
  const [currentQuote, setCurrentQuote] = useState(0);
  const [reflectionText, setReflectionText] = useState(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const reflectionFetchedRef = useRef(false);

  const quote = QUOTES[currentQuote];
  const currentResonance = journey[quote.key];

  function getRatings(updatedKey, updatedVal) {
    const base = {
      quote1Resonance: journey.quote1Resonance,
      quote2Resonance: journey.quote2Resonance,
      quote3Resonance: journey.quote3Resonance,
      quote4Resonance: journey.quote4Resonance,
      quote5Resonance: journey.quote5Resonance,
    };
    if (updatedKey) base[updatedKey] = updatedVal;
    return base;
  }

  function fireReflectionIfNeeded(ratings) {
    if (reflectionFetchedRef.current) return;
    const hasDeep = QUOTES.some((q) => ratings[q.key] === "Deeply");
    if (!hasDeep) return;
    reflectionFetchedRef.current = true;
    setReflectionLoading(true);

    const tensions = QUOTES
      .map((q, i) => ({ tension: TENSIONS[i], rating: ratings[q.key] }))
      .filter((t) => t.rating === "Deeply" || t.rating === "Somewhat");

    fetchReflection("step1", { tensions }).then((text) => {
      setReflectionText(text);
      setReflectionLoading(false);
    });
  }

  function handleSelect(option) {
    update({ [quote.key]: option });
    if (currentQuote === QUOTES.length - 1) {
      fireReflectionIfNeeded(getRatings(quote.key, option));
    }
  }

  function handleNext() {
    if (currentQuote < QUOTES.length - 1) {
      setCurrentQuote(currentQuote + 1);
    } else {
      setPhase("reflection");
    }
  }

  const canAdvanceQuote = currentResonance !== "" && currentResonance !== undefined;
  const canAdvanceReflection = journey.reflectionResonance !== "";

  if (phase === "reflection") {
    const hasDeep = QUOTES.some((q) => journey[q.key] === "Deeply");

    return (
      <Shell
        title="The Provocation"
        footer={
          <>
            <button onClick={() => setPhase("quotes")} style={styles.back}>Back</button>
            <button
              onClick={() => navigate("/step/2")}
              disabled={!canAdvanceReflection}
              style={{ ...styles.next, ...(!canAdvanceReflection ? styles.nextDisabled : {}) }}
            >
              Continue
            </button>
          </>
        }
      >
        <StepNav current={1} />

        <div style={styles.reflectionBox}>
          {hasDeep && reflectionLoading ? (
            <p style={styles.reflectionLoading}>Reading your responses...</p>
          ) : reflectionText ? (
            <p style={styles.reflectionText}>{reflectionText}</p>
          ) : (
            <p style={styles.reflectionFallback}>{FALLBACK}</p>
          )}
        </div>

        <ReflectionResponse
          resonance={journey.reflectionResonance}
          note={journey.reflectionNote}
          onResonance={(val) => update({ reflectionResonance: val })}
          onNote={(val) => update({ reflectionNote: val })}
          yesAck="Let that sit for a while."
        />
      </Shell>
    );
  }

  return (
    <Shell
      title="The Provocation"
      footer={
        <button
          onClick={handleNext}
          disabled={!canAdvanceQuote}
          style={{ ...styles.next, ...(!canAdvanceQuote ? styles.nextDisabled : {}) }}
        >
          {currentQuote < QUOTES.length - 1 ? "Next" : "See reflection"}
        </button>
      }
    >
      <StepNav current={1} />
      {currentQuote === 0 && (
        <p style={styles.leadIn}>
          A few short provocations. Not all of them will land the same way, and that's fine.
          What you notice matters as much as what you feel.
        </p>
      )}
      <p style={styles.instruction}>Read this slowly. Then tell us how much it resonates.</p>

      <blockquote style={styles.quote}>
        <p style={styles.quoteText}>"{quote.text}"</p>
        <footer style={styles.attribution}>— {quote.attribution}</footer>
      </blockquote>

      <div style={styles.options}>
        {RESONANCE_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            style={{
              ...styles.option,
              ...(currentResonance === opt ? styles.optionSelected : {}),
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={styles.quoteCount}>
        {currentQuote + 1} of {QUOTES.length}
      </div>
    </Shell>
  );
}

const styles = {
  leadIn: { color: "var(--color-text)", opacity: 0.85, lineHeight: "1.8", fontSize: "1.05rem", marginBottom: "0.5rem" },
  instruction: { color: "var(--color-text)", marginBottom: "2rem", lineHeight: "1.6" },
  quote: {
    borderLeft: "3px solid var(--color-accent)",
    paddingLeft: "1.25rem",
    margin: "0 0 2rem",
  },
  quoteText: {
    fontFamily: "var(--font-serif)",
    fontStyle: "italic",
    fontSize: "1.25rem",
    lineHeight: "1.6",
    color: "var(--color-text)",
    margin: "0 0 0.5rem",
  },
  attribution: { fontSize: "0.85rem", color: "var(--color-text)", opacity: 0.65 },
  options: { display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" },
  option: {
    padding: "0.6rem 1.2rem",
    border: "1.5px solid var(--color-accent)",
    borderRadius: "4px",
    background: "var(--color-paper)",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "var(--color-accent-deep)",
  },
  optionSelected: { background: "var(--color-accent)", color: "#fff" },
  quoteCount: { fontSize: "0.8rem", color: "var(--color-text)", opacity: 0.5, marginBottom: "1rem" },
  reflectionBox: {
    background: "rgba(94,15,61,0.04)",
    border: "1px solid rgba(94,15,61,0.18)",
    borderRadius: "6px",
    padding: "1.25rem 1.5rem",
    marginBottom: "1.5rem",
    minHeight: "4rem",
  },
  reflectionText: { color: "var(--color-text)", lineHeight: "1.8", margin: 0, fontStyle: "italic", fontSize: "1rem" },
  reflectionFallback: { color: "var(--color-text)", opacity: 0.6, fontStyle: "italic", margin: 0, fontSize: "0.95rem" },
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
