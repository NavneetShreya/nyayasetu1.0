# NyayaSetu - Legal Services Platform

## Introduction
NyayaSetu is a comprehensive legal services platform connecting clients with advocates across India. The platform leverages modern web technologies to provide a seamless experience for finding qualified legal professionals, accessing legal information, and initiating consultations.

## Features

### For Clients
- **Find Advocates**: Search for advocates based on location, specialization, and experience
- **Detailed Profiles**: View advocate profiles with experience, ratings, reviews, and specialties
- **Legal Chatbot**: Get answers to legal questions from our AI-powered chatbot trained on Indian laws
- **Secure Connections**: Connect with advocates for a nominal fee of ₹10 through Razorpay payment gateway
- **End-to-End Encrypted Chat**: Communicate securely with your chosen advocate

### For Advocates
- **Professional Profiles**: Create and manage a detailed professional profile including:
  - Experience and qualifications
  - Areas of practice and specialization
  - AOR number and Bar Council registration
  - Courts where you practice
  - Notable cases and achievements
- **Client Management**: Accept and manage client connections
- **Location-Based Visibility**: Get discovered by clients in your geographic area

### Technical Features
- Responsive design for all devices
- AI-powered legal assistant using InLegalBERT open-source model
- Payment integration with Razorpay
- Role-based access control
- MongoDB integration for data persistence
- Session-based authentication

## Tech Stack
- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js with Express
- **Database**: MongoDB (with in-memory storage fallback)
- **Authentication**: Passport.js with local strategy
- **Payment Processing**: Razorpay
- **AI Integration**: InLegalBERT model for legal query responses

## Setup and Installation

### Prerequisites
- Node.js (v14.x or higher)
- MongoDB (optional - in-memory storage available for development)
- Razorpay API keys (for payment processing)

### Environment Setup
Create a `.env` file in the root directory with the following variables:
```env
# MongoDB connection string (optional)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
# Session secret (change this to a secure random string in production)
SESSION_SECRET=your-secure-session-secret
# Set to 'false' to use in-memory storage (default), 'true' to use MongoDB storage
USE_MONGO=false
# Razorpay API keys (for payment processing)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
# Node environment
NODE_ENV=development
```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/NavneetShreya/nyayasetu1.0.git
   cd nyayasetu
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application at [http://localhost:3001](http://localhost:3001).

### Test Accounts

#### Client Test Accounts
| Username       | Password     | Description                     |
|----------------|--------------|---------------------------------|
| client1        | password123  | Regular client account          |


#### Advocate Test Accounts
| Username       | Password     | Description                     |
|----------------|--------------|---------------------------------|
| adv1           | password123  | Criminal law advocate in Delhi  |
| adv2           | password123  | Family law advocate in Mumbai   |
| adv3           | password123  | Criminal law advocate in Patna  |
| adv4           | password123  | Human rights advocate in Ranchi |

## Project Structure
```
nyayasetu/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── assets/        # Static assets (images, icons)
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── pages/         # Application pages
│   │   ├── App.tsx        # Main application component
│   │   └── main.tsx       # Application entry point
│   └── index.html         # HTML template
├── server/                # Backend Express application
│   ├── bert-model.ts      # InLegalBERT model integration
│   ├── db.ts              # Database connection and setup
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage interface
├── shared/                # Shared code between client and server
│   └── schema.ts          # Data schemas and types
└── package.json           # Project dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (client or advocate)
- `POST /api/auth/login` - Login with username/email and password
- `GET /api/auth/logout` - Logout current user
- `GET /api/auth/user` - Get current user details

### Advocates
- `GET /api/advocates` - Get list of advocates (with optional filters)
- `GET /api/advocates/:id` - Get details of a specific advocate
- `GET /api/practice-areas` - Get list of practice areas

### Chat
- `POST /api/chat` - Send a message to the legal chatbot
- `GET /api/chat/history/:userId` - Get chat history for a user
- `GET /api/chat/suggested-questions` - Get suggested legal questions

### Connections
- `POST /api/connections` - Create a new connection request
- `GET /api/connections/client/:clientId` - Get connections for a client
- `GET /api/connections/advocate/:advocateId` - Get connections for an advocate
- `PATCH /api/connections/:id/status` - Update connection status

## Contribution
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
