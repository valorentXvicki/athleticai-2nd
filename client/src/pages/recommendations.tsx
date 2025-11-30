import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Clock, Users, Zap } from "lucide-react";

interface RecommendedEvent {
  event: {
    id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    date: string;
    venue: string;
    price: number;
    capacity: number;
    skillLevel: string;
    duration: number;
  };
  reason: string;
  matchScore: number;
}

export default function Recommendations() {
  const { user } = useAuth();

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ["/api/sports-events/recommend"],
    queryFn: () =>
      apiRequest("POST", "/api/sports-events/recommend", {}).then((res) => res.json()),
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await apiRequest("POST", `/api/sports-events/${eventId}/enroll`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/enrollments"] });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to see personalized recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Personalized Recommendations
          </h1>
          <p className="text-muted-foreground">
            AI-powered suggestions tailored to your sports preferences and fitness level
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))}
          </div>
        )}

        {error && (
          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <p className="text-destructive">Failed to load recommendations. Please try again.</p>
          </Card>
        )}

        {recommendations && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec: RecommendedEvent, index: number) => (
              <Card
                key={rec.event.id}
                className="overflow-hidden hover-elevate transition-all"
                data-testid={`card-recommendation-${index}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">
                        {rec.event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">{rec.event.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{rec.matchScore}%</div>
                      <p className="text-xs text-muted-foreground">Match</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {rec.event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{rec.event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {rec.event.duration} min -{" "}
                        {new Date(rec.event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Capacity: {rec.event.capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="capitalize">
                      {rec.event.skillLevel}
                    </Badge>
                    <Badge variant="secondary">₹{rec.event.price}</Badge>
                  </div>

                  <div className="mb-4 p-3 bg-primary/5 rounded-md border border-primary/20">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-primary flex items-center gap-1 mb-1">
                        <Zap className="w-4 h-4" />
                        Why recommended:
                      </span>
                      {rec.reason}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => enrollMutation.mutate(rec.event.id)}
                    disabled={enrollMutation.isPending}
                    data-testid={`button-enroll-${rec.event.id}`}
                  >
                    {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {recommendations && recommendations.length === 0 && !isLoading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No recommendations available yet. Update your preferences to get personalized suggestions.
            </p>
            <Button variant="outline" data-testid="button-setup-preferences">
              Set Up Preferences
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
