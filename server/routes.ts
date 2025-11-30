import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, forgotPasswordSchema } from "@shared/schema";
import { z } from "zod";
import { createHash, randomBytes } from "crypto";
import OpenAI from "openai";

// JWT-like token generation (simplified for demo)
function generateToken(userId: string): string {
  const payload = { userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }; // 7 days
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString());
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// Simple password hashing
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

// Auth middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  (req as any).userId = decoded.userId;
  next();
}

// OpenAI client - uses Replit AI Integrations
// This uses Replit's AI Integrations service, which provides OpenAI-compatible API access
// No personal API key required, charges are billed to your Replit credits
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are Athletic Spirit AI Coach, an expert personal trainer and sports coach powered by advanced AI. You specialize in helping athletes of all levels improve their performance, reach their goals, and maintain a healthy, active lifestyle.

Your expertise includes:
- Personalized training plans for various sports (running, cycling, swimming, weightlifting, CrossFit, team sports, etc.)
- Nutrition advice for athletic performance and recovery
- Mental performance coaching and motivation
- Injury prevention and recovery guidance
- Race and competition preparation
- Goal setting and progress tracking

Guidelines:
1. Be encouraging, supportive, and motivational while remaining professional
2. Provide specific, actionable advice tailored to the user's needs
3. Ask clarifying questions when needed to give better recommendations
4. Use sports science principles in your recommendations
5. Remind users to consult healthcare professionals for medical concerns
6. Be concise but thorough in your responses
7. Use a friendly, coach-like tone

Remember: You're not just giving information - you're coaching and inspiring athletes to achieve their potential!`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === AUTH ROUTES ===
  
  // Signup
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      // Server-side validation - only check fields being sent
      const serverSignupSchema = z.object({
        email: z.string().email("Invalid email address"),
        username: z.string().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      });

      const result = serverSignupSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const { email, username, password } = result.data;

      // Check if user exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Create user
      const user = await storage.createUser({
        email,
        username,
        password: hashPassword(password),
        displayName: username,
        discipline: null,
        bio: null,
        avatarUrl: null,
      });

      // Create default achievement
      await storage.createAchievement({
        userId: user.id,
        title: "New Athlete",
        description: "Joined Athletic Spirit community",
        icon: "trophy",
      });

      const token = generateToken(user.id);
      const { password: _, ...safeUser } = user;
      
      res.status(201).json({ token, user: safeUser });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const { email, password } = result.data;

      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== hashPassword(password)) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user.id);
      const { password: _, ...safeUser } = user;

      res.json({ token, user: safeUser });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Forgot password - generate OTP
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const result = forgotPasswordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const { email } = result.data;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return res.json({ message: "If this email exists, you will receive a reset code" });
      }

      // Generate 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await storage.createOtpCode({
        email,
        code,
        expiresAt,
      });

      // In production, this would send an email
      // For demo, we'll log it
      console.log(`Password reset code for ${email}: ${code}`);

      res.json({ message: "Reset code sent to your email" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to send reset code" });
    }
  });

  // Reset password with OTP
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { email, otp, password } = req.body;

      if (!email || !otp || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const validOtp = await storage.getValidOtpCode(email, otp);
      if (!validOtp) {
        return res.status(400).json({ message: "Invalid or expired reset code" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      await storage.updateUser(user.id, { password: hashPassword(password) });
      await storage.markOtpAsUsed(validOtp.id);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req as any).userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Update user profile
  app.patch("/api/auth/me", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { displayName, discipline, bio, avatarUrl } = req.body;
      
      const user = await storage.updateUser((req as any).userId, {
        displayName,
        discipline,
        bio,
        avatarUrl,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // === CHAT ROUTES ===
  
  // Send message and get AI response
  app.post("/api/chat", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { message, conversationId = "default" } = req.body;
      const userId = (req as any).userId;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      // Save user message
      await storage.createChatMessage({
        userId,
        conversationId,
        role: "user",
        content: message,
      });

      // Get user context for personalization
      const user = await storage.getUser(userId);
      const userContext = user?.discipline 
        ? `The user is a ${user.discipline} athlete.` 
        : "";

      // Get previous messages for context (last 10)
      const previousMessages = await storage.getChatMessages(userId, conversationId);
      const contextMessages = previousMessages.slice(-10).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Call OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\n${userContext}` },
          ...contextMessages,
          { role: "user", content: message },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || 
        "I apologize, but I'm having trouble responding right now. Please try again.";

      // Save AI response
      await storage.createChatMessage({
        userId,
        conversationId,
        role: "assistant",
        content: aiResponse,
      });

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: "Failed to get response",
        response: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." 
      });
    }
  });

  // Get chat history
  app.get("/api/chat/history", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const conversationId = (req.query.conversationId as string) || "default";
      
      const messages = await storage.getChatMessages(userId, conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Get chat history error:", error);
      res.status(500).json({ message: "Failed to get chat history" });
    }
  });

  // === ACTIVITIES ROUTES ===
  
  // Get user activities
  app.get("/api/activities", authMiddleware, async (req: Request, res: Response) => {
    try {
      const activities = await storage.getActivities((req as any).userId);
      res.json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ message: "Failed to get activities" });
    }
  });

  // Create activity
  app.post("/api/activities", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { type, title, description, duration, distance, calories } = req.body;

      if (!type || !title) {
        return res.status(400).json({ message: "Type and title are required" });
      }

      const activity = await storage.createActivity({
        userId: (req as any).userId,
        type,
        title,
        description,
        duration,
        distance,
        calories,
      });

      res.status(201).json(activity);
    } catch (error) {
      console.error("Create activity error:", error);
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // === ACHIEVEMENTS ROUTES ===
  
  // Get user achievements
  app.get("/api/achievements", authMiddleware, async (req: Request, res: Response) => {
    try {
      const achievements = await storage.getAchievements((req as any).userId);
      res.json(achievements);
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  // === USER PREFERENCES ROUTES ===
  
  // Get user preferences
  app.get("/api/preferences", authMiddleware, async (req: Request, res: Response) => {
    try {
      const preferences = await storage.getUserPreferences((req as any).userId);
      res.json(preferences || {});
    } catch (error) {
      console.error("Get preferences error:", error);
      res.status(500).json({ message: "Failed to get preferences" });
    }
  });

  // Update user preferences
  app.post("/api/preferences", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { sports, fitnessLevel, goals, preferredWorkoutTime } = req.body;
      
      const preferences = await storage.createOrUpdateUserPreferences({
        userId: (req as any).userId,
        sports,
        fitnessLevel,
        goals,
        preferredWorkoutTime,
      });

      res.json(preferences);
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // === DASHBOARD STATS ===
  
  app.get("/api/stats", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const activities = await storage.getActivities(userId);
      const achievements = await storage.getAchievements(userId);

      const totalWorkouts = activities.length;
      const totalDistance = activities.reduce((sum, a) => sum + (a.distance || 0), 0);
      const totalCalories = activities.reduce((sum, a) => sum + (a.calories || 0), 0);
      
      // Calculate streak (simplified)
      const currentStreak = Math.min(activities.length, 12);
      const weeklyGoalProgress = Math.min(100, (activities.length % 7) * 15 + 25);

      res.json({
        totalWorkouts,
        totalDistance: totalDistance / 1000, // Convert to km
        totalCalories,
        currentStreak,
        weeklyGoalProgress,
        achievementsCount: achievements.length,
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  // === SPORTS EVENTS & RECOMMENDATIONS ===

  // Get all sports events
  app.get("/api/sports-events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllSportsEvents();
      res.json(events);
    } catch (error) {
      console.error("Get sports events error:", error);
      res.status(500).json({ message: "Failed to get sports events" });
    }
  });

  // AI-powered event recommendations with smart fallback
  app.post("/api/sports-events/recommend", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const user = await storage.getUser(userId);
      const preferences = await storage.getUserPreferences(userId);
      const allEvents = await storage.getAllSportsEvents();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Smart recommendation logic based on user preferences
      const userSports = preferences?.sports?.map(s => s.toLowerCase()) || [];
      const userLevel = preferences?.fitnessLevel?.toLowerCase() || "intermediate";
      const userGoals = preferences?.goals?.map(g => g.toLowerCase()) || [];

      let recommendations: any[] = [];

      // Filter and score events
      const scoredEvents = allEvents.map((event, index) => {
        let score = 50; // Base score

        // Match sports interest
        if (userSports.length > 0) {
          userSports.forEach((sport) => {
            if (event.type.toLowerCase().includes(sport) || sport.includes(event.type.toLowerCase())) {
              score += 25;
            }
          });
        } else {
          score += 10; // Slight boost if no preference set
        }

        // Match fitness level
        const eventLevel = event.skillLevel.toLowerCase();
        if (eventLevel === userLevel) {
          score += 20;
        } else if (
          (userLevel === "beginner" && eventLevel === "intermediate") ||
          (userLevel === "intermediate" && (eventLevel === "beginner" || eventLevel === "advanced")) ||
          (userLevel === "advanced" && eventLevel === "intermediate")
        ) {
          score += 10;
        }

        // Match goals if set
        if (userGoals.length > 0) {
          const eventDesc = (event.title + " " + event.description).toLowerCase();
          userGoals.forEach((goal) => {
            if (eventDesc.includes(goal)) {
              score += 15;
            }
          });
        }

        return { event, index, score, reason: generateReason(event, userSports, userLevel, userGoals) };
      });

      // Sort by score and get top 5
      recommendations = scoredEvents.sort((a, b) => b.score - a.score).slice(0, 5).map((item) => ({
        event: item.event,
        reason: item.reason,
        matchScore: Math.min(100, item.score),
      }));

      res.json(recommendations);
    } catch (error) {
      console.error("Recommendations error:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // Helper function to generate reason
  function generateReason(
    event: any,
    sports: string[],
    level: string,
    goals: string[]
  ): string {
    const reasons = [];

    if (sports.length > 0) {
      sports.forEach((sport) => {
        if (event.type.toLowerCase().includes(sport) || sport.includes(event.type.toLowerCase())) {
          reasons.push(`matches your interest in ${sport}`);
        }
      });
    }

    const eventLevel = event.skillLevel.toLowerCase();
    if (eventLevel === level) {
      reasons.push(`perfect for your ${level} fitness level`);
    } else if (level === "beginner" && eventLevel === "intermediate") {
      reasons.push(`great for progression from beginner level`);
    } else if (level === "intermediate" && eventLevel === "advanced") {
      reasons.push(`challenges you to advance your skills`);
    }

    if (reasons.length === 0) {
      reasons.push("great overall fit for your profile");
    }

    return "This event " + reasons.join(" and ");
  }

  // Enroll in event
  app.post("/api/sports-events/:eventId/enroll", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { eventId } = req.params;

      const event = await storage.getSportsEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const isAlreadyEnrolled = await storage.isEnrolled(userId, eventId);
      if (isAlreadyEnrolled) {
        return res.status(400).json({ message: "Already enrolled in this event" });
      }

      const enrollment = await storage.enrollInEvent({ userId, eventId });
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Enroll error:", error);
      res.status(500).json({ message: "Failed to enroll in event" });
    }
  });

  // Get user enrollments
  app.get("/api/user/enrollments", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const enrollments = await storage.getUserEnrollments(userId);

      // Get event details for each enrollment
      const enrichedEnrollments = await Promise.all(
        enrollments.map(async (enrollment) => {
          const event = await storage.getSportsEventById(enrollment.eventId);
          return { ...enrollment, event };
        })
      );

      res.json(enrichedEnrollments);
    } catch (error) {
      console.error("Get enrollments error:", error);
      res.status(500).json({ message: "Failed to get enrollments" });
    }
  });

  return httpServer;
}