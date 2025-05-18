import { useEffect } from "react";
import ThreeWayChat from "./chatbots/ThreeWayChat";
import ContentFeedbackChat from "./chatbots/ContentFeedbackChat";
import PersonalityTuningChat from "./chatbots/PersonalityTuningChat";

interface ChatInterfaceProps {
  threadId: number;
}

export default function ChatInterface({ threadId }: ChatInterfaceProps) {
  // Check for chat ID in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("join");
    if (id) {
      // Handle join chat logic here if needed
    }
  }, []);

  switch (threadId) {
    case 0:
      return <ThreeWayChat />;
    case 1:
      return <ContentFeedbackChat />;
    case 2:
      return <PersonalityTuningChat />;
    default:
      return null;
  }
}
