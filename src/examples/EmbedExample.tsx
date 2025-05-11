import { Box } from "@chakra-ui/react";
import EmbeddableChat from "../components/EmbeddableChat";

export default function EmbedExample() {
  return (
    <Box>
      <h1>My Website</h1>
      <p>Welcome to my website with an embedded chatbot!</p>

      {/* Customized usage */}
      <EmbeddableChat
        apiKey="your-api-key-here"
        position="bottom-left"
        width="400px"
        height="600px"
        initialMessage="Welcome! How can I assist you today?"
      />
    </Box>
  );
}
