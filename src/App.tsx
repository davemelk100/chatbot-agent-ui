import {
  ChakraProvider,
  Box,
  Grid,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChatInterface } from "./components/ChatInterface";
import { threadDescriptions, appTitle } from "./config/textContent";

function App() {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <ChakraProvider>
      <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 8 }}>
        <Box maxW="1600px" mx="auto">
          <Heading
            as="h1"
            size={{ base: "lg", md: "xl" }}
            mb={{ base: 6, md: 8 }}
            color={textColor}
            fontFamily="'Avenir', sans-serif"
            fontWeight="500"
            textAlign="left"
          >
            {appTitle}
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={{ base: 4, md: 6 }}
          >
            {[0, 1, 2, 3].map((threadId) => (
              <Box key={threadId}>
                <Box mb={3}>
                  <Heading
                    size="sm"
                    color={textColor}
                    mb={1}
                    fontFamily="'Avenir', sans-serif"
                  >
                    {threadDescriptions[threadId].title}
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    fontFamily="'Avenir', sans-serif"
                  >
                    {threadDescriptions[threadId].description}
                  </Text>
                </Box>
                <ChatInterface threadId={threadId} />
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
