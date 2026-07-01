function lerpHex(hex1, hex2, t) {
  const p = (h, s, e) => parseInt(h.slice(s, e), 16);
  const r = Math.round(p("#E44A24", 1, 3) + (p("#5E0F3D", 1, 3) - p("#E44A24", 1, 3)) * t);
  const g = Math.round(p("#E44A24", 3, 5) + (p("#5E0F3D", 3, 5) - p("#E44A24", 3, 5)) * t);
  const b = Math.round(p("#E44A24", 5, 7) + (p("#5E0F3D", 5, 7) - p("#E44A24", 5, 7)) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function StepNav({ current, total = 7, rampT = 0 }) {
  const fillColor = lerpHex("#E44A24", "#5E0F3D", Math.max(0, Math.min(1, rampT)));
  return (
    <div style={styles.wrapper}>
      <div style={styles.bar}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.segment,
              background: i < current ? fillColor : "rgba(44,35,29,0.12)",
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
