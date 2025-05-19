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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import {
  placeholders,
  buttonLabels,
  errorMessages,
} from "../../config/textContent";
import { threadStyles, threadColors, fonts } from "../../config/designSystem";
import { createChatCompletion, ChatMessage } from "../../services/openai";

interface Message {
  role: "user" | "assistant";
  content: string;
  model: string;
}

interface PersonalityTraits {
  formality: number;
  detailLevel: number;
  empathy: number;
  humor: number;
}

export default function PersonalityTuningChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [personalityTraits, setPersonalityTraits] = useState<PersonalityTraits>(
    {
      formality: 5,
      detailLevel: 5,
      empathy: 5,
      humor: 5,
    }
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = createStandaloneToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      model: "gpt-4",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(errorMessages.configError);
      }

      const systemMessage = `You are an AI assistant with the following personality traits:
- Formality: ${personalityTraits.formality}/10
- Detail Level: ${personalityTraits.detailLevel}/10
- Empathy: ${personalityTraits.empathy}/10
- Humor: ${personalityTraits.humor}/10

Adjust your responses based on these traits.`;

      const apiMessages: ChatMessage[] = [
        { role: "system", content: systemMessage },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: input },
      ];

      const response = await createChatCompletion(apiKey, apiMessages, "gpt-4");

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

  const handleSavePersonality = () => {
    onClose();
  };

  return (
    <>
      <Box
        w="100%"
        h={{ base: "80vh", sm: "75vh", md: "70vh" }}
        bg={threadColors.thread2.bg}
        borderRadius="lg"
        boxShadow="sm"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box p={{ base: 2, sm: 3, md: 4 }}>
          <Flex justify="space-between" align="center">
            <Text
              fontSize={{ base: "md", sm: "lg" }}
              fontWeight="medium"
              {...threadStyles.thread2}
              color={threadColors.thread2.textColor}
            >
              Personality Tuning
            </Text>
            <Button
              size="sm"
              onClick={onOpen}
              colorScheme={threadColors.thread2.buttonColor}
            >
              Adjust Tone
            </Button>
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
                justify={message.role === "user" ? "flex-end" : "flex-start"}
              >
                <Box
                  maxW={{ base: "90%", sm: "85%", md: "75%" }}
                  bg={
                    message.role === "user"
                      ? threadColors.thread2.userBg
                      : threadColors.thread2.assistantBg
                  }
                  color={message.role === "user" ? "white" : "black"}
                  p="5px 10px"
                  borderRadius="5px"
                  boxShadow="sm"
                >
                  <Text
                    {...threadStyles.thread2}
                    fontSize={{ base: "xs", sm: "sm" }}
                    color={message.role === "user" ? "white" : "black"}
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
          <Flex w="100%" gap={2}>
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
              {...threadStyles.thread2}
              fontSize={{ base: "sm", sm: "md" }}
              size={{ base: "xs", sm: "sm" }}
              bg="blue.50"
              borderColor={threadColors.thread2.borderColor}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ borderColor: threadColors.thread2.borderColor }}
              _focus={{ borderColor: threadColors.thread2.borderColor }}
            />
            <IconButton
              aria-label={buttonLabels.send}
              icon={
                <ChatIcon
                  boxSize={{ base: "20px", sm: "24px", md: "28px" }}
                  strokeWidth="0.5"
                />
              }
              colorScheme={threadColors.thread2.buttonColor}
              onClick={handleSendMessage}
              isLoading={isLoading}
              size={{ base: "xs", sm: "sm", md: "md" }}
              borderRadius="md"
            />
          </Flex>
        </Box>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
        size="full"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent
          bg={threadColors.thread2.bg}
          borderRadius="lg"
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          fontFamily={fonts.body.primary}
          w="45vw"
          h="65vh"
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
            color={threadColors.thread2.textColor}
            borderBottomWidth="1px"
            borderColor={threadColors.thread2.borderColor}
            pb={2}
            pt={3}
            px={4}
            position="relative"
            textAlign="left"
          >
            Adjust Bot's Tone
            <ModalCloseButton
              color={threadColors.thread2.textColor}
              _hover={{ color: threadColors.thread2.buttonColor }}
              size="sm"
              position="absolute"
              top="50%"
              right={2}
              transform="translateY(-50%)"
              zIndex={1}
            />
          </ModalHeader>
          <ModalBody py={3} px={4} flex="1" overflowY="auto">
            <VStack
              spacing={2}
              align="stretch"
              h="100%"
              justify="space-between"
            >
              <VStack spacing={2} align="stretch" flex="1">
                <FormControl>
                  <Flex justify="space-between" align="center" mb={1}>
                    <FormLabel
                      fontSize="xs"
                      fontWeight="medium"
                      color={threadColors.thread2.textColor}
                      mb={0}
                    >
                      Formality
                    </FormLabel>
                  </Flex>
                  <NumberInput
                    value={personalityTraits.formality}
                    onChange={(_, value) =>
                      setPersonalityTraits((prev) => ({
                        ...prev,
                        formality: value,
                      }))
                    }
                    min={1}
                    max={10}
                    size="md"
                  >
                    <NumberInputField
                      bg="white"
                      borderColor={threadColors.thread2.borderColor}
                      h="40px"
                      fontSize="md"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper h="20px" />
                      <NumberDecrementStepper h="20px" />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <Flex justify="space-between" align="center" mb={1}>
                    <FormLabel
                      fontSize="xs"
                      fontWeight="medium"
                      color={threadColors.thread2.textColor}
                      mb={0}
                    >
                      Detail Level
                    </FormLabel>
                  </Flex>
                  <NumberInput
                    value={personalityTraits.detailLevel}
                    onChange={(_, value) =>
                      setPersonalityTraits((prev) => ({
                        ...prev,
                        detailLevel: value,
                      }))
                    }
                    min={1}
                    max={10}
                    size="md"
                  >
                    <NumberInputField
                      bg="white"
                      borderColor={threadColors.thread2.borderColor}
                      h="40px"
                      fontSize="md"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper h="20px" />
                      <NumberDecrementStepper h="20px" />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <Flex justify="space-between" align="center" mb={1}>
                    <FormLabel
                      fontSize="xs"
                      fontWeight="medium"
                      color={threadColors.thread2.textColor}
                      mb={0}
                    >
                      Empathy
                    </FormLabel>
                  </Flex>
                  <NumberInput
                    value={personalityTraits.empathy}
                    onChange={(_, value) =>
                      setPersonalityTraits((prev) => ({
                        ...prev,
                        empathy: value,
                      }))
                    }
                    min={1}
                    max={10}
                    size="md"
                  >
                    <NumberInputField
                      bg="white"
                      borderColor={threadColors.thread2.borderColor}
                      h="40px"
                      fontSize="md"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper h="20px" />
                      <NumberDecrementStepper h="20px" />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <Flex justify="space-between" align="center" mb={1}>
                    <FormLabel
                      fontSize="xs"
                      fontWeight="medium"
                      color={threadColors.thread2.textColor}
                      mb={0}
                    >
                      Humor
                    </FormLabel>
                  </Flex>
                  <NumberInput
                    value={personalityTraits.humor}
                    onChange={(_, value) =>
                      setPersonalityTraits((prev) => ({
                        ...prev,
                        humor: value,
                      }))
                    }
                    min={1}
                    max={10}
                    size="md"
                  >
                    <NumberInputField
                      bg="white"
                      borderColor={threadColors.thread2.borderColor}
                      h="40px"
                      fontSize="md"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper h="20px" />
                      <NumberDecrementStepper h="20px" />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>

              <Button
                colorScheme={threadColors.thread2.buttonColor}
                onClick={handleSavePersonality}
                width="100%"
                size="sm"
                fontWeight="medium"
                h="36px"
                px={6}
                borderRadius="full"
                bg="white"
                color={threadColors.thread2.buttonColor}
                boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                _hover={{
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  bg: "gray.50",
                }}
                _active={{
                  transform: "translateY(0)",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  bg: "gray.100",
                }}
              >
                Save Settings
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
