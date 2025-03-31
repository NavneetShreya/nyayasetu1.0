import { ObjectId } from 'mongodb';
import { collections } from './db';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
import createMemoryStore from 'memorystore';
import { User, InsertUser, PracticeArea, InsertPracticeArea, 
         Location, InsertLocation, Advocate, InsertAdvocate, 
         AdvocateSpecialty, InsertAdvocateSpecialty, Review, InsertReview, 
         Connection, InsertConnection, ChatMessage, InsertChatMessage, 
         AdvocateWithDetails } from '@shared/schema';
import { storage } from './storage';

const MemoryStore = createMemoryStore(session);

const MongoDBStore = connectMongo(session);

// Helper function to check if MongoDB is available
function isMongoAvailable(): boolean {
  return process.env.USE_MONGO === 'true' && !!process.env.MONGODB_URI;
}

// Helper function to convert MongoDB _id to id
function toExternalModel<T>(doc: any): T {
  if (!doc) return doc;
  
  // Create a copy that we can modify
  const result = { ...doc };
  
  // Replace _id with id
  if (result._id) {
    result.id = result._id.toString();
    delete result._id;
  }
  
  return result as T;
}

// Helper to convert IDs for insertion
function toInternalModel(data: any): any {
  const result = { ...data };
  
  // Convert string IDs to ObjectId
  if (result.id) {
    result._id = new ObjectId(result.id);
    delete result.id;
  }
  
  if (result.userId && typeof result.userId === 'string') {
    result.userId = new ObjectId(result.userId);
  }
  
  if (result.advocateId && typeof result.advocateId === 'string') {
    result.advocateId = new ObjectId(result.advocateId);
  }
  
  if (result.clientId && typeof result.clientId === 'string') {
    result.clientId = new ObjectId(result.clientId);
  }
  
  if (result.locationId && typeof result.locationId === 'string') {
    result.locationId = new ObjectId(result.locationId);
  }
  
  if (result.practiceAreaId && typeof result.practiceAreaId === 'string') {
    result.practiceAreaId = new ObjectId(result.practiceAreaId);
  }
  
  if (result.reviewId && typeof result.reviewId === 'string') {
    result.reviewId = new ObjectId(result.reviewId);
  }
  
  return result;
}

export class MongoStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Create MongoDB session store only if MongoDB is available
    if (isMongoAvailable()) {
      this.sessionStore = new MongoDBStore({
        uri: process.env.MONGODB_URI || "mongodb://localhost:27017/nyayasetu",
        collection: 'sessions',
        expires: 1000 * 60 * 60 * 24 * 7, // 1 week
      });
      
      // Handle session store errors
      this.sessionStore.on('error', (error) => {
        console.error('MongoDB session store error:', error);
      });
    } else {
      // Create a memory store for TypeScript compatibility
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
      console.log('Using memory session store as fallback');
    }
  }
  // User operations
  async getUser(id: number | string): Promise<User | undefined> {
    if (!isMongoAvailable()) {
      console.log('MongoDB not available, using MemStorage fallback');
      return await storage.getUser(typeof id === 'string' ? parseInt(id as string) : id as number);
    }
    
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const user = await collections.users.findOne({ _id });
    return user ? toExternalModel<User>(user) : undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await collections.users.findOne({ username: username });
    return user ? toExternalModel<User>(user) : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await collections.users.findOne({ email: email });
    return user ? toExternalModel<User>(user) : undefined;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const result = await collections.users.insertOne({
      ...user,
      createdAt: new Date()
    });
    
    const insertedUser = await collections.users.findOne({ _id: result.insertedId });
    return toExternalModel<User>(insertedUser);
  }
  
  // Location operations
  async createLocation(location: InsertLocation): Promise<Location> {
    const result = await collections.locations.insertOne({
      ...location,
      createdAt: new Date()
    });
    
    const insertedLocation = await collections.locations.findOne({ _id: result.insertedId });
    return toExternalModel<Location>(insertedLocation);
  }
  
  async getLocation(id: number | string): Promise<Location | undefined> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const location = await collections.locations.findOne({ _id });
    return location ? toExternalModel<Location>(location) : undefined;
  }
  
  async getLocationsByCityOrState(query: string): Promise<Location[]> {
    if (!query) return this.getAllLocations();
    
    const regex = new RegExp(query, 'i');
    const locations = await collections.locations.find({
      $or: [
        { city: { $regex: regex } },
        { state: { $regex: regex } },
        { pincode: query }
      ]
    }).toArray();
    
    return locations.map(loc => toExternalModel<Location>(loc));
  }
  
  async getAllLocations(): Promise<Location[]> {
    const locations = await collections.locations.find().toArray();
    return locations.map(loc => toExternalModel<Location>(loc));
  }
  
  // Practice Area operations
  async createPracticeArea(practiceArea: InsertPracticeArea): Promise<PracticeArea> {
    const result = await collections.practiceAreas.insertOne({
      ...practiceArea,
      createdAt: new Date()
    });
    
    const insertedPracticeArea = await collections.practiceAreas.findOne({ _id: result.insertedId });
    return toExternalModel<PracticeArea>(insertedPracticeArea);
  }
  
  async getPracticeArea(id: number | string): Promise<PracticeArea | undefined> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const practiceArea = await collections.practiceAreas.findOne({ _id });
    return practiceArea ? toExternalModel<PracticeArea>(practiceArea) : undefined;
  }
  
  async getAllPracticeAreas(): Promise<PracticeArea[]> {
    const practiceAreas = await collections.practiceAreas.find().toArray();
    return practiceAreas.map(area => toExternalModel<PracticeArea>(area));
  }
  
  // Advocate operations
  async createAdvocate(advocate: InsertAdvocate): Promise<Advocate> {
    const internalAdvocate = toInternalModel(advocate);
    
    const result = await collections.advocates.insertOne({
      ...internalAdvocate,
      createdAt: new Date()
    });
    
    const insertedAdvocate = await collections.advocates.findOne({ _id: result.insertedId });
    return toExternalModel<Advocate>(insertedAdvocate);
  }
  
  async getAdvocate(id: number | string): Promise<Advocate | undefined> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const advocate = await collections.advocates.findOne({ _id });
    return advocate ? toExternalModel<Advocate>(advocate) : undefined;
  }
  
  async getAdvocateWithDetails(id: number | string): Promise<AdvocateWithDetails | undefined> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const advocate = await collections.advocates.findOne({ _id });
    
    if (!advocate) return undefined;
    
    // Get user details
    const user = await collections.users.findOne({ _id: advocate.userId });
    
    // Get location
    const location = await collections.locations.findOne({ _id: advocate.locationId });
    
    // Get specialties
    const specialtyRecords = await collections.advocateSpecialties.find({ 
      advocateId: advocate._id 
    }).toArray();
    
    const specialtyIds = specialtyRecords.map(s => s.practiceAreaId);
    const specialties = await collections.practiceAreas.find({
      _id: { $in: specialtyIds }
    }).toArray();
    
    // Get reviews count and average rating
    const reviewCount = await collections.reviews.countDocuments({ advocateId: advocate._id });
    
    // Create the detailed advocate object
    const advocateWithDetails: AdvocateWithDetails = {
      ...toExternalModel<Advocate>(advocate),
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      },
      location: toExternalModel<Location>(location),
      specialties: specialties.map(s => toExternalModel<PracticeArea>(s)),
      reviewCount: reviewCount,
      rating: advocate.rating || 0
    };
    
    return advocateWithDetails;
  }
  
  async getAdvocatesByLocation(locationId: number | string): Promise<AdvocateWithDetails[]> {
    const _locationId = typeof locationId === 'string' ? new ObjectId(locationId) : locationId;
    const advocates = await collections.advocates.find({ locationId: _locationId }).toArray();
    
    const detailedAdvocates = await Promise.all(
      advocates.map(adv => this.getAdvocateWithDetails(adv._id))
    );
    
    return detailedAdvocates.filter(adv => adv !== undefined) as AdvocateWithDetails[];
  }
  
  async getAdvocatesByPracticeArea(practiceAreaId: number | string): Promise<AdvocateWithDetails[]> {
    const _practiceAreaId = typeof practiceAreaId === 'string' ? 
      new ObjectId(practiceAreaId) : practiceAreaId;
    
    const specialtyRecords = await collections.advocateSpecialties.find({
      practiceAreaId: _practiceAreaId
    }).toArray();
    
    const advocateIds = specialtyRecords.map(s => s.advocateId);
    
    const detailedAdvocates = await Promise.all(
      advocateIds.map(id => this.getAdvocateWithDetails(id))
    );
    
    return detailedAdvocates.filter(adv => adv !== undefined) as AdvocateWithDetails[];
  }
  
  async getAdvocatesByFilter(filters: {
    location?: string,
    practiceArea?: string,
    experience?: string,
    searchQuery?: string
  }): Promise<AdvocateWithDetails[]> {
    // Start with all advocates
    let advocates = await this.getAllAdvocates();
    
    // Filter by location (city or state)
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase();
      advocates = advocates.filter(
        advocate => 
          advocate.location.city.toLowerCase().includes(locationQuery) ||
          advocate.location.state.toLowerCase().includes(locationQuery)
      );
    }
    
    // Filter by practice area
    if (filters.practiceArea) {
      const practiceAreaQuery = filters.practiceArea.toLowerCase();
      advocates = advocates.filter(
        advocate => advocate.specialties.some(
          specialty => specialty.name.toLowerCase().includes(practiceAreaQuery)
        )
      );
    }
    
    // Filter by experience
    if (filters.experience) {
      // Parse experience ranges
      if (filters.experience === '1-3') {
        advocates = advocates.filter(advocate => advocate.experience >= 1 && advocate.experience <= 3);
      } else if (filters.experience === '3-5') {
        advocates = advocates.filter(advocate => advocate.experience >= 3 && advocate.experience <= 5);
      } else if (filters.experience === '5-10') {
        advocates = advocates.filter(advocate => advocate.experience >= 5 && advocate.experience <= 10);
      } else if (filters.experience === '10+') {
        advocates = advocates.filter(advocate => advocate.experience > 10);
      }
    }
    
    // Search by name or bio
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      advocates = advocates.filter(
        advocate => 
          advocate.user.fullName.toLowerCase().includes(query) ||
          advocate.bio.toLowerCase().includes(query)
      );
    }
    
    return advocates;
  }
  
  async getAllAdvocates(): Promise<AdvocateWithDetails[]> {
    const advocates = await collections.advocates.find().toArray();
    
    const detailedAdvocates = await Promise.all(
      advocates.map(adv => this.getAdvocateWithDetails(adv._id))
    );
    
    return detailedAdvocates.filter(adv => adv !== undefined) as AdvocateWithDetails[];
  }
  
  // Advocate Specialty operations
  async addSpecialtyToAdvocate(advocateId: number | string, practiceAreaId: number | string): Promise<AdvocateSpecialty> {
    const _advocateId = typeof advocateId === 'string' ? new ObjectId(advocateId) : advocateId;
    const _practiceAreaId = typeof practiceAreaId === 'string' ? new ObjectId(practiceAreaId) : practiceAreaId;
    
    // Check if specialty already exists
    const existingSpecialty = await collections.advocateSpecialties.findOne({
      advocateId: _advocateId,
      practiceAreaId: _practiceAreaId
    });
    
    if (existingSpecialty) {
      return toExternalModel<AdvocateSpecialty>(existingSpecialty);
    }
    
    // Add new specialty
    const result = await collections.advocateSpecialties.insertOne({
      advocateId: _advocateId,
      practiceAreaId: _practiceAreaId,
      createdAt: new Date()
    });
    
    const insertedSpecialty = await collections.advocateSpecialties.findOne({ _id: result.insertedId });
    return toExternalModel<AdvocateSpecialty>(insertedSpecialty);
  }
  
  async getAdvocateSpecialties(advocateId: number | string): Promise<PracticeArea[]> {
    const _advocateId = typeof advocateId === 'string' ? new ObjectId(advocateId) : advocateId;
    
    const specialtyRecords = await collections.advocateSpecialties.find({
      advocateId: _advocateId
    }).toArray();
    
    const practiceAreaIds = specialtyRecords.map(s => s.practiceAreaId);
    
    const practiceAreas = await collections.practiceAreas.find({
      _id: { $in: practiceAreaIds }
    }).toArray();
    
    return practiceAreas.map(area => toExternalModel<PracticeArea>(area));
  }
  
  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const internalReview = toInternalModel(review);
    
    const result = await collections.reviews.insertOne({
      ...internalReview,
      createdAt: new Date()
    });
    
    // Update advocate rating
    await this.updateAdvocateRating(review.advocateId);
    
    const insertedReview = await collections.reviews.findOne({ _id: result.insertedId });
    return toExternalModel<Review>(insertedReview);
  }
  
  async getReviewsForAdvocate(advocateId: number | string): Promise<Review[]> {
    const _advocateId = typeof advocateId === 'string' ? new ObjectId(advocateId) : advocateId;
    
    const reviews = await collections.reviews.find({
      advocateId: _advocateId
    }).sort({ createdAt: -1 }).toArray();
    
    return reviews.map(review => toExternalModel<Review>(review));
  }
  
  async updateAdvocateRating(advocateId: number | string): Promise<number> {
    const _advocateId = typeof advocateId === 'string' ? new ObjectId(advocateId) : advocateId;
    
    const reviews = await this.getReviewsForAdvocate(_advocateId);
    
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Update advocate rating and review count
    await collections.advocates.updateOne(
      { _id: _advocateId },
      { 
        $set: { 
          rating: averageRating,
          reviewCount: reviews.length 
        } 
      }
    );
    
    return averageRating;
  }
  
  // Connection operations
  async createConnection(connection: InsertConnection): Promise<Connection> {
    const internalConnection = toInternalModel(connection);
    
    // Set expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    const result = await collections.connections.insertOne({
      ...internalConnection,
      status: connection.status || 'active',
      expiresAt,
      createdAt: new Date()
    });
    
    const insertedConnection = await collections.connections.findOne({ _id: result.insertedId });
    return toExternalModel<Connection>(insertedConnection);
  }
  
  async getConnection(id: number | string): Promise<Connection | undefined> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const connection = await collections.connections.findOne({ _id });
    return connection ? toExternalModel<Connection>(connection) : undefined;
  }
  
  async getConnectionsByClient(clientId: number | string): Promise<Connection[]> {
    const _clientId = typeof clientId === 'string' ? new ObjectId(clientId) : clientId;
    
    const connections = await collections.connections.find({
      clientId: _clientId
    }).sort({ createdAt: -1 }).toArray();
    
    return connections.map(conn => toExternalModel<Connection>(conn));
  }
  
  async getConnectionsByAdvocate(advocateId: number | string): Promise<Connection[]> {
    const _advocateId = typeof advocateId === 'string' ? new ObjectId(advocateId) : advocateId;
    
    const connections = await collections.connections.find({
      advocateId: _advocateId
    }).sort({ createdAt: -1 }).toArray();
    
    return connections.map(conn => toExternalModel<Connection>(conn));
  }
  
  async updateConnectionStatus(id: number | string, status: string): Promise<Connection | undefined> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    
    await collections.connections.updateOne(
      { _id },
      { $set: { status, updatedAt: new Date() } }
    );
    
    const updatedConnection = await collections.connections.findOne({ _id });
    return updatedConnection ? toExternalModel<Connection>(updatedConnection) : undefined;
  }
  
  // Chat operations
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const internalMessage = toInternalModel(message);
    
    const result = await collections.chatMessages.insertOne({
      ...internalMessage,
      createdAt: new Date()
    });
    
    const insertedMessage = await collections.chatMessages.findOne({ _id: result.insertedId });
    return toExternalModel<ChatMessage>(insertedMessage);
  }
  
  async getChatHistory(userId: number | string, limit: number = 50): Promise<ChatMessage[]> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const messages = await collections.chatMessages.find({
      userId: _userId
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    
    // Return in chronological order (oldest first)
    return messages
      .map(msg => toExternalModel<ChatMessage>(msg))
      .reverse();
  }
  
  // Helper function to get advocate by user ID
  async getAdvocateByUserId(userId: number | string): Promise<Advocate | undefined> {
    const _userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const advocate = await collections.advocates.findOne({ userId: _userId });
    return advocate ? toExternalModel<Advocate>(advocate) : undefined;
  }
}

export const mongoStorage = new MongoStorage();