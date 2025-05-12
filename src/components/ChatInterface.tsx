import { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  Input,
  Text,
  Flex,
  IconButton,
  Heading,
  FormControl,
  Select,
  HStack,
  Button,
  createStandaloneToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  FormLabel,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import {
  ChatIcon,
  CloseIcon,
  AddIcon,
  CheckIcon,
  NotAllowedIcon,
  SettingsIcon,
  AddIcon as UserAddIcon,
  ArrowUpIcon,
} from "@chakra-ui/icons";
import {
  errorMessages,
  placeholders,
  buttonLabels,
} from "../config/textContent";
import {
  theme,
  threadStyles,
  threadColors,
  fonts,
} from "../config/designSystem";
import ChatJoiner from "./ChatJoiner";
import {
  createChatCompletion,
  createVisionCompletion,
} from "../services/openai";
import type { ChatMessage } from "../services/openai";
import BaseModal from "./BaseModal";
import { usePersonality } from "../context/PersonalityContext";
import { PersonalityFeedback } from "../types/personality";

interface Message {
  role: "user" | "assistant" | "third";
  content: string;
  feedback?: "like" | "dislike" | null;
  feedbackText?: string;
  imageUrl?: string;
  model: LLMModel;
}

interface ChatInterfaceProps {
  threadId: number;
}

type LLMModel =
  | "gpt-3.5-turbo"
  | "gpt-4"
  | "gpt-4-turbo"
  | "gpt-4-vision-preview";

function containsCodeBlock(text: string): boolean {
  return text.includes("```") || text.includes("`");
}

function formatMessageContent(content: string) {
  if (!containsCodeBlock(content)) {
    // Split content into paragraphs and wrap each in a Text component
    return content.split("\n\n").map((paragraph, index) => (
      <Text key={index} mb={index < content.split("\n\n").length - 1 ? 2 : 0}>
        {paragraph}
      </Text>
    ));
  }

  // Split the content by code blocks
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      // Code block
      const code = part.slice(3, -3).trim();
      return (
        <Box
          key={index}
          bg="gray.100"
          p={2}
          borderRadius="md"
          fontFamily="monospace"
          fontSize="sm"
          whiteSpace="pre-wrap"
          my={2}
        >
          {code}
        </Box>
      );
    } else if (part.startsWith("`") && part.endsWith("`")) {
      // Inline code
      const code = part.slice(1, -1);
      return (
        <Text
          key={index}
          as="span"
          fontFamily="monospace"
          bg="gray.100"
          px={1}
          py={0.5}
          borderRadius="sm"
        >
          {code}
        </Text>
      );
    } else {
      // Regular text - split into paragraphs
      return part.split("\n\n").map((paragraph, pIndex) => (
        <Text
          key={`${index}-${pIndex}`}
          mb={pIndex < part.split("\n\n").length - 1 ? 2 : 0}
        >
          {paragraph}
        </Text>
      ));
    }
  });
}

export default function ChatInterface({ threadId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thirdPersonInput, setThirdPersonInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isThirdPersonEnabled, setIsThirdPersonEnabled] = useState(false);
  const [selectedModel, setSelectedModel] = useState<LLMModel>("gpt-3.5-turbo");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = createStandaloneToast();
  const [showJoiner, setShowJoiner] = useState(false);
  const { updatePersonality } = usePersonality();
  const [traitFeedback, setTraitFeedback] = useState<PersonalityFeedback>({
    trait: "formality",
    value: 0.5,
    feedback: "",
  });

  // Add auto-scroll effect for chat container only
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const isThreadOne = threadId === 0;
  const isThreadTwo = threadId === 1;
  const isThreadThree = threadId === 2;
  const isThreadFour = threadId === 3;

  const getThreadStyle = () => {
    switch (threadId) {
      case 0:
        return threadStyles.thread1;
      case 1:
        return threadStyles.thread2;
      case 2:
        return threadStyles.thread3;
      case 3:
        return threadStyles.thread4;
      default:
        return {};
    }
  };

  const getThreadColors = () => {
    switch (threadId) {
      case 0:
        return threadColors.thread1;
      case 1:
        return threadColors.thread2;
      case 2:
        return threadColors.thread3;
      case 3:
        return threadColors.thread4;
      default:
        return threadColors.thread1;
    }
  };

  const threadStyle = getThreadStyle();
  const colors = getThreadColors();

  // Check for chat ID in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("join");
    if (id) {
      setShowJoiner(true);
    }
  }, []);

  const handleJoinChat = () => {
    setShowJoiner(false);
    setIsThirdPersonEnabled(true);
    // Here you would typically load the existing chat messages
    // For now, we'll just enable the third person mode
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: errorMessages.fileTooLarge,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
          containerStyle: {
            background: "white",
            maxWidth: "300px",
            fontSize: "sm",
          },
        });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Check if API key is set
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "Error",
        description: errorMessages.configError,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
        containerStyle: {
          background: "white",
          maxWidth: "300px",
          fontSize: "sm",
        },
      });
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      model: isThreadFour
        ? "gpt-4"
        : isThreadTwo
        ? selectedModel
        : "gpt-3.5-turbo",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages: ChatMessage[] = [
        {
          role: "system",
          content: isThreadFour
            ? "You are a helpful assistant that adapts its personality based on user feedback. Keep responses friendly and engaging. If the user provides feedback about your personality, acknowledge it and adjust your tone accordingly."
            : `You are a helpful assistant in chat thread ${
                threadId + 1
              }. Keep your responses concise and friendly.`,
        },
        ...messages
          .filter((msg) => msg.role !== "third")
          .map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
      ];

      const model: LLMModel = isThreadFour
        ? "gpt-4"
        : isThreadTwo
        ? selectedModel
        : isThreadThree
        ? "gpt-4"
        : "gpt-3.5-turbo";

      apiMessages.push({ role: "user", content: input });

      const completion = await createChatCompletion(
        import.meta.env.VITE_OPENAI_API_KEY,
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
      let errorMessage = errorMessages.apiError;

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage += errorMessages.invalidApiKey;
        } else if (error.message.includes("429")) {
          errorMessage += errorMessages.rateLimit;
        } else if (error.message.includes("404")) {
          errorMessage += errorMessages.modelUnavailable;
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
        containerStyle: {
          background: "white",
          maxWidth: "300px",
          fontSize: "sm",
        },
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
      model: isThreadTwo ? selectedModel : "gpt-3.5-turbo",
    };
    setMessages((prev) => [...prev, thirdPersonMessage]);
    setThirdPersonInput("");
    setIsLoading(true);

    try {
      const apiMessages: ChatMessage[] = [
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
      ];

      const completion = await createChatCompletion(
        import.meta.env.VITE_OPENAI_API_KEY,
        apiMessages,
        isThreadTwo ? selectedModel : "gpt-3.5-turbo"
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: completion.choices[0].message.content || "",
        model: isThreadTwo ? selectedModel : "gpt-3.5-turbo",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from OpenAI",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
        containerStyle: {
          background: "white",
          maxWidth: "300px",
          fontSize: "sm",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputBgColor = () => {
    if (isThreadTwo) return "orange.50";
    if (isThreadThree) return "blue.50";
    return "white";
  };

  const handleFeedback = (
    messageIndex: number,
    feedback: "like" | "dislike"
  ) => {
    setMessages((prev) =>
      prev.map((msg, idx) =>
        idx === messageIndex
          ? {
              ...msg,
              feedback,
              feedbackText: feedback === "dislike" ? "" : undefined,
            }
          : msg
      )
    );
    if (feedback === "dislike") {
      setFeedbackInput("");
    }
  };

  const handleFeedbackSubmit = useCallback(() => {
    if (feedbackMessage.trim()) {
      // Update personality based on feedback
      updatePersonality(traitFeedback);

      // Add feedback message to chat
      const feedbackMsg: Message = {
        role: "assistant",
        content: `Feedback received: ${feedbackMessage}\nAdjusting personality traits accordingly.`,
        model: "gpt-4",
      };
      setMessages((prev) => [...prev, feedbackMsg]);

      // Reset feedback state
      setFeedbackMessage("");
      setTraitFeedback({
        trait: "formality",
        value: 0.5,
        feedback: "",
      });
      onClose();
    }
  }, [feedbackMessage, traitFeedback, updatePersonality, onClose]);

  const handleThreadFeedbackSubmit = (messageIndex: number) => {
    if (feedbackInput.trim()) {
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === messageIndex ? { ...msg, feedbackText: feedbackInput } : msg
        )
      );
      setFeedbackInput("");
    }
  };

  const generateShareLink = () => {
    setIsThirdPersonEnabled(true);
  };

  return (
    <>
      <Box
        w="100%"
        h={{ base: "80vh", sm: "75vh", md: "70vh" }}
        bg={colors.bg}
        borderRadius={threadId === 1 ? "0" : "lg"}
        boxShadow={theme.shadows.sm}
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {showJoiner && <ChatJoiner onJoin={handleJoinChat} />}
        <Box
          p={{ base: 2, sm: 3, md: 4 }}
          borderBottom="1px"
          borderColor={colors.borderColor}
          bg={isThreadThree ? colors.textColor : undefined}
        >
          <Flex justify="space-between" align="center" gap={2}>
            <Text
              fontSize={{ base: "md", sm: "lg" }}
              fontWeight="bold"
              {...threadStyle}
              color={isThreadThree ? colors.bg : colors.textColor}
            >
              <Flex align="center" gap={2}>
                {isThreadOne && <UserAddIcon boxSize="18px" />}
                {isThreadTwo && <SettingsIcon boxSize="18px" />}
                {isThreadThree && <ArrowUpIcon boxSize="18px" />}
                Chatbot {threadId + 1}
              </Flex>
            </Text>
            <Flex gap={{ base: 2, sm: 4 }} align="center">
              {isThreadOne && !isThirdPersonEnabled && (
                <Button
                  leftIcon={<AddIcon />}
                  size={{ base: "xs", sm: "sm" }}
                  colorScheme="blue"
                  onClick={generateShareLink}
                  variant="solid"
                  fontFamily="Poppins"
                >
                  Invite
                </Button>
              )}
              {isThreadTwo && (
                <FormControl w="auto">
                  <Select
                    size={{ base: "xs", sm: "sm" }}
                    value={selectedModel}
                    onChange={(e) =>
                      setSelectedModel(e.target.value as LLMModel)
                    }
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
                      ? colors.userBg
                      : message.role === "third"
                      ? colors.thirdBg
                      : message.feedback === "like"
                      ? colors.assistantBgLiked
                      : message.feedback === "dislike"
                      ? colors.assistantBgDisliked
                      : colors.assistantBg
                  }
                  color={message.role === "user" ? "white" : "black"}
                  p={{ base: 2, sm: 3, md: 4 }}
                  borderRadius={threadId === 1 ? "0" : "lg"}
                  boxShadow="sm"
                >
                  <Text
                    {...threadStyle}
                    fontSize={{ base: "sm", sm: "md" }}
                    color={
                      message.role === "user"
                        ? "white"
                        : isThreadThree
                        ? "black"
                        : "black"
                    }
                  >
                    {formatMessageContent(message.content)}
                  </Text>
                  {message.role === "assistant" && isThreadTwo && (
                    <Text
                      fontSize="xs"
                      color={theme.colors.secondary[500]}
                      fontStyle="italic"
                      mt={1}
                      fontFamily={
                        isThreadThree
                          ? fonts.body.tertiary
                          : isThreadTwo
                          ? fonts.body.primary
                          : fonts.body.secondary
                      }
                    >
                      Generated by {selectedModel}
                    </Text>
                  )}
                  {message.role === "assistant" && isThreadFour && (
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme={colors.buttonColor}
                      mt={2}
                      leftIcon={<ChatIcon boxSize="14px" />}
                      onClick={onOpen}
                      fontFamily={fonts.body.primary}
                      fontSize="xs"
                    >
                      Rate my tone and detail
                    </Button>
                  )}
                  {message.role === "assistant" && !isThreadFour && (
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme={colors.buttonColor}
                      mt={2}
                      leftIcon={<ChatIcon boxSize="14px" />}
                      onClick={() => {
                        setInput(
                          `Can you tell me more about: ${
                            message.content.split(".")[0]
                          }?`
                        );
                      }}
                      fontFamily={
                        isThreadThree
                          ? fonts.body.tertiary
                          : isThreadTwo
                          ? fonts.body.primary
                          : fonts.body.secondary
                      }
                      fontSize="xs"
                    >
                      Learn more about this
                    </Button>
                  )}
                  {message.imageUrl && (
                    <Box mt={2} maxW="300px">
                      <img
                        src={message.imageUrl}
                        alt="Uploaded content"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "4px",
                        }}
                      />
                    </Box>
                  )}
                  {isThreadThree && message.role === "assistant" && (
                    <VStack align="stretch" spacing={2}>
                      <HStack spacing={2} justify="flex-end">
                        <IconButton
                          aria-label="Like message"
                          icon={
                            <CheckIcon
                              color={
                                message.feedback === "like"
                                  ? isThreadThree
                                    ? "green.500"
                                    : `${getThreadColors().buttonColor}.500`
                                  : "gray.500"
                              }
                            />
                          }
                          size={{ base: "xs", sm: "sm" }}
                          variant={
                            message.feedback === "like" ? "solid" : "ghost"
                          }
                          colorScheme={
                            isThreadThree
                              ? "green"
                              : getThreadColors().buttonColor
                          }
                          onClick={() => handleFeedback(index, "like")}
                        />
                        <IconButton
                          aria-label="Dislike message"
                          icon={<NotAllowedIcon />}
                          size={{ base: "xs", sm: "sm" }}
                          variant={
                            message.feedback === "dislike" ? "solid" : "ghost"
                          }
                          colorScheme={
                            message.feedback === "dislike" ? "red" : "gray"
                          }
                          onClick={() => handleFeedback(index, "dislike")}
                        />
                      </HStack>
                      {isThreadThree &&
                        message.feedback === "dislike" &&
                        !message.feedbackText && (
                          <HStack width="100%">
                            <Input
                              id={`feedback-input-${threadId}-${index}`}
                              name={`feedback-input-${threadId}-${index}`}
                              value={feedbackInput}
                              onChange={(e) => setFeedbackInput(e.target.value)}
                              placeholder={placeholders.feedbackInput}
                              size={{ base: "xs", sm: "sm" }}
                              bg="white"
                              flex="1"
                              fontFamily={
                                isThreadThree
                                  ? fonts.body.tertiary
                                  : isThreadTwo
                                  ? fonts.body.primary
                                  : fonts.body.secondary
                              }
                              _placeholder={{
                                fontFamily: isThreadThree
                                  ? fonts.body.tertiary
                                  : isThreadTwo
                                  ? fonts.body.primary
                                  : fonts.body.secondary,
                                color: "gray.500",
                              }}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleThreadFeedbackSubmit(index);
                                }
                              }}
                            />
                            <IconButton
                              aria-label={buttonLabels.submitFeedback}
                              icon={<ChatIcon />}
                              size={{ base: "xs", sm: "sm" }}
                              colorScheme="red"
                              onClick={() => handleThreadFeedbackSubmit(index)}
                            />
                          </HStack>
                        )}
                    </VStack>
                  )}
                </Box>
              </Flex>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        <Box
          p={{ base: 2, sm: 3, md: 4 }}
          borderTop={isThreadThree ? "0" : "1px"}
          borderColor={colors.borderColor}
        >
          <VStack spacing={3}>
            {isThreadThree && imagePreview && (
              <Box position="relative" w="100%">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "4px",
                  }}
                />
                <IconButton
                  aria-label="Remove image"
                  icon={<CloseIcon />}
                  size={{ base: "xs", sm: "sm" }}
                  position="absolute"
                  top={1}
                  right={1}
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                />
              </Box>
            )}
            <Flex w="100%" gap={2}>
              <Input
                type="file"
                ref={fileInputRef}
                display="none"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Input
                id={`message-input-${threadId}`}
                name={`message-input-${threadId}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholders.messageInput}
                flex="1"
                fontFamily={
                  isThreadThree
                    ? fonts.body.tertiary
                    : isThreadTwo
                    ? fonts.body.primary
                    : fonts.body.secondary
                }
                _placeholder={{
                  fontFamily: isThreadThree
                    ? fonts.body.tertiary
                    : isThreadTwo
                    ? fonts.body.primary
                    : fonts.body.secondary,
                  color: "gray.500",
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                {...threadStyle}
                fontSize={{ base: "sm", sm: "md" }}
                size={{ base: "xs", sm: "sm" }}
                bg={getInputBgColor()}
                borderColor={colors.borderColor}
                borderWidth="1px"
                borderRadius={isThreadTwo ? "0" : "md"}
                _hover={{ borderColor: colors.borderColor }}
                _focus={{ borderColor: colors.borderColor }}
              />
              <IconButton
                aria-label={buttonLabels.send}
                icon={
                  <ChatIcon
                    boxSize={{ base: "20px", sm: "24px", md: "28px" }}
                    strokeWidth="0.5"
                  />
                }
                colorScheme={colors.buttonColor}
                onClick={handleSendMessage}
                isLoading={isLoading}
                size={{ base: "xs", sm: "sm", md: "md" }}
                borderRadius={isThreadTwo ? "0" : "md"}
              />
            </Flex>
            {isThreadOne && isThirdPersonEnabled && (
              <Flex w="100%">
                <Input
                  id={`third-person-input-${threadId}`}
                  name={`third-person-input-${threadId}`}
                  value={thirdPersonInput}
                  onChange={(e) => setThirdPersonInput(e.target.value)}
                  placeholder={placeholders.thirdPersonInput}
                  flex="1"
                  fontFamily={
                    isThreadThree
                      ? fonts.body.tertiary
                      : isThreadTwo
                      ? fonts.body.primary
                      : fonts.body.secondary
                  }
                  _placeholder={{
                    fontFamily: isThreadThree
                      ? fonts.body.tertiary
                      : isThreadTwo
                      ? fonts.body.primary
                      : fonts.body.secondary,
                    color: "gray.500",
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleThirdPersonMessage();
                    }
                  }}
                  {...threadStyle}
                  fontSize={{ base: "sm", sm: "md" }}
                  bg="white"
                  borderColor={colors.borderColor}
                  borderWidth="1px"
                  borderRadius={isThreadTwo ? "0" : "md"}
                  _hover={{ borderColor: colors.borderColor }}
                  _focus={{ borderColor: colors.borderColor }}
                />
                <IconButton
                  aria-label={buttonLabels.send}
                  icon={
                    <ChatIcon
                      boxSize={{ base: "20px", sm: "24px", md: "28px" }}
                      strokeWidth="0.5"
                    />
                  }
                  colorScheme={colors.buttonColor}
                  onClick={handleThirdPersonMessage}
                  size={{ base: "xs", sm: "sm", md: "md" }}
                  mr={2}
                />
                <IconButton
                  aria-label="Remove third person"
                  icon={<CloseIcon />}
                  colorScheme="red"
                  onClick={() => setIsThirdPersonEnabled(false)}
                  size={{ base: "xs", sm: "sm", md: "md" }}
                />
              </Flex>
            )}
          </VStack>
        </Box>
      </Box>

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Provide Feedback"
        primaryButtonText="Submit Feedback"
        onPrimaryButtonClick={handleFeedbackSubmit}
        isPrimaryButtonDisabled={!feedbackMessage.trim()}
        secondaryButtonText="Cancel"
      >
        <VStack spacing={6} h="100%">
          <Text color="gray.700" fontSize="md">
            How's my tone and the level of detail provided? Is it to your
            satisfaction?
          </Text>

          <VStack spacing={4} w="100%" align="stretch">
            <Box
              bg="gray.50"
              p={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Text fontWeight="medium" mb={2}>
                Current Settings:
              </Text>
              <VStack align="stretch" spacing={2}>
                <Flex justify="space-between">
                  <Text color="gray.600">Formality:</Text>
                  <Text fontWeight="medium">
                    {traitFeedback.trait === "formality"
                      ? [
                          "Very Casual",
                          "Casual",
                          "Neutral",
                          "Formal",
                          "Very Formal",
                        ][Math.round(traitFeedback.value * 4)]
                      : "Neutral"}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Detail:</Text>
                  <Text fontWeight="medium">
                    {traitFeedback.trait === "detail"
                      ? [
                          "Very Concise",
                          "Concise",
                          "Balanced",
                          "Detailed",
                          "Very Detailed",
                        ][Math.round(traitFeedback.value * 4)]
                      : "Balanced"}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Empathy:</Text>
                  <Text fontWeight="medium">
                    {traitFeedback.trait === "empathy"
                      ? [
                          "Very Objective",
                          "Objective",
                          "Balanced",
                          "Empathetic",
                          "Very Empathetic",
                        ][Math.round(traitFeedback.value * 4)]
                      : "Balanced"}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Humor:</Text>
                  <Text fontWeight="medium">
                    {traitFeedback.trait === "humor"
                      ? [
                          "Very Serious",
                          "Serious",
                          "Balanced",
                          "Humorous",
                          "Very Humorous",
                        ][Math.round(traitFeedback.value * 4)]
                      : "Balanced"}
                  </Text>
                </Flex>
              </VStack>
            </Box>

            <FormControl>
              <FormLabel>Formality Level</FormLabel>
              <RadioGroup
                value={
                  traitFeedback.trait === "formality"
                    ? String(Math.round(traitFeedback.value * 4))
                    : "2"
                }
                onChange={(val) =>
                  setTraitFeedback((prev) => ({
                    ...prev,
                    trait: "formality",
                    value: Number(val) / 4,
                  }))
                }
              >
                <HStack spacing={4} mb={2}>
                  <Radio value="0">Very Casual</Radio>
                  <Radio value="1">Casual</Radio>
                  <Radio value="2">Neutral</Radio>
                  <Radio value="3">Formal</Radio>
                  <Radio value="4">Very Formal</Radio>
                </HStack>
              </RadioGroup>
              <Slider
                value={
                  traitFeedback.trait === "formality"
                    ? traitFeedback.value * 100
                    : 50
                }
                onChange={(val) =>
                  setTraitFeedback((prev) => ({
                    ...prev,
                    trait: "formality",
                    value: val / 100,
                  }))
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl>
              <FormLabel>Detail Level</FormLabel>
              <RadioGroup
                value={
                  traitFeedback.trait === "detail"
                    ? String(Math.round(traitFeedback.value * 4))
                    : "2"
                }
                onChange={(val) =>
                  setTraitFeedback((prev) => ({
                    ...prev,
                    trait: "detail",
                    value: Number(val) / 4,
                  }))
                }
              >
                <HStack spacing={4} mb={2}>
                  <Radio value="0">Very Concise</Radio>
                  <Radio value="1">Concise</Radio>
                  <Radio value="2">Balanced</Radio>
                  <Radio value="3">Detailed</Radio>
                  <Radio value="4">Very Detailed</Radio>
                </HStack>
              </RadioGroup>
              <Slider
                value={
                  traitFeedback.trait === "detail"
                    ? traitFeedback.value * 100
                    : 50
                }
                onChange={(val) =>
                  setTraitFeedback((prev) => ({
                    ...prev,
                    trait: "detail",
                    value: val / 100,
                  }))
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl>
              <FormLabel>Empathy Level</FormLabel>
              <RadioGroup
                value={
                  traitFeedback.trait === "empathy"
                    ? String(Math.round(traitFeedback.value * 4))
                    : "2"
                }
                onChange={(val) =>
                  setTraitFeedback((prev) => ({
                    ...prev,
                    trait: "empathy",
                    value: Number(val) / 4,
                  }))
                }
              >
                <HStack spacing={4} mb={2}>
                  <Radio value="0">Very Objective</Radio>
                  <Radio value="1">Objective</Radio>
                  <Radio value="2">Balanced</Radio>
                  <Radio value="3">Empathetic</Radio>
                  <Radio value="4">Very Empathetic</Radio>
                </HStack>
              </RadioGroup>
              <Slider
                value={
                  traitFeedback.trait === "empathy"
                    ? traitFeedback.value * 100
                    : 50
                }
                onChange={(val) =>
                  setTraitFeedback((prev) => ({
                    ...prev,
                    trait: "empathy",
                    value: val / 100,
                  }))
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl>
              <FormLabel>Humor Level</FormLabel>
              <RadioGroup
                value={
                  traitFeedback.trait === "humor"
                    ? String(Math.round(traitFeedback.value * 4))
                    : "2"
                }
                onChange={(val) =>
                  setTraitFeedback((prev) => ({
                    ...prev,
                    trait: "humor",
                    value: Number(val) / 4,
                  }))
                }
              >
                <HStack spacing={4} mb={2}>
                  <Radio value="0">Very Serious</Radio>
                  <Radio value="1">Serious</Radio>
                  <Radio value="2">Balanced</Radio>
                  <Radio value="3">Humorous</Radio>
                  <Radio value="4">Very Humorous</Radio>
                </HStack>
              </RadioGroup>
              <Slider
                value={
                  traitFeedback.trait === "humor"
                    ? traitFeedback.value * 100
                    : 50
                }
                onChange={(val) =>
                  setTraitFeedback((prev) => ({
                    ...prev,
                    trait: "humor",
                    value: val / 100,
                  }))
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
          </VStack>

          <Textarea
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            placeholder="Share your thoughts about the tone and detail level..."
            size="md"
            w="100%"
            h="100%"
            resize="none"
            bg="gray.50"
            _hover={{ bg: "white" }}
            _focus={{ bg: "white", borderColor: "blue.400" }}
            fontSize="md"
            borderWidth="1px"
            borderColor="gray.200"
            _placeholder={{
              color: "gray.400",
              opacity: 0.8,
            }}
          />
        </VStack>
      </BaseModal>
    </>
  );
}
