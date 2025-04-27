import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";
import { Suspense } from "react";
import { threadDescriptions } from "./config/textContent";
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
        p={{
          base: theme.spacing.sm,
          sm: theme.spacing.md,
          md: theme.spacing.lg,
        }}
      >
        <Box maxW="1600px" mx="auto" px={{ base: 2, sm: 4, md: 6 }}>
          <Text
            position="absolute"
            top={{ base: "12px", sm: "16px" }}
            left={{ base: "12px", sm: "16px" }}
            fontSize={{ base: "xs", sm: "sm" }}
            color={textColor}
            opacity={0.7}
            fontFamily={theme.fonts.body.primary}
          >
            Agent UI Lab
          </Text>
          <VStack
            spacing={{
              base: theme.spacing.sm,
              sm: theme.spacing.md,
              md: theme.spacing.lg,
            }}
            align="stretch"
            mt={{ base: "32px", sm: "40px" }}
          >
            {[0, 1, 2].map((threadId) => (
              <Box key={threadId} w="100%">
                <Box mb={{ base: theme.spacing.sm, sm: theme.spacing.md }}>
                  <Heading
                    size={{ base: "xs", sm: "sm" }}
                    color={textColor}
                    mb={{ base: theme.spacing.xs, sm: theme.spacing.xs }}
                    fontFamily={theme.fonts.heading.primary}
                  >
                    {threadDescriptions[threadId].title}
                  </Heading>
                  <Text
                    fontSize={{ base: "xs", sm: "sm" }}
                    color={theme.colors.secondary[600]}
                    fontFamily={theme.fonts.body.primary}
                  >
                    {threadDescriptions[threadId].description}
                  </Text>
                </Box>
                <Grid
                  templateColumns={{
                    base: "1fr",
                    sm: "1fr 2fr",
                    md: "1fr 3fr",
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
    </ChakraProvider>
  );
}

export default App;
