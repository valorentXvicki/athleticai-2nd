import { cn } from "@/lib/utils";
import type { ChatMessageUI } from "@shared/schema";
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: ChatMessageUI;
  userName?: string;
}

export function ChatMessage({ message, userName }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      data-testid={`message-${message.id}`}
    >
      <Avatar className={cn(
        "w-8 h-8 shrink-0 border",
        isUser ? "border-primary/30 bg-primary/10" : "border-accent/30 bg-accent/10"
      )}>
        <AvatarFallback className={cn(
          isUser ? "text-primary" : "text-accent"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl",
          isUser
            ? "bg-primary/15 border border-primary/25 rounded-br-sm"
            : "bg-accent/10 border border-accent/20 rounded-bl-sm"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-xs font-medium font-heading tracking-wide uppercase",
            isUser ? "text-primary" : "text-accent"
          )}>
            {isUser ? (userName || "You") : "AI Coach"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-accent animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in" data-testid="typing-indicator">
      <Avatar className="w-8 h-8 shrink-0 border border-accent/30 bg-accent/10">
        <AvatarFallback className="text-accent">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>

      <div className="px-4 py-3 rounded-2xl bg-accent/10 border border-accent/20 rounded-bl-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium font-heading tracking-wide uppercase text-accent">
            AI Coach
          </span>
        </div>
        <div className="flex gap-1.5 items-center py-1">
          <span className="w-2 h-2 rounded-full bg-accent animate-typing-1" />
          <span className="w-2 h-2 rounded-full bg-accent animate-typing-2" />
          <span className="w-2 h-2 rounded-full bg-accent animate-typing-3" />
        </div>
      </div>
    </div>
  );
}