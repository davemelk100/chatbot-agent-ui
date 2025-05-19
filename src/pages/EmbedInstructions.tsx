import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Code,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import EmbeddableChat from "../components/EmbeddableChat";

export default function EmbedInstructions() {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={4}>
            Embed Instructions
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Follow these instructions to embed the chatbot in your application.
          </Text>
        </Box>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Quick Start</Tab>
            <Tab>Configuration</Tab>
            <Tab>Live Demo</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading as="h3" size="md" mb={3}>
                    1. Install the Package
                  </Heading>
                  <Code
                    p={4}
                    borderRadius="md"
                    bg={bgColor}
                    border="1px"
                    borderColor={borderColor}
                  >
                    npm install @agent-ui-lab/chatbot
                  </Code>
                </Box>

                <Box>
                  <Heading as="h3" size="md" mb={3}>
                    2. Import and Use
                  </Heading>
                  <Code
                    p={4}
                    borderRadius="md"
                    bg={bgColor}
                    border="1px"
                    borderColor={borderColor}
                  >
                    {`import { EmbeddableChat } from '@agent-ui-lab/chatbot';

function App() {
  return (
    <EmbeddableChat
      apiKey="your-openai-api-key"
      defaultChatType="content-feedback"
    />
  );
}`}
                  </Code>
                </Box>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading as="h3" size="md" mb={3}>
                    Basic Configuration
                  </Heading>
                  <Code
                    p={4}
                    borderRadius="md"
                    bg={bgColor}
                    border="1px"
                    borderColor={borderColor}
                  >
                    {`<EmbeddableChat
  apiKey="your-openai-api-key"
  model="gpt-4"
  defaultChatType="content-feedback"
  onError={(error) => console.error(error)}
/>`}
                  </Code>
                </Box>

                <Box>
                  <Heading as="h3" size="md" mb={3}>
                    Theme Customization
                  </Heading>
                  <Code
                    p={4}
                    borderRadius="md"
                    bg={bgColor}
                    border="1px"
                    borderColor={borderColor}
                  >
                    {`const customTheme = {
  colors: {
    primary: '#3182CE',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
      },
    },
  },
};

<EmbeddableChat
  theme={customTheme}
  apiKey="your-openai-api-key"
/>`}
                  </Code>
                </Box>

                <Box>
                  <Heading as="h3" size="md" mb={3}>
                    Chat Type Selection
                  </Heading>
                  <Code
                    p={4}
                    borderRadius="md"
                    bg={bgColor}
                    border="1px"
                    borderColor={borderColor}
                  >
                    {`<EmbeddableChat
  defaultChatType="content-feedback"
  showChatSelector={true}
  allowedChatTypes={["content-feedback", "personality-tuning"]}
  apiKey="your-openai-api-key"
/>`}
                  </Code>
                </Box>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading as="h3" size="md" mb={3}>
                    Live Demo
                  </Heading>
                  <Box
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="md"
                    p={4}
                    bg={bgColor}
                  >
                    <EmbeddableChat
                      defaultChatType="content-feedback"
                      showChatSelector={true}
                      allowedChatTypes={[
                        "content-feedback",
                        "personality-tuning",
                        "three-way",
                      ]}
                    />
                  </Box>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Box mt={8}>
          <Text fontSize="sm" color="gray.500">
            For more detailed documentation, visit our{" "}
            <Link
              href="https://github.com/davemelk100/chatbot-agent-ui"
              isExternal
              color="blue.500"
            >
              GitHub repository
            </Link>
            .
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
