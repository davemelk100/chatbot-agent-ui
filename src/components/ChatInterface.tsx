import { useState, useRef, useEffect } from "react";
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
import OpenAI from "openai";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = createStandaloneToast();
  const [showJoiner, setShowJoiner] = useState(false);

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

  const getThreadStyle = () => {
    switch (threadId) {
      case 0:
        return threadStyles.thread1;
      case 1:
        return threadStyles.thread2;
      case 2:
        return threadStyles.thread3;
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
      default:
        return threadColors.thread1;
    }
  };

  const threadStyle = getThreadStyle();
  const colors = getThreadColors();

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

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
          containerStyle: {
            background: "white",
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
    if (!input.trim() && !selectedImage) return;

    // Check if API key is set
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "Configuration Error",
        description: errorMessages.configError,
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          background: "white",
        },
      });
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      imageUrl: imagePreview || undefined,
      model: selectedImage ? "gpt-4-vision-preview" : "gpt-3.5-turbo",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
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
      ];

      const model: LLMModel = selectedImage
        ? "gpt-4-vision-preview"
        : isThreadTwo
        ? selectedModel
        : isThreadThree
        ? "gpt-4"
        : "gpt-3.5-turbo";

      // If there's an image, add it to the messages
      if (selectedImage) {
        const base64Image = imagePreview?.split(",")[1]; // Remove the data URL prefix
        if (model === "gpt-4-vision-preview") {
          const content: OpenAI.Chat.ChatCompletionContentPart[] = [
            {
              type: "text",
              text: input || "What can you tell me about this image?",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ];
          apiMessages.push({
            role: "user",
            content,
          });
        } else {
          // For non-vision models, just send the text
          apiMessages.push({
            role: "user",
            content:
              input ||
              "I have uploaded an image. Please note that I can only process text at the moment.",
          });
        }
      } else {
        apiMessages.push({ role: "user", content: input });
      }

      console.log("Sending request to OpenAI with model:", model);
      console.log("Message content:", JSON.stringify(apiMessages, null, 2));

      const completion = await openai.chat.completions.create({
        messages: apiMessages,
        model,
      });

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
        duration: 5000,
        isClosable: true,
        containerStyle: {
          background: "white",
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
        containerStyle: {
          background: "white",
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

  const handleFeedbackSubmit = (messageIndex: number) => {
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
          <Heading
            size={{
              base: "xs",
              sm: "sm",
              md: isThreadTwo ? "md" : "sm",
            }}
            {...threadStyle}
            color={isThreadThree ? colors.bg : colors.textColor}
          >
            <Flex align="center" gap={2}>
              {isThreadOne && <UserAddIcon />}
              {isThreadTwo && <SettingsIcon />}
              {isThreadThree && <ArrowUpIcon />}
              Chatbot {threadId + 1}
            </Flex>
          </Heading>
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
                  onChange={(e) => setSelectedModel(e.target.value as LLMModel)}
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
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  color={
                    message.role === "user"
                      ? "white"
                      : isThreadThree
                      ? "black"
                      : "black"
                  }
                >
                  {message.content}
                </Text>
                {message.role === "assistant" && isThreadTwo && (
                  <Text
                    fontSize="xs"
                    color={theme.colors.secondary[500]}
                    fontStyle="italic"
                    mt={1}
                  >
                    Generated by {selectedModel}
                  </Text>
                )}
                {message.role === "assistant" && (
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme={colors.buttonColor}
                    mt={2}
                    leftIcon={<ChatIcon />}
                    onClick={() => {
                      setInput(
                        `Can you tell me more about: ${
                          message.content.split(".")[0]
                        }?`
                      );
                    }}
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
                                handleFeedbackSubmit(index);
                              }
                            }}
                          />
                          <IconButton
                            aria-label={buttonLabels.submitFeedback}
                            icon={<ChatIcon />}
                            size={{ base: "xs", sm: "sm" }}
                            colorScheme="red"
                            onClick={() => handleFeedbackSubmit(index)}
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
              fontSize={{ base: "xs", sm: "sm", md: "md" }}
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
              icon={<ChatIcon />}
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
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                bg="white"
                borderColor={colors.borderColor}
                borderWidth="1px"
                borderRadius={isThreadTwo ? "0" : "md"}
                _hover={{ borderColor: colors.borderColor }}
                _focus={{ borderColor: colors.borderColor }}
              />
              <IconButton
                aria-label={buttonLabels.send}
                icon={<ChatIcon />}
                colorScheme={colors.buttonColor}
                onClick={handleThirdPersonMessage}
                size={{ base: "xs", sm: "sm", md: "md" }}
              />
            </Flex>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
