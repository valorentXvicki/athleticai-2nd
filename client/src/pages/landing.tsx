import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Trophy, 
  TrendingUp, 
  Zap, 
  Target, 
  Users,
  ChevronRight,
  Sparkles,
  Star
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Coaching",
    description: "Get personalized training advice 24/7 from our intelligent AI coach designed specifically for athletes.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description: "Monitor your progress with detailed analytics and insights to optimize your training regimen.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set and achieve your athletic goals with smart recommendations and milestone tracking.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    borderColor: "border-chart-3/20",
  },
];

const testimonials = [
  {
    quote: "Athletic Spirit transformed my training routine. The AI coach understands my goals perfectly.",
    author: "Sarah M.",
    role: "Marathon Runner",
    rating: 5,
  },
  {
    quote: "Finally, a coaching app that feels like having a personal trainer in my pocket.",
    author: "Marcus J.",
    role: "CrossFit Athlete",
    rating: 5,
  },
  {
    quote: "The personalized recommendations helped me break my personal records consistently.",
    author: "Elena K.",
    role: "Triathlete",
    rating: 5,
  },
];

const stats = [
  { value: "50K+", label: "Athletes Coached" },
  { value: "1M+", label: "Training Sessions" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "AI Availability" },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-radial-primary" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Athletic Coaching</span>
          </div>

          <h1 
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Your Personal{" "}
            <span className="gradient-text text-glow-primary">AI Coach</span>
          </h1>

          <p 
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
            data-testid="text-hero-description"
          >
            Unlock your athletic potential with personalized training plans, real-time coaching, 
            and intelligent performance insights powered by advanced AI technology.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href={user ? "/chat" : "/signup"}>
              <Button size="lg" className="gap-2 gradient-primary text-lg font-heading uppercase tracking-wide glow-primary" data-testid="button-hero-cta">
                <Zap className="w-5 h-5" />
                {user ? "Open AI Coach" : "Start Training Free"}
              </Button>
            </Link>
            {!user && (
              <Link href="/login">
                <Button size="lg" variant="outline" className="gap-2 text-lg border-border/50 bg-card/30" data-testid="button-hero-login">
                  Already a member?
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold uppercase mb-4" data-testid="text-features-title">
              Train Smarter, Not Harder
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI coach combines cutting-edge technology with sports science to deliver 
              personalized training experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className={`group bg-card/50 border ${feature.borderColor} hover-elevate transition-transform duration-300`}
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-heading text-xl font-semibold uppercase tracking-wide mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold uppercase mb-4">
              Athletes Love Us
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of athletes who have transformed their performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.author} 
                className="bg-card/50 border-border/50"
                data-testid={`card-testimonial-${index}`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.author}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl p-8 sm:p-12 border border-primary/20">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-heading text-4xl sm:text-5xl font-bold uppercase mb-4">
              Ready to Level Up?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Start your journey to peak performance today. Our AI coach is ready to help 
              you achieve your athletic goals.
            </p>
            <Link href={user ? "/chat" : "/signup"}>
              <Button size="lg" className="gap-2 gradient-primary text-lg font-heading uppercase tracking-wide glow-primary" data-testid="button-cta-final">
                <Zap className="w-5 h-5" />
                {user ? "Start Coaching Session" : "Get Started Now"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-heading text-sm uppercase tracking-wide">
              Athletic Spirit
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            2024 Athletic Spirit. AI-powered coaching for athletes.
          </p>
        </div>
      </footer>
    </div>
  );
}