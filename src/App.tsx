import {
  ChakraProvider,
  Box,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { Suspense } from "react";
import { threadDescriptions } from "./config/textContent";
import { theme } from "./config/designSystem";
import { ChatInterface } from "./components/lazy";
import { PersonalityProvider } from "./context/PersonalityContext";

function App() {
  const bgColor = "white";
  const textColor = useColorModeValue(
    theme.colors.secondary[800],
    theme.colors.secondary[100]
  );

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
                fontSize={{ base: "sm", sm: "md" }}
                color={textColor}
                opacity={0.7}
                fontFamily="Avenir"
                fontWeight="semibold"
                mt={{ base: "16px", sm: "20px" }}
                mb={{ base: "16px", sm: "20px" }}
              >
                AGENT UI LAB
              </Text>
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={{ base: 4, sm: 6 }}
              >
                {[0, 1, 2, 3].map((threadId) => (
                  <GridItem key={threadId}>
                    <Box mb={{ base: theme.spacing.sm, sm: theme.spacing.md }}>
                      <Text
                        fontSize={{ base: "md", sm: "lg" }}
                        color={textColor}
                        mb={{ base: theme.spacing.xs, sm: theme.spacing.xs }}
                        fontFamily={theme.fonts.heading.primary}
                        fontWeight="bold"
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
