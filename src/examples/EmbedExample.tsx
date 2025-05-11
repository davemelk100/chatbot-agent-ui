import EmbeddableChat from "../components/EmbeddableChat";

export default function ExamplePage() {
  return (
    <div>
      <h1>My Website</h1>
      <p>Welcome to my website with an embedded chatbot!</p>

      {/* Basic usage */}
      <EmbeddableChat />

      {/* Customized usage */}
      <EmbeddableChat
        threadId={1}
        apiKey="your-api-key-here"
        initialMessage="Welcome to our support chat! How can I help you today?"
        position="bottom-left"
        width="400px"
        height="600px"
      />
    </div>
  );
}
