import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
  isWidgetOpen: boolean;
}

const ChatButton = ({ onClick, isWidgetOpen }: ChatButtonProps) => {
  if (isWidgetOpen) return null;
  
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-primary text-black shadow-lg hover:bg-[#e6c200] transition focus:outline-none"
      aria-label="Open AI Legal Assistant"
      size="icon"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};

export default ChatButton;
