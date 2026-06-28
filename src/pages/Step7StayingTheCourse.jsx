import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import { submitJourneyToAirtable } from "../lib/airtable";
import StepNav from "../components/StepNav";

export default function Step7StayingTheCourse() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [errorMsg, setErrorMsg] = useState("");

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

  const canSubmit =
    journey.releasing.trim() !== "" && journey.accountability.trim() !== "";

  if (status === "done") {
    return (
      <div style={styles.page}>
        <div style={styles.done}>
          <h2 style={styles.doneTitle}>You've done the work.</h2>
          <p style={styles.doneText}>
            Your Clarity Document has been saved. Go back to it whenever you need a reminder
            of what you named and why it matters.
          </p>
          <button onClick={() => navigate("/step/6")} style={styles.next}>
            View your Clarity Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <StepNav current={7} />
      <h2 style={styles.stepTitle}>Staying the Course</h2>
      <p style={styles.instruction}>
        Two final questions. These close the journey and build in the return.
      </p>

      <label style={styles.label}>What are you gently releasing this year?</label>
      <textarea
        style={styles.textarea}
        placeholder="A habit, a story, an expectation, a version of yourself that no longer serves you…"
        value={journey.releasing}
        onChange={(e) => update({ releasing: e.target.value })}
        rows={4}
      />

      <label style={styles.label}>
        Who in your life could hold you accountable simply by knowing what you named today?
      </label>
      <input
        style={styles.input}
        type="text"
        placeholder="A name is enough."
        value={journey.accountability}
        onChange={(e) => update({ accountability: e.target.value })}
      />

      {status === "error" && (
        <p style={styles.error}>Something went wrong: {errorMsg}</p>
      )}

      <div style={styles.row}>
        <button onClick={() => navigate("/step/6")} style={styles.back}>Back</button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || status === "submitting"}
          style={{ ...styles.next, ...(!canSubmit || status === "submitting" ? styles.nextDisabled : {}) }}
        >
          {status === "submitting" ? "Saving…" : "Complete your journey"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "640px", margin: "0 auto", padding: "2rem 1rem" },
  stepTitle: { fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" },
  instruction: { color: "#555", marginBottom: "2rem" },
  label: { display: "block", fontWeight: "500", marginBottom: "0.4rem" },
  textarea: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "1.5rem", boxSizing: "border-box", resize: "vertical",
  },
  input: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "2rem", boxSizing: "border-box",
  },
  error: { color: "#c0392b", marginBottom: "1rem" },
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
  done: { textAlign: "center", paddingTop: "4rem" },
  doneTitle: { fontSize: "1.75rem", fontWeight: "700", color: "#2d6a4f", marginBottom: "1rem" },
  doneText: { color: "#555", marginBottom: "2rem", lineHeight: "1.7" },
};
