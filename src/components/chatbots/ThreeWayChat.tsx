import { useState, useRef } from "react";
import {
  Box,
  VStack,
  Input,
  Text,
  Flex,
  IconButton,
  Button,
  createStandaloneToast,
} from "@chakra-ui/react";
import { ChatIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { placeholders, buttonLabels } from "../../config/textContent";
import { threadStyles, threadColors, fonts } from "../../config/designSystem";
import ChatJoiner from "../ChatJoiner";
import { createChatCompletion } from "../../services/openai";
import type { ChatMessage } from "../../services/openai";

interface Message {
  role: "user" | "assistant" | "third";
  content: string;
  model: string;
}

export default function ThreeWayChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thirdPersonInput, setThirdPersonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThirdPersonEnabled, setIsThirdPersonEnabled] = useState(false);
  const [showJoiner, setShowJoiner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = createStandaloneToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Check if API key is set
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "Error",
        description: "OpenAI API key is not set. Please check your .env file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      model: "gpt-3.5-turbo",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages: ChatMessage[] = [
        {
          role: "system",
          content:
            "You are a helpful assistant in a three-way chat. Keep your responses concise and friendly.",
        },
        ...messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user", content: input },
      ];

      const completion = await createChatCompletion(
        import.meta.env.VITE_OPENAI_API_KEY,
        apiMessages,
        "gpt-3.5-turbo"
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: completion.choices[0].message.content || "",
        model: "gpt-3.5-turbo",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "Failed to send message. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage += " Invalid API key.";
        } else if (error.message.includes("429")) {
          errorMessage += " Rate limit exceeded.";
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThirdPersonMessage = async () => {
    if (!thirdPersonInput.trim()) return;

    // Check if API key is set
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "Error",
        description: "OpenAI API key is not set. Please check your .env file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const thirdPersonMessage: Message = {
      role: "third",
      content: thirdPersonInput,
      model: "gpt-3.5-turbo",
    };

    setMessages((prev) => [...prev, thirdPersonMessage]);
    setThirdPersonInput("");
    setIsLoading(true);

    try {
      const apiMessages: ChatMessage[] = [
        {
          role: "system",
          content:
            "You are a helpful assistant in a three-way chat. Keep your responses concise and friendly.",
        },
        ...messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user", content: thirdPersonInput },
      ];

      const completion = await createChatCompletion(
        import.meta.env.VITE_OPENAI_API_KEY,
        apiMessages,
        "gpt-3.5-turbo"
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: completion.choices[0].message.content || "",
        model: "gpt-3.5-turbo",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "Failed to send message. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage += " Invalid API key.";
        } else if (error.message.includes("429")) {
          errorMessage += " Rate limit exceeded.";
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinChat = () => {
    setShowJoiner(false);
    setIsThirdPersonEnabled(true);
  };

  const generateShareLink = () => {
    setIsThirdPersonEnabled(true);
  };

  return (
    <Box
      w="100%"
      h={{ base: "80vh", sm: "75vh", md: "70vh" }}
      bg={threadColors.thread1.bg}
      borderRadius="lg"
      boxShadow="sm"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box p={{ base: 2, sm: 3, md: 4 }}>
        <Flex justify="space-between" align="center" gap={2}>
          <Text
            fontSize={{ base: "md", sm: "lg" }}
            fontWeight="medium"
            color="#3182ce"
            {...threadStyles.thread3}
          >
            Three Way Chat
          </Text>
          {!isThirdPersonEnabled && (
            <Button
              leftIcon={<AddIcon />}
              size={{ base: "xs", sm: "sm" }}
              colorScheme="blue"
              onClick={generateShareLink}
              variant="solid"
              fontFamily="Roboto"
            >
              Invite
            </Button>
          )}
        </Flex>
      </Box>

      {showJoiner && <ChatJoiner onJoin={handleJoinChat} />}

      <Box
        flex="1"
        overflowY="auto"
        p={{ base: 2, sm: 3, md: 4 }}
        ref={chatContainerRef}
      >
        <VStack spacing={{ base: 3, sm: 4, md: 5 }} align="stretch">
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={
                message.role === "user"
                  ? "flex-end"
                  : message.role === "third"
                  ? "center"
                  : "flex-start"
              }
            >
              <Box
                maxW={{ base: "90%", sm: "85%", md: "75%" }}
                bg={
                  message.role === "user"
                    ? threadColors.thread1.userBg
                    : message.role === "third"
                    ? threadColors.thread1.thirdBg
                    : threadColors.thread1.assistantBg
                }
                color={
                  message.role === "user" || message.role === "third"
                    ? "white"
                    : "black"
                }
                p="5px 10px"
                borderRadius="5px"
                boxShadow="sm"
              >
                <Text
                  {...threadStyles.thread1}
                  fontSize={{ base: "xs", sm: "sm" }}
                  color={
                    message.role === "user" || message.role === "third"
                      ? "white"
                      : "black"
                  }
                >
                  {message.content}
                </Text>
              </Box>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <Box p={{ base: 2, sm: 3, md: 4 }}>
        <VStack spacing={3}>
          <Flex w="100%" gap={2}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholders.messageInput}
              flex="1"
              fontFamily={fonts.body.secondary}
              _placeholder={{
                fontFamily: fonts.body.secondary,
                color: "gray.500",
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              {...threadStyles.thread1}
              fontSize={{ base: "sm", sm: "md" }}
              size={{ base: "xs", sm: "sm" }}
              bg="white"
              borderColor={threadColors.thread1.borderColor}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ borderColor: threadColors.thread1.borderColor }}
              _focus={{ borderColor: threadColors.thread1.borderColor }}
            />
            <IconButton
              aria-label={buttonLabels.send}
              icon={
                <ChatIcon
                  boxSize={{ base: "20px", sm: "24px", md: "28px" }}
                  strokeWidth="0.5"
                />
              }
              colorScheme={threadColors.thread1.buttonColor}
              onClick={handleSendMessage}
              isLoading={isLoading}
              size={{ base: "xs", sm: "sm", md: "md" }}
              borderRadius="md"
            />
          </Flex>

          {isThirdPersonEnabled && (
            <Flex w="100%" gap={2}>
              <Input
                value={thirdPersonInput}
                onChange={(e) => setThirdPersonInput(e.target.value)}
                placeholder={placeholders.thirdPersonInput}
                flex="1"
                fontFamily={fonts.body.secondary}
                _placeholder={{
                  fontFamily: fonts.body.secondary,
                  color: "gray.500",
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleThirdPersonMessage();
                  }
                }}
                {...threadStyles.thread1}
                fontSize={{ base: "sm", sm: "md" }}
                bg="white"
                borderColor={threadColors.thread1.borderColor}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ borderColor: threadColors.thread1.borderColor }}
                _focus={{ borderColor: threadColors.thread1.borderColor }}
              />
              <Flex gap={2}>
                <IconButton
                  aria-label={buttonLabels.send}
                  icon={
                    <ChatIcon
                      boxSize={{ base: "20px", sm: "24px", md: "28px" }}
                      strokeWidth="0.5"
                    />
                  }
                  colorScheme={threadColors.thread1.buttonColor}
                  onClick={handleThirdPersonMessage}
                  size={{ base: "xs", sm: "sm", md: "md" }}
                />
                <IconButton
                  aria-label="Remove third person"
                  icon={<CloseIcon />}
                  colorScheme="red"
                  onClick={() => setIsThirdPersonEnabled(false)}
                  size={{ base: "xs", sm: "sm", md: "md" }}
                />
              </Flex>
            </Flex>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
