import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import { fetchReflection } from "../lib/reflect";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";
import ReflectionResponse from "../components/ReflectionResponse";
import NorthStarWord from "../components/NorthStarWord";

export default function Step5GettingGranular() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();
  // phases: "intro1" | "intro2" | "domain" | "lookback" | "reflection"
  const [phase, setPhase] = useState("intro1");
  const [domainIndex, setDomainIndex] = useState(0);
  const [reflectionText, setReflectionText] = useState(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);

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

  const current = commitments[domainIndex] || { items: ["", "", ""] };
  const canAdvanceDomain = current.items[0].trim() !== "";
  const feeling = journey.northStarFeeling || "the feeling you named";
  const isLastDomain = domainIndex === activeDomains.length - 1;

  function handleDomainNext() {
    if (!isLastDomain) {
      setDomainIndex(domainIndex + 1);
    } else {
      setPhase("lookback");
    }
  }

  function handleDomainBack() {
    if (domainIndex > 0) {
      setDomainIndex(domainIndex - 1);
    } else {
      setPhase("intro2");
    }
  }

  if (phase === "reflection") {
    return (
      <Shell
        title="Getting Granular"
        footer={
          <>
            <button onClick={() => setPhase("lookback")} style={styles.back}>Back</button>
            <button onClick={() => navigate("/step/6")} style={styles.next}>Continue</button>
          </>
        }
      >
        <StepNav current={5} />
        <div style={styles.reflectionBox}>
          {reflectionLoading ? (
            <p style={styles.reflectionLoading}>Reading your commitments...</p>
          ) : reflectionText ? (
            <p style={styles.reflectionText}>{reflectionText}</p>
          ) : (
            <p style={styles.reflectionFallback}>
              Read back what you committed to. Do they address what you named?
            </p>
          )}
        </div>

        <ReflectionResponse
          resonance={journey.step5ReflectionResonance}
          note={journey.step5ReflectionNote}
          onResonance={(val) => update({ step5ReflectionResonance: val })}
          onNote={(val) => update({ step5ReflectionNote: val })}
          yesAck="No need to do anything with that yet. Just notice it."
        />
      </Shell>
    );
  }

  if (phase === "lookback") {
    return (
      <Shell
        title="Getting Granular"
        footer={
          <>
            <button
              onClick={() => { setDomainIndex(activeDomains.length - 1); setPhase("domain"); }}
              style={styles.back}
            >
              Back to editing
            </button>
            <button
              onClick={() => {
                setPhase("reflection");
                setReflectionLoading(true);
                fetchReflection("step5", {
                  northStarFeeling: journey.northStarFeeling,
                  domains: activeDomains.map((domain, i) => {
                    const diag = journey.coherenceDiagnostic[i] || {};
                    return {
                      domain,
                      gap: diag.gap,
                      barriers: diag.barriers,
                      barrierNotes: diag.barrierNotes,
                      commitments: (journey.commitments[i]?.items || []).filter((c) => c.trim()),
                    };
                  }),
                }).then((text) => {
                  setReflectionText(text);
                  setReflectionLoading(false);
                });
              }}
              style={styles.next}
            >
              Continue
            </button>
          </>
        }
      >
        <StepNav current={5} />
        <div style={styles.lookback}>
          <p style={styles.lookbackIntro}>
            Before this becomes your document, a moment to look back at what you've committed to.
          </p>
          <p style={styles.lookbackCopy}>
            The commitments that tend to stick share a few markers:
          </p>
          <ul style={styles.markerList}>
            <li>They pull toward feeling <NorthStarWord>{feeling}</NorthStarWord> and the life you're trying to tend.</li>
            <li>They're concrete enough that you'd know whether you'd done them.</li>
            <li>They're small enough to fit a real year.</li>
            <li>They matter enough to be worth the effort.</li>
          </ul>
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
      </Shell>
    );
  }

  if (phase === "domain") {
    const domain = activeDomains[domainIndex];
    return (
      <Shell
        title="Getting Granular"
        footer={
          <>
            <button onClick={handleDomainBack} style={styles.back}>Back</button>
            <button
              onClick={handleDomainNext}
              disabled={!canAdvanceDomain}
              style={{ ...styles.next, ...(!canAdvanceDomain ? styles.nextDisabled : {}) }}
            >
              {isLastDomain ? "Review before continuing" : "Next"}
            </button>
          </>
        }
      >
        <StepNav current={5} />
        <p style={styles.domainCount}>{domainIndex + 1} of {activeDomains.length}</p>
        <h3 style={styles.domainName}>{domain}</h3>
        {current.items.map((item, j) => (
          <input
            key={j}
            style={styles.input}
            type="text"
            placeholder={j === 0 ? "Commitment (required)" : `Commitment ${j + 1} (optional)`}
            value={item}
            onChange={(e) => setCommitment(domainIndex, j, e.target.value)}
          />
        ))}
        <p style={styles.helperText}>
          A good test: could someone who doesn't know you tell whether you'd done it?
        </p>
      </Shell>
    );
  }

  if (phase === "intro2") {
    return (
      <Shell
        title="Getting Granular"
        footer={
          <>
            <button onClick={() => setPhase("intro1")} style={styles.back}>Back</button>
            <button onClick={() => setPhase("domain")} style={styles.next}>Continue</button>
          </>
        }
      >
        <StepNav current={5} />
        <p style={styles.intro}>
          These are the areas you chose to focus on. For each one, what will you commit to this year,
          the small, concrete moves that build the year you're after?
        </p>

        <div style={styles.examples}>
          <p style={styles.examplesDefn}>
            A commitment is a small, concrete promise to yourself, something specific enough that
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
      </Shell>
    );
  }

  // intro1
  return (
    <Shell
      title="Getting Granular"
      footer={
        <>
          <button onClick={() => navigate("/step/4")} style={styles.back}>Back</button>
          <button onClick={() => setPhase("intro2")} style={styles.next}>Continue</button>
        </>
      }
    >
      <StepNav current={5} />
      <div style={styles.transition}>
        <p>
          You started this journey looking to foster a feeling. You named the areas of your life
          that would support it, and you've looked honestly at where things stand and what's
          getting in the way. That clarity is what makes everything next possible.{" "}
          <strong>Now you get to build, with focus, the year you actually want.</strong>
        </p>
        <p>
          The commitments you're about to make are how you do it, the real work of building that
          life one small move at a time. So picture this time next year, the version of you who has
          been tending to these areas. What are they doing differently?
        </p>
      </div>
    </Shell>
  );
}

const styles = {
  reflectionBox: {
    background: "rgba(94,15,61,0.04)",
    border: "1px solid rgba(94,15,61,0.18)",
    borderRadius: "6px",
    padding: "1.25rem 1.5rem",
    marginBottom: "1.5rem",
    minHeight: "4rem",
  },
  reflectionText: { color: "var(--color-text)", lineHeight: "1.8", margin: 0, fontStyle: "italic", fontSize: "1rem" },
  reflectionLoading: { color: "var(--color-text)", opacity: 0.45, fontStyle: "italic", margin: 0, fontSize: "0.95rem" },
  reflectionFallback: { color: "var(--color-text)", opacity: 0.6, fontStyle: "italic", margin: 0, fontSize: "0.95rem" },
  transition: {
    background: "rgba(228,74,36,0.06)",
    border: "1px solid rgba(228,74,36,0.2)",
    borderRadius: "6px",
    padding: "1.25rem",
    lineHeight: "1.7",
    fontSize: "1rem",
    color: "var(--color-text)",
  },
  intro: { color: "var(--color-text)", opacity: 0.8, marginBottom: "1.5rem", lineHeight: "1.6" },
  examples: {
    background: "rgba(228,74,36,0.06)",
    border: "1px solid rgba(228,74,36,0.2)",
    borderRadius: "6px",
    padding: "1rem 1.25rem",
  },
  examplesDefn: { marginBottom: "0.75rem", lineHeight: "1.6", fontSize: "0.95rem", color: "var(--color-text)" },
  examplesLabel: { fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--color-text)" },
  exampleList: {
    paddingLeft: "1.25rem",
    margin: "0 0 0.75rem",
    color: "var(--color-text)",
    opacity: 0.85,
    fontSize: "0.9rem",
    lineHeight: "1.8",
  },
  examplesClose: { color: "var(--color-text)", opacity: 0.7, fontSize: "0.9rem", margin: 0 },
  domainCount: { fontSize: "0.8rem", color: "var(--color-text)", opacity: 0.5, marginBottom: "0.4rem" },
  domainName: { fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 600, marginBottom: "1rem", color: "var(--color-accent-deep)" },
  input: {
    display: "block", width: "100%", padding: "0.65rem 0.75rem", fontSize: "0.95rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "0.6rem", boxSizing: "border-box", background: "#fff",
  },
  helperText: { fontSize: "0.82rem", color: "var(--color-text)", opacity: 0.55, margin: "0.25rem 0 0", fontStyle: "italic" },
  lookback: { marginBottom: "0.5rem" },
  lookbackIntro: { fontSize: "1.05rem", fontWeight: 600, marginBottom: "1rem", color: "var(--color-text)" },
  lookbackCopy: { color: "var(--color-text)", opacity: 0.85, lineHeight: "1.7", marginBottom: "0.5rem" },
  markerList: {
    margin: "0 0 0.75rem 1.25rem",
    padding: 0,
    color: "var(--color-text)",
    lineHeight: "1.9",
    fontSize: "0.95rem",
  },
  reviewBlock: {
    border: "1px solid rgba(228,74,36,0.2)",
    borderRadius: "6px",
    padding: "1rem 1.25rem",
    marginBottom: "1rem",
    background: "rgba(228,74,36,0.04)",
  },
  reviewDomain: { fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 600, color: "var(--color-accent-deep)", marginBottom: "0.6rem" },
  reviewInput: {
    display: "block", width: "100%", padding: "0.6rem 0.75rem", fontSize: "0.95rem",
    border: "1.5px solid rgba(44,35,29,0.25)", borderRadius: "4px",
    marginBottom: "0.5rem", boxSizing: "border-box", background: "#fff",
  },
  reviewInputEmpty: { borderColor: "rgba(44,35,29,0.12)", color: "rgba(44,35,29,0.4)" },
  placeholder: {
    background: "rgba(44,35,29,0.04)",
    border: "1.5px dashed rgba(44,35,29,0.3)",
    borderRadius: "6px",
    padding: "1.25rem",
    marginBottom: "0.5rem",
  },
  placeholderLabel: {
    display: "block", fontSize: "0.7rem", textTransform: "uppercase",
    letterSpacing: "0.08em", color: "var(--color-text)", opacity: 0.5, marginBottom: "0.5rem",
  },
  placeholderText: { color: "var(--color-text)", opacity: 0.7, fontStyle: "italic", margin: 0, lineHeight: "1.6" },
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
