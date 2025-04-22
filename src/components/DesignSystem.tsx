import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Grid,
  GridItem,
  useColorModeValue,
  Divider,
  Code,
} from "@chakra-ui/react";
import { theme, threadStyles, threadColors } from "../config/designSystem";

type ThreadId = "1" | "2" | "3";
type ThreadKey = `thread${ThreadId}`;

export const DesignSystem = () => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.700");

  const renderThreadSection = (threadId: ThreadId) => {
    const threadName = `Thread ${threadId}`;
    const threadKey: ThreadKey = `thread${threadId}`;
    const colors = threadColors[threadKey];
    const style = threadStyles[threadKey];

    return (
      <Box
        w="100%"
        bg={colors.bg}
        borderRadius={
          threadId === "1" || threadId === "2"
            ? theme.borderRadius.none
            : theme.borderRadius.lg
        }
        boxShadow={
          threadId === "1" || threadId === "2"
            ? theme.shadows.none
            : theme.shadows.md
        }
        overflow="hidden"
        p={4}
      >
        <Heading size="sm" mb={4} fontFamily={theme.fonts.heading.primary}>
          {threadName}
        </Heading>

        {/* Typography Section */}
        <Box
          p={6}
          borderWidth="1px"
          borderRadius="xl"
          borderColor={borderColor}
          bg={cardBg}
          boxShadow="sm"
          mb={6}
        >
          <Heading size="sm" mb={4} fontFamily={theme.fonts.heading.primary}>
            Typography
          </Heading>
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading
                as="h1"
                size={{ base: "2xl", md: "4xl" }}
                {...style}
                mb={2}
              >
                Heading 1 (2xl/4xl)
              </Heading>
              <Code
                fontSize="sm"
                colorScheme="gray"
                fontFamily={theme.fonts.body.primary}
              >
                {`size={{ base: "2xl", md: "4xl" }}`}
              </Code>
            </Box>
            <Box>
              <Heading
                as="h2"
                size={{ base: "xl", md: "3xl" }}
                {...style}
                mb={2}
              >
                Heading 2 (xl/3xl)
              </Heading>
              <Code
                fontSize="sm"
                colorScheme="gray"
                fontFamily={theme.fonts.body.primary}
              >
                {`size={{ base: "xl", md: "3xl" }}`}
              </Code>
            </Box>
            <Box>
              <Heading
                as="h3"
                size={{ base: "lg", md: "2xl" }}
                {...style}
                mb={2}
              >
                Heading 3 (lg/2xl)
              </Heading>
              <Code
                fontSize="sm"
                colorScheme="gray"
                fontFamily={theme.fonts.body.primary}
              >
                {`size={{ base: "lg", md: "2xl" }}`}
              </Code>
            </Box>
            <Box>
              <Heading
                as="h4"
                size={{ base: "lg", md: "2xl" }}
                fontWeight="normal"
                {...style}
                mb={2}
              >
                Heading 4 (lg/2xl)
              </Heading>
              <Code
                fontSize="sm"
                colorScheme="gray"
                fontFamily={theme.fonts.body.primary}
              >
                {`size={{ base: "lg", md: "2xl" }}`}
              </Code>
            </Box>
          </VStack>
        </Box>

        {/* Colors Section */}
        <Box
          p={6}
          borderWidth="1px"
          borderRadius="xl"
          borderColor={borderColor}
          bg={cardBg}
          boxShadow="sm"
        >
          <Heading size="sm" mb={4} fontFamily={theme.fonts.heading.primary}>
            Colors
          </Heading>
          <VStack align="stretch" spacing={4}>
            {Object.entries(colors).map(([name, value]) => (
              <Box key={name}>
                <HStack spacing={3} mb={1}>
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="md"
                    bg={value}
                    borderWidth="1px"
                    borderColor={borderColor}
                    boxShadow="sm"
                  />
                  <Box>
                    <Text
                      fontWeight="medium"
                      fontSize="sm"
                      fontFamily={theme.fonts.body.primary}
                    >
                      {name}
                    </Text>
                    <Code
                      fontSize="xs"
                      colorScheme="gray"
                      fontFamily={theme.fonts.body.primary}
                    >
                      {value}
                    </Code>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    );
  };

  return (
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
          "design1"
          "thread2"
          "design2"
          "thread3"
          "design3"
        `,
        sm: `
          "thread1 thread2"
          "design1 design2"
          "thread3 ."
          "design3 ."
        `,
        lg: `
          "thread1 thread2"
          "design1 design2"
          "thread3 ."
          "design3 ."
        `,
        xl: `
          "thread1 thread2 thread3"
          "design1 design2 design3"
        `,
      }}
    >
      {(["1", "2", "3"] as const).map((threadId) => (
        <GridItem key={threadId} gridArea={`design${threadId}`}>
          {renderThreadSection(threadId)}
        </GridItem>
      ))}
    </Grid>
  );
};
