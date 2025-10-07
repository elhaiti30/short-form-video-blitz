import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your VideoBlitz AI assistant. Ask me anything about creating videos, using templates, or scheduling posts!",
    },
  ]);

  const quickQuestions = [
    "How do I generate a video?",
    "How can I schedule content?",
    "What are the best templates?",
    "How do I upgrade my plan?",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(input);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 500);

    setInput("");
  };

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes("video") || q.includes("generate")) {
      return "To generate a video:\n1. Click 'Create' in the dashboard\n2. Enter your video topic or idea\n3. Choose a style and template\n4. Click 'Generate' and wait 30 seconds!\n\nYou can also customize voice, music, and transitions before generating.";
    }
    
    if (q.includes("schedule") || q.includes("post")) {
      return "To schedule content:\n1. Go to the 'Scheduler' tab\n2. Select your video\n3. Choose platform (TikTok, Instagram, YouTube)\n4. Pick date and time\n5. Click 'Schedule Post'\n\nYou can also connect your social accounts in the 'Social' tab first!";
    }
    
    if (q.includes("template")) {
      return "Browse templates in the 'Templates' tab! We have categories like:\n• Trending styles\n• Business promos\n• Education content\n• Entertainment\n\nEach template is customizable with your own colors, fonts, and branding.";
    }
    
    if (q.includes("upgrade") || q.includes("plan")) {
      return "To upgrade your plan:\n1. Go to Settings → Billing\n2. Click 'Upgrade Plan'\n3. Choose Creator ($19/mo) or Pro ($49/mo)\n\nCreator plan gives you 50 videos/month in 1080p with premium templates!";
    }
    
    return "I'm here to help! You can ask me about:\n• Creating videos\n• Using templates\n• Scheduling posts\n• Account settings\n• Billing and plans\n\nWhat would you like to know?";
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSend();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`fixed ${
        isMinimized ? "bottom-6 right-6 w-80" : "bottom-6 right-6 w-96 h-[600px]"
      } shadow-2xl z-50 flex flex-col transition-all`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold">AI Assistant</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs text-muted-foreground">Quick questions:</p>
                  {quickQuestions.map((q, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => handleQuickQuestion(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIAssistant;
