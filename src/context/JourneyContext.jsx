import { createContext, useContext, useState } from "react";

const JourneyContext = createContext(null);

export function JourneyProvider({ children }) {
  const [journey, setJourney] = useState({
    // Step 1
    quote1Resonance: "",
    quote2Resonance: "",
    quote3Resonance: "",
    quote4Resonance: "",
    reflectionResonance: "",   // "yes" | "no"
    reflectionNote: "",        // optional text when "no"

    // Step 2
    feelingWords: "",
    northStarFeeling: "",

    // Step 3
    allDomains: ["", ""],      // everything the user generated
    domains: [],               // kept set after optional narrowing

    // Step 4 — array of { gap, barriers: string[], barrierNotes } per domain
    coherenceDiagnostic: [],
    step4ReflectionResonance: "",
    step4ReflectionNote: "",

    // Step 5 — array of { items: string[] } per domain
    commitments: [],
    step5ReflectionResonance: "",
    step5ReflectionNote: "",

    // Step 7
    whatsClearer: "",
    lookingForwardTo: "",
    accountability: "",
    communityInterest: "",
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
