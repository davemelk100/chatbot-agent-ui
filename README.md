# Agent UI Chatbot

A customizable, embeddable chatbot component built with React and Chakra UI.

## Installation

```bash
npm install @agent-ui-lab/chatbot
# or
yarn add @agent-ui-lab/chatbot
```

## Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@chakra-ui/react": "^2.8.2",
  "@emotion/react": "^11.11.3",
  "@emotion/styled": "^11.11.0",
  "framer-motion": "^11.0.5"
}
```

## Usage

```tsx
import { EmbeddableChat } from "@agent-ui-lab/chatbot";

function App() {
  return (
    <EmbeddableChat
      apiKey="your-openai-api-key"
      defaultChatType="content-feedback"
      theme={{
        // Optional: Customize the theme
        colors: {
          primary: "#3182CE",
          // ... other theme customizations
        },
      }}
      onError={(error) => {
        console.error("Chatbot error:", error);
      }}
    />
  );
}
```

## Available Chat Types

- `content-feedback`: A chat interface for providing feedback on content
- `personality-tuning`: A chat interface for adjusting the bot's personality traits
- `three-way`: A chat interface supporting three-way conversations

## Props

| Prop            | Type                                                      | Default            | Description                           |
| --------------- | --------------------------------------------------------- | ------------------ | ------------------------------------- |
| apiKey          | string                                                    | -                  | Your OpenAI API key                   |
| theme           | object                                                    | -                  | Custom theme configuration            |
| defaultChatType | 'content-feedback' \| 'personality-tuning' \| 'three-way' | 'content-feedback' | The type of chat interface to display |
| onError         | (error: Error) => void                                    | -                  | Error handler callback                |

## Theme Customization

You can customize the appearance of the chatbot by passing a theme object:

```tsx
const customTheme = {
  colors: {
    primary: "#3182CE",
    // ... other color customizations
  },
  components: {
    Button: {
      // ... button customizations
    },
    // ... other component customizations
  },
};

<EmbeddableChat theme={customTheme} />;
```

## Error Handling

The component includes built-in error boundaries and will display a fallback UI when errors occur. You can handle errors by providing an `onError` callback:

```tsx
<EmbeddableChat
  onError={(error) => {
    // Handle the error
    console.error("Chatbot error:", error);
  }}
/>
```

## License

MIT
