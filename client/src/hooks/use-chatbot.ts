import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "@shared/schema";

// Temporary user ID for demo purposes (in a real app, this would come from auth)
const DEMO_USER_ID = 999;

type Message = {
  isUserMessage: boolean;
  content: string;
};

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What is Section 144 of IPC?",
    "How do I file for divorce in India?",
    "What are my rights in a property dispute?",
    "What is habeas corpus?",
    "How long does patent protection last in India?"
  ]);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetch(`/api/chat/history/${DEMO_USER_ID}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && Array.isArray(data.data)) {
            const formattedMessages = data.data.map((msg: ChatMessage) => ({
              isUserMessage: msg.isUserMessage,
              content: msg.content
            }));
            
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };
    
    loadChatHistory();
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      isUserMessage: true,
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat", {
        content,
        userId: DEMO_USER_ID,
        isUserMessage: true
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      
      if (data.success) {
        // Add AI response to chat
        const aiMessage: Message = {
          isUserMessage: false,
          content: data.data.content
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      
      // Add error message
      const errorMessage: Message = {
        isUserMessage: false,
        content: "I'm sorry, I'm having trouble responding right now. Please try again later."
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    suggestedQuestions
  };
}
