import { useNavigate } from "react-router-dom";
import { useJourney } from "../context/JourneyContext";
import Shell from "../components/Shell";
import StepNav from "../components/StepNav";

export default function Step7ClarityDocument() {
  const { journey } = useJourney();
  const navigate = useNavigate();

  const activeDomains = journey.domains.filter((d) => d.trim() !== "");

  function handlePrint() {
    window.print();
  }

  return (
    <Shell
      title="Your Clarity Document"
      footer={
        <>
          <button onClick={() => navigate("/step/6")} style={styles.back}>Back</button>
          <button onClick={handlePrint} style={styles.print}>Print / Save as PDF</button>
          <button onClick={() => navigate("/step/8")} style={styles.next}>Continue</button>
        </>
      }
    >
      <StepNav current={7} />
      <p style={styles.instruction}>
        Everything you've named, in one place. Save it, print it, return to it.
      </p>
      <p style={styles.leadIn}>
        One more thing before you go: take a moment to read what you've put here.
        This is the document you'll come back to.
      </p>

      <div style={styles.doc} id="clarity-doc">
        <div style={styles.northStar}>
          <div style={styles.nsLabel}>One year from now, I want to feel</div>
          <div style={styles.nsWord}>{journey.northStarFeeling || "—"}</div>
        </div>

        {activeDomains.map((domain, i) => {
          const diag = journey.coherenceDiagnostic[i] || {};
          const comms = journey.commitments[i]?.items?.filter((c) => c.trim() !== "") || [];
          return (
            <div key={i} style={styles.domainSection}>
              <h3 style={styles.domainTitle}>{domain}</h3>
              <div style={styles.diagBlock}>
                <div style={styles.diagLabel}>What it looks like now</div>
                <p style={styles.diagText}>{diag.gap || "—"}</p>
                <div style={styles.diagLabel}>What's been standing in the way</div>
                <p style={styles.diagText}>
                  {(diag.barriers && diag.barriers.length > 0 ? diag.barriers.join(", ") : "") ||
                    diag.barrierNotes ||
                    "—"}
                </p>
              </div>
              {comms.length > 0 && (
                <div style={styles.commitBlock}>
                  <div style={styles.commitLabel}>Commitments</div>
                  <ul style={styles.commitList}>
                    {comms.map((c, j) => <li key={j}>{c}</li>)}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

const styles = {
  instruction: { color: "var(--color-text)", opacity: 0.75, marginBottom: "0.75rem", lineHeight: "1.6" },
  leadIn: { color: "var(--color-text)", opacity: 0.85, marginBottom: "1.5rem", lineHeight: "1.6", fontStyle: "italic" },
  doc: {
    border: "1px solid rgba(94,15,61,0.2)", borderRadius: "8px",
    padding: "2rem", marginBottom: "0.5rem", background: "rgba(94,15,61,0.04)",
  },
  northStar: { textAlign: "center", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(94,15,61,0.2)" },
  nsLabel: { fontSize: "0.85rem", color: "var(--color-text)", opacity: 0.6, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" },
  nsWord: { fontFamily: "var(--font-serif)", fontSize: "2.1rem", fontWeight: 600, color: "var(--color-gold)" },
  domainSection: { marginBottom: "1.75rem", paddingBottom: "1.75rem", borderBottom: "1px solid rgba(94,15,61,0.12)" },
  domainTitle: { fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.75rem" },
  diagBlock: { marginBottom: "0.75rem" },
  diagLabel: { fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text)", opacity: 0.55, marginBottom: "0.2rem" },
  diagText: { margin: "0 0 0.75rem", color: "var(--color-text)" },
  commitBlock: {},
  commitLabel: { fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text)", opacity: 0.55, marginBottom: "0.4rem" },
  commitList: { margin: 0, paddingLeft: "1.25rem", color: "var(--color-text)" },
  back: {
    padding: "0.75rem 1.5rem", background: "var(--color-paper)", color: "var(--color-accent-deep)",
    border: "1.5px solid var(--color-accent)", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  print: {
    padding: "0.75rem 1.5rem", background: "var(--color-paper)", color: "var(--color-accent-deep)",
    border: "1.5px solid var(--color-accent)", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
  next: {
    padding: "0.75rem 2rem", background: "var(--color-plum)", color: "#fff",
    border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
  },
};
