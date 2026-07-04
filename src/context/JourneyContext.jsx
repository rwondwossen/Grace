import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "grace-journey-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const DEFAULT_STATE = {
  // Step 1
  quote1Resonance: "",
  quote2Resonance: "",
  quote3Resonance: "",
  quote4Resonance: "",
  reflectionResonance: "",
  reflectionNote: "",

  // Step 2
  feelingWords: "",
  northStarFeeling: "",

  // Step 3
  allDomains: ["", ""],
  domains: [],

  // Step 4
  coherenceDiagnostic: [],
  step4ReflectionResonance: "",
  step4ReflectionNote: "",

  // Step 5
  commitments: [],
  step5ReflectionResonance: "",
  step5ReflectionNote: "",

  // Step 6 (Accountability)
  driftChip: "",
  driftCommitment: "",

  // Step 8 (Closing Reflection)
  whatsClearer: "",
  lookingForwardTo: "",
};

const JourneyContext = createContext(null);

export function JourneyProvider({ children }) {
  const [journey, setJourney] = useState(() => {
    const saved = loadState();
    return saved ? { ...DEFAULT_STATE, ...saved } : DEFAULT_STATE;
  });

  function update(patch) {
    setJourney((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setJourney(DEFAULT_STATE);
  }

  return (
    <JourneyContext.Provider value={{ journey, update, reset }}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be inside JourneyProvider");
  return ctx;
}
