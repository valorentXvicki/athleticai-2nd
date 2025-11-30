import { 
  type User, 
  type InsertUser,
  type ChatMessage,
  type InsertChatMessage,
  type Activity,
  type InsertActivity,
  type Achievement,
  type InsertAchievement,
  type OtpCode,
  type InsertOtpCode,
  type UserPreferences,
  type InsertUserPreferences,
  type SportsEvent,
  type InsertSportsEvent,
  type EventEnrollment,
  type InsertEventEnrollment
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Chat Messages
  getChatMessages(userId: string, conversationId: string): Promise<ChatMessage[]>;
  getUserConversations(userId: string): Promise<string[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Activities
  getActivities(userId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Achievements
  getAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // User Preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences>;
  
  // OTP Codes
  createOtpCode(otp: InsertOtpCode): Promise<OtpCode>;
  getValidOtpCode(email: string, code: string): Promise<OtpCode | undefined>;
  markOtpAsUsed(id: string): Promise<void>;

  // Sports Events
  getAllSportsEvents(): Promise<SportsEvent[]>;
  getSportsEventById(id: string): Promise<SportsEvent | undefined>;
  createSportsEvent(event: InsertSportsEvent): Promise<SportsEvent>;
  
  // Event Enrollments
  enrollInEvent(enrollment: InsertEventEnrollment): Promise<EventEnrollment>;
  getUserEnrollments(userId: string): Promise<EventEnrollment[]>;
  isEnrolled(userId: string, eventId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatMessages: Map<string, ChatMessage>;
  private activities: Map<string, Activity>;
  private achievements: Map<string, Achievement>;
  private userPreferences: Map<string, UserPreferences>;
  private otpCodes: Map<string, OtpCode>;
  private sportsEvents: Map<string, SportsEvent>;
  private eventEnrollments: Map<string, EventEnrollment>;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.activities = new Map();
    this.achievements = new Map();
    this.userPreferences = new Map();
    this.otpCodes = new Map();
    this.sportsEvents = new Map();
    this.eventEnrollments = new Map();
    this.seedSportsEvents();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getChatMessages(userId: string, conversationId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId && msg.conversationId === conversationId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async getUserConversations(userId: string): Promise<string[]> {
    const conversations = new Set<string>();
    Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId)
      .forEach(msg => conversations.add(msg.conversationId));
    return Array.from(conversations);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getActivities(userId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      date: insertActivity.date || new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      unlockedAt: new Date()
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (prefs) => prefs.userId === userId
    );
  }

  async createOrUpdateUserPreferences(insertPrefs: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(insertPrefs.userId);
    
    if (existing) {
      const updated = { ...existing, ...insertPrefs };
      this.userPreferences.set(existing.id, updated);
      return updated;
    }
    
    const id = randomUUID();
    const prefs: UserPreferences = {
      ...insertPrefs,
      id
    };
    this.userPreferences.set(id, prefs);
    return prefs;
  }

  async createOtpCode(insertOtp: InsertOtpCode): Promise<OtpCode> {
    const id = randomUUID();
    const otp: OtpCode = {
      ...insertOtp,
      id,
      used: false
    };
    this.otpCodes.set(id, otp);
    return otp;
  }

  async getValidOtpCode(email: string, code: string): Promise<OtpCode | undefined> {
    return Array.from(this.otpCodes.values()).find(
      (otp) => 
        otp.email.toLowerCase() === email.toLowerCase() && 
        otp.code === code && 
        !otp.used && 
        new Date(otp.expiresAt) > new Date()
    );
  }

  async markOtpAsUsed(id: string): Promise<void> {
    const otp = this.otpCodes.get(id);
    if (otp) {
      otp.used = true;
      this.otpCodes.set(id, otp);
    }
  }

  private seedSportsEvents(): void {
    const events: InsertSportsEvent[] = [
      {
        title: "Basketball League Finals",
        description: "Exciting basketball championship finals at the sports complex",
        type: "basketball",
        location: "Main Sports Arena, Downtown",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        venue: "Main Sports Arena",
        price: 500,
        capacity: 200,
        skillLevel: "intermediate",
        duration: 120,
        imageUrl: null,
      },
      {
        title: "Beginner Yoga Classes",
        description: "Relaxing yoga sessions for beginners and all fitness levels",
        type: "yoga",
        location: "Wellness Center, Park District",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        venue: "Wellness Center",
        price: 300,
        capacity: 50,
        skillLevel: "beginner",
        duration: 60,
        imageUrl: null,
      },
      {
        title: "Professional Tennis Tournament",
        description: "High-level professional tennis tournament with expert players",
        type: "tennis",
        location: "Tennis Complex, Sports City",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        venue: "Tennis Complex",
        price: 1000,
        capacity: 300,
        skillLevel: "advanced",
        duration: 180,
        imageUrl: null,
      },
      {
        title: "Running Club Weekly 10K",
        description: "Join our weekly running club for a scenic 10km run through the city",
        type: "running",
        location: "Central Park, North Gate",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        venue: "Central Park",
        price: 100,
        capacity: 100,
        skillLevel: "intermediate",
        duration: 60,
        imageUrl: null,
      },
      {
        title: "CrossFit Championships",
        description: "Intense CrossFit competition featuring teams from across the region",
        type: "crossfit",
        location: "Fitness Arena, Industrial Zone",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        venue: "Fitness Arena",
        price: 800,
        capacity: 150,
        skillLevel: "advanced",
        duration: 240,
        imageUrl: null,
      },
      {
        title: "Swimming Lessons - All Ages",
        description: "Professional swimming instruction for all age groups and skill levels",
        type: "swimming",
        location: "Olympic Pool Complex",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        venue: "Olympic Pool",
        price: 400,
        capacity: 80,
        skillLevel: "beginner",
        duration: 90,
        imageUrl: null,
      },
      {
        title: "Cycling Expedition - Mountain Trails",
        description: "Guided mountain biking expedition through scenic trails",
        type: "cycling",
        location: "Mountain Ridge National Park",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        venue: "Mountain Ridge",
        price: 600,
        capacity: 120,
        skillLevel: "intermediate",
        duration: 180,
        imageUrl: null,
      },
      {
        title: "Fitness Bootcamp - 4 Week Challenge",
        description: "Intensive 4-week fitness bootcamp with personal training and nutrition guidance",
        type: "bootcamp",
        location: "Fitness Hub, Downtown",
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        venue: "Fitness Hub",
        price: 2000,
        capacity: 60,
        skillLevel: "intermediate",
        duration: 300,
        imageUrl: null,
      },
    ];

    events.forEach((event) => {
      const id = randomUUID();
      const sportsEvent: SportsEvent = {
        ...event,
        id,
        enrolledCount: 0,
        createdAt: new Date(),
      };
      this.sportsEvents.set(id, sportsEvent);
    });
  }

  async getAllSportsEvents(): Promise<SportsEvent[]> {
    return Array.from(this.sportsEvents.values());
  }

  async getSportsEventById(id: string): Promise<SportsEvent | undefined> {
    return this.sportsEvents.get(id);
  }

  async createSportsEvent(insertEvent: InsertSportsEvent): Promise<SportsEvent> {
    const id = randomUUID();
    const event: SportsEvent = {
      ...insertEvent,
      id,
      enrolledCount: 0,
      createdAt: new Date(),
    };
    this.sportsEvents.set(id, event);
    return event;
  }

  async enrollInEvent(insertEnrollment: InsertEventEnrollment): Promise<EventEnrollment> {
    const id = randomUUID();
    const enrollment: EventEnrollment = {
      ...insertEnrollment,
      id,
      enrolledAt: new Date(),
    };
    this.eventEnrollments.set(id, enrollment);
    return enrollment;
  }

  async getUserEnrollments(userId: string): Promise<EventEnrollment[]> {
    return Array.from(this.eventEnrollments.values()).filter(
      (enrollment) => enrollment.userId === userId
    );
  }

  async isEnrolled(userId: string, eventId: string): Promise<boolean> {
    return Array.from(this.eventEnrollments.values()).some(
      (enrollment) => enrollment.userId === userId && enrollment.eventId === eventId
    );
  }
}

export const storage = new MemStorage();