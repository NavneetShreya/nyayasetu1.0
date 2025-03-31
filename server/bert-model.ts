import fs from 'fs';
import path from 'path';

// Legal information database (simulated)
interface LegalSection {
  [key: string]: string;
}

interface LegalCode {
  [key: string]: LegalSection;
}

const legalDatabase: LegalCode = {
  "ipc": {
    "section 302": "Section 302 of IPC deals with punishment for murder. If convicted, the punishment is death or imprisonment for life and fine.",
    "section 376": "Section 376 of IPC deals with punishment for rape. It includes imprisonment not less than 7 years which may extend to life and fine.",
    "section 420": "Section 420 of IPC deals with cheating and dishonestly inducing delivery of property. The punishment is imprisonment up to 7 years and fine.",
    "section 124a": "Section 124A of IPC deals with sedition. The punishment is imprisonment for life with fine, or imprisonment up to 3 years with fine.",
    "section 304b": "Section 304B of IPC deals with dowry death. The minimum punishment is 7 years imprisonment which may extend to life imprisonment.",
    "section 498a": "Section 498A of IPC deals with husband or relative of husband subjecting a woman to cruelty. Punishment is imprisonment up to 3 years and fine.",
  },
  "crpc": {
    "section 41": "Section 41 of CrPC deals with when police may arrest without warrant.",
    "section 125": "Section 125 of CrPC deals with order for maintenance of wives, children and parents.",
    "section 144": "Section 144 of CrPC deals with power to issue order in urgent cases of nuisance or apprehended danger.",
    "section 161": "Section 161 of CrPC deals with examination of witnesses by police.",
  },
  "cpc": {
    "section 9": "Section 9 of CPC deals with courts to try all civil suits unless barred.",
    "section 11": "Section 11 of CPC deals with res judicata, meaning no court shall try any suit in which the matter has been directly and substantially in issue in a former suit.",
  },
};

// Common legal questions and answers
interface LegalFAQs {
  [key: string]: string;
}

const legalFAQs: LegalFAQs = {
  "rights when arrested": "When arrested in India, you have the right to: 1) Know the grounds of arrest, 2) Inform a friend/relative, 3) Meet an advocate of your choice, 4) Be produced before a magistrate within 24 hours, 5) Medical examination, and 6) Not be subjected to unnecessary restraint or torture.",
  "file for divorce": "To file for divorce in India, you need to: 1) Have grounds for divorce (cruelty, desertion, etc.), 2) File a petition in the family court, 3) Attempt reconciliation if ordered by court, 4) Go through trial if contested, 5) Wait for the court's decree. The process varies based on personal laws (Hindu, Muslim, Christian, etc.).",
  "property registration": "For property registration in India: 1) Execute a sale deed, 2) Pay appropriate stamp duty, 3) Get the deed registered at the Sub-Registrar's office within 4 months, 4) Pay registration fee, 5) Get the property mutation done in municipal records for tax purposes.",
  "legally binding will": "For a legally binding will in India: 1) It must be in writing, 2) Signed by the testator, 3) Attested by two witnesses, 4) Registration is recommended but not mandatory, 5) The testator must be of sound mind and not coerced.",
  "starting a business": "Legal steps for starting a business in India: 1) Choose a business structure (Proprietorship/Partnership/LLP/Company), 2) Register the business name, 3) Get necessary licenses (GST, Professional Tax, Shop Act), 4) Register under Companies Act if incorporating, 5) Comply with labor laws if hiring employees.",
};

// Extract section number from query
function extractSectionNumber(query: string): string {
  const sectionMatch = query.match(/section\s+(\d+[A-Za-z]?)/i);
  if (sectionMatch && sectionMatch[1]) {
    return sectionMatch[1].toLowerCase();
  }
  return "";
}

// Extract legal code from query
function extractLegalCode(query: string): string {
  const codeMatches = query.match(/ipc|crpc|cpc|it act|companies act|indian constitution/gi);
  if (codeMatches && codeMatches.length > 0) {
    return codeMatches[0].toLowerCase();
  }
  return "";
}

// Check if the query is asking about a specific legal section
function isAskingAboutSection(query: string): boolean {
  return query.toLowerCase().includes("section") && 
         (extractLegalCode(query) !== "" || extractSectionNumber(query) !== "");
}

// Find best matching FAQ for a query
function findRelevantFAQ(query: string): string | null {
  const queryLower = query.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;
  
  for (const [key, value] of Object.entries(legalFAQs)) {
    if (queryLower.includes(key)) {
      const score = key.length; // Simple scoring by length of matched phrase
      if (score > highestScore) {
        highestScore = score;
        bestMatch = value;
      }
    }
  }
  
  return bestMatch;
}

// AI chat response function
export async function aiChatResponse(userMessage: string): Promise<string> {
  try {
    const queryLower = userMessage.toLowerCase();
    
    // Check if asking about legal section
    if (isAskingAboutSection(queryLower)) {
      const code = extractLegalCode(queryLower);
      const section = extractSectionNumber(queryLower);
      
      if (code && section && legalDatabase[code] && legalDatabase[code][`section ${section}`]) {
        return legalDatabase[code][`section ${section}`];
      } else {
        return `I don't have specific information about Section ${section} of ${code.toUpperCase()}. For accurate information, please consult a legal professional or refer to the official legal texts.`;
      }
    }
    
    // Check for FAQ matches
    const faqMatch = findRelevantFAQ(queryLower);
    if (faqMatch) {
      return faqMatch;
    }
    
    // General legal queries
    if (queryLower.includes("bail")) {
      return "Bail is the conditional release of an accused with an assurance to appear in court when required. Regular bail is sought under Section 437 and 439 CrPC. Anticipatory bail, under Section 438 CrPC, is sought before arrest. The application needs to be filed with proper grounds in the appropriate court.";
    }
    
    if (queryLower.includes("fir") || queryLower.includes("police complaint")) {
      return "To file an FIR (First Information Report): 1) Go to the police station with jurisdiction, 2) Provide all details of the incident, 3) Get a copy of the FIR with a unique number, 4) If police refuse to register, approach the Superintendent of Police or file a complaint before the Magistrate under Section 156(3) CrPC.";
    }
    
    if (queryLower.includes("tenant") || queryLower.includes("landlord") || queryLower.includes("rent")) {
      return "Landlord-tenant laws in India vary by state. Generally, a rental agreement should specify rent, duration, security deposit, and maintenance responsibilities. Eviction requires proper notice as per the agreement and state laws. Security deposits must be returned after deducting legitimate costs.";
    }
    
    // Default response for other legal questions
    return "I can provide general legal information on Indian laws including IPC, CrPC, family law, property law, etc. For specific legal advice tailored to your situation, please consult with a qualified advocate who can provide personalized guidance.";
    
  } catch (error) {
    console.error("Error generating AI chat response:", error);
    return "I apologize, but I'm having trouble processing your question right now. Please try again with a different query about Indian law.";
  }
}

// Get information about legal section
export async function getLegalSectionInfo(section: string, code: string): Promise<string> {
  try {
    if (legalDatabase[code.toLowerCase()] && 
        legalDatabase[code.toLowerCase()][`section ${section.toLowerCase()}`]) {
      return legalDatabase[code.toLowerCase()][`section ${section.toLowerCase()}`];
    }
    
    return `I don't have specific information about Section ${section} of ${code.toUpperCase()}. For accurate information, please consult a legal professional or refer to the official legal texts.`;
  } catch (error) {
    console.error("Error getting legal section info:", error);
    return "I apologize, but I'm having trouble retrieving information about this legal section. Please try again later.";
  }
}

// Get suggested legal questions
export async function getSuggestedLegalQuestions(): Promise<string[]> {
  return [
    "What are my rights if I'm arrested?",
    "How do I file for divorce in India?",
    "What is the process for property registration?",
    "How can I draft a legally binding will?",
    "What does Section 420 of IPC deal with?"
  ];
}