import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";

const STEPS = [
  "Provocation — a set of powerful quotes to reflect on, to get your ideation going",
  "The Feeling Question — one year from now, what do you want to feel",
  "The Buckets — the categories of life that will support that feeling",
  "The Coherence Diagnostic — the gap between what you want and where you actually stand",
  "Getting Granular — planning the details",
  "Planning for the Drift — life happens, plan for the setback",
  "The Clarity Doc — the culmination of your work",
  "Closing Reflection",
];

export default function Intro() {
  const navigate = useNavigate();

  return (
    <Shell
      title="Grace"
      footer={
        <button onClick={() => navigate("/step/1")} style={styles.next}>
          Begin
        </button>
      }
    >
      <p style={styles.eyebrow}>Grace is early.</p>
      <p style={styles.lead}>
        Most people spend more time planning a vacation than they spend on the year itself.
        Grace is an hour to do something different.
      </p>

      <ul style={styles.stepList}>
        {STEPS.map((step, i) => (
          <li key={i} style={styles.stepItem}>
            <span style={styles.check}>&#10003;</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>

      <p style={styles.coda}>
        At the end, you'll have a document worth putting on a wall, something to return to
        when things get noisy, to remind yourself what you decided mattered.
      </p>
    </Shell>
  );
}

const styles = {
  eyebrow: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-text)",
    opacity: 0.45,
    marginBottom: "0.75rem",
  },
  lead: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.15rem",
    lineHeight: "1.7",
    color: "var(--color-text)",
    marginBottom: "1.75rem",
    fontStyle: "italic",
  },
  stepList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 1.75rem",
  },
  stepItem: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.6rem",
    color: "var(--color-text)",
    fontSize: "0.95rem",
    lineHeight: "1.7",
    opacity: 0.85,
  },
  check: {
    color: "var(--color-accent)",
    flexShrink: 0,
    fontSize: "0.85rem",
  },
  coda: {
    color: "var(--color-text)",
    lineHeight: "1.7",
    opacity: 0.65,
    fontSize: "0.95rem",
    fontStyle: "italic",
  },
  next: {
    padding: "0.75rem 2.5rem",
    background: "var(--color-plum)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
