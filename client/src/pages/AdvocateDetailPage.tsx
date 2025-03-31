import { useState } from "react";
import { useRoute } from "wouter";
import AdvocateDetail from "@/components/advocates/AdvocateDetail";
import ChatButton from "@/components/chatbot/ChatButton";
import ChatWidget from "@/components/chatbot/ChatWidget";

const AdvocateDetailPage = () => {
  const [, params] = useRoute("/advocate/:id");
  const advocateId = params?.id || "";
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  return (
    <>
      <AdvocateDetail advocateId={advocateId} />
      
      {/* AI Chatbot */}
      <ChatButton onClick={toggleChat} isWidgetOpen={isChatOpen} />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default AdvocateDetailPage;
