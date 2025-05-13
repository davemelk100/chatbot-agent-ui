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
  FormLabel,
} from "@chakra-ui/react";
import {
  ChatIcon,
  CloseIcon,
  AddIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SettingsIcon,
  AddIcon as UserAddIcon,
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
      <Box key={index} mb={index < content.split("\n\n").length - 1 ? 2 : 0}>
        {paragraph}
      </Box>
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
        <Box
          key={index}
          as="span"
          fontFamily="monospace"
          bg="gray.100"
          px={1}
          py={0.5}
          borderRadius="sm"
          display="inline"
        >
          {code}
        </Box>
      );
    } else {
      // Regular text - split into paragraphs
      return part.split("\n\n").map((paragraph, pIndex) => (
        <Box
          key={`${index}-${pIndex}`}
          mb={pIndex < part.split("\n\n").length - 1 ? 2 : 0}
        >
          {paragraph}
        </Box>
      ));
    }
  });
}

export default function ChatInterface({ threadId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thirdPersonInput, setThirdPersonInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isThirdPersonEnabled, setIsThirdPersonEnabled] = useState(false);
  const [selectedModel, setSelectedModel] = useState<LLMModel>("gpt-3.5-turbo");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = createStandaloneToast();
  const [showJoiner, setShowJoiner] = useState(false);
  const { updatePersonality, personality } = usePersonality();
  const [traitFeedback, setTraitFeedback] = useState<PersonalityFeedback>({
    trait: "formality",
    value: 0.5,
    feedback: "",
    formality: 0.5,
    detail: 0.5,
    empathy: 0.5,
    humor: 0.5,
  });
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState<
    number | null
  >(null);

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
          content: isThreadFour
            ? `You are a helpful assistant with the following personality settings:
               - Formality: ${formalityLevel}
               - Detail: ${detailLevel}
               - Empathy: ${empathyLevel}
               - Humor: ${humorLevel}
               
               Adjust your responses according to these settings. Keep responses friendly and engaging.`
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
              feedback: msg.feedback === feedback ? null : feedback,
              feedbackText: feedback === "dislike" ? "" : undefined,
            }
          : msg
      )
    );
  };

  const handleMessageFeedbackSubmit = (messageIndex: number) => {
    const message = messages[messageIndex];
    if (message.feedback === "dislike" && message.feedbackText?.trim()) {
      setCurrentFeedbackIndex(messageIndex);
      setIsFeedbackModalOpen(true);
    }
  };

  const handleConfirmFeedback = () => {
    if (currentFeedbackIndex !== null) {
      const message = messages[currentFeedbackIndex];
      // Here you could send the feedback to your backend
      console.log("Feedback submitted:", {
        messageIndex: currentFeedbackIndex,
        feedback: message.feedback,
        feedbackText: message.feedbackText,
      });

      // Reset the feedback state
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === currentFeedbackIndex
            ? { ...msg, feedback: null, feedbackText: undefined }
            : msg
        )
      );
      setIsFeedbackModalOpen(false);
      setCurrentFeedbackIndex(null);
    }
  };

  const handleFeedbackSubmit = useCallback(() => {
    // Create a complete personality trait object with all values
    const personalityTrait: PersonalityFeedback = {
      trait: traitFeedback.trait,
      value: traitFeedback.value,
      feedback: "", // Empty string since we removed the textarea
      formality: Number(traitFeedback.formality),
      detail: Number(traitFeedback.detail),
      empathy: Number(traitFeedback.empathy),
      humor: Number(traitFeedback.humor),
    };

    // Update personality with all trait values
    updatePersonality(personalityTrait);

    // Show success toast
    toast({
      title: "Settings Saved",
      description: "Your personality preferences have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
      containerStyle: {
        background: "transparent",
        maxWidth: "300px",
        fontSize: "sm",
        fontFamily: "Roboto",
        boxShadow: "none",
      },
    });

    // Reset feedback state
    setTraitFeedback({
      trait: "formality",
      value: 0.5,
      feedback: "",
      formality: 0.5,
      detail: 0.5,
      empathy: 0.5,
      humor: 0.5,
    });
  }, [traitFeedback, updatePersonality, toast]);

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
        <Box p={{ base: 2, sm: 3, md: 4 }}>
          <Flex justify="space-between" align="center" gap={2}>
            <Flex align="center" gap={2}>
              <Text
                fontSize={{ base: "md", sm: "lg" }}
                fontWeight="medium"
                {...threadStyle}
                color={colors.textColor}
              >
                {isThreadOne
                  ? "Three Way Chat"
                  : isThreadTwo
                  ? "Select a Model"
                  : isThreadThree
                  ? "Content Feedback"
                  : isThreadFour
                  ? "Tuning"
                  : `Chatbot ${threadId + 1}`}
              </Text>
            </Flex>
            <Flex gap={{ base: 2, sm: 4 }} align="center">
              {isThreadOne && !isThirdPersonEnabled && (
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
              {isThreadTwo && (
                <FormControl w="auto">
                  <Select
                    id="model-select"
                    size={{ base: "xs", sm: "sm" }}
                    value={selectedModel}
                    onChange={(e) =>
                      setSelectedModel(e.target.value as LLMModel)
                    }
                    pr={2}
                    bg="transparent"
                    borderWidth="1px"
                    borderColor={colors.textColor}
                    _hover={{ borderColor: colors.textColor, opacity: 0.8 }}
                    _focus={{
                      borderColor: colors.textColor,
                      boxShadow: "none",
                    }}
                    fontFamily="Roboto"
                    fontSize={{ base: "xs", sm: "sm" }}
                    fontWeight="medium"
                    color={colors.textColor}
                    cursor="pointer"
                    px={4}
                    py={2}
                    borderRadius="md"
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
                  p="5px 10px"
                  borderRadius="5px"
                  boxShadow="sm"
                >
                  <Box
                    {...threadStyle}
                    fontSize={{ base: "xs", sm: "sm" }}
                    color={
                      message.role === "user"
                        ? "white"
                        : isThreadThree
                        ? "black"
                        : "black"
                    }
                  >
                    {formatMessageContent(message.content)}
                  </Box>
                  {message.role === "assistant" && isThreadTwo && (
                    <Box
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
                    </Box>
                  )}
                  {message.role === "assistant" && isThreadFour && (
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme={colors.buttonColor}
                      mt={2}
                      leftIcon={<ChatIcon boxSize="14px" />}
                      onClick={handleFeedbackSubmit}
                      fontFamily={fonts.body.primary}
                      fontSize="xs"
                    >
                      Tune your bot's tone
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
                    <VStack align="stretch" spacing={2} mt={2}>
                      <HStack spacing={2} justify="flex-end">
                        <Box
                          as="button"
                          onClick={() => handleFeedback(index, "like")}
                          p={1}
                          _hover={{ opacity: 0.8 }}
                          _active={{ opacity: 0.6 }}
                        >
                          <ArrowUpIcon
                            boxSize="20px"
                            color={
                              message.feedback === "like"
                                ? "green.500"
                                : "gray.500"
                            }
                          />
                        </Box>
                        <Box
                          as="button"
                          onClick={() => handleFeedback(index, "dislike")}
                          p={1}
                          _hover={{ opacity: 0.8 }}
                          _active={{ opacity: 0.6 }}
                        >
                          <ArrowDownIcon
                            boxSize="20px"
                            color={
                              message.feedback === "dislike"
                                ? "red.500"
                                : "gray.500"
                            }
                          />
                        </Box>
                      </HStack>
                      {message.feedback === "dislike" && (
                        <HStack spacing={2}>
                          <Input
                            placeholder="What could be improved?"
                            size="sm"
                            value={message.feedbackText || ""}
                            onChange={(e) => {
                              setMessages((prev) =>
                                prev.map((msg, idx) =>
                                  idx === index
                                    ? { ...msg, feedbackText: e.target.value }
                                    : msg
                                )
                              );
                            }}
                            bg="white"
                            borderColor="gray.200"
                            _hover={{ borderColor: "gray.300" }}
                            _focus={{ borderColor: "blue.500" }}
                            onKeyPress={(e) => {
                              if (
                                e.key === "Enter" &&
                                message.feedbackText?.trim()
                              ) {
                                setCurrentFeedbackIndex(index);
                                setIsFeedbackModalOpen(true);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => {
                              setCurrentFeedbackIndex(index);
                              setIsFeedbackModalOpen(true);
                            }}
                            isDisabled={!message.feedbackText?.trim()}
                          >
                            Submit
                          </Button>
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

        <Box p={{ base: 2, sm: 3, md: 4 }}>
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
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setCurrentFeedbackIndex(null);
        }}
        title="Submit Feedback"
        primaryButtonText="Submit"
        onPrimaryButtonClick={handleConfirmFeedback}
        secondaryButtonText="Cancel"
      >
        <VStack spacing={4} align="stretch">
          <Text fontFamily="Roboto">
            Are you sure you want to submit this feedback?
          </Text>
          {currentFeedbackIndex !== null &&
            messages[currentFeedbackIndex]?.feedbackText && (
              <Box
                p={4}
                bg="gray.50"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <Text fontFamily="Roboto" color="gray.700">
                  {messages[currentFeedbackIndex].feedbackText}
                </Text>
              </Box>
            )}
        </VStack>
      </BaseModal>
    </>
  );
}
