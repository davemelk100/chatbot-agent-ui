# Agent UI Chatbot

A customizable, embeddable chatbot component built with React and Chakra UI.

## Installation

### Option 1: Install from npm

```bash
npm install @agent-ui-lab/chatbot
# or
yarn add @agent-ui-lab/chatbot
```

### Option 2: Clone from GitHub

```bash
# Clone the repository
git clone https://github.com/agent-ui-lab/chatbot-agent-ui.git

# Navigate to the project directory
cd chatbot-agent-ui

# Install dependencies
npm install
# or
yarn install

# Build the package
npm run build
# or
yarn build
```

### Environment Setup

Create a `.env` file in your project root:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
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

### Basic Usage

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

### Using a Specific Chat Type

```tsx
// Use only the content feedback chat
<EmbeddableChat
  defaultChatType="content-feedback"
  showChatSelector={false}
  allowedChatTypes={["content-feedback"]}
/>

// Use only the personality tuning chat
<EmbeddableChat
  defaultChatType="personality-tuning"
  showChatSelector={false}
  allowedChatTypes={["personality-tuning"]}
/>

// Use only the three-way chat
<EmbeddableChat
  defaultChatType="three-way"
  showChatSelector={false}
  allowedChatTypes={["three-way"]}
/>
```

### Allowing Multiple Chat Types

```tsx
// Allow users to switch between content feedback and personality tuning
<EmbeddableChat
  defaultChatType="content-feedback"
  showChatSelector={true}
  allowedChatTypes={["content-feedback", "personality-tuning"]}
/>
```

## Available Chat Types

- `content-feedback`: A chat interface for providing feedback on content
- `personality-tuning`: A chat interface for adjusting the bot's personality traits
- `three-way`: A chat interface supporting three-way conversations

## Props

| Prop             | Type                                                      | Default            | Description                            |
| ---------------- | --------------------------------------------------------- | ------------------ | -------------------------------------- |
| apiKey           | string                                                    | -                  | Your OpenAI API key                    |
| model            | string                                                    | 'gpt-4'            | The OpenAI model to use                |
| theme            | object                                                    | -                  | Custom theme configuration             |
| defaultChatType  | 'content-feedback' \| 'personality-tuning' \| 'three-way' | 'content-feedback' | The type of chat interface to display  |
| onError          | (error: Error) => void                                    | -                  | Error handler callback                 |
| showChatSelector | boolean                                                   | false              | Whether to show the chat type selector |
| allowedChatTypes | ChatType[]                                                | all types          | Which chat types are available         |

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

## Development

```bash
# Start development server
npm run dev
# or
yarn dev

# Run tests
npm test
# or
yarn test

# Build for production
npm run build
# or
yarn build
```

## License

MIT
