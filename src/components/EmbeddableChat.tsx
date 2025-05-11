import { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  Input,
  Text,
  Flex,
  IconButton,
  Heading,
  createStandaloneToast,
} from "@chakra-ui/react";
import { ChatIcon, CloseIcon } from "@chakra-ui/icons";
import OpenAI from "openai";
import {
  theme,
  threadStyles,
  threadColors,
  fonts,
} from "../config/designSystem";

interface Message {
  role: "user" | "assistant";
  content: string;
  model: "gpt-3.5-turbo" | "gpt-4";
}

interface EmbeddableChatProps {
  threadId?: number;
  apiKey?: string;
  initialMessage?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  width?: string;
  height?: string;
}

export default function EmbeddableChat({
  threadId = 0,
  apiKey,
  initialMessage = "Hello! How can I help you today?",
  position = "bottom-right",
  width = "350px",
  height = "500px",
}: EmbeddableChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: initialMessage, model: "gpt-3.5-turbo" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = createStandaloneToast();

  const colors =
    threadColors[`thread${threadId + 1}` as keyof typeof threadColors];
  const threadStyle =
    threadStyles[`thread${threadId + 1}` as keyof typeof threadStyles];

  const openai = new OpenAI({
    apiKey: apiKey || import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      model: "gpt-3.5-turbo",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant in chat thread ${
              threadId + 1
            }. Keep your responses concise and friendly.`,
          },
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        model: "gpt-3.5-turbo",
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: completion.choices[0].message.content || "",
        model: "gpt-3.5-turbo",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from OpenAI",
        status: "error",
        duration: 3000,
        isClosable: true,
        containerStyle: {
          background: "white",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionStyles = () => {
    const baseStyles = {
      position: "fixed",
      zIndex: 1000,
    };

    switch (position) {
      case "bottom-right":
        return { ...baseStyles, bottom: "20px", right: "20px" };
      case "bottom-left":
        return { ...baseStyles, bottom: "20px", left: "20px" };
      case "top-right":
        return { ...baseStyles, top: "20px", right: "20px" };
      case "top-left":
        return { ...baseStyles, top: "20px", left: "20px" };
      default:
        return { ...baseStyles, bottom: "20px", right: "20px" };
    }
  };

  if (!isOpen) {
    return (
      <Box {...getPositionStyles()}>
        <IconButton
          aria-label="Open chat"
          icon={<ChatIcon />}
          colorScheme={colors.buttonColor}
          size="lg"
          isRound
          onClick={() => setIsOpen(true)}
          boxShadow="lg"
        />
      </Box>
    );
  }

  return (
    <Box
      {...getPositionStyles()}
      w={width}
      h={height}
      bg={colors.bg}
      borderRadius="lg"
      boxShadow="xl"
      display="flex"
      flexDirection="column"
    >
      <Box
        p={3}
        borderBottom="1px"
        borderColor={colors.borderColor}
        bg={colors.textColor}
      >
        <Flex justify="space-between" align="center">
          <Heading
            size="sm"
            color={colors.bg}
            fontFamily={fonts.heading.primary}
          >
            Chat Assistant
          </Heading>
          <IconButton
            aria-label="Close chat"
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            color={colors.bg}
            onClick={() => setIsOpen(false)}
          />
        </Flex>
      </Box>

      <Box flex="1" overflowY="auto" p={3} ref={messagesEndRef}>
        <VStack spacing={3} align="stretch">
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={message.role === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                maxW="85%"
                bg={
                  message.role === "user" ? colors.userBg : colors.assistantBg
                }
                color={message.role === "user" ? "white" : "black"}
                p={3}
                borderRadius="lg"
                boxShadow="sm"
              >
                <Text fontSize="sm" fontFamily={fonts.body.primary}>
                  {message.content}
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>

      <Box p={3} borderTop="1px" borderColor={colors.borderColor}>
        <Flex gap={2}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            size="sm"
            fontFamily={fonts.body.primary}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <IconButton
            aria-label="Send message"
            icon={<ChatIcon />}
            colorScheme={colors.buttonColor}
            onClick={handleSendMessage}
            isLoading={isLoading}
            size="sm"
          />
        </Flex>
      </Box>
    </Box>
  );
}
