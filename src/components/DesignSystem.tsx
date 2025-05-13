import { Box, VStack, Text, List, ListItem } from "@chakra-ui/react";
import { theme, threadColors, threadStyles } from "../config/designSystem";
import { threadDescriptions } from "../config/textContent";

interface DesignSystemProps {
  threadId: number;
}

type ThreadKey = "thread1" | "thread2" | "thread3" | "thread4";

export default function DesignSystem({ threadId }: DesignSystemProps) {
  const threadKey: ThreadKey =
    threadId === 0
      ? "thread1"
      : threadId === 1
      ? "thread2"
      : threadId === 2
      ? "thread3"
      : "thread4";
  const colors = threadColors[threadKey];

  const getInstructions = () => {
    switch (threadId) {
      case 0:
        return [
          "Type your message in the input box at the bottom",
          "Click the chat icon or press Enter to send",
          "Click 'Invite' to add another person to the chat",
          "The other person can join using the shared link",
        ];
      case 1:
        return [
          "Select different AI models from the dropdown",
          "Try GPT-3.5 for faster responses",
          "Use GPT-4 for more complex tasks",
          "GPT-4 Turbo offers the best balance of speed and quality",
        ];
      case 2:
        return [
          "Use the feedback buttons to rate responses",
          "Provide feedback when responses are incorrect",
          "Share your experience with the chatbot",
          "Help improve the AI's responses",
        ];
      case 3:
        return [
          "Review the chatbot's personality",
          "Change the chatbot's personality",
          "The chatbot will adapt its responses based on your feedback",
        ];
      default:
        return [];
    }
  };

  return (
    <Box
      w="100%"
      h={{ base: "80vh", sm: "75vh", md: "70vh" }}
      bg={colors.bg}
      p={{ base: 2, sm: 3, md: 4 }}
      borderRadius={threadId === 1 ? "0" : "lg"}
      boxShadow={theme.shadows.sm}
      overflowY="auto"
    >
      <VStack spacing={{ base: 2, sm: 3, md: 4 }} align="stretch" h="100%">
        <Box>
          <Text
            fontSize={{ base: "md", sm: "lg" }}
            fontWeight="bold"
            color={colors.textColor}
            mb={{ base: 1, sm: 2 }}
            fontFamily={theme.fonts.heading.primary}
          >
            How to Use
          </Text>
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            color={theme.colors.secondary[600]}
            fontFamily={theme.fonts.body.primary}
          >
            {threadDescriptions[threadId].description}
          </Text>
        </Box>
        <List spacing={3} styleType="decimal" pl={4}>
          {getInstructions().map((instruction, index) => (
            <ListItem
              key={index}
              fontSize={{ base: "sm", sm: "md" }}
              color={colors.textColor}
              fontFamily={theme.fonts.body.primary}
            >
              {instruction}
            </ListItem>
          ))}
        </List>
      </VStack>
    </Box>
  );
}
