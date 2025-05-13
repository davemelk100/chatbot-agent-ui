export type PersonalityTrait = {
  formality: number; // 0-1: casual to formal
  detail: number; // 0-1: concise to detailed
  empathy: number; // 0-1: objective to empathetic
  humor: number; // 0-1: serious to humorous
};

export type PersonalityFeedback = {
  trait: "formality" | "detail" | "empathy" | "humor";
  value: number;
  feedback: string;
  formality: number;
  detail: number;
  empathy: number;
  humor: number;
};

export const defaultPersonality: PersonalityTrait = {
  formality: 0.5,
  detail: 0.5,
  empathy: 0.5,
  humor: 0.5,
};
