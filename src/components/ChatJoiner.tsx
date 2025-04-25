import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { fonts } from "../config/designSystem";

interface ChatJoinerProps {
  onJoin: () => void;
}

export default function ChatJoiner({ onJoin }: ChatJoinerProps) {
  const handleJoin = () => {
    onJoin();
    // Remove the join parameter from URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0, 0, 0, 0.4)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="modal"
    >
      <Box
        bg="white"
        width="500px"
        borderRadius="8px"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        p={8}
      >
        <VStack spacing={4} align="stretch">
          <Text
            fontSize="xl"
            fontWeight="bold"
            textAlign="center"
            fontFamily={fonts.heading.primary}
          >
            Join Chat
          </Text>
          <Text textAlign="center" fontFamily={fonts.body.primary}>
            You've been invited to join a chat. Click the button below to
            participate.
          </Text>
          <Button colorScheme="blue" onClick={handleJoin} size="lg">
            Join Chat
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
