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
    "npm install @agent-ui-lab/chatbot",
    "import { EmbeddableChat } from '@agent-ui-lab/chatbot';",
    `<EmbeddableChat
  threadId={0}
  apiKey="your-api-key"
  position="bottom-right"
  width="350px"
  height="500px"
/>`,
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
          Add our chatbot to your website in three simple steps:
        </Text>

        <VStack align="stretch" spacing={3} pl={4}>
          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              mb={1}
              fontFamily="Avenir"
            >
              1. Install the package
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
              2. Import the component
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
              3. Add to your page
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
