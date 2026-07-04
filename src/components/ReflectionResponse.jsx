export default function ReflectionResponse({ resonance, note, onResonance, onNote, yesAck = "Good. Carry that with you." }) {
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
        <p style={styles.ack}>{yesAck}</p>
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
    borderTop: "1px solid rgba(44,35,29,0.12)",
    paddingTop: "1.5rem",
    marginTop: "1.5rem",
  },
  question: { fontWeight: 600, marginBottom: "0.75rem", color: "var(--color-text)" },
  buttons: { display: "flex", gap: "0.75rem", marginBottom: "1rem" },
  btn: {
    padding: "0.55rem 1.5rem",
    border: "1.5px solid var(--color-accent)",
    borderRadius: "4px",
    background: "var(--color-paper)",
    color: "var(--color-accent-deep)",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  btnSelected: { background: "var(--color-accent)", color: "#fff" },
  ack: { color: "var(--color-text)", fontStyle: "italic" },
  noPath: {},
  noText: { color: "var(--color-text)", marginBottom: "0.75rem", lineHeight: "1.6" },
  textarea: {
    width: "100%",
    padding: "0.65rem",
    fontSize: "0.95rem",
    border: "1.5px solid rgba(44,35,29,0.25)",
    borderRadius: "4px",
    boxSizing: "border-box",
    resize: "vertical",
    background: "#fff",
  },
};
