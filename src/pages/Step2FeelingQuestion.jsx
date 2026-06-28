import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import StepNav from "../components/StepNav";

export default function Step2FeelingQuestion() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();

  const canAdvance = journey.northStarFeeling.trim() !== "";

  return (
    <div style={styles.page}>
      <StepNav current={2} />
      <h2 style={styles.stepTitle}>The Feeling Question</h2>
      <p style={styles.instruction}>
        One year from now, I want to feel...
      </p>
      <p style={styles.hint}>
        Start by generating as many feeling words as come to mind. Notice what patterns emerge.
        Then land on the one word or phrase that feels most true.
      </p>

      <label style={styles.label}>Your feeling words (brainstorm freely)</label>
      <textarea
        style={styles.textarea}
        placeholder="e.g. free, grounded, proud, present, lighter, alive..."
        value={journey.feelingWords}
        onChange={(e) => update({ feelingWords: e.target.value })}
        rows={4}
      />

      <label style={styles.label}>Your north star — one word or tagline</label>
      <input
        style={styles.input}
        type="text"
        placeholder="e.g. Grounded  /  Quietly thriving  /  At home in my life"
        value={journey.northStarFeeling}
        onChange={(e) => update({ northStarFeeling: e.target.value })}
      />

      <p style={styles.prompts}>
        <strong>If you're stuck:</strong> What is the opposite of how you feel on your worst days?
        What would the people who love you most want for you?
      </p>

      <div style={styles.row}>
        <button onClick={() => navigate("/step/1")} style={styles.back}>Back</button>
        <button
          onClick={() => navigate("/step/3")}
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
  instruction: { fontSize: "1.2rem", fontStyle: "italic", color: "#1a1a1a", marginBottom: "0.5rem" },
  hint: { color: "#555", marginBottom: "1.5rem" },
  label: { display: "block", fontWeight: "500", marginBottom: "0.4rem" },
  textarea: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "1.5rem", boxSizing: "border-box", resize: "vertical",
  },
  input: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box",
  },
  prompts: { color: "#666", fontSize: "0.9rem", marginBottom: "2rem" },
  row: { display: "flex", gap: "1rem" },
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
