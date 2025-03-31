import { MongoClient, ServerApiVersion } from 'mongodb';

// Connection URI
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/nyayasetu";

// Create a MongoClient with appropriate options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and collections
let db: any;
export const collections: { [key: string]: any } = {};

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    db = client.db();
    
    // Initialize collections
    collections.users = db.collection("users");
    collections.advocates = db.collection("advocates");
    collections.locations = db.collection("locations");
    collections.practiceAreas = db.collection("practiceAreas");
    collections.advocateSpecialties = db.collection("advocateSpecialties");
    collections.reviews = db.collection("reviews");
    collections.connections = db.collection("connections");
    collections.chatMessages = db.collection("chatMessages");
    
    // Create indexes for faster queries
    await collections.users.createIndex({ username: 1 }, { unique: true });
    await collections.users.createIndex({ email: 1 }, { unique: true });
    await collections.advocates.createIndex({ userId: 1 }, { unique: true });
    await collections.locations.createIndex({ city: 1, state: 1 });
    await collections.advocateSpecialties.createIndex({ advocateId: 1, practiceAreaId: 1 }, { unique: true });
    
    console.log("Database initialized");
    return { db, collections };
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export async function initializeDatabase() {
  try {
    const userCount = await collections.users.countDocuments();
    console.log('User count in database:', userCount); // Log user count
    if (userCount > 0) {
      console.log("Database already has data, skipping initialization");
      return;
    }

    console.log("Initializing database with sample data");
    
    // Add practice areas
    const practiceAreaData = [
      { name: "Criminal Law" },
      { name: "Family Law" },
      { name: "Constitutional Law" },
      { name: "Corporate Law" },
      { name: "Property Law" },
      { name: "Civil Law" },
      { name: "Tax Law" },
      { name: "Intellectual Property" },
      { name: "Divorce" },
      { name: "Child Custody" },
      { name: "Human Rights" },
      { name: "Public Interest" },
      { name: "Mergers & Acquisitions" },
      { name: "Startups" },
      { name: "Technology" },
      { name: "Civil Disputes" },
      { name: "Contracts" }
    ];
    
    const practiceAreasResult = await collections.practiceAreas.insertMany(practiceAreaData);
    
    // Add locations
    const locationData = [
      { city: "New Delhi", state: "Delhi", pincode: "110001" },
      { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
      { city: "Bangalore", state: "Karnataka", pincode: "560001" },
      { city: "Chennai", state: "Tamil Nadu", pincode: "600001" },
      { city: "Kolkata", state: "West Bengal", pincode: "700001" },
      { city: "Hyderabad", state: "Telangana", pincode: "500001" },
    ];
    
    const locationsResult = await collections.locations.insertMany(locationData);
    
    // Add test user accounts (both client and advocate)
    const bcrypt = require('bcryptjs');
    const saltRounds = 10;
    
    // Create a client account
    const clientUser = {
      username: "testclient",
      password: await bcrypt.hash("password123", saltRounds),
      email: "client@example.com",
      fullName: "Test Client",
      phone: "9876543210",
      role: "client",
      createdAt: new Date()
    };
    
    const clientResult = await collections.users.insertOne(clientUser);
    
    // Create test advocates
    const advocateData = [
      {
        user: {
          username: "testadvocate1",
          password: await bcrypt.hash("password123", saltRounds),
          email: "advocate1@example.com",
          fullName: "Test Advocate 1",
          phone: "9876543211",
          role: "advocate",
          createdAt: new Date()
        },
        advocate: {
          locationId: locationsResult.insertedIds[0], // Delhi
          bio: "Over 15 years of experience in criminal defense and corporate legal matters.",
          experience: 15,
          barCouncilNumber: "DL/123/2005",
          aorNumber: "AOR/2007/123",
          practitionerCourts: ["Supreme Court", "Delhi High Court"],
          notableCases: ["State v. Kumar (2018)", "Delhi Development Authority v. Singh (2015)"],
          highlights: ["Specialized in white-collar criminal defense", "Former government counsel"],
          imageUrl: "https://images.unsplash.com/photo-1516382799247-87df95d790b7", // Ensure this is valid
          rating: 4.8,
          reviewCount: 124,
          verified: true,
          createdAt: new Date()
        },
        specialties: [0, 2, 3]
      },
      {
        user: {
          username: "testadvocate2",
          password: await bcrypt.hash("password123", saltRounds),
          email: "advocate2@example.com",
          fullName: "Test Advocate 2",
          phone: "8765432109",
          role: "advocate",
          createdAt: new Date()
        },
        advocate: {
          locationId: locationsResult.insertedIds[1], // Mumbai
          bio: "Specializing in family law matters with compassionate representation.",
          experience: 8,
          barCouncilNumber: "MH/789/2014",
          aorNumber: "AOR/2016/456",
          practitionerCourts: ["Bombay High Court", "Family Court"],
          notableCases: ["Patel v. Patel (2019)", "In Re: Adoption of Minor (2021)"],
          highlights: ["Specialized in women's rights", "Child custody expert"],
          imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Ensure this is valid
          rating: 4.9,
          reviewCount: 89,
          verified: true,
          createdAt: new Date()
        },
        specialties: [1, 8, 9]
      }
    ];
    
    // Insert advocates and their specialties
    for (const data of advocateData) {
      // Insert user
      const userResult = await collections.users.insertOne(data.user);
      
      // Insert advocate
      const advocate = {
        userId: userResult.insertedId,
        ...data.advocate
      };
      
      const advocateResult = await collections.advocates.insertOne(advocate);
      
      // Add specialties
      for (const specialtyIndex of data.specialties) {
        const specialtyId = practiceAreasResult.insertedIds[specialtyIndex];
        await collections.advocateSpecialties.insertOne({
          advocateId: advocateResult.insertedId,
          practiceAreaId: specialtyId,
          createdAt: new Date()
        });
      }
    }
    
    console.log("Database initialized with sample data");
  } catch (error) {
    console.error("Database initialization error:", error); // Log initialization errors
    throw error;
  }
}

export function closeConnection() {
  return client.close();
}