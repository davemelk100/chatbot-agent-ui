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
  HStack,
} from "@chakra-ui/react";
import {
  ChatIcon,
  CloseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@chakra-ui/icons";
import {
  placeholders,
  buttonLabels,
  errorMessages,
} from "../../config/textContent";
import { threadStyles, threadColors, fonts } from "../../config/designSystem";
import BaseModal from "../BaseModal";
import { createChatCompletion, ChatMessage } from "../../services/openai";

interface Message {
  role: "user" | "assistant";
  content: string;
  model: string;
  feedback?: "like" | "dislike" | null;
  feedbackText?: string;
  imageUrl?: string;
}

export default function ContentFeedbackChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState<
    number | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = createStandaloneToast();

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      model: "gpt-4",
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(errorMessages.configError);
      }

      const apiMessages: ChatMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await createChatCompletion(
        apiKey,
        [...apiMessages, { role: "user", content: input }],
        "gpt-4"
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: response.choices[0].message.content,
        model: "gpt-4",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      let errorMessage = errorMessages.apiError;

      if (error.message.includes("API key")) {
        errorMessage = errorMessages.invalidApiKey;
      } else if (error.message.includes("rate limit")) {
        errorMessage = errorMessages.rateLimit;
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
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
      console.log("Feedback submitted:", {
        messageIndex: currentFeedbackIndex,
        feedback: message.feedback,
        feedbackText: message.feedbackText,
      });

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

  return (
    <>
      <Box
        w="100%"
        h={{ base: "80vh", sm: "75vh", md: "70vh" }}
        bg={threadColors.thread3.bg}
        borderRadius="lg"
        boxShadow="sm"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box p={{ base: 2, sm: 3, md: 4 }}>
          <Text
            fontSize={{ base: "md", sm: "lg" }}
            fontWeight="medium"
            {...threadStyles.thread3}
            color={threadColors.thread3.textColor}
          >
            Content Feedback
          </Text>
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
                justify={message.role === "user" ? "flex-end" : "flex-start"}
              >
                <Box
                  maxW={{ base: "90%", sm: "85%", md: "75%" }}
                  bg={
                    message.role === "user"
                      ? threadColors.thread3.userBg
                      : message.feedback === "like"
                      ? threadColors.thread3.assistantBgLiked
                      : message.feedback === "dislike"
                      ? threadColors.thread3.assistantBgDisliked
                      : threadColors.thread3.assistantBg
                  }
                  color={message.role === "user" ? "white" : "black"}
                  p="5px 10px"
                  borderRadius="5px"
                  boxShadow="sm"
                >
                  <Text
                    {...threadStyles.thread3}
                    fontSize={{ base: "xs", sm: "sm" }}
                    color={message.role === "user" ? "white" : "black"}
                  >
                    {message.content}
                  </Text>
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
                  {message.role === "assistant" && (
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
                                handleMessageFeedbackSubmit(index);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleMessageFeedbackSubmit(index)}
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
            {imagePreview && (
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholders.messageInput}
                flex="1"
                fontFamily={fonts.body.tertiary}
                _placeholder={{
                  fontFamily: fonts.body.tertiary,
                  color: "gray.500",
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                {...threadStyles.thread3}
                fontSize={{ base: "sm", sm: "md" }}
                size={{ base: "xs", sm: "sm" }}
                bg="blue.50"
                borderColor={threadColors.thread3.borderColor}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ borderColor: threadColors.thread3.borderColor }}
                _focus={{ borderColor: threadColors.thread3.borderColor }}
              />
              <IconButton
                aria-label={buttonLabels.send}
                icon={
                  <ChatIcon
                    boxSize={{ base: "20px", sm: "24px", md: "28px" }}
                    strokeWidth="0.5"
                  />
                }
                colorScheme={threadColors.thread3.buttonColor}
                onClick={handleSendMessage}
                isLoading={isLoading}
                size={{ base: "xs", sm: "sm", md: "md" }}
                borderRadius="md"
              />
            </Flex>
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
