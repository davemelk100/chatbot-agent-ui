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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
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
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentRatingIndex, setCurrentRatingIndex] = useState<number | null>(
    null
  );
  const [ratingValue, setRatingValue] = useState<string>("");
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

  const handleRateClick = (index: number) => {
    setCurrentRatingIndex(index);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = (feedback: "like" | "dislike") => {
    if (currentRatingIndex !== null) {
      handleFeedback(currentRatingIndex, feedback);
      setIsRatingModalOpen(false);
      setCurrentRatingIndex(null);
      setRatingValue("");
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
                        <Button
                          size="sm"
                          variant="link"
                          color="blue.500"
                          onClick={() => handleRateClick(index)}
                          _hover={{ textDecoration: "underline" }}
                          fontSize="xs"
                        >
                          Rate this response
                        </Button>
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

      {/* Rating Modal */}
      <Modal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setCurrentRatingIndex(null);
        }}
        isCentered
        motionPreset="slideInBottom"
        size="full"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent
          bg={threadColors.thread3.bg}
          borderRadius="lg"
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          fontFamily={fonts.body.primary}
          w="30vw"
          h="50vh"
          maxW="none"
          mx="auto"
          mt="20vh"
          display="flex"
          flexDirection="column"
          position="relative"
        >
          <ModalHeader
            fontSize={{ base: "sm", sm: "md" }}
            fontWeight="medium"
            color={threadColors.thread3.textColor}
            borderBottomWidth="1px"
            borderColor={threadColors.thread3.borderColor}
            pb={2}
            pt={3}
            px={4}
            position="relative"
            textAlign="left"
          >
            Rate this response
            <ModalCloseButton
              color={threadColors.thread3.textColor}
              _hover={{ color: threadColors.thread3.buttonColor }}
              size="sm"
              position="absolute"
              top="50%"
              right={2}
              transform="translateY(-50%)"
            />
          </ModalHeader>
          <ModalBody
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <VStack spacing={4} align="stretch" w="100%">
              <Button
                size="lg"
                variant={ratingValue === "like" ? "solid" : "outline"}
                colorScheme="green"
                onClick={() => {
                  setRatingValue("like");
                  handleRatingSubmit("like");
                }}
                _hover={{
                  bg: ratingValue === "like" ? "green.500" : "green.50",
                }}
                height="48px"
                fontSize="md"
                fontWeight="medium"
                borderRadius="md"
                boxShadow="sm"
                borderWidth="2px"
                _active={{
                  transform: "scale(0.95)",
                  transition: "transform 0.1s ease-in-out",
                  bg: "black",
                  color: "white",
                  borderColor: "black",
                }}
                transition="all 0.2s ease-in-out"
              >
                Good Response
              </Button>
              <Button
                size="lg"
                variant={ratingValue === "dislike" ? "solid" : "outline"}
                colorScheme="red"
                onClick={() => {
                  setRatingValue("dislike");
                  handleRatingSubmit("dislike");
                }}
                _hover={{
                  bg: ratingValue === "dislike" ? "red.500" : "red.50",
                }}
                height="48px"
                fontSize="md"
                fontWeight="medium"
                borderRadius="md"
                boxShadow="sm"
                borderWidth="2px"
                _active={{
                  transform: "scale(0.95)",
                  transition: "transform 0.1s ease-in-out",
                  bg: "black",
                  color: "white",
                  borderColor: "black",
                }}
                transition="all 0.2s ease-in-out"
              >
                Needs Improvement
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Existing Feedback Modal */}
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
