import { useState } from "react";
import {
  ChakraProvider,
  extendTheme,
  Select,
  Box,
  Text,
} from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import ContentFeedbackChat from "./chatbots/ContentFeedbackChat";
import PersonalityTuningChat from "./chatbots/PersonalityTuningChat";
import ThreeWayChat from "./chatbots/ThreeWayChat";
import { ConfigProvider } from "../context/ConfigContext";

export type ChatType = "content-feedback" | "personality-tuning" | "three-way";

export interface EmbeddableChatProps {
  apiKey?: string;
  model?: string;
  theme?: Record<string, any>;
  defaultChatType?: ChatType;
  onError?: (error: Error) => void;
  showChatSelector?: boolean;
  allowedChatTypes?: ChatType[];
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
  showChatSelector = false,
  allowedChatTypes = ["content-feedback", "personality-tuning", "three-way"],
}: EmbeddableChatProps) {
  const [chatType, setChatType] = useState<ChatType>(defaultChatType);

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
        setChatType(defaultChatType);
      }}
    >
      <ConfigProvider apiKey={apiKey} model={model}>
        <ChakraProvider theme={customTheme}>
          <Box>
            {showChatSelector && allowedChatTypes.length > 1 && (
              <Box mb={4}>
                <Text mb={2} fontSize="sm" fontWeight="medium">
                  Select Chat Type:
                </Text>
                <Select
                  value={chatType}
                  onChange={(e) => setChatType(e.target.value as ChatType)}
                  size="sm"
                  width="200px"
                >
                  {allowedChatTypes.map((type) => (
                    <option key={type} value={type}>
                      {type
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </option>
                  ))}
                </Select>
              </Box>
            )}
            {renderChat()}
          </Box>
        </ChakraProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}
