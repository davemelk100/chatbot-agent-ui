import { lazy } from "react";

export const ChatInterface = lazy(() =>
  import("./ChatInterface").then((module) => ({ default: module.default }))
);
export const DesignSystem = lazy(() =>
  import("./DesignSystem").then((module) => ({ default: module.default }))
);
