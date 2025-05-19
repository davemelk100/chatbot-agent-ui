import { createContext, useContext, ReactNode } from "react";

interface ConfigContextType {
  apiKey: string | undefined;
  model: string;
}

const defaultConfig: ConfigContextType = {
  apiKey: undefined,
  model: "gpt-4",
};

const ConfigContext = createContext<ConfigContextType>(defaultConfig);

interface ConfigProviderProps {
  children: ReactNode;
  apiKey?: string;
  model?: string;
}

export function ConfigProvider({
  children,
  apiKey,
  model = "gpt-4",
}: ConfigProviderProps) {
  const value = {
    apiKey: apiKey || import.meta.env.VITE_OPENAI_API_KEY,
    model,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
