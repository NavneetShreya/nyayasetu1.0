import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { storage } from './storage';
import { mongoStorage } from './mongo-storage';

// Use MongoDB storage when available, fallback to in-memory storage
const dataStore = process.env.USE_MONGO === 'true' ? mongoStorage : storage;

// Configure local strategy for passport
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      // Check if user exists by username
      let user = await dataStore.getUserByUsername(username);
      
      // If not found by username, try by email
      if (!user) {
        user = await dataStore.getUserByEmail(username);
      }
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      
      // Check password - in development environment, allow both hashed and plain text passwords
      // This is only for development, in production always use bcrypt
      const isDevelopment = process.env.NODE_ENV !== 'production';
      
      // Check if the stored password is already hashed (has the bcrypt format)
      const isHashed = user.password.startsWith('$2');
      
      let isMatch = false;
      
      if (isDevelopment && !isHashed) {
        // In development mode with plain text passwords, do direct comparison
        isMatch = password === user.password;
      } else {
        // Use bcrypt for hashed passwords
        isMatch = await bcrypt.compare(password, user.password);
      }
      
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      
      // Remove sensitive information
      const { password: _, ...userWithoutPassword } = user;
      
      // Return user without sensitive information
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  }
));

// Configure session serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await dataStore.getUser(id);
    
    if (!user) {
      return done(null, null);
    }
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = user;
    
    done(null, userWithoutPassword);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Unauthorized' });
}

// Middleware to check if user has role
export function hasRole(role: string | string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // Check if the user has any of the allowed roles
    if (Array.isArray(role)) {
      if (!role.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Forbidden. Requires one of these roles: ' + role.join(', ') 
        });
      }
    } else {
      // Single role check
      if (req.user.role !== role) {
        return res.status(403).json({ 
          success: false, 
          message: `Forbidden. Requires ${role} role.` 
        });
      }
    }
    
    next();
  };
}

// Middleware to check if user is the owner of the resource
export function isResourceOwner(paramName: string, userIdField: string = 'userId') {
  return async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const resourceId = parseInt(req.params[paramName]);
    
    if (isNaN(resourceId)) {
      return res.status(400).json({ success: false, message: 'Invalid resource ID' });
    }
    
    try {
      // Get the resource based on the paramName
      let resource: any = null;
      
      // Get the appropriate resource based on the paramName
      switch(paramName) {
        case 'advocates':
          resource = await dataStore.getAdvocate(resourceId);
          break;
        case 'connections':
          resource = await dataStore.getConnection(resourceId);
          break;
        case 'reviews':
          // Handle reviews if needed
          break;
        default:
          return res.status(400).json({ success: false, message: 'Unsupported resource type' });
      }
      
      if (!resource) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
      }
      
      // Check if the user is the owner
      if (resource[userIdField] !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default passport;