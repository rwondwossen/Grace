import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import StepNav from "../components/StepNav";

export default function Step5GettingGranular() {
  const { journey, update } = useJourney();
  const navigate = useNavigate();

  const activeDomains = journey.domains.filter((d) => d.trim() !== "");

  const commitments = activeDomains.map((_, i) =>
    journey.commitments[i] || { items: ["", "", ""] }
  );

  function setCommitment(domainIdx, itemIdx, val) {
    const next = commitments.map((c) => ({ ...c, items: [...c.items] }));
    next[domainIdx].items[itemIdx] = val;
    update({ commitments: next });
  }

  const canAdvance = commitments.every((c) => c.items[0].trim() !== "");

  return (
    <div style={styles.page}>
      <StepNav current={5} />
      <h2 style={styles.stepTitle}>Getting Granular</h2>
      <p style={styles.instruction}>
        For each domain, set one to three specific, observable, time-bound commitments.
        Be ambitious but kind to your actual life.
      </p>

      {activeDomains.map((domain, i) => (
        <div key={i} style={styles.domainBlock}>
          <h3 style={styles.domainName}>{domain}</h3>
          <p style={styles.sentence}>
            I will feel more <em>{journey.northStarFeeling || "___"}</em> in my{" "}
            <em>{domain}</em> life by:
          </p>
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
        </div>
      ))}

      <div style={styles.row}>
        <button onClick={() => navigate("/step/4")} style={styles.back}>Back</button>
        <button
          onClick={() => navigate("/step/6")}
          disabled={!canAdvance}
          style={{ ...styles.next, ...(canAdvance ? {} : styles.nextDisabled) }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "640px", margin: "0 auto", padding: "2rem 1rem" },
  stepTitle: { fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" },
  instruction: { color: "#555", marginBottom: "2rem" },
  domainBlock: {
    border: "1px solid #e0e0e0", borderRadius: "6px",
    padding: "1.25rem", marginBottom: "1.5rem",
  },
  domainName: { fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2d6a4f" },
  sentence: { color: "#555", marginBottom: "0.75rem", fontStyle: "italic" },
  input: {
    display: "block", width: "100%", padding: "0.65rem 0.75rem", fontSize: "0.95rem",
    border: "1.5px solid #ccc", borderRadius: "4px",
    marginBottom: "0.6rem", boxSizing: "border-box",
  },
  row: { display: "flex", gap: "1rem", marginTop: "0.5rem" },
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
