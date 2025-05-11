import {
  Box,
  Button,
  VStack,
  Input,
  Text,
  useColorModeValue,
  IconButton,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { ChatIcon, CloseIcon } from "@chakra-ui/icons";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface EmbeddableChatProps {
  apiKey: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  width?: string;
  height?: string;
  initialMessage?: string;
}

export default function EmbeddableChat({
  apiKey,
  position = "bottom-right",
  width = "350px",
  height = "500px",
  initialMessage = "Hello! How can I help you today?",
}: EmbeddableChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: initialMessage },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant.",
              },
              ...messages,
              userMessage,
            ],
          }),
        }
      );

      const data = await response.json();
      const assistantMessage = {
        role: "assistant" as const,
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionStyles = () => {
    const positions = {
      "bottom-right": { bottom: "20px", right: "20px" },
      "bottom-left": { bottom: "20px", left: "20px" },
      "top-right": { top: "20px", right: "20px" },
      "top-left": { top: "20px", left: "20px" },
    };
    return positions[position];
  };

  return (
    <Box position="fixed" zIndex={1000} {...getPositionStyles()}>
      {!isOpen ? (
        <IconButton
          aria-label="Open chat"
          icon={<ChatIcon />}
          colorScheme="blue"
          size="lg"
          isRound
          onClick={() => setIsOpen(true)}
        />
      ) : (
        <Box
          w={width}
          h={height}
          bg={bgColor}
          borderRadius="lg"
          boxShadow="xl"
          display="flex"
          flexDirection="column"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex
            justify="space-between"
            align="center"
            p={4}
            borderBottomWidth="1px"
            borderColor={borderColor}
          >
            <Text fontWeight="bold">Chat</Text>
            <IconButton
              aria-label="Close chat"
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            />
          </Flex>

          <VStack flex="1" overflowY="auto" p={4} spacing={4} align="stretch">
            {messages.map((message, index) => (
              <Box
                key={index}
                alignSelf={message.role === "user" ? "flex-end" : "flex-start"}
                maxW="80%"
                bg={message.role === "user" ? "blue.500" : "gray.100"}
                color={message.role === "user" ? "white" : "black"}
                p={3}
                borderRadius="lg"
              >
                <Text fontSize="sm">{message.content}</Text>
              </Box>
            ))}
            {isLoading && (
              <Box alignSelf="flex-start">
                <Spinner size="sm" color="blue.500" />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </VStack>

          <Flex p={4} borderTopWidth="1px" borderColor={borderColor}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              mr={2}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              colorScheme="blue"
              onClick={handleSend}
              isLoading={isLoading}
            >
              Send
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
