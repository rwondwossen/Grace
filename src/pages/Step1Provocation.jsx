import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import StepNav from "../components/StepNav";

const QUOTES = [
  {
    id: "quote1",
    text: "You are not too busy. You are too comfortable with letting the most important things wait.",
  },
  {
    id: "quote2",
    text: "The life you keep meaning to live is waiting for you to stop rehearsing it.",
  },
];

const RESONANCE_OPTIONS = ["Deeply", "Somewhat", "Not really"];

export default function Step1Provocation() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const resonanceKey = current === 0 ? "quote1Resonance" : "quote2Resonance";
  const value = current === 0 ? journey.quote1Resonance : journey.quote2Resonance;

  function handleSelect(option) {
    update({ [resonanceKey]: option });
  }

  function handleNext() {
    if (current === 0) {
      setCurrent(1);
    } else {
      navigate("/step/2");
    }
  }

  const canAdvance = value !== "";

  return (
    <div style={styles.page}>
      <StepNav current={1} />
      <h2 style={styles.stepTitle}>The Provocation</h2>
      <p style={styles.instruction}>
        Read this slowly. Then tell us how much it resonates.
      </p>

      <blockquote style={styles.quote}>"{QUOTES[current].text}"</blockquote>

      <div style={styles.options}>
        {RESONANCE_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            style={{
              ...styles.option,
              ...(value === opt ? styles.optionSelected : {}),
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={styles.quoteCount}>
        Quote {current + 1} of {QUOTES.length}
      </div>

      <button
        onClick={handleNext}
        disabled={!canAdvance}
        style={{ ...styles.next, ...(canAdvance ? {} : styles.nextDisabled) }}
      >
        {current === 0 ? "Next quote" : "Continue"}
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
    fontStyle: "italic",
    fontSize: "1.15rem",
    lineHeight: "1.7",
    marginBottom: "2rem",
    color: "#1a1a1a",
  },
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
  optionSelected: {
    background: "#2d6a4f",
    color: "white",
  },
  quoteCount: { fontSize: "0.8rem", color: "#999", marginBottom: "2rem" },
  next: {
    padding: "0.75rem 2rem",
    background: "#2d6a4f",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  nextDisabled: { background: "#aaa", cursor: "not-allowed" },
};
