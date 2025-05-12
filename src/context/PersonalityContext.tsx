import React, { createContext, useContext, useState, useCallback } from "react";
import {
  PersonalityTrait,
  PersonalityFeedback,
  defaultPersonality,
} from "../types/personality";

interface PersonalityContextType {
  personality: PersonalityTrait;
  updatePersonality: (feedback: PersonalityFeedback) => void;
  resetPersonality: () => void;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(
  undefined
);

export function PersonalityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [personality, setPersonality] =
    useState<PersonalityTrait>(defaultPersonality);

  const updatePersonality = useCallback((feedback: PersonalityFeedback) => {
    setPersonality((prev) => ({
      ...prev,
      [feedback.trait]: feedback.value,
    }));
  }, []);

  const resetPersonality = useCallback(() => {
    setPersonality(defaultPersonality);
  }, []);

  return (
    <PersonalityContext.Provider
      value={{ personality, updatePersonality, resetPersonality }}
    >
      {children}
    </PersonalityContext.Provider>
  );
}

export function usePersonality() {
  const context = useContext(PersonalityContext);
  if (context === undefined) {
    throw new Error("usePersonality must be used within a PersonalityProvider");
  }
  return context;
}
