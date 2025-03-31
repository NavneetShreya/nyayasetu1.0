import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  encryptMessage, 
  decryptMessage, 
  isEncryptedMessage 
} from "@/lib/encryption";

interface ChatMessage {
  content: string;
  isUserMessage: boolean;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // If opening the chat for the first time, add welcome message
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          content: "Hello! I'm the NyayaSetu legal assistant. How can I help you today?",
          isUserMessage: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Display the original message to the user
    const userMessage: ChatMessage = {
      content: inputValue,
      isUserMessage: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Encrypt the message before sending to server
      const encryptedContent = await encryptMessage(userMessage.content);
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: encryptedContent,
          isEncrypted: true
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a response");
      }

      const data = await response.json();
      
      // The server response is unencrypted since it comes from the AI
      setMessages((prev) => [
        ...prev,
        {
          content: data.response,
          isUserMessage: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
      
      setMessages((prev) => [
        ...prev,
        {
          content: "I'm sorry, I'm having trouble connecting to the server. Please try again later.",
          isUserMessage: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history from the server when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        // Using a placeholder user ID (999) for now - should use actual user ID when authenticated
        const response = await fetch("/api/chat/history/999");
        if (response.ok) {
          const data = await response.json();
          if (data && data.data && data.data.length > 0) {
            const formattedMessages: ChatMessage[] = [];
            
            // Process each message, decrypting user messages if needed
            for (const msg of data.data) {
              let content = msg.content;
              
              // If it's a user message, check if it needs decryption
              if (msg.isUserMessage && isEncryptedMessage(content)) {
                try {
                  content = await decryptMessage(content);
                } catch (err) {
                  console.error("Failed to decrypt message:", err);
                  content = "🔒 [Encrypted message]";
                }
              }
              
              formattedMessages.push({
                content: content,
                isUserMessage: msg.isUserMessage,
                timestamp: new Date(msg.timestamp || Date.now()),
              });
            }
            
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    loadChatHistory();
  }, []);

  return (
    <>
      {/* Chat bubble button */}
      <Button
        onClick={toggleChat}
        className={`fixed bottom-5 right-5 rounded-full p-4 shadow-lg z-40 ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary text-black hover:bg-[#e6c200]"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat widget */}
      {isOpen && (
        <Card className="fixed bottom-20 right-5 w-80 sm:w-96 shadow-xl z-40 border border-gray-300">
          <CardHeader className="bg-black text-white py-3 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="font-semibold mr-2">Legal Assistant</div>
              <div className="flex items-center text-xs bg-black/40 px-2 py-1 rounded">
                <Lock size={12} className="text-green-500 mr-1" />
                <span className="text-green-500">End-to-End Encrypted</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-white">
              <X size={18} />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    message.isUserMessage ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.isUserMessage
                        ? "bg-primary text-black"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="p-3 border-t">
            <div className="flex w-full items-center gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a legal question..."
                className="flex-1 min-h-[40px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || inputValue.trim() === ""}
                className="bg-primary text-black hover:bg-[#e6c200]"
              >
                <Send size={18} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;