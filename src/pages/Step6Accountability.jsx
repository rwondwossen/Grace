import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";

const DRIFT_CHIPS = [
  "Telling someone specific",
  "Checking in with yourself regularly",
  "A monthly nudge",
  "A group of people doing this too",
  "Something else",
];

export default function Step6Accountability() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();

  const canAdvance = journey.driftCommitment.trim() !== "";

  function selectChip(chip) {
    update({ driftChip: chip });
  }

  return (
    <Shell
      title="When you drift"
      footer={
        <>
          <button onClick={() => navigate("/step/5")} style={styles.back}>Back</button>
          <button
            onClick={() => navigate("/step/7")}
            disabled={!canAdvance}
            style={{ ...styles.next, ...(!canAdvance ? styles.nextDisabled : {}) }}
          >
            Continue
          </button>
        </>
      }
    >
      <StepNav current={6} />
      <p style={styles.copy}>
        Here's the part no one tells you: you'll fall off. Not might, will. A week goes sideways,
        a commitment slides, and the whole thing feels far away. That's not failure. That's every
        person who's ever set out to change something.
      </p>
      <p style={styles.copy}>
        What matters isn't staying perfect. It's having a way back. Different things work for
        different people. What sounds like something you'd actually use?
      </p>

      <div style={styles.chips}>
        {DRIFT_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => selectChip(chip)}
            style={{ ...styles.chip, ...(journey.driftChip === chip ? styles.chipSelected : {}) }}
          >
            {chip}
          </button>
        ))}
      </div>

      <label style={styles.label}>
        Turn that into one specific commitment: a name, a day, a place you'll check in.
      </label>
      <textarea
        style={styles.textarea}
        value={journey.driftCommitment}
        onChange={(e) => update({ driftCommitment: e.target.value })}
        rows={3}
      />
    </Shell>
  );
}

const styles = {
  copy: { color: "var(--color-text)", opacity: 0.85, lineHeight: "1.7", marginBottom: "0.75rem" },
  chips: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" },
  chip: {
    padding: "0.45rem 1rem",
    border: "1.5px solid var(--color-accent)",
    borderRadius: "4px",
    background: "var(--color-paper)",
    color: "var(--color-accent-deep)",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  chipSelected: { background: "var(--color-accent)", color: "#fff" },
  label: { display: "block", fontWeight: 600, marginBottom: "0.4rem", color: "var(--color-text)" },
  textarea: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box", resize: "vertical", background: "#fff",
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
