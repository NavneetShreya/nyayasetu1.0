import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import { connectToDatabase, initializeDatabase } from "./db";
import passport from "./auth";
import { mongoStorage } from "./mongo-storage";
import { storage } from "./storage";

// Determine which storage to use based on environment variable
const useMongo = process.env.USE_MONGO === 'true';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware with the appropriate session store
app.use(session({
  secret: process.env.SESSION_SECRET || 'nyayasetu-secret-key',
  resave: false,
  saveUninitialized: false,
  store: useMongo ? mongoStorage.sessionStore : undefined, // Use MongoDB store only if USE_MONGO is true
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "NyayaSetu API is running",
    timestamp: new Date().toISOString()
  });
});

(async () => {
  try {
    // Connect to MongoDB only if USE_MONGO is true
    if (useMongo) {
      await connectToDatabase();
      log("Connected to MongoDB");
      
      // Initialize database with sample data if needed
      await initializeDatabase();
      log("Database initialized");
    } else {
      log("Using in-memory storage");
    }
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 3001
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 3001;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`NyayaSetu server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server initialization error:", error);
    console.error(error);
  }
})();
