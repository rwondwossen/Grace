export default function StepNav({ current, total = 8 }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.bar}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.segment,
              background: i < current ? "var(--color-accent)" : "rgba(44,35,29,0.12)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { marginBottom: "1.5rem" },
  bar: { display: "flex", gap: "4px" },
  segment: { height: "4px", flex: 1, borderRadius: "2px" },
};
