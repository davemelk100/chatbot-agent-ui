import {
  ChakraProvider,
  Box,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  VStack,
  Flex,
  Button,
  CSSReset,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import EmbeddableChat from "./components/EmbeddableChat";
import EmbedInstructions from "./pages/EmbedInstructions";
import { theme } from "./config/designSystem";

function App() {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue(
    theme.colors.secondary[800],
    theme.colors.secondary[100]
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const activeBgColor = useColorModeValue("blue.50", "blue.900");
  const activeTextColor = useColorModeValue("blue.600", "blue.200");

  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Box minH="100vh" bg={bgColor}>
          <Flex
            as="nav"
            p={4}
            borderBottom="1px"
            borderColor={borderColor}
            justify="flex-start"
            align="center"
            flexDirection="column"
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              textAlign="left"
              mb={4}
              color={textColor}
              fontFamily={theme.fonts.heading.primary}
              alignSelf="flex-start"
              pl={1}
            >
              AI AGENT LAB
            </Text>
            <Box alignSelf="flex-start">
              <NavLink to="/" end>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    bg={isActive ? activeBgColor : "transparent"}
                    color={isActive ? activeTextColor : textColor}
                    _hover={{
                      bg: isActive ? activeBgColor : "gray.100",
                    }}
                    mr={2}
                  >
                    Home
                  </Button>
                )}
              </NavLink>
              <NavLink to="/embed">
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    bg={isActive ? activeBgColor : "transparent"}
                    color={isActive ? activeTextColor : textColor}
                    _hover={{
                      bg: isActive ? activeBgColor : "gray.100",
                    }}
                  >
                    Embed Instructions
                  </Button>
                )}
              </NavLink>
            </Box>
          </Flex>

          <Routes>
            <Route
              path="/"
              element={
                <Box p={8}>
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(3, 1fr)",
                    }}
                    gap={6}
                  >
                    <GridItem>
                      <VStack align="stretch" spacing={4}>
                        <Box
                          border="1px"
                          borderColor={borderColor}
                          borderRadius="md"
                          p={4}
                          bg={bgColor}
                          h="600px"
                        >
                          <EmbeddableChat
                            defaultChatType="content-feedback"
                            showChatSelector={false}
                            allowedChatTypes={["content-feedback"]}
                          />
                        </Box>
                      </VStack>
                    </GridItem>

                    <GridItem>
                      <VStack align="stretch" spacing={4}>
                        <Box
                          border="1px"
                          borderColor={borderColor}
                          borderRadius="md"
                          p={4}
                          bg={bgColor}
                          h="600px"
                        >
                          <EmbeddableChat
                            defaultChatType="personality-tuning"
                            showChatSelector={false}
                            allowedChatTypes={["personality-tuning"]}
                          />
                        </Box>
                      </VStack>
                    </GridItem>

                    <GridItem>
                      <VStack align="stretch" spacing={4}>
                        <Box
                          border="1px"
                          borderColor={borderColor}
                          borderRadius="md"
                          p={4}
                          bg={bgColor}
                          h="600px"
                        >
                          <EmbeddableChat
                            defaultChatType="three-way"
                            showChatSelector={false}
                            allowedChatTypes={["three-way"]}
                          />
                        </Box>
                      </VStack>
                    </GridItem>
                  </Grid>
                </Box>
              }
            />
            <Route path="/embed" element={<EmbedInstructions />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
