import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { Suspense } from "react";
import { threadDescriptions, appTitle } from "./config/textContent";
import { theme } from "./config/designSystem";
import { ChatInterface, DesignSystem } from "./components/lazy";

function App() {
  const bgColor = useColorModeValue(
    theme.colors.secondary[100],
    theme.colors.secondary[900]
  );
  const textColor = useColorModeValue(
    theme.colors.secondary[800],
    theme.colors.secondary[100]
  );

  return (
    <ChakraProvider theme={theme}>
      <Box
        minH="100vh"
        bg={bgColor}
        p={{ base: theme.spacing.md, md: theme.spacing.lg }}
      >
        <Box maxW="1600px" mx="auto">
          <Heading
            as="h1"
            size={{ base: "lg", md: "xl" }}
            mb={{ base: theme.spacing.lg, md: theme.spacing.xl }}
            color={textColor}
            fontFamily={theme.fonts.heading.primary}
            fontWeight="bold"
            textAlign="left"
          >
            {appTitle}
          </Heading>
          <VStack
            spacing={{ base: theme.spacing.md, md: theme.spacing.lg }}
            align="stretch"
          >
            {[0, 1, 2].map((threadId) => (
              <Box key={threadId} w="100%">
                <Box mb={theme.spacing.md}>
                  <Heading
                    size="sm"
                    color={textColor}
                    mb={theme.spacing.xs}
                    fontFamily={theme.fonts.heading.primary}
                  >
                    {threadDescriptions[threadId].title}
                  </Heading>
                  <Text
                    fontSize="sm"
                    color={theme.colors.secondary[600]}
                    fontFamily={theme.fonts.body.primary}
                  >
                    {threadDescriptions[threadId].description}
                  </Text>
                </Box>
                <Grid templateColumns={{ base: "1fr", md: "1fr 3fr" }} gap={6}>
                  <GridItem>
                    <Suspense fallback={<div>Loading...</div>}>
                      <ChatInterface threadId={threadId} />
                    </Suspense>
                  </GridItem>
                  <GridItem>
                    <Suspense fallback={<div>Loading...</div>}>
                      <DesignSystem threadId={threadId} />
                    </Suspense>
                  </GridItem>
                </Grid>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
