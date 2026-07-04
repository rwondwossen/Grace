import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import { submitJourneyToAirtable } from "../lib/airtable";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";

export default function Step8ClosingReflection() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const feeling = journey.northStarFeeling || "the feeling you named";
  const canSubmit = journey.whatsClearer.trim() !== "" && journey.lookingForwardTo.trim() !== "";

  async function handleSubmit() {
    setStatus("submitting");
    try {
      await submitJourneyToAirtable(journey);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <Shell title="You're done.">
        <p style={styles.doneText}>
          Your Clarity Document is saved. Come back to it whenever you need a reminder of what
          you named and why it matters.
        </p>
        <button onClick={() => navigate("/step/7")} style={styles.next}>
          Back to your Clarity Document
        </button>
      </Shell>
    );
  }

  return (
    <Shell
      title="How it feels now"
      footer={
        <>
          <button onClick={() => navigate("/step/7")} style={styles.back}>Back</button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || status === "submitting"}
            style={{ ...styles.next, ...(!canSubmit || status === "submitting" ? styles.nextDisabled : {}) }}
          >
            {status === "submitting" ? "Saving…" : "Complete your journey"}
          </button>
        </>
      }
    >
      <StepNav current={8} />
      <p style={styles.copy}>
        You came in wanting to feel <strong style={styles.feelingWord}>{feeling}</strong>. You've named where it lives,
        looked honestly at what's in the way, and made your commitments. That's the work most
        people never sit down to do.
      </p>
      <p style={styles.copy}>
        So, having done it, what's clearer than it was an hour ago? And what are you most
        looking forward to?
      </p>

      <label style={styles.label}>What's clearer now</label>
      <textarea
        style={styles.textarea}
        value={journey.whatsClearer}
        onChange={(e) => update({ whatsClearer: e.target.value })}
        rows={3}
      />

      <label style={styles.label}>What you're most looking forward to</label>
      <textarea
        style={styles.textarea}
        value={journey.lookingForwardTo}
        onChange={(e) => update({ lookingForwardTo: e.target.value })}
        rows={3}
      />

      <div style={styles.closingNote}>
        <p style={styles.closingP}>
          You named what you want to feel. You looked honestly at what's in the way.
          You made commitments. Keep returning to your Clarity Document.
          Every time you do, the wins compound.
        </p>
        <button onClick={() => navigate("/step/7")} style={styles.printLink}>
          Print or save your Clarity Document
        </button>
      </div>

      {status === "error" && (
        <p style={styles.error}>Something went wrong: {errorMsg}</p>
      )}
    </Shell>
  );
}

const styles = {
  copy: { color: "var(--color-text)", opacity: 0.85, lineHeight: "1.7", marginBottom: "0.75rem" },
  feelingWord: { color: "var(--color-plum)", fontFamily: "var(--font-serif)" },
  label: { display: "block", fontWeight: 600, marginBottom: "0.4rem", color: "var(--color-text)" },
  textarea: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box", resize: "vertical", background: "#fff",
  },
  closingNote: {
    marginTop: "1rem",
    marginBottom: "0.5rem",
    padding: "1rem 1.25rem",
    background: "rgba(228,74,36,0.06)",
    borderRadius: "6px",
  },
  closingP: {
    color: "var(--color-text)",
    lineHeight: "1.7",
    marginBottom: "0.75rem",
    fontSize: "0.95rem",
  },
  printLink: {
    background: "none",
    border: "none",
    padding: 0,
    color: "var(--color-accent-deep)",
    cursor: "pointer",
    fontSize: "0.9rem",
    textDecoration: "underline",
  },
  error: { color: "#c0392b", marginTop: "1rem" },
  back: {
    padding: "0.75rem 1.5rem", background: "var(--color-paper)", color: "var(--color-accent-deep)",
    border: "1.5px solid var(--color-accent)", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  next: {
    padding: "0.75rem 2rem", background: "var(--color-plum)", color: "#fff",
    border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  nextDisabled: { background: "rgba(44,35,29,0.25)", cursor: "not-allowed" },
  doneText: { color: "var(--color-text)", opacity: 0.8, marginBottom: "2rem", lineHeight: "1.7" },
};
