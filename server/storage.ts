import {
  users, locations, advocates, practiceAreas, 
  advocateSpecialties, reviews, connections, chatMessages,
  type User, type InsertUser, type Location, type InsertLocation,
  type Advocate, type InsertAdvocate, type PracticeArea, type InsertPracticeArea,
  type AdvocateSpecialty, type InsertAdvocateSpecialty, 
  type Review, type InsertReview, type Connection, type InsertConnection,
  type ChatMessage, type InsertChatMessage, type AdvocateWithDetails
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Location operations
  createLocation(location: InsertLocation): Promise<Location>;
  getLocation(id: number): Promise<Location | undefined>;
  getLocationsByCityOrState(query: string): Promise<Location[]>;
  getAllLocations(): Promise<Location[]>;
  
  // Practice Area operations
  createPracticeArea(practiceArea: InsertPracticeArea): Promise<PracticeArea>;
  getPracticeArea(id: number): Promise<PracticeArea | undefined>;
  getAllPracticeAreas(): Promise<PracticeArea[]>;
  
  // Advocate operations
  createAdvocate(advocate: InsertAdvocate): Promise<Advocate>;
  getAdvocate(id: number): Promise<Advocate | undefined>;
  getAdvocateWithDetails(id: number): Promise<AdvocateWithDetails | undefined>;
  getAdvocatesByLocation(locationId: number): Promise<AdvocateWithDetails[]>;
  getAdvocatesByPracticeArea(practiceAreaId: number): Promise<AdvocateWithDetails[]>;
  getAdvocatesByFilter(filters: {
    location?: string,
    practiceArea?: string,
    experience?: string,
    searchQuery?: string
  }): Promise<AdvocateWithDetails[]>;
  getAllAdvocates(): Promise<AdvocateWithDetails[]>;
  
  // Advocate Specialty operations
  addSpecialtyToAdvocate(advocateId: number, practiceAreaId: number): Promise<AdvocateSpecialty>;
  getAdvocateSpecialties(advocateId: number): Promise<PracticeArea[]>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsForAdvocate(advocateId: number): Promise<Review[]>;
  updateAdvocateRating(advocateId: number): Promise<number>;
  
  // Connection operations
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnection(id: number): Promise<Connection | undefined>;
  getConnectionsByClient(clientId: number): Promise<Connection[]>;
  getConnectionsByAdvocate(advocateId: number): Promise<Connection[]>;
  updateConnectionStatus(id: number, status: string): Promise<Connection | undefined>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(userId: number, limit?: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private locations: Map<number, Location>;
  private advocates: Map<number, Advocate>;
  private practiceAreas: Map<number, PracticeArea>;
  private advocateSpecialties: Map<number, AdvocateSpecialty>;
  private reviews: Map<number, Review>;
  private connections: Map<number, Connection>;
  private chatMessages: Map<number, ChatMessage>;
  
  private userIdCounter: number;
  private locationIdCounter: number;
  private advocateIdCounter: number;
  private practiceAreaIdCounter: number;
  private advocateSpecialtyIdCounter: number;
  private reviewIdCounter: number;
  private connectionIdCounter: number;
  private chatMessageIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.advocates = new Map();
    this.practiceAreas = new Map();
    this.advocateSpecialties = new Map();
    this.reviews = new Map();
    this.connections = new Map();
    this.chatMessages = new Map();
    
    this.userIdCounter = 1;
    this.locationIdCounter = 1;
    this.advocateIdCounter = 1;
    this.practiceAreaIdCounter = 1;
    this.advocateSpecialtyIdCounter = 1;
    this.reviewIdCounter = 1;
    this.connectionIdCounter = 1;
    this.chatMessageIdCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData().catch(err => 
      console.error("Error initializing sample data:", err)
    );
  }
  
  private async initializeSampleData() {
    // Create practice areas
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
    
    for (const area of practiceAreaData) {
      await this.createPracticeArea(area);
    }
    
    // Create locations
    const locationData = [
      // Delhi
      { city: "New Delhi", state: "Delhi", pincode: "110001" },
      { city: "South Delhi", state: "Delhi", pincode: "110025" },
      { city: "East Delhi", state: "Delhi", pincode: "110091" },
      { city: "West Delhi", state: "Delhi", pincode: "110063" },
      { city: "North Delhi", state: "Delhi", pincode: "110007" },
      
      // Bihar
      { city: "Patna", state: "Bihar", pincode: "800001" },
      { city: "Gaya", state: "Bihar", pincode: "823001" },
      { city: "Muzaffarpur", state: "Bihar", pincode: "842001" },
      { city: "Bhagalpur", state: "Bihar", pincode: "812001" },
      { city: "Darbhanga", state: "Bihar", pincode: "846004" },
      { city: "Purnia", state: "Bihar", pincode: "854301" },
      { city: "Arrah", state: "Bihar", pincode: "802301" },
      { city: "Katihar", state: "Bihar", pincode: "854105" },
      { city: "Chapra", state: "Bihar", pincode: "841301" },
      
      // Jharkhand
      { city: "Ranchi", state: "Jharkhand", pincode: "834001" },
      { city: "Jamshedpur", state: "Jharkhand", pincode: "831001" },
      { city: "Dhanbad", state: "Jharkhand", pincode: "826001" },
      { city: "Bokaro", state: "Jharkhand", pincode: "827001" },
      { city: "Deoghar", state: "Jharkhand", pincode: "814112" },
      { city: "Hazaribagh", state: "Jharkhand", pincode: "825301" },
      { city: "Giridih", state: "Jharkhand", pincode: "815301" },
      
      // Other major cities
      { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
      { city: "Bangalore", state: "Karnataka", pincode: "560001" },
      { city: "Chennai", state: "Tamil Nadu", pincode: "600001" },
      { city: "Kolkata", state: "West Bengal", pincode: "700001" },
      { city: "Hyderabad", state: "Telangana", pincode: "500001" },
    ];
    
    for (const location of locationData) {
      await this.createLocation(location);
    }
    
    // Create sample advocates with users
    const advocateData = [
      {
        user: {
          username: "adv1",
          password: "password123",
          email: "advocate1@example.com",
          fullName: "Advocate 1",
          phone: "9876543210",
          role: "advocate"
        },
        advocate: {
          locationId: 1, // Delhi
          bio: "Over 15 years of experience in criminal defense and corporate legal matters. Former additional solicitor at Delhi High Court.",
          experience: 15,
          barCouncilNumber: "DL/123/2005",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 124,
          verified: true
        },
        specialties: [1, 3, 4] // Criminal, Constitutional, Corporate
      },
      {
        user: {
          username: "adv2",
          password: "password123",
          email: "advocate2@example.com",
          fullName: "Advocate 2",
          phone: "8765432109",
          role: "advocate"
        },
        advocate: {
          locationId: 2, // Mumbai
          bio: "Specializing in family law matters with compassionate representation. Expert in divorce, child custody, and domestic relations.",
          experience: 12,
          barCouncilNumber: "MH/456/2010",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.9,
          reviewCount: 207,
          verified: true
        },
        specialties: [2, 9, 10] // Family Law, Divorce, Child Custody
      },
      {
        user: {
          username: "adv3",
          password: "password123",
          email: "advocate3@example.com",
          fullName: "Advocate 3",
          phone: "7654321098",
          role: "advocate"
        },
        advocate: {
          locationId: 3, // Bangalore
          bio: "Tech law specialist with expertise in intellectual property, startups, and technology regulations. Former legal counsel at major tech firms.",
          experience: 9,
          barCouncilNumber: "KA/789/2013",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 98,
          verified: true
        },
        specialties: [8, 14, 15] // IP, Startups, Technology
      },
      {
        user: {
          username: "adv4",
          password: "password123",
          email: "advocate4@example.com",
          fullName: "Advocate 4",
          phone: "6543210987",
          role: "advocate"
        },
        advocate: {
          locationId: 5, // Kolkata
          bio: "Experienced in property law and civil disputes. Specializes in property documentation, tenant disputes, and inheritance cases.",
          experience: 11,
          barCouncilNumber: "WB/234/2012",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.6,
          reviewCount: 73,
          verified: true
        },
        specialties: [5, 16, 17] // Property Law, Civil Disputes, Contracts
      },
      {
        user: {
          username: "advocate5",
          password: "password123",
          email: "advocate5@example.com",
          fullName: "Advocate 5",
          phone: "5432109876",
          role: "advocate"
        },
        advocate: {
          locationId: 4, // Chennai
          bio: "Corporate law expert with extensive experience in mergers, acquisitions, and business restructuring. Former partner at a top law firm.",
          experience: 18,
          barCouncilNumber: "TN/567/2004",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.9,
          reviewCount: 156,
          verified: true
        },
        specialties: [4, 7, 13] // Corporate Law, Tax Law, M&A
      },
      {
        user: {
          username: "advocate6",
          password: "password123",
          email: "advocate6@example.com",
          fullName: "Advocate 6",
          phone: "4321098765",
          role: "advocate"
        },
        advocate: {
          locationId: 6, // Hyderabad
          bio: "Passionate human rights advocate with expertise in constitutional law and public interest litigation. Worked with several NGOs.",
          experience: 10,
          barCouncilNumber: "TS/890/2013",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 89,
          verified: true
        },
        specialties: [11, 3, 12] // Human Rights, Constitutional Law, Public Interest
      },
      {
        user: {
          username: "advocate7",
          password: "password123",
          email: "advocate7@example.com",
          fullName: "Advocate 7",
          phone: "9876543211",
          role: "advocate"
        },
        advocate: {
          locationId: 7, // Patna
          bio: "Expert in criminal law with over 12 years of experience handling high-profile cases in Patna High Court. Specializes in criminal defense and appeals.",
          experience: 12,
          barCouncilNumber: "BR/234/2011",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 112,
          verified: true
        },
        specialties: [1, 3, 11] // Criminal Law, Constitutional Law, Human Rights
      },
      {
        user: {
          username: "advocate8",
          password: "password123",
          email: "advocate8@example.com",
          fullName: "Advocate 8",
          phone: "8765432110",
          role: "advocate"
        },
        advocate: {
          locationId: 8, // Ranchi
          bio: "Tribal rights and environmental law expert with extensive experience in Jharkhand. Specializes in land rights cases and environmental litigation.",
          experience: 14,
          barCouncilNumber: "JH/456/2010",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.9,
          reviewCount: 93,
          verified: true
        },
        specialties: [5, 11, 12] // Property Law, Human Rights, Public Interest
      },
      {
        user: {
          username: "advocate9",
          password: "password123",
          email: "advocate9@example.com",
          fullName: "Advocate 9",
          phone: "7654321109",
          role: "advocate"
        },
        advocate: {
          locationId: 9, // Gaya
          bio: "Family law advocate with deep understanding of matrimonial matters. Offers compassionate guidance in divorce, maintenance, and child custody cases.",
          experience: 8,
          barCouncilNumber: "BR/567/2015",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.5,
          reviewCount: 67,
          verified: true
        },
        specialties: [2, 9, 10] // Family Law, Divorce, Child Custody
      },
      {
        user: {
          username: "advocate10",
          password: "password123",
          email: "advocate10@example.com",
          fullName: "Advocate 10",
          phone: "6543210986",
          role: "advocate"
        },
        advocate: {
          locationId: 11, // Jamshedpur
          bio: "Corporate and business law expert with experience in industrial disputes. Specializes in labor law and corporate contracts for industrial clients.",
          experience: 9,
          barCouncilNumber: "JH/789/2014",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.6,
          reviewCount: 78,
          verified: true
        },
        specialties: [4, 6, 17] // Corporate Law, Civil Law, Contracts
      },
      {
        user: {
          username: "advocate11",
          password: "password123",
          email: "advocate11@example.com",
          fullName: "Advocate 11",
          phone: "8765432111",
          role: "advocate"
        },
        advocate: {
          locationId: 10, // Muzaffarpur
          bio: "Criminal defense lawyer with expertise in bail applications and trial advocacy. Handles criminal cases at all levels of courts in Bihar.",
          experience: 16,
          barCouncilNumber: "BR/123/2008",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 124,
          verified: true
        },
        specialties: [1, 3, 6] // Criminal Law, Constitutional Law, Civil Law
      },
      {
        user: {
          username: "advocate12",
          password: "password123",
          email: "advocate12@example.com",
          fullName: "Advocate 12",
          phone: "7654321108",
          role: "advocate"
        },
        advocate: {
          locationId: 12, // Dhanbad
          bio: "Mining and environmental law expert with experience in workers' compensation cases. Specializes in mining regulations and labor rights.",
          experience: 11,
          barCouncilNumber: "JH/345/2012",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 91,
          verified: true
        },
        specialties: [11, 6, 17] // Human Rights, Civil Law, Contracts
      }
    ];
    
    // Create advocates and their specialties
    for (const data of advocateData) {
      const user = await this.createUser(data.user as InsertUser);
      
      const advocate = {
        userId: user.id,
        ...data.advocate,
      };
      
      const createdAdvocate = await this.createAdvocate(advocate as InsertAdvocate);
      
      // Add specialties
      for (const specialtyId of data.specialties) {
        await this.addSpecialtyToAdvocate(createdAdvocate.id, specialtyId);
      }
    }
    
    // Add more Delhi advocates
    const delhiAdvocates = [
      {
        user: {
          username: "advocate13",
          password: "password123",
          email: "advocate13@example.com",
          fullName: "Advocate 13",
          phone: "9876543212",
          role: "advocate"
        },
        advocate: {
          locationId: 2, // South Delhi
          bio: "Specialized in intellectual property law with experience in patent litigation and copyright disputes. Previously worked at a top-tier IP firm.",
          experience: 14,
          barCouncilNumber: "DL/456/2009",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.9,
          reviewCount: 132,
          verified: true
        },
        specialties: [8, 14, 4] // IP, Startups, Corporate
      },
      {
        user: {
          username: "advocate14",
          password: "password123",
          email: "advocate14@example.com",
          fullName: "Advocate 14",
          phone: "8765432112",
          role: "advocate"
        },
        advocate: {
          locationId: 3, // East Delhi
          bio: "Family law expert with compassionate approach to divorce and child custody cases. Mediator certified by Delhi Mediation Centre.",
          experience: 12,
          barCouncilNumber: "DL/789/2011",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 115,
          verified: true
        },
        specialties: [2, 9, 10] // Family Law, Divorce, Child Custody
      }
    ];
    
    // Add more Bihar advocates
    const biharAdvocates = [
      {
        user: {
          username: "advocate15",
          password: "password123",
          email: "advocate15@example.com",
          fullName: "Advocate 15",
          phone: "9876543213",
          role: "advocate"
        },
        advocate: {
          locationId: 15, // Darbhanga
          bio: "Criminal defense specialist with extensive experience in Bihar courts. Expert in bail applications and criminal trials.",
          experience: 17,
          barCouncilNumber: "BR/345/2006",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 98,
          verified: true
        },
        specialties: [1, 3, 6] // Criminal, Constitutional, Civil
      },
      {
        user: {
          username: "advocate16",
          password: "password123",
          email: "advocate16@example.com",
          fullName: "Advocate 16",
          phone: "8765432113",
          role: "advocate"
        },
        advocate: {
          locationId: 16, // Purnia
          bio: "Land law specialist focusing on property disputes, agricultural land cases, and property documentation in North Bihar.",
          experience: 13,
          barCouncilNumber: "BR/567/2010",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.6,
          reviewCount: 87,
          verified: true
        },
        specialties: [5, 16, 17] // Property, Civil Disputes, Contracts
      }
    ];
    
    // Add more Jharkhand advocates
    const jharkhandAdvocates = [
      {
        user: {
          username: "advocate17",
          password: "password123",
          email: "advocate17@example.com",
          fullName: "Advocate 17",
          phone: "9876543214",
          role: "advocate"
        },
        advocate: {
          locationId: 18, // Bokaro
          bio: "Labor law expert with experience in industrial disputes, factory workers' rights, and employment contracts in industrial belt of Jharkhand.",
          experience: 15,
          barCouncilNumber: "JH/123/2008",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 104,
          verified: true
        },
        specialties: [11, 6, 17] // Human Rights, Civil Law, Contracts
      },
      {
        user: {
          username: "advocate18",
          password: "password123",
          email: "advocate18@example.com",
          fullName: "Advocate 18",
          phone: "8765432114",
          role: "advocate"
        },
        advocate: {
          locationId: 20, // Hazaribagh
          bio: "Tribal rights advocate with expertise in forest rights, land acquisition cases, and representation of tribal communities in legal disputes.",
          experience: 11,
          barCouncilNumber: "JH/456/2012",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 92,
          verified: true
        },
        specialties: [11, 3, 12] // Human Rights, Constitutional, Public Interest
      }
    ];
    
    // Add all additional advocates
    for (const data of [...delhiAdvocates, ...biharAdvocates, ...jharkhandAdvocates]) {
      const user = await this.createUser(data.user as InsertUser);
      
      const advocate = {
        userId: user.id,
        ...data.advocate,
      };
      
      const createdAdvocate = await this.createAdvocate(advocate as InsertAdvocate);
      
      // Add specialties
      for (const specialtyId of data.specialties) {
        await this.addSpecialtyToAdvocate(createdAdvocate.id, specialtyId);
      }
    }

    // Create sample client users
    const clientUsers = [
      {
        username: "client1",
        password: "password123",
        email: "client1@example.com",
        fullName: "Test Client",
        phone: "9999999999",
        role: "client"
      },
      {
        username: "rahul.kumar",
        password: "password123",
        email: "rahul.kumar@example.com",
        fullName: "Rahul Kumar",
        phone: "8888888888",
        role: "client"
      },
      {
        username: "meera.singh",
        password: "password123",
        email: "meera.singh@example.com",
        fullName: "Meera Singh",
        phone: "7777777777",
        role: "client"
      }
    ];
    
    for (const user of clientUsers) {
      await this.createUser(user as InsertUser);
    }
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    
    const newUser: User = {
      id,
      username: user.username,
      password: user.password,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone ?? null,
      role: user.role || "client",
      createdAt
    };
    
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Location operations
  async createLocation(location: InsertLocation): Promise<Location> {
    const id = this.locationIdCounter++;
    
    const newLocation: Location = {
      id,
      city: location.city,
      state: location.state,
      pincode: location.pincode ?? null
    };
    
    this.locations.set(id, newLocation);
    return newLocation;
  }
  
  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }
  
  async getLocationsByCityOrState(query: string): Promise<Location[]> {
    if (!query) return Array.from(this.locations.values());
    
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.locations.values()).filter(
      location => 
        location.city.toLowerCase().includes(lowercaseQuery) || 
        location.state.toLowerCase().includes(lowercaseQuery) ||
        (location.pincode && location.pincode.includes(query))
    );
  }
  
  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }
  
  // Practice Area operations
  async createPracticeArea(practiceArea: InsertPracticeArea): Promise<PracticeArea> {
    const id = this.practiceAreaIdCounter++;
    const newPracticeArea = { ...practiceArea, id };
    this.practiceAreas.set(id, newPracticeArea);
    return newPracticeArea;
  }
  
  async getPracticeArea(id: number): Promise<PracticeArea | undefined> {
    return this.practiceAreas.get(id);
  }
  
  async getAllPracticeAreas(): Promise<PracticeArea[]> {
    return Array.from(this.practiceAreas.values());
  }
  
  // Advocate operations
  async createAdvocate(advocate: InsertAdvocate): Promise<Advocate> {
    const id = this.advocateIdCounter++;
    
    const newAdvocate: Advocate = {
      id,
      userId: advocate.userId,
      locationId: advocate.locationId,
      bio: advocate.bio,
      experience: advocate.experience,
      barCouncilNumber: advocate.barCouncilNumber,
      imageUrl: advocate.imageUrl ?? null,
      rating: null,
      reviewCount: null,
      verified: null
    };
    
    this.advocates.set(id, newAdvocate);
    return newAdvocate;
  }
  
  async getAdvocate(id: number): Promise<Advocate | undefined> {
    return this.advocates.get(id);
  }
  
  async getAdvocateWithDetails(id: number): Promise<AdvocateWithDetails | undefined> {
    const advocate = this.advocates.get(id);
    if (!advocate) return undefined;
    
    const user = await this.getUser(advocate.userId);
    const location = await this.getLocation(advocate.locationId);
    const specialties = await this.getAdvocateSpecialties(id);
    
    if (!user || !location) return undefined;
    
    return {
      ...advocate,
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      },
      location,
      specialties,
      reviewCount: advocate.reviewCount ?? 0,
      rating: advocate.rating ?? 0
    };
  }
  
  async getAdvocatesByLocation(locationId: number): Promise<AdvocateWithDetails[]> {
    const advocates = Array.from(this.advocates.values())
      .filter(advocate => advocate.locationId === locationId);
    
    const result: AdvocateWithDetails[] = [];
    
    for (const advocate of advocates) {
      const advocateWithDetails = await this.getAdvocateWithDetails(advocate.id);
      if (advocateWithDetails) {
        result.push(advocateWithDetails);
      }
    }
    
    return result;
  }
  
  async getAdvocatesByPracticeArea(practiceAreaId: number): Promise<AdvocateWithDetails[]> {
    const specialties = Array.from(this.advocateSpecialties.values())
      .filter(specialty => specialty.practiceAreaId === practiceAreaId);
    
    const advocateIds = [...new Set(specialties.map(s => s.advocateId))];
    
    const result: AdvocateWithDetails[] = [];
    
    for (const advocateId of advocateIds) {
      const advocateWithDetails = await this.getAdvocateWithDetails(advocateId);
      if (advocateWithDetails) {
        result.push(advocateWithDetails);
      }
    }
    
    return result;
  }
  
  async getAdvocatesByFilter(filters: {
    location?: string,
    practiceArea?: string,
    experience?: string,
    searchQuery?: string
  }): Promise<AdvocateWithDetails[]> {
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
      const experienceRange = filters.experience.split('-').map(Number);
      if (experienceRange.length === 2) {
        // Range: e.g., "1-3" years
        advocates = advocates.filter(
          advocate => advocate.experience >= experienceRange[0] && advocate.experience <= experienceRange[1]
        );
      } else if (filters.experience.includes('+')) {
        // Minimum: e.g., "10+" years
        const minExperience = parseInt(filters.experience);
        advocates = advocates.filter(
          advocate => advocate.experience >= minExperience
        );
      }
    }
    
    // Filter by search query (name, bio)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      advocates = advocates.filter(
        advocate => 
          advocate.user.fullName.toLowerCase().includes(query) ||
          advocate.bio.toLowerCase().includes(query) ||
          advocate.specialties.some(specialty => 
            specialty.name.toLowerCase().includes(query)
          )
      );
    }
    
    return advocates;
  }
  
  async getAllAdvocates(): Promise<AdvocateWithDetails[]> {
    const result: AdvocateWithDetails[] = [];
    
    for (const advocate of this.advocates.values()) {
      const advocateWithDetails = await this.getAdvocateWithDetails(advocate.id);
      if (advocateWithDetails) {
        result.push(advocateWithDetails);
      }
    }
    
    return result;
  }
  
  // Advocate Specialty operations
  async addSpecialtyToAdvocate(advocateId: number, practiceAreaId: number): Promise<AdvocateSpecialty> {
    const id = this.advocateSpecialtyIdCounter++;
    const specialty: AdvocateSpecialty = {
      id,
      advocateId,
      practiceAreaId
    };
    
    this.advocateSpecialties.set(id, specialty);
    return specialty;
  }
  
  async getAdvocateSpecialties(advocateId: number): Promise<PracticeArea[]> {
    const specialtyIds = Array.from(this.advocateSpecialties.values())
      .filter(specialty => specialty.advocateId === advocateId)
      .map(specialty => specialty.practiceAreaId);
    
    return Array.from(this.practiceAreas.values())
      .filter(area => specialtyIds.includes(area.id));
  }
  
  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const createdAt = new Date();
    
    const newReview: Review = {
      id,
      createdAt,
      userId: review.userId,
      rating: review.rating,
      advocateId: review.advocateId,
      content: review.content ?? null
    };
    
    this.reviews.set(id, newReview);
    
    // Update advocate rating and review count
    await this.updateAdvocateRating(review.advocateId);
    
    return newReview;
  }
  
  async getReviewsForAdvocate(advocateId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.advocateId === advocateId);
  }
  
  async updateAdvocateRating(advocateId: number): Promise<number> {
    const reviews = await this.getReviewsForAdvocate(advocateId);
    const advocate = await this.getAdvocate(advocateId);
    
    if (!advocate || reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const newRating = parseFloat((totalRating / reviews.length).toFixed(1));
    
    const updatedAdvocate = {
      ...advocate,
      rating: newRating,
      reviewCount: reviews.length
    };
    
    this.advocates.set(advocateId, updatedAdvocate);
    
    return newRating;
  }
  
  // Connection operations
  async createConnection(connection: InsertConnection): Promise<Connection> {
    const id = this.connectionIdCounter++;
    const createdAt = new Date();
    
    // Set expiration date to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    const newConnection: Connection = {
      id,
      createdAt,
      advocateId: connection.advocateId,
      clientId: connection.clientId,
      status: connection.status || "pending",
      paymentId: connection.paymentId ?? null,
      expiresAt: connection.expiresAt ?? expiresAt
    };
    
    this.connections.set(id, newConnection);
    return newConnection;
  }
  
  async getConnection(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }
  
  async getConnectionsByClient(clientId: number): Promise<Connection[]> {
    return Array.from(this.connections.values())
      .filter(connection => connection.clientId === clientId);
  }
  
  async getConnectionsByAdvocate(advocateId: number): Promise<Connection[]> {
    return Array.from(this.connections.values())
      .filter(connection => connection.advocateId === advocateId);
  }
  
  async updateConnectionStatus(id: number, status: string): Promise<Connection | undefined> {
    const connection = await this.getConnection(id);
    if (!connection) return undefined;
    
    const updatedConnection = { ...connection, status };
    this.connections.set(id, updatedConnection);
    
    return updatedConnection;
  }
  
  // Chat operations
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const createdAt = new Date();
    
    const newMessage: ChatMessage = {
      id,
      userId: message.userId,
      isUserMessage: message.isUserMessage,
      content: message.content,
      createdAt
    };
    
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
  
  async getChatHistory(userId: number, limit: number = 50): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    if (limit > 0 && messages.length > limit) {
      return messages.slice(-limit);
    }
    
    return messages;
  }
}

export const storage = new MemStorage();
