import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import { submitJourneyToAirtable } from "../lib/airtable";

export default function Step7StayingTheCourse() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [errorMsg, setErrorMsg] = useState("");

  const feeling = journey.northStarFeeling || "the feeling you named";

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
    journey.whatsClearer.trim() !== "" &&
    journey.lookingForwardTo.trim() !== "" &&
    journey.accountability.trim() !== "";

  if (status === "done") {
    return (
      <div style={styles.page}>
        <div style={styles.done}>
          <h2 style={styles.doneTitle}>You're done.</h2>
          <p style={styles.doneText}>
            Your Clarity Document is saved. Come back to it whenever you need a reminder of what
            you named and why it matters.
          </p>
          <button onClick={() => navigate("/step/6")} style={styles.next}>
            Back to your Clarity Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.beat}>
        <h2 style={styles.beatTitle}>How it feels now</h2>
        <p style={styles.beatCopy}>
          You came in wanting to feel <strong>{feeling}</strong>. You've named where it lives,
          looked honestly at what's in the way, and made your commitments. That's the work most
          people never sit down to do.
        </p>
        <p style={styles.beatCopy}>
          So, having done it, what's clearer than it was an hour ago? And what are you most
          looking forward to?
        </p>
        <label style={styles.label}>What's clearer now</label>
        <textarea
          style={styles.textarea}
          placeholder=""
          value={journey.whatsClearer}
          onChange={(e) => update({ whatsClearer: e.target.value })}
          rows={3}
        />
        <label style={styles.label}>What you're most looking forward to</label>
        <textarea
          style={styles.textarea}
          placeholder=""
          value={journey.lookingForwardTo}
          onChange={(e) => update({ lookingForwardTo: e.target.value })}
          rows={3}
        />
      </div>

      <div style={styles.beat}>
        <h2 style={styles.beatTitle}>When you drift</h2>
        <p style={styles.beatCopy}>
          Here's the part no one tells you: you'll fall off. Not might, will. A week goes sideways,
          a commitment slides, and the whole thing feels far away. That's not failure. That's every
          person who's ever set out to change something.
        </p>
        <p style={styles.beatCopy}>
          What matters isn't staying perfect. It's having a way back. So: who in your life could
          you tell what you named today — someone who'd help you find your way back when you drift?
        </p>
        <label style={styles.label}>Someone who could help you find your way back</label>
        <input
          style={styles.input}
          type="text"
          placeholder="A name is enough."
          value={journey.accountability}
          onChange={(e) => update({ accountability: e.target.value })}
        />
      </div>

      <div style={styles.beat}>
        <h2 style={styles.beatTitle}>You're not doing this alone</h2>
        <p style={styles.beatCopy}>
          You've just done something a lot of other people are doing too — sitting down to build a
          year on purpose. You're in good company.
        </p>
        <p style={styles.beatCopy}>
          We're building ways for people who've been through Grace to support each other — sharing
          what you named, small groups, places to check in. What would actually help you stay close
          to this?
        </p>
        <label style={styles.label}>What would help (optional)</label>
        <textarea
          style={styles.textarea}
          placeholder=""
          value={journey.communityInterest}
          onChange={(e) => update({ communityInterest: e.target.value })}
          rows={3}
        />
        <p style={styles.boardNote}>
          And the visual board — the one you'd put on a wall — is coming. Your Clarity Document is
          what you'll build it from.
        </p>
      </div>

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
  beat: {
    borderBottom: "1px solid #e8e8e8",
    paddingBottom: "2rem",
    marginBottom: "2rem",
  },
  beatTitle: { fontSize: "1.3rem", fontWeight: "600", marginBottom: "1rem", color: "#1a1a1a" },
  beatCopy: { color: "#444", lineHeight: "1.7", marginBottom: "0.75rem" },
  label: { display: "block", fontWeight: "500", marginBottom: "0.4rem" },
  textarea: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box", resize: "vertical",
  },
  input: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "0.5rem", boxSizing: "border-box",
  },
  boardNote: { fontSize: "0.9rem", color: "#888", fontStyle: "italic", marginTop: "0.75rem" },
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
