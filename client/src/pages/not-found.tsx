import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0 bg-radial-primary opacity-30" />
      
      <div className="text-center relative z-10 animate-fade-up">
        <h1 className="font-heading text-8xl sm:text-9xl font-bold gradient-text mb-4">
          404
        </h1>
        <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like you've wandered off the track. Don't worry, even the best athletes
          take a wrong turn sometimes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.history.back()}
            data-testid="button-go-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Link href="/">
            <Button className="gap-2 gradient-primary" data-testid="button-go-home">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}