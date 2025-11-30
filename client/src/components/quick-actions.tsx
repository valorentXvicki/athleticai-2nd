import { Button } from "@/components/ui/button";
import { Dumbbell, Trophy, Calendar, Zap, Target, TrendingUp } from "lucide-react";

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    label: "Training Plan",
    prompt: "Create a personalized training plan for me based on my fitness level and goals",
    icon: Dumbbell,
  },
  {
    label: "Nutrition Tips",
    prompt: "What should I eat before and after my workout for optimal performance?",
    icon: Zap,
  },
  {
    label: "Race Prep",
    prompt: "Help me prepare for my upcoming race. What should I focus on in the final weeks?",
    icon: Trophy,
  },
  {
    label: "Recovery Advice",
    prompt: "What are the best recovery practices after an intense training session?",
    icon: TrendingUp,
  },
  {
    label: "Weekly Schedule",
    prompt: "Help me create a balanced weekly training schedule with rest days",
    icon: Calendar,
  },
  {
    label: "Set Goals",
    prompt: "Help me set realistic and achievable fitness goals for the next 3 months",
    icon: Target,
  },
];

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center" data-testid="quick-actions">
      {quickActions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          size="sm"
          onClick={() => onSelect(action.prompt)}
          disabled={disabled}
          className="gap-2 text-xs bg-card/50 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
          data-testid={`quick-action-${action.label.toLowerCase().replace(" ", "-")}`}
        >
          <action.icon className="w-3.5 h-3.5 text-primary" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}