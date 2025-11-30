import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, TypingIndicator } from "@/components/chat-message";
import { QuickActions } from "@/components/quick-actions";
import type { ChatMessageUI } from "@shared/schema";
import { Send, Sparkles, Trash2, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const welcomeMessage: ChatMessageUI = {
  id: "welcome",
  role: "assistant",
  content: `Welcome to Athletic Spirit! I'm your personal AI coach, here to help you achieve your fitness goals.

I can assist you with:
- Creating personalized training plans
- Nutrition and recovery advice
- Race and competition preparation
- Goal setting and progress tracking
- Answering any sports-related questions

How can I help you today?`,
  timestamp: new Date(),
};

export default function Chat() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessageUI[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!user) {
    return <Redirect to="/login" />;
  }

  const handleSend = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessageUI = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: ChatMessageUI = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
    toast({
      title: "Chat cleared",
      description: "Your conversation has been reset.",
    });
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="min-h-screen bg-background pt-16 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-semibold uppercase tracking-wide flex items-center gap-2">
                AI Coach
                <Sparkles className="w-4 h-4 text-primary" />
              </h1>
              <p className="text-xs text-muted-foreground">
                Your personal athletic assistant
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="gap-2 text-muted-foreground hover:text-destructive"
            data-testid="button-clear-chat"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-6 pb-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                userName={user.displayName || user.username}
              />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        </ScrollArea>

        <div className="border-t border-border/50 bg-card/30 p-4 space-y-4">
          {messages.length === 1 && (
            <QuickActions onSelect={handleQuickAction} disabled={isLoading} />
          )}
          
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI coach anything..."
                className="min-h-[52px] max-h-[200px] resize-none bg-background border-border/50 focus:border-primary/50 pr-12"
                disabled={isLoading}
                data-testid="input-chat-message"
              />
            </div>
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-[52px] px-4 gradient-primary glow-primary"
              data-testid="button-send-message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Athletic Spirit AI may make mistakes. Always consult with a professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}