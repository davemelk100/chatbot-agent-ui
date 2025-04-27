import {
  Box,
  VStack,
  Text,
  Heading,
  Grid,
  Button,
  Input,
  Select,
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
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap={{ base: 2, sm: 3, md: 4 }}
          >
            {Object.entries(theme.colors.primary).map(([name, value]) => (
              <Box key={name}>
                <Box
                  w="100%"
                  h={{ base: "60px", sm: "80px", md: "100px" }}
                  bg={value}
                  borderRadius="md"
                  mb={1}
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

        <Box>
          <Heading
            size={{ base: "xs", sm: "sm", md: "md" }}
            color={colors.textColor}
            mb={{ base: 2, sm: 3 }}
            fontFamily={theme.fonts.heading.primary}
          >
            Components
          </Heading>
          <VStack spacing={{ base: 2, sm: 3, md: 4 }} align="stretch">
            <Button
              size={{ base: "xs", sm: "sm", md: "md" }}
              colorScheme={colors.buttonColor}
              fontFamily={theme.fonts.body.primary}
            >
              Button
            </Button>
            <Input
              placeholder="Input"
              size={{ base: "xs", sm: "sm", md: "md" }}
              fontFamily={theme.fonts.body.primary}
            />
            <Select
              placeholder="Select"
              size={{ base: "xs", sm: "sm", md: "md" }}
              fontFamily={theme.fonts.body.primary}
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </Select>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
