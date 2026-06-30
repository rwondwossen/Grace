import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import { submitJourneyToAirtable } from "../lib/airtable";
import Shell from "../components/Shell";

export default function Step7StayingTheCourse() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [beat, setBeat] = useState(1); // 1 | 2 | 3
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

  const canAdvanceBeat1 = journey.whatsClearer.trim() !== "" && journey.lookingForwardTo.trim() !== "";
  const canAdvanceBeat2 = journey.accountability.trim() !== "";

  if (status === "done") {
    return (
      <Shell title="You're done." accent="plum">
        <p style={styles.doneText}>
          Your Clarity Document is saved. Come back to it whenever you need a reminder of what
          you named and why it matters.
        </p>
        <button onClick={() => navigate("/step/6")} style={styles.next}>
          Back to your Clarity Document
        </button>
      </Shell>
    );
  }

  if (beat === 1) {
    return (
      <Shell
        title="How it feels now"
        accent="plum"
        footer={
          <>
            <button onClick={() => navigate("/step/6")} style={styles.back}>Back</button>
            <button
              onClick={() => setBeat(2)}
              disabled={!canAdvanceBeat1}
              style={{ ...styles.next, ...(!canAdvanceBeat1 ? styles.nextDisabled : {}) }}
            >
              Continue
            </button>
          </>
        }
      >
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
      </Shell>
    );
  }

  if (beat === 2) {
    return (
      <Shell
        title="When you drift"
        accent="plum"
        footer={
          <>
            <button onClick={() => setBeat(1)} style={styles.back}>Back</button>
            <button
              onClick={() => setBeat(3)}
              disabled={!canAdvanceBeat2}
              style={{ ...styles.next, ...(!canAdvanceBeat2 ? styles.nextDisabled : {}) }}
            >
              Continue
            </button>
          </>
        }
      >
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
      </Shell>
    );
  }

  return (
    <Shell
      title="You're not doing this alone"
      accent="plum"
      footer={
        <>
          <button onClick={() => setBeat(2)} style={styles.back}>Back</button>
          <button
            onClick={handleSubmit}
            disabled={status === "submitting"}
            style={{ ...styles.next, ...(status === "submitting" ? styles.nextDisabled : {}) }}
          >
            {status === "submitting" ? "Saving…" : "Complete your journey"}
          </button>
        </>
      }
    >
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
        value={journey.communityInterest}
        onChange={(e) => update({ communityInterest: e.target.value })}
        rows={3}
      />
      <p style={styles.boardNote}>
        And the visual board — the one you'd put on a wall — is coming. Your Clarity Document is
        what you'll build it from.
      </p>

      {status === "error" && (
        <p style={styles.error}>Something went wrong: {errorMsg}</p>
      )}
    </Shell>
  );
}

const styles = {
  beatCopy: { color: "var(--color-text)", opacity: 0.85, lineHeight: "1.7", marginBottom: "0.75rem" },
  label: { display: "block", fontWeight: 600, marginBottom: "0.4rem", color: "var(--color-text)" },
  textarea: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box", resize: "vertical", background: "#fff",
  },
  input: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "0.5rem", boxSizing: "border-box", background: "#fff",
  },
  boardNote: { fontSize: "0.9rem", color: "var(--color-text)", opacity: 0.6, fontStyle: "italic", marginTop: "0.75rem" },
  error: { color: "#c0392b", marginTop: "1rem" },
  back: {
    padding: "0.75rem 1.5rem", background: "var(--color-paper)", color: "var(--color-plum)",
    border: "1.5px solid var(--color-plum)", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  next: {
    padding: "0.75rem 2rem", background: "var(--color-plum)", color: "#fff",
    border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  nextDisabled: { background: "rgba(44,35,29,0.25)", cursor: "not-allowed" },
  doneText: { color: "var(--color-text)", opacity: 0.8, marginBottom: "2rem", lineHeight: "1.7" },
};
