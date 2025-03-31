var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import passport2 from "passport";
import { z } from "zod";

// server/storage.ts
var MemStorage = class {
  users;
  locations;
  advocates;
  practiceAreas;
  advocateSpecialties;
  reviews;
  connections;
  chatMessages;
  userIdCounter;
  locationIdCounter;
  advocateIdCounter;
  practiceAreaIdCounter;
  advocateSpecialtyIdCounter;
  reviewIdCounter;
  connectionIdCounter;
  chatMessageIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.locations = /* @__PURE__ */ new Map();
    this.advocates = /* @__PURE__ */ new Map();
    this.practiceAreas = /* @__PURE__ */ new Map();
    this.advocateSpecialties = /* @__PURE__ */ new Map();
    this.reviews = /* @__PURE__ */ new Map();
    this.connections = /* @__PURE__ */ new Map();
    this.chatMessages = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.locationIdCounter = 1;
    this.advocateIdCounter = 1;
    this.practiceAreaIdCounter = 1;
    this.advocateSpecialtyIdCounter = 1;
    this.reviewIdCounter = 1;
    this.connectionIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.initializeSampleData().catch(
      (err) => console.error("Error initializing sample data:", err)
    );
  }
  async initializeSampleData() {
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
      { city: "Hyderabad", state: "Telangana", pincode: "500001" }
    ];
    for (const location of locationData) {
      await this.createLocation(location);
    }
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
          locationId: 1,
          // Delhi
          bio: "Over 15 years of experience in criminal defense and corporate legal matters. Former additional solicitor at Delhi High Court.",
          experience: 15,
          barCouncilNumber: "DL/123/2005",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 124,
          verified: true
        },
        specialties: [1, 3, 4]
        // Criminal, Constitutional, Corporate
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
          locationId: 2,
          // Mumbai
          bio: "Specializing in family law matters with compassionate representation. Expert in divorce, child custody, and domestic relations.",
          experience: 12,
          barCouncilNumber: "MH/456/2010",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.9,
          reviewCount: 207,
          verified: true
        },
        specialties: [2, 9, 10]
        // Family Law, Divorce, Child Custody
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
          locationId: 3,
          // Bangalore
          bio: "Tech law specialist with expertise in intellectual property, startups, and technology regulations. Former legal counsel at major tech firms.",
          experience: 9,
          barCouncilNumber: "KA/789/2013",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 98,
          verified: true
        },
        specialties: [8, 14, 15]
        // IP, Startups, Technology
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
          locationId: 5,
          // Kolkata
          bio: "Experienced in property law and civil disputes. Specializes in property documentation, tenant disputes, and inheritance cases.",
          experience: 11,
          barCouncilNumber: "WB/234/2012",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.6,
          reviewCount: 73,
          verified: true
        },
        specialties: [5, 16, 17]
        // Property Law, Civil Disputes, Contracts
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
          locationId: 4,
          // Chennai
          bio: "Corporate law expert with extensive experience in mergers, acquisitions, and business restructuring. Former partner at a top law firm.",
          experience: 18,
          barCouncilNumber: "TN/567/2004",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.9,
          reviewCount: 156,
          verified: true
        },
        specialties: [4, 7, 13]
        // Corporate Law, Tax Law, M&A
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
          locationId: 6,
          // Hyderabad
          bio: "Passionate human rights advocate with expertise in constitutional law and public interest litigation. Worked with several NGOs.",
          experience: 10,
          barCouncilNumber: "TS/890/2013",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 89,
          verified: true
        },
        specialties: [11, 3, 12]
        // Human Rights, Constitutional Law, Public Interest
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
          locationId: 7,
          // Patna
          bio: "Expert in criminal law with over 12 years of experience handling high-profile cases in Patna High Court. Specializes in criminal defense and appeals.",
          experience: 12,
          barCouncilNumber: "BR/234/2011",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 112,
          verified: true
        },
        specialties: [1, 3, 11]
        // Criminal Law, Constitutional Law, Human Rights
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
          locationId: 8,
          // Ranchi
          bio: "Tribal rights and environmental law expert with extensive experience in Jharkhand. Specializes in land rights cases and environmental litigation.",
          experience: 14,
          barCouncilNumber: "JH/456/2010",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.9,
          reviewCount: 93,
          verified: true
        },
        specialties: [5, 11, 12]
        // Property Law, Human Rights, Public Interest
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
          locationId: 9,
          // Gaya
          bio: "Family law advocate with deep understanding of matrimonial matters. Offers compassionate guidance in divorce, maintenance, and child custody cases.",
          experience: 8,
          barCouncilNumber: "BR/567/2015",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.5,
          reviewCount: 67,
          verified: true
        },
        specialties: [2, 9, 10]
        // Family Law, Divorce, Child Custody
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
          locationId: 11,
          // Jamshedpur
          bio: "Corporate and business law expert with experience in industrial disputes. Specializes in labor law and corporate contracts for industrial clients.",
          experience: 9,
          barCouncilNumber: "JH/789/2014",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.6,
          reviewCount: 78,
          verified: true
        },
        specialties: [4, 6, 17]
        // Corporate Law, Civil Law, Contracts
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
          locationId: 10,
          // Muzaffarpur
          bio: "Criminal defense lawyer with expertise in bail applications and trial advocacy. Handles criminal cases at all levels of courts in Bihar.",
          experience: 16,
          barCouncilNumber: "BR/123/2008",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 124,
          verified: true
        },
        specialties: [1, 3, 6]
        // Criminal Law, Constitutional Law, Civil Law
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
          locationId: 12,
          // Dhanbad
          bio: "Mining and environmental law expert with experience in workers' compensation cases. Specializes in mining regulations and labor rights.",
          experience: 11,
          barCouncilNumber: "JH/345/2012",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 91,
          verified: true
        },
        specialties: [11, 6, 17]
        // Human Rights, Civil Law, Contracts
      }
    ];
    for (const data of advocateData) {
      const user = await this.createUser(data.user);
      const advocate = {
        userId: user.id,
        ...data.advocate
      };
      const createdAdvocate = await this.createAdvocate(advocate);
      for (const specialtyId of data.specialties) {
        await this.addSpecialtyToAdvocate(createdAdvocate.id, specialtyId);
      }
    }
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
          locationId: 2,
          // South Delhi
          bio: "Specialized in intellectual property law with experience in patent litigation and copyright disputes. Previously worked at a top-tier IP firm.",
          experience: 14,
          barCouncilNumber: "DL/456/2009",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.9,
          reviewCount: 132,
          verified: true
        },
        specialties: [8, 14, 4]
        // IP, Startups, Corporate
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
          locationId: 3,
          // East Delhi
          bio: "Family law expert with compassionate approach to divorce and child custody cases. Mediator certified by Delhi Mediation Centre.",
          experience: 12,
          barCouncilNumber: "DL/789/2011",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 115,
          verified: true
        },
        specialties: [2, 9, 10]
        // Family Law, Divorce, Child Custody
      }
    ];
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
          locationId: 15,
          // Darbhanga
          bio: "Criminal defense specialist with extensive experience in Bihar courts. Expert in bail applications and criminal trials.",
          experience: 17,
          barCouncilNumber: "BR/345/2006",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 98,
          verified: true
        },
        specialties: [1, 3, 6]
        // Criminal, Constitutional, Civil
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
          locationId: 16,
          // Purnia
          bio: "Land law specialist focusing on property disputes, agricultural land cases, and property documentation in North Bihar.",
          experience: 13,
          barCouncilNumber: "BR/567/2010",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.6,
          reviewCount: 87,
          verified: true
        },
        specialties: [5, 16, 17]
        // Property, Civil Disputes, Contracts
      }
    ];
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
          locationId: 18,
          // Bokaro
          bio: "Labor law expert with experience in industrial disputes, factory workers' rights, and employment contracts in industrial belt of Jharkhand.",
          experience: 15,
          barCouncilNumber: "JH/123/2008",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.7,
          reviewCount: 104,
          verified: true
        },
        specialties: [11, 6, 17]
        // Human Rights, Civil Law, Contracts
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
          locationId: 20,
          // Hazaribagh
          bio: "Tribal rights advocate with expertise in forest rights, land acquisition cases, and representation of tribal communities in legal disputes.",
          experience: 11,
          barCouncilNumber: "JH/456/2012",
          imageUrl: "/src/assets/advocate-placeholder.svg",
          rating: 4.8,
          reviewCount: 92,
          verified: true
        },
        specialties: [11, 3, 12]
        // Human Rights, Constitutional, Public Interest
      }
    ];
    for (const data of [...delhiAdvocates, ...biharAdvocates, ...jharkhandAdvocates]) {
      const user = await this.createUser(data.user);
      const advocate = {
        userId: user.id,
        ...data.advocate
      };
      const createdAdvocate = await this.createAdvocate(advocate);
      for (const specialtyId of data.specialties) {
        await this.addSpecialtyToAdvocate(createdAdvocate.id, specialtyId);
      }
    }
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
      await this.createUser(user);
    }
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  async createUser(user) {
    const id = this.userIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const newUser = {
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
  async createLocation(location) {
    const id = this.locationIdCounter++;
    const newLocation = {
      id,
      city: location.city,
      state: location.state,
      pincode: location.pincode ?? null
    };
    this.locations.set(id, newLocation);
    return newLocation;
  }
  async getLocation(id) {
    return this.locations.get(id);
  }
  async getLocationsByCityOrState(query) {
    if (!query) return Array.from(this.locations.values());
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.locations.values()).filter(
      (location) => location.city.toLowerCase().includes(lowercaseQuery) || location.state.toLowerCase().includes(lowercaseQuery) || location.pincode && location.pincode.includes(query)
    );
  }
  async getAllLocations() {
    return Array.from(this.locations.values());
  }
  // Practice Area operations
  async createPracticeArea(practiceArea) {
    const id = this.practiceAreaIdCounter++;
    const newPracticeArea = { ...practiceArea, id };
    this.practiceAreas.set(id, newPracticeArea);
    return newPracticeArea;
  }
  async getPracticeArea(id) {
    return this.practiceAreas.get(id);
  }
  async getAllPracticeAreas() {
    return Array.from(this.practiceAreas.values());
  }
  // Advocate operations
  async createAdvocate(advocate) {
    const id = this.advocateIdCounter++;
    const newAdvocate = {
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
  async getAdvocate(id) {
    return this.advocates.get(id);
  }
  async getAdvocateWithDetails(id) {
    const advocate = this.advocates.get(id);
    if (!advocate) return void 0;
    const user = await this.getUser(advocate.userId);
    const location = await this.getLocation(advocate.locationId);
    const specialties = await this.getAdvocateSpecialties(id);
    if (!user || !location) return void 0;
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
  async getAdvocatesByLocation(locationId) {
    const advocates = Array.from(this.advocates.values()).filter((advocate) => advocate.locationId === locationId);
    const result = [];
    for (const advocate of advocates) {
      const advocateWithDetails = await this.getAdvocateWithDetails(advocate.id);
      if (advocateWithDetails) {
        result.push(advocateWithDetails);
      }
    }
    return result;
  }
  async getAdvocatesByPracticeArea(practiceAreaId) {
    const specialties = Array.from(this.advocateSpecialties.values()).filter((specialty) => specialty.practiceAreaId === practiceAreaId);
    const advocateIds = [...new Set(specialties.map((s) => s.advocateId))];
    const result = [];
    for (const advocateId of advocateIds) {
      const advocateWithDetails = await this.getAdvocateWithDetails(advocateId);
      if (advocateWithDetails) {
        result.push(advocateWithDetails);
      }
    }
    return result;
  }
  async getAdvocatesByFilter(filters) {
    let advocates = await this.getAllAdvocates();
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase();
      advocates = advocates.filter(
        (advocate) => advocate.location.city.toLowerCase().includes(locationQuery) || advocate.location.state.toLowerCase().includes(locationQuery)
      );
    }
    if (filters.practiceArea) {
      const practiceAreaQuery = filters.practiceArea.toLowerCase();
      advocates = advocates.filter(
        (advocate) => advocate.specialties.some(
          (specialty) => specialty.name.toLowerCase().includes(practiceAreaQuery)
        )
      );
    }
    if (filters.experience) {
      const experienceRange = filters.experience.split("-").map(Number);
      if (experienceRange.length === 2) {
        advocates = advocates.filter(
          (advocate) => advocate.experience >= experienceRange[0] && advocate.experience <= experienceRange[1]
        );
      } else if (filters.experience.includes("+")) {
        const minExperience = parseInt(filters.experience);
        advocates = advocates.filter(
          (advocate) => advocate.experience >= minExperience
        );
      }
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      advocates = advocates.filter(
        (advocate) => advocate.user.fullName.toLowerCase().includes(query) || advocate.bio.toLowerCase().includes(query) || advocate.specialties.some(
          (specialty) => specialty.name.toLowerCase().includes(query)
        )
      );
    }
    return advocates;
  }
  async getAllAdvocates() {
    const result = [];
    for (const advocate of this.advocates.values()) {
      const advocateWithDetails = await this.getAdvocateWithDetails(advocate.id);
      if (advocateWithDetails) {
        result.push(advocateWithDetails);
      }
    }
    return result;
  }
  // Advocate Specialty operations
  async addSpecialtyToAdvocate(advocateId, practiceAreaId) {
    const id = this.advocateSpecialtyIdCounter++;
    const specialty = {
      id,
      advocateId,
      practiceAreaId
    };
    this.advocateSpecialties.set(id, specialty);
    return specialty;
  }
  async getAdvocateSpecialties(advocateId) {
    const specialtyIds = Array.from(this.advocateSpecialties.values()).filter((specialty) => specialty.advocateId === advocateId).map((specialty) => specialty.practiceAreaId);
    return Array.from(this.practiceAreas.values()).filter((area) => specialtyIds.includes(area.id));
  }
  // Review operations
  async createReview(review) {
    const id = this.reviewIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const newReview = {
      id,
      createdAt,
      userId: review.userId,
      rating: review.rating,
      advocateId: review.advocateId,
      content: review.content ?? null
    };
    this.reviews.set(id, newReview);
    await this.updateAdvocateRating(review.advocateId);
    return newReview;
  }
  async getReviewsForAdvocate(advocateId) {
    return Array.from(this.reviews.values()).filter((review) => review.advocateId === advocateId);
  }
  async updateAdvocateRating(advocateId) {
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
  async createConnection(connection) {
    const id = this.connectionIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const newConnection = {
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
  async getConnection(id) {
    return this.connections.get(id);
  }
  async getConnectionsByClient(clientId) {
    return Array.from(this.connections.values()).filter((connection) => connection.clientId === clientId);
  }
  async getConnectionsByAdvocate(advocateId) {
    return Array.from(this.connections.values()).filter((connection) => connection.advocateId === advocateId);
  }
  async updateConnectionStatus(id, status) {
    const connection = await this.getConnection(id);
    if (!connection) return void 0;
    const updatedConnection = { ...connection, status };
    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }
  // Chat operations
  async createChatMessage(message) {
    const id = this.chatMessageIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const newMessage = {
      id,
      userId: message.userId,
      isUserMessage: message.isUserMessage,
      content: message.content,
      createdAt
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
  async getChatHistory(userId, limit = 50) {
    const messages = Array.from(this.chatMessages.values()).filter((message) => message.userId === userId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    if (limit > 0 && messages.length > limit) {
      return messages.slice(-limit);
    }
    return messages;
  }
};
var storage = new MemStorage();

// server/mongo-storage.ts
import { ObjectId } from "mongodb";

// server/db.ts
import { MongoClient, ServerApiVersion } from "mongodb";
var uri = process.env.MONGODB_URI || "mongodb://localhost:27017/nyayasetu";
var client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});
var db;
var collections = {};
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db();
    collections.users = db.collection("users");
    collections.advocates = db.collection("advocates");
    collections.locations = db.collection("locations");
    collections.practiceAreas = db.collection("practiceAreas");
    collections.advocateSpecialties = db.collection("advocateSpecialties");
    collections.reviews = db.collection("reviews");
    collections.connections = db.collection("connections");
    collections.chatMessages = db.collection("chatMessages");
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
async function initializeDatabase() {
  try {
    const userCount = await collections.users.countDocuments();
    if (userCount > 0) {
      console.log("Database already has data, skipping initialization");
      return;
    }
    console.log("Initializing database with sample data");
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
    const locationData = [
      { city: "New Delhi", state: "Delhi", pincode: "110001" },
      { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
      { city: "Bangalore", state: "Karnataka", pincode: "560001" },
      { city: "Chennai", state: "Tamil Nadu", pincode: "600001" },
      { city: "Kolkata", state: "West Bengal", pincode: "700001" },
      { city: "Hyderabad", state: "Telangana", pincode: "500001" }
    ];
    const locationsResult = await collections.locations.insertMany(locationData);
    const bcrypt3 = __require("bcryptjs");
    const saltRounds = 10;
    const clientUser = {
      username: "testclient",
      password: await bcrypt3.hash("password123", saltRounds),
      email: "client@example.com",
      fullName: "Test Client",
      phone: "9876543210",
      role: "client",
      createdAt: /* @__PURE__ */ new Date()
    };
    const clientResult = await collections.users.insertOne(clientUser);
    const advocateData = [
      {
        user: {
          username: "testadvocate1",
          password: await bcrypt3.hash("password123", saltRounds),
          email: "advocate1@example.com",
          fullName: "Test Advocate 1",
          phone: "9876543211",
          role: "advocate",
          createdAt: /* @__PURE__ */ new Date()
        },
        advocate: {
          locationId: locationsResult.insertedIds[0],
          // Delhi
          bio: "Over 15 years of experience in criminal defense and corporate legal matters.",
          experience: 15,
          barCouncilNumber: "DL/123/2005",
          aorNumber: "AOR/2007/123",
          practitionerCourts: ["Supreme Court", "Delhi High Court"],
          notableCases: ["State v. Kumar (2018)", "Delhi Development Authority v. Singh (2015)"],
          highlights: ["Specialized in white-collar criminal defense", "Former government counsel"],
          imageUrl: "https://images.unsplash.com/photo-1516382799247-87df95d790b7",
          // Ensure this is valid
          rating: 4.8,
          reviewCount: 124,
          verified: true,
          createdAt: /* @__PURE__ */ new Date()
        },
        specialties: [0, 2, 3]
      },
      {
        user: {
          username: "testadvocate2",
          password: await bcrypt3.hash("password123", saltRounds),
          email: "advocate2@example.com",
          fullName: "Test Advocate 2",
          phone: "8765432109",
          role: "advocate",
          createdAt: /* @__PURE__ */ new Date()
        },
        advocate: {
          locationId: locationsResult.insertedIds[1],
          // Mumbai
          bio: "Specializing in family law matters with compassionate representation.",
          experience: 8,
          barCouncilNumber: "MH/789/2014",
          aorNumber: "AOR/2016/456",
          practitionerCourts: ["Bombay High Court", "Family Court"],
          notableCases: ["Patel v. Patel (2019)", "In Re: Adoption of Minor (2021)"],
          highlights: ["Specialized in women's rights", "Child custody expert"],
          imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
          // Ensure this is valid
          rating: 4.9,
          reviewCount: 89,
          verified: true,
          createdAt: /* @__PURE__ */ new Date()
        },
        specialties: [1, 8, 9]
      }
    ];
    for (const data of advocateData) {
      const userResult = await collections.users.insertOne(data.user);
      const advocate = {
        userId: userResult.insertedId,
        ...data.advocate
      };
      const advocateResult = await collections.advocates.insertOne(advocate);
      for (const specialtyIndex of data.specialties) {
        const specialtyId = practiceAreasResult.insertedIds[specialtyIndex];
        await collections.advocateSpecialties.insertOne({
          advocateId: advocateResult.insertedId,
          practiceAreaId: specialtyId,
          createdAt: /* @__PURE__ */ new Date()
        });
      }
    }
    console.log("Database initialized with sample data");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

// server/mongo-storage.ts
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MongoDBStore = connectMongo(session);
function isMongoAvailable() {
  return process.env.USE_MONGO === "true" && !!process.env.MONGODB_URI;
}
function toExternalModel(doc) {
  if (!doc) return doc;
  const result = { ...doc };
  if (result._id) {
    result.id = result._id.toString();
    delete result._id;
  }
  return result;
}
function toInternalModel(data) {
  const result = { ...data };
  if (result.id) {
    result._id = new ObjectId(result.id);
    delete result.id;
  }
  if (result.userId && typeof result.userId === "string") {
    result.userId = new ObjectId(result.userId);
  }
  if (result.advocateId && typeof result.advocateId === "string") {
    result.advocateId = new ObjectId(result.advocateId);
  }
  if (result.clientId && typeof result.clientId === "string") {
    result.clientId = new ObjectId(result.clientId);
  }
  if (result.locationId && typeof result.locationId === "string") {
    result.locationId = new ObjectId(result.locationId);
  }
  if (result.practiceAreaId && typeof result.practiceAreaId === "string") {
    result.practiceAreaId = new ObjectId(result.practiceAreaId);
  }
  if (result.reviewId && typeof result.reviewId === "string") {
    result.reviewId = new ObjectId(result.reviewId);
  }
  return result;
}
var MongoStorage = class {
  sessionStore;
  constructor() {
    if (isMongoAvailable()) {
      this.sessionStore = new MongoDBStore({
        uri: process.env.MONGODB_URI || "mongodb://localhost:27017/nyayasetu",
        collection: "sessions",
        expires: 1e3 * 60 * 60 * 24 * 7
        // 1 week
      });
      this.sessionStore.on("error", (error) => {
        console.error("MongoDB session store error:", error);
      });
    } else {
      this.sessionStore = new MemoryStore({
        checkPeriod: 864e5
        // prune expired entries every 24h
      });
      console.log("Using memory session store as fallback");
    }
  }
  // User operations
  async getUser(id) {
    if (!isMongoAvailable()) {
      console.log("MongoDB not available, using MemStorage fallback");
      return await storage.getUser(typeof id === "string" ? parseInt(id) : id);
    }
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const user = await collections.users.findOne({ _id });
    return user ? toExternalModel(user) : void 0;
  }
  async getUserByUsername(username) {
    const user = await collections.users.findOne({ username });
    return user ? toExternalModel(user) : void 0;
  }
  async getUserByEmail(email) {
    const user = await collections.users.findOne({ email });
    return user ? toExternalModel(user) : void 0;
  }
  async createUser(user) {
    const result = await collections.users.insertOne({
      ...user,
      createdAt: /* @__PURE__ */ new Date()
    });
    const insertedUser = await collections.users.findOne({ _id: result.insertedId });
    return toExternalModel(insertedUser);
  }
  // Location operations
  async createLocation(location) {
    const result = await collections.locations.insertOne({
      ...location,
      createdAt: /* @__PURE__ */ new Date()
    });
    const insertedLocation = await collections.locations.findOne({ _id: result.insertedId });
    return toExternalModel(insertedLocation);
  }
  async getLocation(id) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const location = await collections.locations.findOne({ _id });
    return location ? toExternalModel(location) : void 0;
  }
  async getLocationsByCityOrState(query) {
    if (!query) return this.getAllLocations();
    const regex = new RegExp(query, "i");
    const locations = await collections.locations.find({
      $or: [
        { city: { $regex: regex } },
        { state: { $regex: regex } },
        { pincode: query }
      ]
    }).toArray();
    return locations.map((loc) => toExternalModel(loc));
  }
  async getAllLocations() {
    const locations = await collections.locations.find().toArray();
    return locations.map((loc) => toExternalModel(loc));
  }
  // Practice Area operations
  async createPracticeArea(practiceArea) {
    const result = await collections.practiceAreas.insertOne({
      ...practiceArea,
      createdAt: /* @__PURE__ */ new Date()
    });
    const insertedPracticeArea = await collections.practiceAreas.findOne({ _id: result.insertedId });
    return toExternalModel(insertedPracticeArea);
  }
  async getPracticeArea(id) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const practiceArea = await collections.practiceAreas.findOne({ _id });
    return practiceArea ? toExternalModel(practiceArea) : void 0;
  }
  async getAllPracticeAreas() {
    const practiceAreas = await collections.practiceAreas.find().toArray();
    return practiceAreas.map((area) => toExternalModel(area));
  }
  // Advocate operations
  async createAdvocate(advocate) {
    const internalAdvocate = toInternalModel(advocate);
    const result = await collections.advocates.insertOne({
      ...internalAdvocate,
      createdAt: /* @__PURE__ */ new Date()
    });
    const insertedAdvocate = await collections.advocates.findOne({ _id: result.insertedId });
    return toExternalModel(insertedAdvocate);
  }
  async getAdvocate(id) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const advocate = await collections.advocates.findOne({ _id });
    return advocate ? toExternalModel(advocate) : void 0;
  }
  async getAdvocateWithDetails(id) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const advocate = await collections.advocates.findOne({ _id });
    if (!advocate) return void 0;
    const user = await collections.users.findOne({ _id: advocate.userId });
    const location = await collections.locations.findOne({ _id: advocate.locationId });
    const specialtyRecords = await collections.advocateSpecialties.find({
      advocateId: advocate._id
    }).toArray();
    const specialtyIds = specialtyRecords.map((s) => s.practiceAreaId);
    const specialties = await collections.practiceAreas.find({
      _id: { $in: specialtyIds }
    }).toArray();
    const reviewCount = await collections.reviews.countDocuments({ advocateId: advocate._id });
    const advocateWithDetails = {
      ...toExternalModel(advocate),
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      },
      location: toExternalModel(location),
      specialties: specialties.map((s) => toExternalModel(s)),
      reviewCount,
      rating: advocate.rating || 0
    };
    return advocateWithDetails;
  }
  async getAdvocatesByLocation(locationId) {
    const _locationId = typeof locationId === "string" ? new ObjectId(locationId) : locationId;
    const advocates = await collections.advocates.find({ locationId: _locationId }).toArray();
    const detailedAdvocates = await Promise.all(
      advocates.map((adv) => this.getAdvocateWithDetails(adv._id))
    );
    return detailedAdvocates.filter((adv) => adv !== void 0);
  }
  async getAdvocatesByPracticeArea(practiceAreaId) {
    const _practiceAreaId = typeof practiceAreaId === "string" ? new ObjectId(practiceAreaId) : practiceAreaId;
    const specialtyRecords = await collections.advocateSpecialties.find({
      practiceAreaId: _practiceAreaId
    }).toArray();
    const advocateIds = specialtyRecords.map((s) => s.advocateId);
    const detailedAdvocates = await Promise.all(
      advocateIds.map((id) => this.getAdvocateWithDetails(id))
    );
    return detailedAdvocates.filter((adv) => adv !== void 0);
  }
  async getAdvocatesByFilter(filters) {
    let advocates = await this.getAllAdvocates();
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase();
      advocates = advocates.filter(
        (advocate) => advocate.location.city.toLowerCase().includes(locationQuery) || advocate.location.state.toLowerCase().includes(locationQuery)
      );
    }
    if (filters.practiceArea) {
      const practiceAreaQuery = filters.practiceArea.toLowerCase();
      advocates = advocates.filter(
        (advocate) => advocate.specialties.some(
          (specialty) => specialty.name.toLowerCase().includes(practiceAreaQuery)
        )
      );
    }
    if (filters.experience) {
      if (filters.experience === "1-3") {
        advocates = advocates.filter((advocate) => advocate.experience >= 1 && advocate.experience <= 3);
      } else if (filters.experience === "3-5") {
        advocates = advocates.filter((advocate) => advocate.experience >= 3 && advocate.experience <= 5);
      } else if (filters.experience === "5-10") {
        advocates = advocates.filter((advocate) => advocate.experience >= 5 && advocate.experience <= 10);
      } else if (filters.experience === "10+") {
        advocates = advocates.filter((advocate) => advocate.experience > 10);
      }
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      advocates = advocates.filter(
        (advocate) => advocate.user.fullName.toLowerCase().includes(query) || advocate.bio.toLowerCase().includes(query)
      );
    }
    return advocates;
  }
  async getAllAdvocates() {
    const advocates = await collections.advocates.find().toArray();
    const detailedAdvocates = await Promise.all(
      advocates.map((adv) => this.getAdvocateWithDetails(adv._id))
    );
    return detailedAdvocates.filter((adv) => adv !== void 0);
  }
  // Advocate Specialty operations
  async addSpecialtyToAdvocate(advocateId, practiceAreaId) {
    const _advocateId = typeof advocateId === "string" ? new ObjectId(advocateId) : advocateId;
    const _practiceAreaId = typeof practiceAreaId === "string" ? new ObjectId(practiceAreaId) : practiceAreaId;
    const existingSpecialty = await collections.advocateSpecialties.findOne({
      advocateId: _advocateId,
      practiceAreaId: _practiceAreaId
    });
    if (existingSpecialty) {
      return toExternalModel(existingSpecialty);
    }
    const result = await collections.advocateSpecialties.insertOne({
      advocateId: _advocateId,
      practiceAreaId: _practiceAreaId,
      createdAt: /* @__PURE__ */ new Date()
    });
    const insertedSpecialty = await collections.advocateSpecialties.findOne({ _id: result.insertedId });
    return toExternalModel(insertedSpecialty);
  }
  async getAdvocateSpecialties(advocateId) {
    const _advocateId = typeof advocateId === "string" ? new ObjectId(advocateId) : advocateId;
    const specialtyRecords = await collections.advocateSpecialties.find({
      advocateId: _advocateId
    }).toArray();
    const practiceAreaIds = specialtyRecords.map((s) => s.practiceAreaId);
    const practiceAreas = await collections.practiceAreas.find({
      _id: { $in: practiceAreaIds }
    }).toArray();
    return practiceAreas.map((area) => toExternalModel(area));
  }
  // Review operations
  async createReview(review) {
    const internalReview = toInternalModel(review);
    const result = await collections.reviews.insertOne({
      ...internalReview,
      createdAt: /* @__PURE__ */ new Date()
    });
    await this.updateAdvocateRating(review.advocateId);
    const insertedReview = await collections.reviews.findOne({ _id: result.insertedId });
    return toExternalModel(insertedReview);
  }
  async getReviewsForAdvocate(advocateId) {
    const _advocateId = typeof advocateId === "string" ? new ObjectId(advocateId) : advocateId;
    const reviews = await collections.reviews.find({
      advocateId: _advocateId
    }).sort({ createdAt: -1 }).toArray();
    return reviews.map((review) => toExternalModel(review));
  }
  async updateAdvocateRating(advocateId) {
    const _advocateId = typeof advocateId === "string" ? new ObjectId(advocateId) : advocateId;
    const reviews = await this.getReviewsForAdvocate(_advocateId);
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
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
  async createConnection(connection) {
    const internalConnection = toInternalModel(connection);
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const result = await collections.connections.insertOne({
      ...internalConnection,
      status: connection.status || "active",
      expiresAt,
      createdAt: /* @__PURE__ */ new Date()
    });
    const insertedConnection = await collections.connections.findOne({ _id: result.insertedId });
    return toExternalModel(insertedConnection);
  }
  async getConnection(id) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const connection = await collections.connections.findOne({ _id });
    return connection ? toExternalModel(connection) : void 0;
  }
  async getConnectionsByClient(clientId) {
    const _clientId = typeof clientId === "string" ? new ObjectId(clientId) : clientId;
    const connections = await collections.connections.find({
      clientId: _clientId
    }).sort({ createdAt: -1 }).toArray();
    return connections.map((conn) => toExternalModel(conn));
  }
  async getConnectionsByAdvocate(advocateId) {
    const _advocateId = typeof advocateId === "string" ? new ObjectId(advocateId) : advocateId;
    const connections = await collections.connections.find({
      advocateId: _advocateId
    }).sort({ createdAt: -1 }).toArray();
    return connections.map((conn) => toExternalModel(conn));
  }
  async updateConnectionStatus(id, status) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    await collections.connections.updateOne(
      { _id },
      { $set: { status, updatedAt: /* @__PURE__ */ new Date() } }
    );
    const updatedConnection = await collections.connections.findOne({ _id });
    return updatedConnection ? toExternalModel(updatedConnection) : void 0;
  }
  // Chat operations
  async createChatMessage(message) {
    const internalMessage = toInternalModel(message);
    const result = await collections.chatMessages.insertOne({
      ...internalMessage,
      createdAt: /* @__PURE__ */ new Date()
    });
    const insertedMessage = await collections.chatMessages.findOne({ _id: result.insertedId });
    return toExternalModel(insertedMessage);
  }
  async getChatHistory(userId, limit = 50) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    const messages = await collections.chatMessages.find({
      userId: _userId
    }).sort({ createdAt: -1 }).limit(limit).toArray();
    return messages.map((msg) => toExternalModel(msg)).reverse();
  }
  // Helper function to get advocate by user ID
  async getAdvocateByUserId(userId) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    const advocate = await collections.advocates.findOne({ userId: _userId });
    return advocate ? toExternalModel(advocate) : void 0;
  }
};
var mongoStorage = new MongoStorage();

// server/routes.ts
import bcrypt2 from "bcryptjs";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
var dataStore = process.env.USE_MONGO === "true" ? mongoStorage : storage;
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      let user = await dataStore.getUserByUsername(username);
      if (!user) {
        user = await dataStore.getUserByEmail(username);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username or password." });
      }
      const isDevelopment = process.env.NODE_ENV !== "production";
      const isHashed = user.password.startsWith("$2");
      let isMatch = false;
      if (isDevelopment && !isHashed) {
        isMatch = password === user.password;
      } else {
        isMatch = await bcrypt.compare(password, user.password);
      }
      if (!isMatch) {
        return done(null, false, { message: "Incorrect username or password." });
      }
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  }
));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await dataStore.getUser(id);
    if (!user) {
      return done(null, null);
    }
    const { password, ...userWithoutPassword } = user;
    done(null, userWithoutPassword);
  } catch (error) {
    done(error);
  }
});
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Unauthorized" });
}
var auth_default = passport;

// server/bert-model.ts
var legalDatabase = {
  "ipc": {
    "section 302": "Section 302 of IPC deals with punishment for murder. If convicted, the punishment is death or imprisonment for life and fine.",
    "section 376": "Section 376 of IPC deals with punishment for rape. It includes imprisonment not less than 7 years which may extend to life and fine.",
    "section 420": "Section 420 of IPC deals with cheating and dishonestly inducing delivery of property. The punishment is imprisonment up to 7 years and fine.",
    "section 124a": "Section 124A of IPC deals with sedition. The punishment is imprisonment for life with fine, or imprisonment up to 3 years with fine.",
    "section 304b": "Section 304B of IPC deals with dowry death. The minimum punishment is 7 years imprisonment which may extend to life imprisonment.",
    "section 498a": "Section 498A of IPC deals with husband or relative of husband subjecting a woman to cruelty. Punishment is imprisonment up to 3 years and fine."
  },
  "crpc": {
    "section 41": "Section 41 of CrPC deals with when police may arrest without warrant.",
    "section 125": "Section 125 of CrPC deals with order for maintenance of wives, children and parents.",
    "section 144": "Section 144 of CrPC deals with power to issue order in urgent cases of nuisance or apprehended danger.",
    "section 161": "Section 161 of CrPC deals with examination of witnesses by police."
  },
  "cpc": {
    "section 9": "Section 9 of CPC deals with courts to try all civil suits unless barred.",
    "section 11": "Section 11 of CPC deals with res judicata, meaning no court shall try any suit in which the matter has been directly and substantially in issue in a former suit."
  }
};
var legalFAQs = {
  "rights when arrested": "When arrested in India, you have the right to: 1) Know the grounds of arrest, 2) Inform a friend/relative, 3) Meet an advocate of your choice, 4) Be produced before a magistrate within 24 hours, 5) Medical examination, and 6) Not be subjected to unnecessary restraint or torture.",
  "file for divorce": "To file for divorce in India, you need to: 1) Have grounds for divorce (cruelty, desertion, etc.), 2) File a petition in the family court, 3) Attempt reconciliation if ordered by court, 4) Go through trial if contested, 5) Wait for the court's decree. The process varies based on personal laws (Hindu, Muslim, Christian, etc.).",
  "property registration": "For property registration in India: 1) Execute a sale deed, 2) Pay appropriate stamp duty, 3) Get the deed registered at the Sub-Registrar's office within 4 months, 4) Pay registration fee, 5) Get the property mutation done in municipal records for tax purposes.",
  "legally binding will": "For a legally binding will in India: 1) It must be in writing, 2) Signed by the testator, 3) Attested by two witnesses, 4) Registration is recommended but not mandatory, 5) The testator must be of sound mind and not coerced.",
  "starting a business": "Legal steps for starting a business in India: 1) Choose a business structure (Proprietorship/Partnership/LLP/Company), 2) Register the business name, 3) Get necessary licenses (GST, Professional Tax, Shop Act), 4) Register under Companies Act if incorporating, 5) Comply with labor laws if hiring employees."
};
function extractSectionNumber(query) {
  const sectionMatch = query.match(/section\s+(\d+[A-Za-z]?)/i);
  if (sectionMatch && sectionMatch[1]) {
    return sectionMatch[1].toLowerCase();
  }
  return "";
}
function extractLegalCode(query) {
  const codeMatches = query.match(/ipc|crpc|cpc|it act|companies act|indian constitution/gi);
  if (codeMatches && codeMatches.length > 0) {
    return codeMatches[0].toLowerCase();
  }
  return "";
}
function isAskingAboutSection(query) {
  return query.toLowerCase().includes("section") && (extractLegalCode(query) !== "" || extractSectionNumber(query) !== "");
}
function findRelevantFAQ(query) {
  const queryLower = query.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;
  for (const [key, value] of Object.entries(legalFAQs)) {
    if (queryLower.includes(key)) {
      const score = key.length;
      if (score > highestScore) {
        highestScore = score;
        bestMatch = value;
      }
    }
  }
  return bestMatch;
}
async function aiChatResponse(userMessage) {
  try {
    const queryLower = userMessage.toLowerCase();
    if (isAskingAboutSection(queryLower)) {
      const code = extractLegalCode(queryLower);
      const section = extractSectionNumber(queryLower);
      if (code && section && legalDatabase[code] && legalDatabase[code][`section ${section}`]) {
        return legalDatabase[code][`section ${section}`];
      } else {
        return `I don't have specific information about Section ${section} of ${code.toUpperCase()}. For accurate information, please consult a legal professional or refer to the official legal texts.`;
      }
    }
    const faqMatch = findRelevantFAQ(queryLower);
    if (faqMatch) {
      return faqMatch;
    }
    if (queryLower.includes("bail")) {
      return "Bail is the conditional release of an accused with an assurance to appear in court when required. Regular bail is sought under Section 437 and 439 CrPC. Anticipatory bail, under Section 438 CrPC, is sought before arrest. The application needs to be filed with proper grounds in the appropriate court.";
    }
    if (queryLower.includes("fir") || queryLower.includes("police complaint")) {
      return "To file an FIR (First Information Report): 1) Go to the police station with jurisdiction, 2) Provide all details of the incident, 3) Get a copy of the FIR with a unique number, 4) If police refuse to register, approach the Superintendent of Police or file a complaint before the Magistrate under Section 156(3) CrPC.";
    }
    if (queryLower.includes("tenant") || queryLower.includes("landlord") || queryLower.includes("rent")) {
      return "Landlord-tenant laws in India vary by state. Generally, a rental agreement should specify rent, duration, security deposit, and maintenance responsibilities. Eviction requires proper notice as per the agreement and state laws. Security deposits must be returned after deducting legitimate costs.";
    }
    return "I can provide general legal information on Indian laws including IPC, CrPC, family law, property law, etc. For specific legal advice tailored to your situation, please consult with a qualified advocate who can provide personalized guidance.";
  } catch (error) {
    console.error("Error generating AI chat response:", error);
    return "I apologize, but I'm having trouble processing your question right now. Please try again with a different query about Indian law.";
  }
}
async function getSuggestedLegalQuestions() {
  return [
    "What are my rights if I'm arrested?",
    "How do I file for divorce in India?",
    "What is the process for property registration?",
    "How can I draft a legally binding will?",
    "What does Section 420 of IPC deal with?"
  ];
}

// server/routes.ts
var dataStore2 = process.env.USE_MONGO === "true" ? mongoStorage : storage;
var loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});
var registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email format"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  role: z.enum(["client", "advocate"], {
    errorMap: () => ({ message: "Role must be either 'client' or 'advocate'" })
  })
});
async function registerRoutes(app2) {
  app2.post("/api/auth/login", (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      passport2.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({
            success: false,
            message: info?.message || "Authentication failed"
          });
        }
        req.login(user, (err2) => {
          if (err2) return next(err2);
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
  app2.post("/api/auth/register", async (req, res, next) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const existingUserByUsername = await dataStore2.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }
      const existingUserByEmail = await dataStore2.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
      const salt = await bcrypt2.genSalt(10);
      const hashedPassword = await bcrypt2.hash(validatedData.password, salt);
      const newUser = await dataStore2.createUser({
        username: validatedData.username,
        password: hashedPassword,
        email: validatedData.email,
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        role: validatedData.role
      });
      if (validatedData.role === "advocate") {
        const defaultLocation = (await dataStore2.getAllLocations())[0];
        if (defaultLocation) {
          await dataStore2.createAdvocate({
            userId: newUser.id,
            locationId: defaultLocation.id,
            bio: `Advocate profile for ${validatedData.fullName}`,
            experience: 0,
            barCouncilNumber: "Not verified",
            imageUrl: null
          });
        }
      }
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
  app2.get("/api/auth/logout", (req, res) => {
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
  app2.get("/api/auth/user", isAuthenticated, (req, res) => {
    res.json({
      success: true,
      user: req.user
    });
  });
  app2.post("/api/chat", async (req, res, next) => {
    try {
      const { message, isEncrypted } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({
          success: false,
          message: "Message is required and must be a string"
        });
      }
      const userId = req.user ? req.user.id : 999;
      await dataStore2.createChatMessage({
        userId,
        content: message,
        isUserMessage: true
      });
      const userMessageForAI = isEncrypted ? "I'm sending an encrypted legal question" : message;
      const aiResponse = await aiChatResponse(userMessageForAI);
      const aiMessageRecord = await dataStore2.createChatMessage({
        userId,
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
  app2.get("/api/chat/history/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await dataStore2.getChatHistory(userId);
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/chat/suggested-questions", async (req, res, next) => {
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
  app2.get("/api/practice-areas", async (req, res, next) => {
    try {
      const areas = await dataStore2.getAllPracticeAreas();
      res.json({
        success: true,
        data: areas
      });
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/advocates", async (req, res, next) => {
    try {
      const { location, practiceArea, experience, searchQuery } = req.query;
      let advocates;
      if (location || practiceArea || experience || searchQuery) {
        advocates = await dataStore2.getAdvocatesByFilter({
          location,
          practiceArea,
          experience,
          searchQuery
        });
      } else {
        advocates = await dataStore2.getAllAdvocates();
      }
      res.json({
        success: true,
        data: advocates
      });
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/advocates/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const advocate = await dataStore2.getAdvocateWithDetails(id);
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
  app2.get("/api/test", (req, res) => {
    res.json({
      success: true,
      message: "API is working",
      data: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import session2 from "express-session";
var useMongo = process.env.USE_MONGO === "true";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(session2({
  secret: process.env.SESSION_SECRET || "nyayasetu-secret-key",
  resave: false,
  saveUninitialized: false,
  store: useMongo ? mongoStorage.sessionStore : void 0,
  // Use MongoDB store only if USE_MONGO is true
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1e3
    // 1 day
  }
}));
app.use(auth_default.initialize());
app.use(auth_default.session());
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
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
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
(async () => {
  try {
    if (useMongo) {
      await connectToDatabase();
      log("Connected to MongoDB");
      await initializeDatabase();
      log("Database initialized");
    } else {
      log("Using in-memory storage");
    }
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error(err);
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const port = 3001;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`NyayaSetu server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server initialization error:", error);
    console.error(error);
  }
})();
