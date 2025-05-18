import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AgentUIChatbot",
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@chakra-ui/react",
        "@emotion/react",
        "@emotion/styled",
        "framer-motion",
        "openai",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@chakra-ui/react": "ChakraUI",
          "@emotion/react": "EmotionReact",
          "@emotion/styled": "EmotionStyled",
          "framer-motion": "FramerMotion",
          openai: "OpenAI",
        },
      },
    },
    sourcemap: true,
    minify: true,
  },
});
