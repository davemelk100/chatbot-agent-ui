import { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  Input,
  Text,
  Flex,
  IconButton,
  createStandaloneToast,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { createChatCompletion } from "../services/openai";
import type { ChatMessage } from "../services/openai";
import { usePersonality } from "../context/PersonalityContext";
import { ErrorBoundary } from "react-error-boundary";
import ContentFeedbackChat from "./chatbots/ContentFeedbackChat";
import PersonalityTuningChat from "./chatbots/PersonalityTuningChat";
import ThreeWayChat from "./chatbots/ThreeWayChat";
import { ConfigProvider } from "../context/ConfigContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  model: string;
}

export interface EmbeddableChatProps {
  apiKey?: string;
  model?: string;
  theme?: Record<string, any>;
  defaultChatType?: "content-feedback" | "personality-tuning" | "three-way";
  onError?: (error: Error) => void;
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert" style={{ padding: "20px", color: "red" }}>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default function EmbeddableChat({
  apiKey,
  model,
  theme,
  defaultChatType = "content-feedback",
  onError,
}: EmbeddableChatProps) {
  const [chatType, setChatType] = useState(defaultChatType);

  // Extend the default theme with custom theme
  const customTheme = extendTheme(theme || {});

  const handleError = (error: Error) => {
    console.error("Chatbot error:", error);
    onError?.(error);
  };

  const renderChat = () => {
    switch (chatType) {
      case "content-feedback":
        return <ContentFeedbackChat />;
      case "personality-tuning":
        return <PersonalityTuningChat />;
      case "three-way":
        return <ThreeWayChat />;
      default:
        return <ContentFeedbackChat />;
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset the state here
        setChatType(defaultChatType);
      }}
    >
      <ConfigProvider apiKey={apiKey} model={model}>
        <ChakraProvider theme={customTheme}>{renderChat()}</ChakraProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}
