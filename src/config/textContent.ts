export const threadDescriptions = [
  {
    title: "Chatbot 1",
    description: "A chatbot that can add a third person to the conversation.",
  },
  {
    title: "Chatbot 2",
    description: "Advanced chat with model selection.",
  },
  {
    title: "Chatbot 3",
    description: "Feedback-focused chat with like/dislike functionality.",
  },
  {
    title: "Personality Feedback Chatbot",
    description:
      "Choose and rate different chatbot personalities to help improve responses.",
  },
];

export const personalityTypes = [
  { value: "friendly", label: "Friendly & Casual" },
  { value: "professional", label: "Professional & Formal" },
  { value: "humorous", label: "Humorous & Playful" },
  { value: "concise", label: "Concise & Direct" },
  { value: "empathetic", label: "Empathetic & Supportive" },
];

export const appTitle = "Agent UI Interfaces";

export const errorMessages = {
  apiError: "Failed to get response from OpenAI. ",
  invalidApiKey: "Please check your API key is valid and has access to GPT-4.",
  rateLimit:
    "You may have hit the rate limit or need to add billing information.",
  modelUnavailable:
    "The model is not available. Please check your API key has access to GPT-4 Vision.",
  fileTooLarge: "Please upload an image smaller than 5MB",
  configError: "OpenAI API key is not set. Please check your .env file.",
};

export const placeholders = {
  messageInput: "Type your message...",
  thirdPersonInput: "Third person's message...",
  feedbackInput: "Please describe",
};

export const buttonLabels = {
  send: "Send message",
  upload: "Upload image",
  remove: "Remove image",
  like: "Like message",
  dislike: "Dislike message",
  submitFeedback: "Submit feedback",
};
