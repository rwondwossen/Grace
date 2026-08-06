import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";

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
      <p style={styles.lead}>
        Most people spend more time planning a vacation than they spend on the year itself.
        Grace is an hour to do something different.
      </p>
      <p style={styles.body}>
        You'll start with a single question: one year from now, what do you want to feel?
        Not what you want to achieve. What you want to feel. From there, you'll name the
        areas of your life that would most support that feeling, look honestly at where
        things actually stand, and make a small set of commitments that are real enough
        to keep.
      </p>
      <p style={styles.body}>
        At the end, you'll have a Clarity Document. One page. Everything you named, in
        one place. Something to put on a wall, return to when things get noisy, and use
        to remind yourself what you decided mattered.
      </p>
      <p style={styles.coda}>
        You don't need to have it figured out. That's the point of doing this.
      </p>
    </Shell>
  );
}

const styles = {
  lead: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.2rem",
    lineHeight: "1.7",
    color: "var(--color-text)",
    marginBottom: "1.5rem",
    fontStyle: "italic",
  },
  body: {
    color: "var(--color-text)",
    lineHeight: "1.8",
    marginBottom: "1.25rem",
    fontSize: "1rem",
    opacity: 0.9,
  },
  coda: {
    color: "var(--color-text)",
    lineHeight: "1.7",
    opacity: 0.65,
    fontSize: "0.95rem",
    marginTop: "0.5rem",
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
