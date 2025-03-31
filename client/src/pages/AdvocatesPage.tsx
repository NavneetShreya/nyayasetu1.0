import { useState } from "react";
import AdvocateList from "@/components/advocates/AdvocateList";
import ChatButton from "@/components/chatbot/ChatButton";
import ChatWidget from "@/components/chatbot/ChatWidget";

const AdvocatesPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-4">Find Advocates Near You</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our extensive network of qualified legal professionals across India.
        </p>
      </div>
      
      <AdvocateList />
      
      {/* AI Chatbot */}
      <ChatButton onClick={toggleChat} isWidgetOpen={isChatOpen} />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default AdvocatesPage;
