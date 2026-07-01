import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import { submitJourneyToAirtable } from "../lib/airtable";
import Shell from "../components/Shell";

const DRIFT_CHIPS = [
  "Telling someone specific",
  "Checking in with yourself regularly",
  "A monthly nudge",
  "A group of people doing this too",
  "Something else",
];

const COMMUNITY_CHIPS = [
  "A small group with others who've been through Grace",
  "A place to share what I named with others",
  "A periodic check-in from Grace itself",
  "Seeing what others have committed to",
  "Something else",
];

export default function Step7StayingTheCourse() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [beat, setBeat] = useState(1);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const feeling = journey.northStarFeeling || "the feeling you named";

  function toggleChip(field, chip) {
    const current = journey[field] || [];
    const next = current.includes(chip) ? current.filter((c) => c !== chip) : [...current, chip];
    update({ [field]: next });
  }

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
  const canAdvanceBeat2 = journey.driftCommitment.trim() !== "";

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
          You came in wanting to feel <strong style={{ color: "var(--color-plum)", fontFamily: "var(--font-serif)" }}>{feeling}</strong>. You've named where it lives,
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
          What matters isn't staying perfect. It's having a way back. Different things work for
          different people. What sounds like something you'd actually use?
        </p>

        <div style={styles.chips}>
          {DRIFT_CHIPS.map((chip) => {
            const selected = (journey.driftChips || []).includes(chip);
            return (
              <button
                key={chip}
                onClick={() => toggleChip("driftChips", chip)}
                style={{ ...styles.chip, ...(selected ? styles.chipSelected : {}) }}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <label style={styles.label}>
          Of those, which one will you actually commit to? Turn that into one specific
          commitment — a name, a day, a place you'll check in.
        </label>
        <textarea
          style={styles.textarea}
          placeholder=""
          value={journey.driftCommitment}
          onChange={(e) => update({ driftCommitment: e.target.value })}
          rows={3}
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
        We're building ways for people who've been through Grace to support each other. What sounds
        like it would actually help?
      </p>

      <div style={styles.chips}>
        {COMMUNITY_CHIPS.map((chip) => {
          const selected = (journey.communityChips || []).includes(chip);
          return (
            <button
              key={chip}
              onClick={() => toggleChip("communityChips", chip)}
              style={{ ...styles.chip, ...(selected ? styles.chipSelected : {}) }}
            >
              {chip}
            </button>
          );
        })}
      </div>

      <label style={styles.notesLabel}>Anything else?</label>
      <textarea
        style={styles.notesField}
        placeholder="Any texture the options above don't capture…"
        value={journey.communityNote}
        onChange={(e) => update({ communityNote: e.target.value })}
        rows={2}
      />

      <p style={styles.boardNote}>
        One more thing worth knowing: the visual board itself, the one you'd put on a wall, isn't
        part of Grace yet. Your Clarity Document is what you'll build it from when it arrives.
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
  notesLabel: { display: "block", fontSize: "0.9rem", color: "var(--color-text)", opacity: 0.75, marginBottom: "0.35rem" },
  textarea: {
    width: "100%", padding: "0.75rem", fontSize: "1rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box", resize: "vertical", background: "#fff",
  },
  notesField: {
    width: "100%", padding: "0.6rem", fontSize: "0.9rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "1rem", boxSizing: "border-box", resize: "vertical", background: "#fff",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" },
  chip: {
    padding: "0.45rem 1rem",
    border: "1.5px solid var(--color-plum)",
    borderRadius: "4px",
    background: "var(--color-paper)",
    color: "var(--color-plum)",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  chipSelected: { background: "var(--color-plum)", color: "#fff" },
  boardNote: {
    color: "var(--color-text)",
    opacity: 0.8,
    lineHeight: "1.6",
    marginTop: "1rem",
    marginBottom: "0.5rem",
    padding: "0.75rem 1rem",
    background: "rgba(94,15,61,0.06)",
    borderRadius: "6px",
    fontSize: "0.95rem",
  },
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
