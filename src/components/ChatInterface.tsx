import { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  Input,
  Text,
  useToast,
  Flex,
  IconButton,
  Heading,
  Switch,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import OpenAI from "openai";

interface Message {
  role: "user" | "assistant" | "third";
  content: string;
}

interface ChatInterfaceProps {
  threadId: number;
}

type LLMModel = "gpt-3.5-turbo" | "gpt-4" | "gpt-4-turbo";

export const ChatInterface = ({ threadId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thirdPersonInput, setThirdPersonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThirdPersonEnabled, setIsThirdPersonEnabled] = useState(false);
  const [selectedModel, setSelectedModel] = useState<LLMModel>("gpt-3.5-turbo");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const isThreadOne = threadId === 0;
  const isThreadTwo = threadId === 1;
  const isThreadThree = threadId === 2;
  const isThreadFour = threadId === 3;

  const getThreadStyle = () => {
    if (isThreadOne) {
      return { fontFamily: "'Poppins', sans-serif", fontWeight: "500" };
    }
    if (isThreadTwo) {
      return { fontFamily: "'Avenir', sans-serif", fontWeight: "500" };
    }
    if (isThreadThree) {
      return {
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "500",
      };
    }
    if (isThreadFour) {
      return {
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "500",
        fontSize: "sm",
      };
    }
    return {};
  };

  const threadStyle = getThreadStyle();

  const getThreadColors = () => {
    if (isThreadTwo) {
      return {
        bg: "orange.50",
        userBg: "orange.600",
        assistantBg: "orange.100",
        thirdBg: "orange.300",
        borderColor: "orange.200",
        buttonColor: "orange",
        textColor: "orange.700",
      };
    }
    if (isThreadThree) {
      return {
        bg: "green.50",
        userBg: "green.500",
        assistantBg: "green.100",
        thirdBg: "green.300",
        borderColor: "green.200",
        buttonColor: "green",
        textColor: "green.700",
      };
    }
    if (isThreadFour) {
      return {
        bg: "gray.50",
        userBg: "gray.600",
        assistantBg: "gray.100",
        thirdBg: "gray.300",
        borderColor: "gray.300",
        buttonColor: "gray",
        textColor: "gray.700",
      };
    }
    return {
      bg: "white",
      userBg: "blue.500",
      assistantBg: "gray.100",
      thirdBg: "blue.300",
      borderColor: "gray.200",
      buttonColor: "blue",
      textColor: undefined,
    };
  };

  const colors = getThreadColors();

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
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
          ...messages
            .filter((msg) => msg.role !== "third")
            .map((msg) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
          { role: "user", content: input },
        ],
        model: isThreadTwo ? selectedModel : "gpt-3.5-turbo",
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: completion.choices[0].message.content || "",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from OpenAI",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThirdPersonMessage = async () => {
    if (!thirdPersonInput.trim()) return;

    const thirdPersonMessage: Message = {
      role: "third",
      content: thirdPersonInput,
    };
    setMessages((prev) => [...prev, thirdPersonMessage]);
    setThirdPersonInput("");
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
          ...messages
            .filter((msg) => msg.role !== "third")
            .map((msg) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
          { role: "user", content: thirdPersonInput },
        ],
        model: isThreadTwo ? selectedModel : "gpt-3.5-turbo",
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: completion.choices[0].message.content || "",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from OpenAI",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputBgColor = () => {
    if (isThreadTwo) return "orange.50";
    if (isThreadThree) return "green.50";
    if (isThreadFour) return "gray.50";
    return "white";
  };

  return (
    <Box
      w="100%"
      h={{ base: "60vh", md: "75vh" }}
      bg={colors.bg}
      borderRadius={isThreadThree ? "0" : "lg"}
      boxShadow="md"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box
        p={{ base: 3, md: 4 }}
        borderBottom="1px"
        borderColor={colors.borderColor}
        bg={isThreadThree ? colors.textColor : undefined}
      >
        <Flex justify="space-between" align="center">
          <Heading
            size={{
              base: "sm",
              md: isThreadTwo ? "md" : isThreadFour ? "md" : "sm",
            }}
            {...threadStyle}
            color={isThreadThree ? colors.bg : colors.textColor}
            fontWeight={isThreadFour ? "bold" : undefined}
          >
            Chatbot {threadId + 1}
          </Heading>
          <Flex gap={4} align="center">
            {isThreadOne && (
              <FormControl display="flex" alignItems="center" w="auto">
                <FormLabel htmlFor="third-person" mb="0" fontSize="sm">
                  Third Person
                </FormLabel>
                <Switch
                  id="third-person"
                  isChecked={isThirdPersonEnabled}
                  onChange={(e) => setIsThirdPersonEnabled(e.target.checked)}
                  colorScheme="blue"
                  size="sm"
                />
              </FormControl>
            )}
            {isThreadTwo && (
              <FormControl w="auto">
                <Select
                  size="sm"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as LLMModel)}
                  bg={colors.bg}
                  color={colors.textColor}
                  borderColor={colors.borderColor}
                >
                  <option value="gpt-3.5-turbo">GPT-3.5</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </Select>
              </FormControl>
            )}
          </Flex>
        </Flex>
      </Box>
      <Box flex="1" overflowY="auto" p={{ base: 3, md: 4 }}>
        <VStack spacing={{ base: 4, md: 5 }} align="stretch">
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
                maxW={{ base: "85%", md: "75%" }}
                bg={
                  message.role === "user"
                    ? colors.userBg
                    : message.role === "third"
                    ? colors.thirdBg
                    : colors.assistantBg
                }
                color={message.role === "user" ? "white" : "black"}
                p={{ base: 3, md: 4 }}
                borderRadius={isThreadThree ? "0" : "lg"}
                boxShadow="sm"
              >
                <Text {...threadStyle} fontSize={{ base: "sm", md: "md" }}>
                  {message.content}
                </Text>
              </Box>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <Box
        p={{ base: 3, md: 4 }}
        borderTop={isThreadFour ? "0" : "1px"}
        borderColor={colors.borderColor}
      >
        <VStack spacing={3}>
          <Flex w="100%">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              mr={2}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              {...threadStyle}
              fontSize={{ base: "sm", md: "md" }}
              bg={getInputBgColor()}
              borderColor={colors.borderColor}
              borderRadius={isThreadThree ? "0" : "md"}
              _hover={{ borderColor: colors.borderColor }}
              _focus={{ borderColor: colors.borderColor }}
            />
            <IconButton
              aria-label="Send message"
              icon={<ChatIcon />}
              colorScheme={colors.buttonColor}
              onClick={handleSendMessage}
              isLoading={isLoading}
              size={{ base: "sm", md: "md" }}
            />
          </Flex>
          {isThreadOne && isThirdPersonEnabled && (
            <Flex w="100%">
              <Input
                value={thirdPersonInput}
                onChange={(e) => setThirdPersonInput(e.target.value)}
                placeholder="Third person's message..."
                mr={2}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleThirdPersonMessage();
                  }
                }}
                {...threadStyle}
                fontSize={{ base: "sm", md: "md" }}
                bg="white"
                borderColor={colors.borderColor}
                borderRadius={isThreadThree ? "0" : "md"}
                _hover={{ borderColor: colors.borderColor }}
                _focus={{ borderColor: colors.borderColor }}
              />
              <IconButton
                aria-label="Send third person message"
                icon={<ChatIcon />}
                colorScheme={colors.buttonColor}
                onClick={handleThirdPersonMessage}
                size={{ base: "sm", md: "md" }}
              />
            </Flex>
          )}
        </VStack>
      </Box>
    </Box>
  );
};
