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
      bg={colors.bg}
      borderRadius={
        threadId === 0 || threadId === 1
          ? theme.borderRadius.none
          : theme.borderRadius.lg
      }
      boxShadow={
        threadId === 0 || threadId === 1 ? theme.shadows.none : theme.shadows.md
      }
      overflow="hidden"
      p={4}
    >
      <Heading size="sm" mb={4} fontFamily={theme.fonts.heading.primary}>
        Design System
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
            <Heading as="h2" size={{ base: "xl", md: "3xl" }} {...style} mb={2}>
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
            <Heading as="h3" size={{ base: "lg", md: "2xl" }} {...style} mb={2}>
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
            <Heading as="h4" size={{ base: "lg", md: "2xl" }} {...style} mb={2}>
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
        mb={6}
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

      {/* Buttons Section */}
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
          Buttons
        </Heading>
        <VStack align="start" spacing={4}>
          {threadId === 0 && (
            <Button
              leftIcon={<AddIcon />}
              colorScheme={colors.buttonColor}
              fontFamily={style.fontFamily}
            >
              Invite Third Person
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
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
              </Select>
            </FormControl>
          )}
          <Button
            leftIcon={<ChatIcon />}
            colorScheme={colors.buttonColor}
            fontFamily={style.fontFamily}
          >
            Send Message
          </Button>
          <HStack spacing={2}>
            <IconButton
              aria-label="Like"
              icon={<CheckIcon />}
              colorScheme="green"
              fontFamily={style.fontFamily}
            />
            <IconButton
              aria-label="Dislike"
              icon={<NotAllowedIcon />}
              colorScheme="red"
              fontFamily={style.fontFamily}
            />
          </HStack>
        </VStack>
      </Box>

      {/* Inputs Section */}
      <Box
        p={6}
        borderWidth="1px"
        borderRadius="xl"
        borderColor={borderColor}
        bg={cardBg}
        boxShadow="sm"
      >
        <Heading size="sm" mb={4} fontFamily={theme.fonts.heading.primary}>
          Inputs
        </Heading>
        <VStack align="stretch" spacing={4}>
          <Input
            placeholder={placeholders.messageInput}
            fontFamily={style.fontFamily}
            _placeholder={{
              fontFamily: style.fontFamily,
              color: "gray.500",
            }}
          />
          <Input
            placeholder={placeholders.thirdPersonInput}
            fontFamily={style.fontFamily}
            _placeholder={{
              fontFamily: style.fontFamily,
              color: "gray.500",
            }}
          />
          <Input
            placeholder={placeholders.feedbackInput}
            fontFamily={style.fontFamily}
            _placeholder={{
              fontFamily: style.fontFamily,
              color: "gray.500",
            }}
          />
        </VStack>
      </Box>
    </Box>
  );
}
