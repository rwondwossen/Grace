import { createContext, useContext, useState } from "react";

const JourneyContext = createContext(null);

export function JourneyProvider({ children }) {
  const [journey, setJourney] = useState({
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

    // Step 7
    whatsClearer: "",
    lookingForwardTo: "",
    driftChips: [],
    driftCommitment: "",
    communityChips: [],
    communityNote: "",
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
