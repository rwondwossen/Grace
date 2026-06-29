import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
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
      <div style={styles.page}>
        <StepNav current={1} />
        <h2 style={styles.stepTitle}>The Provocation</h2>

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

        <div style={styles.row}>
          <button onClick={() => setPhase("quotes")} style={styles.back}>Back</button>
          <button
            onClick={() => navigate("/step/2")}
            disabled={!canAdvanceReflection}
            style={{ ...styles.next, ...(!canAdvanceReflection ? styles.nextDisabled : {}) }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <StepNav current={1} />
      <h2 style={styles.stepTitle}>The Provocation</h2>
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

      <button
        onClick={handleNext}
        disabled={!canAdvanceQuote}
        style={{ ...styles.next, ...(!canAdvanceQuote ? styles.nextDisabled : {}) }}
      >
        {currentQuote < QUOTES.length - 1 ? "Next" : "See reflection"}
      </button>
    </div>
  );
}

const styles = {
  page: { maxWidth: "640px", margin: "0 auto", padding: "2rem 1rem" },
  stepTitle: { fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" },
  instruction: { color: "#555", marginBottom: "2rem" },
  quote: {
    borderLeft: "3px solid #2d6a4f",
    paddingLeft: "1.25rem",
    margin: "0 0 2rem",
  },
  quoteText: {
    fontStyle: "italic",
    fontSize: "1.15rem",
    lineHeight: "1.7",
    color: "#1a1a1a",
    margin: "0 0 0.5rem",
  },
  attribution: { fontSize: "0.85rem", color: "#666" },
  options: { display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" },
  option: {
    padding: "0.6rem 1.2rem",
    border: "1.5px solid #2d6a4f",
    borderRadius: "4px",
    background: "white",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#2d6a4f",
  },
  optionSelected: { background: "#2d6a4f", color: "white" },
  quoteCount: { fontSize: "0.8rem", color: "#999", marginBottom: "2rem" },
  placeholder: {
    background: "#f5f5f5",
    border: "1.5px dashed #bbb",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "0.5rem",
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
