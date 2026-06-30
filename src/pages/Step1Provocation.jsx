import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";
import ReflectionResponse from "../components/ReflectionResponse";

const QUOTES = [
  {
    key: "quote1Resonance",
    text: "Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare.",
    attribution: "Audre Lorde",
  },
  {
    key: "quote2Resonance",
    text: "The things that make you feel most alive are often the things you are neglecting.",
    attribution: "Parker J. Palmer",
  },
  {
    key: "quote3Resonance",
    text: "Wholeness is not achieved by cutting off a portion of one's being, but by integration of the contraries.",
    attribution: "Carl Jung",
  },
  {
    key: "quote4Resonance",
    text: "Beware the barrenness of a busy life.",
    attribution: "Socrates",
  },
];

const RESONANCE_OPTIONS = ["Deeply", "Somewhat", "Not really"];

export default function Step1Provocation() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("quotes"); // "quotes" | "reflection"
  const [currentQuote, setCurrentQuote] = useState(0);

  const quote = QUOTES[currentQuote];
  const currentResonance = journey[quote.key];

  function handleSelect(option) {
    update({ [quote.key]: option });
  }

  function handleNext() {
    if (currentQuote < QUOTES.length - 1) {
      setCurrentQuote(currentQuote + 1);
    } else {
      setPhase("reflection");
    }
  }

  const canAdvanceQuote = currentResonance !== "";
  const canAdvanceReflection = journey.reflectionResonance !== "";

  if (phase === "reflection") {
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

        <div style={styles.placeholder}>
          <span style={styles.placeholderLabel}>AI reflection placeholder</span>
          <p style={styles.placeholderText}>
            [AI reflection appears here — two to three sentences, warm and specific,
            generated from the user's responses to all four quotes. Not a summary.
            An observation that feels written for this specific person.]
          </p>
        </div>

        <ReflectionResponse
          resonance={journey.reflectionResonance}
          note={journey.reflectionNote}
          onResonance={(val) => update({ reflectionResonance: val })}
          onNote={(val) => update({ reflectionNote: val })}
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
  placeholder: {
    background: "rgba(44,35,29,0.04)",
    border: "1.5px dashed rgba(44,35,29,0.3)",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "0.5rem",
  },
  placeholderLabel: {
    display: "block",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-text)",
    opacity: 0.5,
    marginBottom: "0.5rem",
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
