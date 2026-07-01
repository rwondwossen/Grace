import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";

export default function Step2FeelingQuestion() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();

  const canAdvance = journey.northStarFeeling.trim() !== "";

  return (
    <Shell
      title="The Feeling Question"
      footer={
        <>
          <button onClick={() => navigate("/step/1")} style={styles.back}>Back</button>
          <button
            onClick={() => navigate("/step/3")}
            disabled={!canAdvance}
            style={{ ...styles.next, ...(canAdvance ? {} : styles.nextDisabled) }}
          >
            Continue
          </button>
        </>
      }
    >
      <StepNav current={2} />
      <p style={styles.instruction}>One year from now, I want to feel...</p>
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
        If you're stuck: what is the opposite of how you feel on your worst days?
        What would the people who love you most want for you?
      </p>
    </Shell>
  );
}

const styles = {
  instruction: { fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontStyle: "italic", color: "var(--color-text)", marginBottom: "0.5rem" },
  hint: { color: "var(--color-text)", opacity: 0.75, marginBottom: "1.5rem", lineHeight: "1.6" },
  label: { display: "block", fontWeight: 600, marginBottom: "0.4rem", color: "var(--color-text)" },
  textarea: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "1.5rem", boxSizing: "border-box", resize: "vertical", background: "#fff",
  },
  input: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box", background: "#fff",
  },
  prompts: { color: "var(--color-text)", opacity: 0.65, fontSize: "0.9rem", marginBottom: "0.5rem", lineHeight: "1.6" },
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
