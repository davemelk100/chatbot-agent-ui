import {
  Box,
  VStack,
  Heading,
  Text,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";
import { theme, threadColors } from "../config/designSystem";

interface DesignSystemProps {
  threadId: number;
}

type ThreadKey = "thread1" | "thread2" | "thread3";

export default function DesignSystem({ threadId }: DesignSystemProps) {
  const threadKey: ThreadKey =
    threadId === 0 ? "thread1" : threadId === 1 ? "thread2" : "thread3";
  const colors = threadColors[threadKey];
  const bgColor = useColorModeValue("white", "gray.800");

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
            base: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
          gap={{ base: 2, sm: 3 }}
        >
          {Object.entries(colors).map(([name, value]) => (
            <Box key={name}>
              <Box
                w="100%"
                h={{ base: "30px", sm: "40px" }}
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
    </Box>
  );
}
