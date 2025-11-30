import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Calendar, MapPin, Users, Search, Filter, Zap, BookOpen } from "lucide-react";

const mockEvents = [
  {
    id: "1",
    title: "Bangalore Half Marathon 2025",
    description: "Urban half marathon through Bangalore's IT corridor and parks. Perfect for all fitness levels.",
    date: "2025-03-16",
    time: "06:00 AM",
    location: "Bangalore, Karnataka",
    type: "running",
    attendees: 2100,
    distance: "21.1 km",
    difficulty: "Intermediate",
    image: "🏃",
  },
  {
    id: "2",
    title: "CrossFit Bangalore Championship",
    description: "Compete in intense CrossFit WODs at Bangalore's premier fitness facility.",
    date: "2025-04-20",
    time: "08:00 AM",
    location: "Bangalore, Karnataka",
    type: "crossfit",
    attendees: 380,
    distance: "N/A",
    difficulty: "Advanced",
    image: "💪",
  },
  {
    id: "3",
    title: "Bangalore Cycling Festival",
    description: "Multi-distance cycling event through Bangalore's scenic routes and tech parks.",
    date: "2025-03-23",
    time: "07:00 AM",
    location: "Bangalore, Karnataka",
    type: "cycling",
    attendees: 950,
    distance: "40-80 km",
    difficulty: "Intermediate",
    image: "🚴",
  },
  {
    id: "4",
    title: "Strength & Power Meet Bangalore",
    description: "Powerlifting competition with athletes from across South India.",
    date: "2025-05-18",
    time: "10:00 AM",
    location: "Bangalore, Karnataka",
    type: "strength",
    attendees: 280,
    distance: "N/A",
    difficulty: "Advanced",
    image: "🏋️",
  },
  {
    id: "5",
    title: "Bangalore 10K Sprint",
    description: "Fast-paced 10km running event perfect for beginners and intermediate runners.",
    date: "2025-04-06",
    time: "06:30 AM",
    location: "Bangalore, Karnataka",
    type: "running",
    attendees: 1580,
    distance: "10 km",
    difficulty: "Beginner",
    image: "🏃",
  },
  {
    id: "6",
    title: "Triathlon at Whitefield",
    description: "Sprint triathlon with 750m swim, 20km bike, and 5km run in tech hub.",
    date: "2025-06-08",
    time: "07:00 AM",
    location: "Bangalore, Karnataka",
    type: "triathlon",
    attendees: 420,
    distance: "Sprint",
    difficulty: "Intermediate",
    image: "🏊",
  },
  {
    id: "7",
    title: "City Marathon 2025",
    description: "Annual city marathon featuring a 42.2km course through urban trails and parks.",
    date: "2025-04-15",
    time: "07:00 AM",
    location: "New York, USA",
    type: "running",
    attendees: 1250,
    distance: "42.2 km",
    difficulty: "Advanced",
    image: "🏃",
  },
  {
    id: "8",
    title: "CrossFit Regionals Qualifier",
    description: "Compete in CrossFit WODs to qualify for regional competition.",
    date: "2025-05-10",
    time: "08:00 AM",
    location: "Los Angeles, USA",
    type: "crossfit",
    attendees: 450,
    distance: "N/A",
    difficulty: "Expert",
    image: "💪",
  },
];

const typeColors = {
  running: "bg-primary/10 text-primary border-primary/20",
  crossfit: "bg-accent/10 text-accent border-accent/20",
  triathlon: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  strength: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  cycling: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};

const difficultyColors = {
  Beginner: "bg-chart-3/20 text-chart-3",
  Intermediate: "bg-accent/20 text-accent",
  Advanced: "bg-primary/20 text-primary",
  Expert: "bg-destructive/20 text-destructive",
};

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [bangaloreOnly, setBangaloreOnly] = useState(true);

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || event.type === selectedType;
    const matchesLocation = !bangaloreOnly || event.location.includes("Bangalore");
    return matchesSearch && matchesType && matchesLocation;
  });

  const eventTypes = ["running", "crossfit", "triathlon", "strength", "cycling"];

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading text-4xl sm:text-5xl uppercase tracking-wide font-bold mb-2">
            Discover Events
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Find and register for athletic events tailored to your interests. Connect with other athletes and challenge yourself.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex gap-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border/50 focus:border-primary/50"
              data-testid="input-event-search"
            />
            <Button 
              variant={bangaloreOnly ? "secondary" : "outline"}
              className="gap-2 border-border/50"
              onClick={() => setBangaloreOnly(!bangaloreOnly)}
              data-testid="button-bangalore-filter"
            >
              <MapPin className="w-4 h-4" />
              {bangaloreOnly ? "Bangalore Only" : "All Locations"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className={`capitalize ${selectedType === type ? "bg-primary/15" : ""}`}
                data-testid={`filter-${type}`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <Card className="bg-card/30 border-border/50">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-heading text-lg uppercase tracking-wide mb-2">
                No Events Found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className="bg-card/50 border-border/50 hover-elevate transition-transform overflow-hidden group"
                data-testid={`card-event-${event.id}`}
              >
                <div className={`h-32 flex items-center justify-center text-6xl bg-gradient-to-br ${typeColors[event.type as keyof typeof typeColors] || typeColors.running}`}>
                  {event.image}
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="font-heading text-lg uppercase tracking-wide leading-tight flex-1">
                      {event.title}
                    </CardTitle>
                    <Badge className={`capitalize shrink-0 ${difficultyColors[event.difficulty as keyof typeof difficultyColors]}`}>
                      {event.difficulty}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="w-fit capitalize text-xs">
                    {event.type}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees.toLocaleString()} attending</span>
                    </div>
                  </div>

                  <Button
                    className="w-full gradient-primary gap-2 font-heading uppercase tracking-wide text-sm"
                    data-testid={`button-register-${event.id}`}
                  >
                    <Zap className="w-4 h-4" />
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}