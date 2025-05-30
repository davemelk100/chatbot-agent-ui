import {
  Box,
  VStack,
  Heading,
  Text,
  Code,
  useColorModeValue,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function EmbedInstructions() {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const popAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(0.85); }
    100% { transform: scale(1); }
  `;

  const codeBlocks = [
    "npm install chatbot-agent-ui",
    "import { EmbeddableChat } from 'chatbot-agent-ui';",
    `<EmbeddableChat
  apiKey="your-openai-api-key"
  model="gpt-3.5-turbo"
  initialMessage="Hello! How can I help you today?"
  width="400px"
  height="600px"
  position="bottom-right"
  theme={{
    primaryColor: "#3182CE",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    userMessageBg: "#3182CE",
    assistantMessageBg: "#F7FAFC"
  }}
/>`,
    "VITE_OPENAI_API_KEY=your-openai-api-key",
    `import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <YourApp />
    </ChakraProvider>
  )
}`,
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      mb={8}
      fontFamily="Avenir"
    >
      <VStack align="stretch" spacing={4}>
        <Heading size="md" fontFamily="Avenir">
          Embed the Chatbot
        </Heading>

        <Text fontSize="sm" fontFamily="Avenir">
          Embed chatbot to your website like this:
        </Text>

        <VStack align="stretch" spacing={3} pl={4}>
          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              mb={1}
              fontFamily="Avenir"
            >
              1. Install the required dependencies:
            </Text>
            <HStack spacing="4px" align="center">
              <Code
                p={2}
                borderRadius="md"
                fontSize="sm"
                display="inline-block"
                whiteSpace="nowrap"
              >
                {codeBlocks[0]}
              </Code>
              <IconButton
                aria-label="Copy code"
                icon={
                  copiedIndex === 0 ? (
                    <CheckIcon boxSize="16px" />
                  ) : (
                    <CopyIcon boxSize="16px" />
                  )
                }
                size="sm"
                onClick={() => handleCopy(codeBlocks[0], 0)}
                colorScheme={copiedIndex === 0 ? "green" : "gray"}
                minW="32px"
                h="32px"
                animation={
                  copiedIndex === 0
                    ? `${popAnimation} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)`
                    : "none"
                }
                transition="all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                _hover={{ transform: "scale(1.1)", bg: "gray.100" }}
                _active={{ transform: "scale(0.9)" }}
                bg={copiedIndex === 0 ? "green.100" : "transparent"}
              />
            </HStack>
          </Box>

          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              mb={1}
              fontFamily="Avenir"
            >
              2. Import the component:
            </Text>
            <HStack spacing="4px" align="center">
              <Code
                p={2}
                borderRadius="md"
                fontSize="sm"
                display="inline-block"
                whiteSpace="nowrap"
              >
                {codeBlocks[1]}
              </Code>
              <IconButton
                aria-label="Copy code"
                icon={
                  copiedIndex === 1 ? (
                    <CheckIcon boxSize="16px" />
                  ) : (
                    <CopyIcon boxSize="16px" />
                  )
                }
                size="sm"
                onClick={() => handleCopy(codeBlocks[1], 1)}
                colorScheme={copiedIndex === 1 ? "green" : "gray"}
                minW="32px"
                h="32px"
                animation={
                  copiedIndex === 1
                    ? `${popAnimation} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)`
                    : "none"
                }
                transition="all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                _hover={{ transform: "scale(1.1)", bg: "gray.100" }}
                _active={{ transform: "scale(0.9)" }}
                bg={copiedIndex === 1 ? "green.100" : "transparent"}
              />
            </HStack>
          </Box>

          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              mb={1}
              fontFamily="Avenir"
            >
              3. Use the component in your app:
            </Text>
            <HStack spacing="4px" align="center">
              <Code
                p={2}
                borderRadius="md"
                fontSize="sm"
                display="inline-block"
                whiteSpace="nowrap"
              >
                {codeBlocks[2]}
              </Code>
              <IconButton
                aria-label="Copy code"
                icon={
                  copiedIndex === 2 ? (
                    <CheckIcon boxSize="16px" />
                  ) : (
                    <CopyIcon boxSize="16px" />
                  )
                }
                size="sm"
                onClick={() => handleCopy(codeBlocks[2], 2)}
                colorScheme={copiedIndex === 2 ? "green" : "gray"}
                minW="32px"
                h="32px"
                animation={
                  copiedIndex === 2
                    ? `${popAnimation} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)`
                    : "none"
                }
                transition="all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                _hover={{ transform: "scale(1.1)", bg: "gray.100" }}
                _active={{ transform: "scale(0.9)" }}
                bg={copiedIndex === 2 ? "green.100" : "transparent"}
              />
            </HStack>
          </Box>

          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              mb={1}
              fontFamily="Avenir"
            >
              4. Set up the environment variable (optional):
            </Text>
            <HStack spacing="4px" align="center">
              <Code
                p={2}
                borderRadius="md"
                fontSize="sm"
                display="inline-block"
                whiteSpace="nowrap"
              >
                {`VITE_OPENAI_API_KEY=your-openai-api-key`}
              </Code>
              <IconButton
                aria-label="Copy code"
                icon={
                  copiedIndex === 3 ? (
                    <CheckIcon boxSize="16px" />
                  ) : (
                    <CopyIcon boxSize="16px" />
                  )
                }
                size="sm"
                onClick={() => handleCopy(codeBlocks[3], 3)}
                colorScheme={copiedIndex === 3 ? "green" : "gray"}
                minW="32px"
                h="32px"
                animation={
                  copiedIndex === 3
                    ? `${popAnimation} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)`
                    : "none"
                }
                transition="all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                _hover={{ transform: "scale(1.1)", bg: "gray.100" }}
                _active={{ transform: "scale(0.9)" }}
                bg={copiedIndex === 3 ? "green.100" : "transparent"}
              />
            </HStack>
          </Box>

          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              mb={1}
              fontFamily="Avenir"
            >
              5. Wrap your app with ChakraProvider:
            </Text>
            <HStack spacing="4px" align="center">
              <Code
                p={2}
                borderRadius="md"
                fontSize="sm"
                display="inline-block"
                whiteSpace="nowrap"
              >
                {`import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <YourApp />
    </ChakraProvider>
  )
}`}
              </Code>
              <IconButton
                aria-label="Copy code"
                icon={
                  copiedIndex === 4 ? (
                    <CheckIcon boxSize="16px" />
                  ) : (
                    <CopyIcon boxSize="16px" />
                  )
                }
                size="sm"
                onClick={() => handleCopy(codeBlocks[4], 4)}
                colorScheme={copiedIndex === 4 ? "green" : "gray"}
                minW="32px"
                h="32px"
                animation={
                  copiedIndex === 4
                    ? `${popAnimation} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)`
                    : "none"
                }
                transition="all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                _hover={{ transform: "scale(1.1)", bg: "gray.100" }}
                _active={{ transform: "scale(0.9)" }}
                bg={copiedIndex === 4 ? "green.100" : "transparent"}
              />
            </HStack>
          </Box>
        </VStack>

        <Text fontSize="sm" color="gray.600" mt={2} fontFamily="Avenir">
          Customize the chatbot's appearance and behavior using the props above.
          The chatbot will appear as a floating button that expands into a full
          chat interface when clicked.
        </Text>
      </VStack>
    </Box>
  );
}
