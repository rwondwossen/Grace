export default function ReflectionResponse({ resonance, note, onResonance, onNote }) {
  return (
    <div style={styles.wrapper}>
      <p style={styles.question}>Does this resonate?</p>
      <div style={styles.buttons}>
        <button
          onClick={() => onResonance("yes")}
          style={{ ...styles.btn, ...(resonance === "yes" ? styles.btnSelected : {}) }}
        >
          Yes
        </button>
        <button
          onClick={() => onResonance("no")}
          style={{ ...styles.btn, ...(resonance === "no" ? styles.btnSelected : {}) }}
        >
          No
        </button>
      </div>

      {resonance === "yes" && (
        <p style={styles.ack}>Good. Carry that with you.</p>
      )}

      {resonance === "no" && (
        <div style={styles.noPath}>
          <p style={styles.noText}>
            Thank you for the honesty. Let's carry that with us and see what comes into focus as we go.
          </p>
          <textarea
            style={styles.textarea}
            placeholder="What felt off, or what would you say instead? (optional)"
            value={note}
            onChange={(e) => onNote(e.target.value)}
            rows={3}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    borderTop: "1px solid #e8e8e8",
    paddingTop: "1.5rem",
    marginTop: "1.5rem",
  },
  question: { fontWeight: "500", marginBottom: "0.75rem" },
  buttons: { display: "flex", gap: "0.75rem", marginBottom: "1rem" },
  btn: {
    padding: "0.55rem 1.5rem",
    border: "1.5px solid #2d6a4f",
    borderRadius: "4px",
    background: "white",
    color: "#2d6a4f",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  btnSelected: { background: "#2d6a4f", color: "white" },
  ack: { color: "#555", fontStyle: "italic" },
  noPath: {},
  noText: { color: "#555", marginBottom: "0.75rem" },
  textarea: {
    width: "100%",
    padding: "0.65rem",
    fontSize: "0.95rem",
    border: "1.5px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    resize: "vertical",
  },
};
