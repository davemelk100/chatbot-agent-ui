import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ChatInterface } from "./components/ChatInterface";
import { threadDescriptions, appTitle } from "./config/textContent";
import { theme } from "./config/designSystem";
import { DesignSystem } from "./components/DesignSystem";

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
              xl: "repeat(3, 1fr)",
            }}
            gap={{ base: theme.spacing.md, md: theme.spacing.lg }}
            templateAreas={{
              base: `
                "thread1"
                "thread2"
                "thread3"
              `,
              sm: `
                "thread1 thread2"
                "thread3 ."
              `,
              lg: `
                "thread1 thread2"
                "thread3 ."
              `,
              xl: `
                "thread1 thread2 thread3"
              `,
            }}
          >
            {[0, 1, 2].map((threadId) => (
              <GridItem key={threadId} gridArea={`thread${threadId + 1}`}>
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
                <ChatInterface threadId={threadId} />
              </GridItem>
            ))}
          </Grid>
          <Box mt="2rem">
            <DesignSystem />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
