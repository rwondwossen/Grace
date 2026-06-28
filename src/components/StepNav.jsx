export default function StepNav({ current, total = 7 }) {
  return (
    <div style={styles.wrapper}>
      <span style={styles.label}>
        Step {current} of {total}
      </span>
      <div style={styles.bar}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.segment,
              background: i < current ? "#2d6a4f" : "#d8e8df",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { marginBottom: "2rem" },
  label: { fontSize: "0.85rem", color: "#666", display: "block", marginBottom: "0.4rem" },
  bar: { display: "flex", gap: "4px" },
  segment: { height: "4px", flex: 1, borderRadius: "2px" },
};
