export default function Shell({ title, stepLabel, children, footer }) {
  return (
    <div style={styles.page}>
      <div style={styles.monogram}>RW</div>
      <div style={styles.column}>
        {stepLabel && <div style={styles.stepLabel}>{stepLabel}</div>}
        {title && <h1 style={styles.title}>{title}</h1>}
        <div style={styles.content}>{children}</div>
        {footer && <div style={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--color-paper)",
    position: "relative",
    padding: "2.5rem 1.25rem 4rem",
  },
  monogram: {
    position: "absolute",
    top: "1.5rem",
    right: "1.75rem",
    fontFamily: "var(--font-serif)",
    fontWeight: 600,
    fontSize: "1.1rem",
    letterSpacing: "0.04em",
    color: "var(--color-accent)",
  },
  column: {
    maxWidth: "var(--column-width)",
    margin: "0 auto",
  },
  stepLabel: {
    textAlign: "center",
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.06em",
    marginBottom: "0.75rem",
    color: "var(--color-accent)",
  },
  title: {
    textAlign: "center",
    fontFamily: "var(--font-serif)",
    fontSize: "1.65rem",
    fontWeight: 600,
    color: "var(--color-text)",
    marginBottom: "2rem",
  },
  content: { textAlign: "left" },
  footer: {
    display: "flex",
    gap: "1rem",
    marginTop: "2.5rem",
  },
};
