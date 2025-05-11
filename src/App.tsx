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
import { ChatInterface, DesignSystem } from "./components/lazy";

function App() {
  const bgColor = "white";
  const textColor = useColorModeValue(
    theme.colors.secondary[800],
    theme.colors.secondary[100]
  );

  return (
    <ChakraProvider theme={theme}>
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
            <VStack
              spacing={{
                base: theme.spacing.sm,
                sm: theme.spacing.md,
                md: theme.spacing.lg,
              }}
              align="stretch"
            >
              {[0, 1, 2].map((threadId) => (
                <Box key={threadId} w="100%">
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
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      sm: "1fr 1fr",
                    }}
                    gap={{ base: 4, sm: 6 }}
                  >
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
      </Flex>
    </ChakraProvider>
  );
}

export default App;
