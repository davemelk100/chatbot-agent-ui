import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  VStack,
  Flex,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { Suspense } from "react";
import { threadDescriptions } from "./config/textContent";
import { theme } from "./config/designSystem";
import { ChatInterface, DesignSystem } from "./components/lazy";
import { ChatIcon, SettingsIcon, InfoIcon } from "@chakra-ui/icons";

function App() {
  const bgColor = useColorModeValue(
    theme.colors.secondary[100],
    theme.colors.secondary[900]
  );
  const textColor = useColorModeValue(
    theme.colors.secondary[800],
    theme.colors.secondary[100]
  );
  const navBgColor = useColorModeValue("white", "gray.800");
  const navBorderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <ChakraProvider theme={theme}>
      <Flex minH="100vh" bg={bgColor}>
        {/* Left Navigation */}
        <Box
          w="60px"
          bg={navBgColor}
          borderRight="1px"
          borderColor={navBorderColor}
          py={4}
          position="fixed"
          h="100vh"
          display={{ base: "none", md: "block" }}
          fontFamily="Avenir"
        >
          <VStack spacing={6} align="center">
            <Tooltip label="Chat" placement="right" fontFamily="Avenir">
              <IconButton
                aria-label="Chat"
                icon={<ChatIcon />}
                variant="ghost"
                colorScheme="blue"
                size="md"
                isRound
              />
            </Tooltip>
            <Tooltip
              label="Design System"
              placement="right"
              fontFamily="Avenir"
            >
              <IconButton
                aria-label="Design System"
                icon={<SettingsIcon />}
                variant="ghost"
                colorScheme="blue"
                size="md"
                isRound
              />
            </Tooltip>
            <Tooltip label="About" placement="right" fontFamily="Avenir">
              <IconButton
                aria-label="About"
                icon={<InfoIcon />}
                variant="ghost"
                colorScheme="blue"
                size="md"
                isRound
              />
            </Tooltip>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box
          flex="1"
          ml={{ base: 0, md: "60px" }}
          p={{
            base: theme.spacing.sm,
            sm: theme.spacing.md,
            md: theme.spacing.lg,
          }}
        >
          <Box maxW="1600px" mx="auto" px={{ base: 2, sm: 4, md: 6 }}>
            <Text
              fontSize={{ base: "2xs", sm: "xs" }}
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
                    <Heading
                      size={{ base: "2xs", sm: "xs" }}
                      color={textColor}
                      mb={{ base: theme.spacing.xs, sm: theme.spacing.xs }}
                      fontFamily={theme.fonts.heading.primary}
                    >
                      {threadDescriptions[threadId].title}
                    </Heading>
                    <Text
                      fontSize={{ base: "2xs", sm: "xs" }}
                      color={theme.colors.secondary[600]}
                      fontFamily={theme.fonts.body.primary}
                    >
                      {threadDescriptions[threadId].description}
                    </Text>
                  </Box>
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      sm: "3fr 1fr",
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
