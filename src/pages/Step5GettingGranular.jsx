import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import StepNav from "../components/StepNav";
import ReflectionResponse from "../components/ReflectionResponse";

export default function Step5GettingGranular() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("commit"); // "commit" | "lookback"

  const activeDomains = (journey.domains.length > 0 ? journey.domains : journey.allDomains).filter(
    (d) => d.trim() !== ""
  );

  const commitments = activeDomains.map((_, i) =>
    journey.commitments[i] || { items: ["", "", ""] }
  );

  function setCommitment(domainIdx, itemIdx, val) {
    const next = commitments.map((c) => ({ ...c, items: [...c.items] }));
    next[domainIdx].items[itemIdx] = val;
    update({ commitments: next });
  }

  const canAdvanceCommit = commitments.every((c) => c.items[0].trim() !== "");
  const canAdvanceLookback = true;
  const feeling = journey.northStarFeeling || "the feeling you named";

  if (phase === "lookback") {
    return (
      <div style={styles.page}>
        <StepNav current={5} />
        <h2 style={styles.stepTitle}>Getting Granular</h2>

        <div style={styles.lookback}>
          <p style={styles.lookbackIntro}>
            Before this becomes your document, a moment to look back at what you've committed to.
          </p>
          <p style={styles.lookbackCopy}>
            The commitments that tend to stick share a few markers. They pull toward feeling{" "}
            <strong>{feeling}</strong> and the life you're trying to tend. They're concrete enough
            that you'd know whether you'd done them. They're small enough to fit a real year, and
            they matter enough to be worth the effort.
          </p>
          <p style={styles.lookbackCopy}>
            Read yours back with that in mind. Edit anything you'd like to, or carry them forward as
            they are.
          </p>

          {activeDomains.map((domain, i) => {
            const filled = commitments[i].items.filter((c) => c.trim() !== "");
            return (
              <div key={i} style={styles.reviewBlock}>
                <h3 style={styles.reviewDomain}>{domain}</h3>
                {commitments[i].items.map((item, j) => (
                  <input
                    key={j}
                    style={{
                      ...styles.reviewInput,
                      ...(j > 0 && !item && filled.length < j + 1 ? styles.reviewInputEmpty : {}),
                    }}
                    type="text"
                    placeholder={j === 0 ? "Commitment (required)" : `Commitment ${j + 1} (optional)`}
                    value={item}
                    onChange={(e) => setCommitment(i, j, e.target.value)}
                  />
                ))}
              </div>
            );
          })}
        </div>

        <div style={styles.placeholder}>
          <span style={styles.placeholderLabel}>AI reflection placeholder</span>
          <p style={styles.placeholderText}>
            [AI reflection appears here — does what the user committed to actually address what
            they diagnosed? One to two sentences per domain. One closing sentence specific to
            this person. Honest, not a cheerleader.]
          </p>
        </div>

        <ReflectionResponse
          resonance={journey.step5ReflectionResonance}
          note={journey.step5ReflectionNote}
          onResonance={(val) => update({ step5ReflectionResonance: val })}
          onNote={(val) => update({ step5ReflectionNote: val })}
        />

        <div style={styles.row}>
          <button onClick={() => setPhase("commit")} style={styles.back}>Back to editing</button>
          <button
            onClick={() => navigate("/step/6")}
            disabled={!canAdvanceLookback}
            style={{ ...styles.next, ...(!canAdvanceLookback ? styles.nextDisabled : {}) }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <StepNav current={5} />

      <div style={styles.transition}>
        <p>
          You started this journey looking to foster a feeling. You named the areas of your life
          that would support it, and you've looked honestly at where things stand and what's
          getting in the way. That clarity is what makes everything next possible.{" "}
          <strong>Now you get to build, with focus, the life you actually want.</strong>
        </p>
        <p>
          The commitments you're about to make are how you do it, the real work of building that
          life one small move at a time. So picture this time next year, the version of you who has
          been tending to these areas. What are they doing differently?
        </p>
      </div>

      <h2 style={styles.stepTitle}>Getting Granular</h2>
      <p style={styles.intro}>
        These are the areas you chose to focus on. For each one, what will you commit to this year,
        the small, concrete moves that build the life you're after?
      </p>

      <div style={styles.examples}>
        <p style={styles.examplesDefn}>
          A commitment is a small, concrete promise to yourself — something specific enough that
          someone who doesn't know you could tell whether you'd done it. Aim for one to three per
          area, ambitious enough to matter and kind enough to fit the life you actually have.
        </p>
        <p style={styles.examplesLabel}>A few examples, to give you the feel:</p>
        <ul style={styles.exampleList}>
          <li>Sign up for one drawing class a month and share my sketches with my family.</li>
          <li>Go to the gym twice a week, forty weeks this year.</li>
          <li>Call my sister every Sunday, even when there's nothing to report.</li>
          <li>No screens for the first hour after I wake up, starting now.</li>
        </ul>
        <p style={styles.examplesClose}>
          Different shapes, same idea: each one is specific enough that you'd know if you did it,
          and built for a real year, not a perfect one.
        </p>
      </div>

      {activeDomains.map((domain, i) => (
        <div key={i} style={styles.domainBlock}>
          <h3 style={styles.domainName}>{domain}</h3>
          {commitments[i].items.map((item, j) => (
            <input
              key={j}
              style={styles.input}
              type="text"
              placeholder={j === 0 ? "Commitment (required)" : `Commitment ${j + 1} (optional)`}
              value={item}
              onChange={(e) => setCommitment(i, j, e.target.value)}
            />
          ))}
          <p style={styles.helperText}>
            A good test: could someone who doesn't know you tell whether you'd done it?
          </p>
        </div>
      ))}

      <div style={styles.row}>
        <button onClick={() => navigate("/step/4")} style={styles.back}>Back</button>
        <button
          onClick={() => setPhase("lookback")}
          disabled={!canAdvanceCommit}
          style={{ ...styles.next, ...(!canAdvanceCommit ? styles.nextDisabled : {}) }}
        >
          Review before continuing
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "640px", margin: "0 auto", padding: "2rem 1rem" },
  transition: {
    background: "#f9fdf9",
    border: "1px solid #d8e8df",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "1.75rem",
    lineHeight: "1.7",
    fontSize: "1rem",
  },
  stepTitle: { fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" },
  intro: { color: "#444", marginBottom: "1.5rem", lineHeight: "1.6" },
  examples: {
    background: "#f9fdf9",
    border: "1px solid #d8e8df",
    borderRadius: "6px",
    padding: "1rem 1.25rem",
    marginBottom: "2rem",
  },
  examplesDefn: { marginBottom: "0.75rem", lineHeight: "1.6", fontSize: "0.95rem" },
  examplesLabel: { fontWeight: "500", marginBottom: "0.5rem", fontSize: "0.9rem" },
  exampleList: {
    paddingLeft: "1.25rem",
    margin: "0 0 0.75rem",
    color: "#444",
    fontSize: "0.9rem",
    lineHeight: "1.8",
  },
  examplesClose: { color: "#555", fontSize: "0.9rem", margin: 0 },
  domainBlock: {
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "1.5rem",
  },
  domainName: { fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.75rem", color: "#2d6a4f" },
  input: {
    display: "block", width: "100%", padding: "0.65rem 0.75rem", fontSize: "0.95rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "0.6rem", boxSizing: "border-box",
  },
  helperText: { fontSize: "0.82rem", color: "#888", margin: "0.25rem 0 0", fontStyle: "italic" },
  lookback: { marginBottom: "1.5rem" },
  lookbackIntro: { fontSize: "1.05rem", fontWeight: "500", marginBottom: "1rem" },
  lookbackCopy: { color: "#444", lineHeight: "1.7", marginBottom: "0.75rem" },
  reviewBlock: {
    border: "1px solid #d8e8df",
    borderRadius: "6px",
    padding: "1rem 1.25rem",
    marginBottom: "1rem",
    background: "#fafff9",
  },
  reviewDomain: { fontSize: "1rem", fontWeight: "600", color: "#2d6a4f", marginBottom: "0.6rem" },
  reviewInput: {
    display: "block", width: "100%", padding: "0.6rem 0.75rem", fontSize: "0.95rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "0.5rem", boxSizing: "border-box",
    background: "white",
  },
  reviewInputEmpty: { borderColor: "#eee", color: "#bbb" },
  placeholder: {
    background: "#f5f5f5",
    border: "1.5px dashed #bbb",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "0.5rem",
  },
  placeholderLabel: {
    display: "block",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#999",
    marginBottom: "0.5rem",
  },
  placeholderText: { color: "#888", fontStyle: "italic", margin: 0, lineHeight: "1.6" },
  row: { display: "flex", gap: "1rem", marginTop: "1.5rem" },
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
