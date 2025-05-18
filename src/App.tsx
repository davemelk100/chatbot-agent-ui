import {
  ChakraProvider,
  Box,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  VStack,
  Flex,
  Code,
  Button,
  Collapse,
} from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { threadDescriptions } from "./config/textContent";
import { theme } from "./config/designSystem";
import { ChatInterface } from "./components/lazy";
import { PersonalityProvider } from "./context/PersonalityContext";

function App() {
  const [showEmbedInstructions, setShowEmbedInstructions] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue(
    theme.colors.secondary[800],
    theme.colors.secondary[100]
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <ChakraProvider theme={theme}>
      <PersonalityProvider>
        <Flex minH="100vh" bg={bgColor}>
          {/* Main Content */}
          <Box
            flex="1"
            p={{
              base: theme.spacing.sm,
              sm: theme.spacing.md,
              md: theme.spacing.lg,
            }}
          >
            <Box maxW="1600px" mx="auto" px={{ base: 2, sm: 4, md: 6 }}>
              <Text
                fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                color={textColor}
                opacity={0.7}
                fontFamily="Avenir"
                fontWeight="semibold"
                mt={{ base: "16px", sm: "20px" }}
                mb={{ base: "16px", sm: "20px" }}
              >
                AGENT UI LAB
              </Text>
              <Box mb={6}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setShowEmbedInstructions(!showEmbedInstructions)
                  }
                  fontFamily="Roboto"
                  mb={2}
                >
                  {showEmbedInstructions
                    ? "Hide Embed Instructions"
                    : "Show Embed Instructions"}
                </Button>

                <Collapse in={showEmbedInstructions}>
                  <Box
                    p={4}
                    bg={bgColor}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    mb={4}
                  >
                    <VStack align="stretch" spacing={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        fontFamily="Roboto"
                      >
                        To embed this chat interface in your application:
                      </Text>

                      <Box>
                        <Text fontSize="sm" mb={1} fontFamily="Roboto">
                          1. Install dependencies:
                        </Text>
                        <Code
                          p={2}
                          borderRadius="md"
                          fontSize="sm"
                          display="block"
                          whiteSpace="pre"
                        >
                          {`npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion`}
                        </Code>
                      </Box>

                      <Box>
                        <Text fontSize="sm" mb={1} fontFamily="Roboto">
                          2. Import the component:
                        </Text>
                        <Code
                          p={2}
                          borderRadius="md"
                          fontSize="sm"
                          display="block"
                          whiteSpace="pre"
                        >
                          {`import EmbeddableChat from 'path/to/EmbeddableChat';`}
                        </Code>
                      </Box>

                      <Box>
                        <Text fontSize="sm" mb={1} fontFamily="Roboto">
                          3. Use in your app:
                        </Text>
                        <Code
                          p={2}
                          borderRadius="md"
                          fontSize="sm"
                          display="block"
                          whiteSpace="pre"
                        >
                          {`<EmbeddableChat
  apiKey="your-openai-api-key"  // Optional if using environment variable
  model="gpt-3.5-turbo"         // Optional
  initialMessage="Hello! How can I help you today?"  // Optional
  width="100%"                  // Optional
  height="500px"               // Optional
  theme={{                     // Optional
    primaryColor: "#3182CE",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    userMessageBg: "#3182CE",
    assistantMessageBg: "#F7FAFC"
  }}
/>`}
                        </Code>
                      </Box>

                      <Box>
                        <Text fontSize="sm" mb={1} fontFamily="Roboto">
                          4. Set up environment variable (optional):
                        </Text>
                        <Code
                          p={2}
                          borderRadius="md"
                          fontSize="sm"
                          display="block"
                          whiteSpace="pre"
                        >
                          {`VITE_OPENAI_API_KEY=your-openai-api-key`}
                        </Code>
                      </Box>

                      <Box>
                        <Text fontSize="sm" mb={1} fontFamily="Roboto">
                          5. Wrap your app with ChakraProvider:
                        </Text>
                        <Code
                          p={2}
                          borderRadius="md"
                          fontSize="sm"
                          display="block"
                          whiteSpace="pre"
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
                      </Box>
                    </VStack>
                  </Box>
                </Collapse>
              </Box>
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={{ base: 4, sm: 6 }}
              >
                {[0, 1, 2].map((threadId) => (
                  <GridItem key={threadId}>
                    <Box mb={{ base: theme.spacing.sm, sm: theme.spacing.md }}>
                      <Text
                        fontSize={{ base: "md", sm: "lg" }}
                        color={textColor}
                        mb={{ base: theme.spacing.xs, sm: theme.spacing.xs }}
                        fontFamily={theme.fonts.heading.primary}
                        fontWeight="medium"
                      >
                        {threadDescriptions[threadId].title}
                      </Text>
                      <Text
                        fontSize={{ base: "sm", sm: "md" }}
                        color={theme.colors.secondary[600]}
                        fontFamily={theme.fonts.body.primary}
                      >
                        {threadDescriptions[threadId].description}
                      </Text>
                    </Box>
                    <Suspense fallback={<div>Loading...</div>}>
                      <ChatInterface threadId={threadId} />
                    </Suspense>
                  </GridItem>
                ))}
              </Grid>
            </Box>
          </Box>
        </Flex>
      </PersonalityProvider>
    </ChakraProvider>
  );
}

export default App;
