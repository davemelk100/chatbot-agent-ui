import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Grid,
  GridItem,
  useColorModeValue,
  Code,
  Button,
  Input,
  IconButton,
  FormControl,
  Select,
} from "@chakra-ui/react";
import { ChatIcon, AddIcon, CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  theme,
  fonts,
  threadStyles,
  threadColors,
} from "../config/designSystem";
import { generateFigmaTokens } from "../utils/convertToFigmaTokens";
import { buttonLabels, placeholders } from "../config/textContent";

interface DesignSystemProps {
  threadId: number;
}

type ThreadKey = "thread1" | "thread2" | "thread3";

export default function DesignSystem({ threadId }: DesignSystemProps) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.700");
  const bgColor = useColorModeValue(
    theme.colors.secondary[100],
    theme.colors.secondary[900]
  );
  const textColor = useColorModeValue(
    theme.colors.secondary[800],
    theme.colors.secondary[100]
  );

  const handleExport = () => {
    generateFigmaTokens();
  };

  const threadKey: ThreadKey =
    threadId === 0 ? "thread1" : threadId === 1 ? "thread2" : "thread3";
  const colors = threadColors[threadKey];
  const style = threadStyles[threadKey];

  return (
    <Box
      w="100%"
      h="100%"
      bg={colors.bg}
      borderRadius={
        threadId === 0 || threadId === 1
          ? theme.borderRadius.none
          : theme.borderRadius.lg
      }
      boxShadow={
        threadId === 0
          ? theme.shadows.none
          : threadId === 1
          ? theme.shadows.sm
          : theme.shadows.md
      }
      overflow="hidden"
      p={4}
      display="flex"
      flexDirection="column"
    >
      <Heading size="sm" mb={4} fontFamily={theme.fonts.heading.primary}>
        Design System
      </Heading>

      <Box
        flex="1"
        p={4}
        borderWidth="1px"
        borderRadius="xl"
        borderColor={borderColor}
        bg={cardBg}
        boxShadow="sm"
        overflowY="auto"
      >
        <VStack spacing={6} align="stretch">
          {/* Typography Section */}
          <Box>
            <Heading size="sm" mb={2} fontFamily={theme.fonts.heading.primary}>
              Typography
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>
                <Heading as="h1" size="md" {...style} mb={1}>
                  Heading 1
                </Heading>
                <Code fontSize="xs" colorScheme="gray">
                  {`size={{ base: "2xl", md: "4xl" }}`}
                </Code>
              </Box>
              <Box>
                <Heading as="h2" size="sm" {...style} mb={1}>
                  Heading 2
                </Heading>
                <Code fontSize="xs" colorScheme="gray">
                  {`size={{ base: "xl", md: "3xl" }}`}
                </Code>
              </Box>
            </Grid>
          </Box>

          {/* Colors Section */}
          <Box>
            <Heading size="sm" mb={2} fontFamily={theme.fonts.heading.primary}>
              Colors
            </Heading>
            <Grid templateColumns="repeat(4, 1fr)" gap={2}>
              {Object.entries(colors).map(([name, value]) => (
                <Box key={name}>
                  <HStack spacing={2} mb={1}>
                    <Box
                      w="20px"
                      h="20px"
                      borderRadius="sm"
                      bg={value}
                      borderWidth="1px"
                      borderColor={borderColor}
                    />
                    <Text fontSize="xs" fontFamily={theme.fonts.body.primary}>
                      {name}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </Grid>
          </Box>

          {/* Buttons Section */}
          <Box>
            <Heading size="sm" mb={2} fontFamily={theme.fonts.heading.primary}>
              Buttons
            </Heading>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              {threadId === 0 && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme={colors.buttonColor}
                  size="sm"
                  fontFamily={style.fontFamily}
                >
                  Invite
                </Button>
              )}
              {threadId === 1 && (
                <FormControl>
                  <Select
                    size="sm"
                    fontFamily={style.fontFamily}
                    colorScheme={colors.buttonColor}
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5</option>
                    <option value="gpt-4">GPT-4</option>
                  </Select>
                </FormControl>
              )}
              <Button
                leftIcon={<ChatIcon />}
                colorScheme={colors.buttonColor}
                size="sm"
                fontFamily={style.fontFamily}
              >
                Send
              </Button>
              <HStack spacing={1}>
                <IconButton
                  aria-label="Like"
                  icon={<CheckIcon />}
                  colorScheme="green"
                  size="sm"
                  fontFamily={style.fontFamily}
                />
                <IconButton
                  aria-label="Dislike"
                  icon={<NotAllowedIcon />}
                  colorScheme="red"
                  size="sm"
                  fontFamily={style.fontFamily}
                />
              </HStack>
            </Grid>
          </Box>

          {/* Inputs Section */}
          <Box>
            <Heading size="sm" mb={2} fontFamily={theme.fonts.heading.primary}>
              Inputs
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Input
                placeholder={placeholders.messageInput}
                size="sm"
                fontFamily={style.fontFamily}
                _placeholder={{
                  fontFamily: style.fontFamily,
                  color: "gray.500",
                }}
              />
              <Input
                placeholder={placeholders.thirdPersonInput}
                size="sm"
                fontFamily={style.fontFamily}
                _placeholder={{
                  fontFamily: style.fontFamily,
                  color: "gray.500",
                }}
              />
            </Grid>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
