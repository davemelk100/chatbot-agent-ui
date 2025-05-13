import { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  Input,
  Text,
  Flex,
  IconButton,
  createStandaloneToast,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { createChatCompletion } from "../services/openai";
import type { ChatMessage } from "../services/openai";
import { usePersonality } from "../context/PersonalityContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  model: string;
}

interface EmbeddableChatProps {
  apiKey?: string;
  model?: string;
  initialMessage?: string;
  width?: string | number;
  height?: string | number;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    userMessageBg?: string;
    assistantMessageBg?: string;
  };
}

export default function EmbeddableChat({
  apiKey,
  model = "gpt-3.5-turbo",
  initialMessage = "Hello! How can I help you today?",
  width = "100%",
  height = "500px",
  theme = {
    primaryColor: "#3182CE",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    userMessageBg: "#3182CE",
    assistantMessageBg: "#F7FAFC",
  },
}: EmbeddableChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: initialMessage,
      model,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = createStandaloneToast();
  const { personality } = usePersonality();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      model,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const formalityLevel = ["Casual", "Neutral", "Formal"][
        Math.round(personality.formality * 2)
      ];
      const detailLevel = ["Concise", "Balanced", "Detailed"][
        Math.round(personality.detail * 2)
      ];
      const empathyLevel = ["Objective", "Balanced", "Empathetic"][
        Math.round(personality.empathy * 2)
      ];
      const humorLevel = ["Serious", "Balanced", "Humorous"][
        Math.round(personality.humor * 2)
      ];

      const apiMessages: ChatMessage[] = [
        {
          role: "system",
          content: `You are a helpful assistant with the following personality settings:
            - Formality: ${formalityLevel}
            - Detail: ${detailLevel}
            - Empathy: ${empathyLevel}
            - Humor: ${humorLevel}
            
            Adjust your responses according to these settings. Keep responses friendly and engaging.`,
        },
        ...messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ];

      apiMessages.push({ role: "user", content: input });

      const completion = await createChatCompletion(
        apiKey || import.meta.env.VITE_OPENAI_API_KEY,
        apiMessages,
        model
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: completion.choices[0].message.content || "",
        model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("OpenAI API Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response from OpenAI",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      w={width}
      h={height}
      bg={theme.backgroundColor}
      borderRadius="lg"
      boxShadow="sm"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box flex="1" overflowY="auto" p={4} ref={chatContainerRef}>
        <VStack spacing={4} align="stretch">
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={message.role === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                maxW="75%"
                bg={
                  message.role === "user"
                    ? theme.userMessageBg
                    : theme.assistantMessageBg
                }
                color={message.role === "user" ? "white" : theme.textColor}
                p="5px 10px"
                borderRadius="5px"
                boxShadow="sm"
              >
                <Text fontSize="sm">{message.content}</Text>
              </Box>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <Box p={4}>
        <Flex w="100%" gap={2}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            flex="1"
            fontSize="sm"
            bg="white"
            borderColor="gray.200"
            borderWidth="1px"
            borderRadius="md"
            _hover={{ borderColor: "gray.300" }}
            _focus={{ borderColor: theme.primaryColor }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <IconButton
            aria-label="Send message"
            icon={<ChatIcon />}
            colorScheme="blue"
            onClick={handleSendMessage}
            isLoading={isLoading}
            size="md"
            borderRadius="md"
          />
        </Flex>
      </Box>
    </Box>
  );
}
