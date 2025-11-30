import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  User,
  Trophy,
  Flame,
  TrendingUp,
  Calendar,
  Edit,
  Save,
  X,
  Target,
  Zap,
  Award,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockStats = {
  totalWorkouts: 47,
  totalDistance: 156.8,
  totalCalories: 24500,
  currentStreak: 12,
  weeklyGoalProgress: 75,
};

const mockActivities = [
  { id: "1", type: "run", title: "Morning Run", duration: 45, date: "Today", distance: 5.2 },
  { id: "2", type: "strength", title: "Upper Body Strength", duration: 60, date: "Yesterday", distance: 0 },
  { id: "3", type: "run", title: "Interval Training", duration: 35, date: "2 days ago", distance: 4.1 },
  { id: "4", type: "yoga", title: "Recovery Yoga", duration: 30, date: "3 days ago", distance: 0 },
];

const mockAchievements = [
  { id: "1", title: "First 5K", description: "Completed your first 5K run", icon: "medal", date: "Nov 15" },
  { id: "2", title: "Week Warrior", description: "7-day workout streak", icon: "fire", date: "Nov 20" },
  { id: "3", title: "Early Bird", description: "10 morning workouts", icon: "sun", date: "Nov 22" },
  { id: "4", title: "Century Club", description: "100km total distance", icon: "trophy", date: "Nov 25" },
];

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || "",
    discipline: user?.discipline || "",
    bio: user?.bio || "",
  });

  if (!user) {
    return <Redirect to="/login" />;
  }

  const handleSaveProfile = async () => {
    try {
      updateUser(editForm);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[320px,1fr] gap-6">
          <Card className="bg-card/50 border-border/50 h-fit" data-testid="card-profile">
            <CardContent className="p-6">
              <div className="flex justify-end mb-4">
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                    data-testid="button-edit-profile"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      data-testid="button-cancel-edit"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveProfile}
                      className="gap-2 gradient-primary"
                      data-testid="button-save-profile"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary/30 glow-primary">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-heading">
                    {(user.displayName || user.username)?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {isEditing ? (
                  <div className="space-y-4 text-left">
                    <div>
                      <Label htmlFor="displayName" className="text-xs text-muted-foreground">
                        Display Name
                      </Label>
                      <Input
                        id="displayName"
                        value={editForm.displayName}
                        onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                        className="mt-1"
                        data-testid="input-display-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discipline" className="text-xs text-muted-foreground">
                        Discipline
                      </Label>
                      <Input
                        id="discipline"
                        value={editForm.discipline}
                        onChange={(e) => setEditForm({ ...editForm, discipline: e.target.value })}
                        placeholder="e.g., Running, CrossFit, Triathlon"
                        className="mt-1"
                        data-testid="input-discipline"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-xs text-muted-foreground">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        className="mt-1 min-h-[80px]"
                        data-testid="input-bio"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading text-2xl font-bold uppercase" data-testid="text-user-name">
                      {user.displayName || user.username}
                    </h2>
                    <Badge variant="outline" className="mt-2 text-accent border-accent/30 bg-accent/10">
                      {user.discipline || "Athlete"}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-4" data-testid="text-user-bio">
                      {user.bio || "No bio yet. Click Edit to add one!"}
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "November 2024"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card/50 border-border/50" data-testid="stat-workouts">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Total Workouts
                      </p>
                      <p className="font-heading text-2xl font-bold text-primary">
                        {mockStats.totalWorkouts}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50" data-testid="stat-distance">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Total Distance
                      </p>
                      <p className="font-heading text-2xl font-bold text-accent">
                        {mockStats.totalDistance} km
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50" data-testid="stat-calories">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Calories Burned
                      </p>
                      <p className="font-heading text-2xl font-bold text-chart-3">
                        {(mockStats.totalCalories / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50" data-testid="stat-streak">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-chart-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Current Streak
                      </p>
                      <p className="font-heading text-2xl font-bold text-chart-4">
                        {mockStats.currentStreak} days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 border-border/50" data-testid="card-weekly-goal">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg uppercase tracking-wide flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Weekly Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-primary">{mockStats.weeklyGoalProgress}%</span>
                  </div>
                  <Progress value={mockStats.weeklyGoalProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    3 more workouts to reach your weekly goal!
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 border-border/50" data-testid="card-recent-activity">
                <CardHeader>
                  <CardTitle className="font-heading text-lg uppercase tracking-wide flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                        data-testid={`activity-${activity.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span>{activity.duration}m</span>
                          </div>
                          {activity.distance > 0 && (
                            <p className="text-xs text-muted-foreground">{activity.distance} km</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50" data-testid="card-achievements">
                <CardHeader>
                  <CardTitle className="font-heading text-lg uppercase tracking-wide flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {mockAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="p-3 rounded-lg bg-background/50 border border-border/30 text-center"
                        data-testid={`achievement-${achievement.id}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-2">
                          <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-medium text-xs">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}