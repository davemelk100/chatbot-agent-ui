import { Box, VStack, Text, Heading, Grid } from "@chakra-ui/react";
import { theme, threadColors } from "../config/designSystem";

interface DesignSystemProps {
  threadId: number;
}

type ThreadKey = "thread1" | "thread2" | "thread3";

export default function DesignSystem({ threadId }: DesignSystemProps) {
  const threadKey: ThreadKey =
    threadId === 0 ? "thread1" : threadId === 1 ? "thread2" : "thread3";
  const colors = threadColors[threadKey];

  return (
    <Box
      w="100%"
      h="100%"
      bg={colors.bg}
      p={{ base: 2, sm: 3, md: 4 }}
      borderRadius={
        threadId === 2 ? theme.borderRadius.xl : theme.borderRadius.lg
      }
      boxShadow={
        threadId === 1
          ? theme.shadows.sm
          : threadId === 2
          ? theme.shadows.md
          : theme.shadows.none
      }
      overflowY="auto"
    >
      <VStack spacing={{ base: 3, sm: 4, md: 6 }} align="stretch">
        <Box>
          <Heading
            size={{ base: "xs", sm: "sm", md: "md" }}
            color={colors.textColor}
            mb={{ base: 2, sm: 3 }}
            fontFamily={theme.fonts.heading.primary}
          >
            Colors
          </Heading>
          <Grid
            templateColumns={{
              base: "repeat(8, 1fr)",
              sm: "repeat(8, 1fr)",
              md: "repeat(8, 1fr)",
            }}
            gap={{ base: 1, sm: 2, md: 3 }}
          >
            {Object.entries(colors).map(([name, value]) => (
              <Box key={name} gridColumn="span 1">
                <Box
                  w="100%"
                  h={{ base: "30px", sm: "40px", md: "50px" }}
                  bg={value}
                  borderRadius="md"
                  mb={1}
                  boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                />
                <Text
                  fontSize={{ base: "xs", sm: "sm" }}
                  color={colors.textColor}
                  fontFamily={theme.fonts.body.primary}
                >
                  {name}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>

        <Box>
          <Heading
            size={{ base: "xs", sm: "sm", md: "md" }}
            color={colors.textColor}
            mb={{ base: 2, sm: 3 }}
            fontFamily={theme.fonts.heading.primary}
          >
            Typography
          </Heading>
          <VStack spacing={{ base: 2, sm: 3, md: 4 }} align="stretch">
            <Box>
              <Text
                fontSize={{ base: "xs", sm: "sm" }}
                color={theme.colors.secondary[600]}
                mb={1}
                fontFamily={theme.fonts.body.primary}
              >
                Heading
              </Text>
              <Heading
                size={{ base: "sm", sm: "md", md: "lg" }}
                color={colors.textColor}
                fontFamily={theme.fonts.heading.primary}
              >
                The quick brown fox
              </Heading>
            </Box>
            <Box>
              <Text
                fontSize={{ base: "xs", sm: "sm" }}
                color={theme.colors.secondary[600]}
                mb={1}
                fontFamily={theme.fonts.body.primary}
              >
                Body
              </Text>
              <Text
                fontSize={{ base: "sm", sm: "md" }}
                color={colors.textColor}
                fontFamily={theme.fonts.body.primary}
              >
                The quick brown fox jumps over the lazy dog
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
