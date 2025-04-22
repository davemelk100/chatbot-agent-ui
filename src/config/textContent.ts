export const threadDescriptions = [
  {
    title: "Multi-Person Chat",
    description:
      "Toggle between two-person and three-person conversations with independent AI responses.",
  },
  {
    title: "Model Selector",
    description:
      "Switch between different GPT models (3.5, 4, 4 Turbo) to compare their responses.",
  },
  {
    title: "Feedback System",
    description:
      "Like or dislike responses and provide detailed feedback on unhelpful answers.",
  },
  {
    title: "Image Upload",
    description:
      "Upload images with context. Supports image upload confirmation with GPT-4 text responses.",
  },
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
  feedbackInput: "Why was this response not helpful?",
};

export const buttonLabels = {
  send: "Send message",
  upload: "Upload image",
  remove: "Remove image",
  like: "Like message",
  dislike: "Dislike message",
  submitFeedback: "Submit feedback",
};
