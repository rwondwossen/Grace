import { createContext, useContext, useState } from "react";

const JourneyContext = createContext(null);

export function JourneyProvider({ children }) {
  const [journey, setJourney] = useState({
    // Step 1
    quote1Resonance: "",
    quote2Resonance: "",
    // Step 2
    feelingWords: "",
    northStarFeeling: "",
    // Step 3 — array of domain name strings, 2–4
    domains: ["", ""],
    // Step 4 — array of { gap, barrier } objects, one per domain
    coherenceDiagnostic: [],
    // Step 5 — array of { commitments: string[] } objects, one per domain
    commitments: [],
    // Step 7
    releasing: "",
    accountability: "",
  });

  function update(patch) {
    setJourney((prev) => ({ ...prev, ...patch }));
  }

  return (
    <JourneyContext.Provider value={{ journey, update }}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be inside JourneyProvider");
  return ctx;
}
