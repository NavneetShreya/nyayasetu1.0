import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { z } from "zod";
import { storage } from "./storage";
import { mongoStorage } from "./mongo-storage";
import bcrypt from "bcryptjs";
import { isAuthenticated, hasRole } from "./auth";
import { aiChatResponse, getSuggestedLegalQuestions } from "./bert-model";

// Use MongoDB storage when available, fallback to in-memory storage
const dataStore = process.env.USE_MONGO === 'true' ? mongoStorage : storage;

// Login schema validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Register schema validation with role selection
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email format"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  role: z.enum(["client", "advocate"], { 
    errorMap: () => ({ message: "Role must be either 'client' or 'advocate'" }) 
  }),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return next(err);
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: info?.message || "Authentication failed"
          });
        }
        
        req.login(user, (err) => {
          if (err) return next(err);
          
          return res.json({
            success: true,
            message: "Authentication successful",
            user
          });
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });
  
  app.post("/api/auth/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body);
      
      // Check if username already exists
      const existingUserByUsername = await dataStore.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }
      
      // Check if email already exists
      const existingUserByEmail = await dataStore.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);
      
      // Create user
      const newUser = await dataStore.createUser({
        username: validatedData.username,
        password: hashedPassword,
        email: validatedData.email,
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        role: validatedData.role
      });
      
      // If role is advocate, create advocate profile
      if (validatedData.role === "advocate") {
        // Get default location for initial setup
        const defaultLocation = (await dataStore.getAllLocations())[0];
        
        if (defaultLocation) {
          await dataStore.createAdvocate({
            userId: newUser.id,
            locationId: defaultLocation.id,
            bio: `Advocate profile for ${validatedData.fullName}`,
            experience: 0,
            barCouncilNumber: "Not verified",
            imageUrl: null
          });
        }
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });
  
  app.get("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error during logout"
        });
      }
      
      res.json({
        success: true,
        message: "Logged out successfully"
      });
    });
  });
  
  app.get("/api/auth/user", isAuthenticated, (req: Request, res: Response) => {
    res.json({
      success: true,
      user: req.user
    });
  });
  
  // Chat routes
  app.post("/api/chat", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, isEncrypted } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Message is required and must be a string"
        });
      }
      
      const userId = req.user ? (req.user as any).id : 999; // Guest user ID
      
      // Store user message (might be encrypted)
      await dataStore.createChatMessage({
        userId: userId,
        content: message,
        isUserMessage: true
      });
      
      // Get AI response - if the message is encrypted, we'll just process it as is.
      // The actual content doesn't matter for our demo purposes since we're not actually
      // using a real model. In a real system, you'd need a way to decrypt on the server
      // for AI processing while maintaining E2E guarantees.
      const userMessageForAI = isEncrypted 
        ? "I'm sending an encrypted legal question" 
        : message;
        
      const aiResponse = await aiChatResponse(userMessageForAI);
      
      // Store AI response
      const aiMessageRecord = await dataStore.createChatMessage({
        userId: userId,
        content: aiResponse,
        isUserMessage: false
      });
      
      res.json({
        success: true,
        response: aiResponse
      });
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/chat/history/:userId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get chat history for user
      const messages = await dataStore.getChatHistory(userId);
      
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/chat/suggested-questions", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questions = await getSuggestedLegalQuestions();
      
      res.json({
        success: true,
        data: questions
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Practice areas routes
  app.get("/api/practice-areas", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const areas = await dataStore.getAllPracticeAreas();
      res.json({
        success: true,
        data: areas
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Advocates routes
  app.get("/api/advocates", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { location, practiceArea, experience, searchQuery } = req.query;
      
      let advocates;
      
      if (location || practiceArea || experience || searchQuery) {
        advocates = await dataStore.getAdvocatesByFilter({
          location: location as string,
          practiceArea: practiceArea as string,
          experience: experience as string,
          searchQuery: searchQuery as string
        });
      } else {
        advocates = await dataStore.getAllAdvocates();
      }
      
      res.json({
        success: true,
        data: advocates
      });
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/advocates/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const advocate = await dataStore.getAdvocateWithDetails(id);
      
      if (!advocate) {
        return res.status(404).json({
          success: false,
          message: "Advocate not found"
        });
      }
      
      res.json({
        success: true,
        data: advocate
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Add simplified test routes
  app.get("/api/test", (req, res) => {
    res.json({
      success: true,
      message: "API is working",
      data: {
        timestamp: new Date().toISOString()
      }
    });
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
