export const threadDescriptions = [
  {
    title: "Chatbot 1",
    description: "A simple chat interface with a clean, modern design.",
  },
  {
    title: "Chatbot 2",
    description: "Advanced chat with model selection and custom styling.",
  },
  {
    title: "Chatbot 3",
    description: "Feedback-focused chat with like/dislike functionality.",
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
