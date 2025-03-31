import { useState } from "react";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import ContactSection from "@/components/home/ContactSection";
import ChatButton from "@/components/chatbot/ChatButton";
import ChatWidget from "@/components/chatbot/ChatWidget";

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <ContactSection />
      
      {/* AI Chatbot */}
      <ChatButton onClick={toggleChat} isWidgetOpen={isChatOpen} />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Home;
