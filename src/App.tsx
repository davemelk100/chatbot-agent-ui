import {
  ChakraProvider,
  Box,
  Container,
  Grid,
  Heading,
} from "@chakra-ui/react";
import { ChatInterface } from "./components/ChatInterface";

function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50" py={8}>
        <Box px={4}>
          <Heading mb={6} textAlign="center">
            Multi-Chat Interface
          </Heading>
          <Grid templateColumns="repeat(6, 1fr)" gap={4} w="100%">
            {[...Array(6)].map((_, index) => (
              <Box key={index} h="full">
                <ChatInterface threadId={index} />
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
