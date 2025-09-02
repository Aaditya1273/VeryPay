# VPay - Web3 Micro-Economy Platform

VPay is a comprehensive Web3 micro-economy platform that enables instant payments, task completion rewards, and loyalty programs within the Very Network ecosystem. Built with React, Node.js, and Solidity smart contracts, featuring integrated VeryChat AI assistant for intelligent user support.

## 🚀 Features

- **💰 Instant Payments**: Send and receive VRC tokens with minimal fees
- **💼 Task Marketplace**: Find and post micro-tasks for quick earnings
- **🎁 Rewards System**: Earn points and unlock exclusive rewards
- **🔐 Web3 Integration**: Connect your wallet for secure transactions
- **📱 Modern UI**: Beautiful, responsive interface with dark/light themes
- **⚡ Real-time Updates**: Live notifications and transaction updates
- **🤖 VeryChat AI Assistant**: Intelligent support with VPay-specific context
- **🏆 Gamification**: Quests, streaks, leaderboards, and NFT badges
- **🆔 Decentralized Identity**: DID integration with Soulbound Tokens
- **💳 Account Abstraction**: Gasless transactions with ERC-4337 support


## 🤖 VeryChat AI Assistant Integration

VPay features an intelligent AI assistant powered by VeryChat that provides contextual help and support for all platform features.

### VeryChat API Key Setup

1. **Obtain API Key**: Get your VeryChat API key from [VeryChat Dashboard](https://dashboard.verychat.ai)

2. **Configure Environment**: Add your API key to the frontend `.env` file:
   ```env
   VITE_VERYCHAT_API_KEY=your_actual_api_key_here
   ```

3. **Verify Setup**: The chat assistant will appear as a floating button in the bottom-right corner

### Efficient VeryChat Usage

#### **Smart Context Enhancement**
- **VPay-Specific Prompts**: The assistant is pre-configured with VPay context for accurate responses
- **Intent Detection**: Automatically detects user intent (wallet, payments, tasks, rewards)
- **Contextual Responses**: Provides relevant help based on current page and user actions

#### **Optimized API Calls**
```typescript
// Efficient streaming implementation
const streamResponse = async (message: string) => {
  const response = await fetch(`${VITE_VERYCHAT_API_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VITE_VERYCHAT_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: enhanceWithVPayContext(message),
      stream: true,
      model: 'verychat-pro'
    })
  });
  
  // Process streaming response for real-time updates
  const reader = response.body?.getReader();
  // ... streaming logic
};
```

## 🏗️ Architecture

### System Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React + TypeScript UI]
        WC[Wallet Connection]
        AI[VeryChat AI Assistant]
        RT[Real-time Updates]
    end
    
    subgraph "Backend Layer"
        API[Express.js API]
        AUTH[JWT Authentication]
        WS[WebSocket Server]
        DB[(Prisma + Database)]
    end
    
    subgraph "Blockchain Layer"
        SC[Smart Contracts]
        WALLET[User Wallets]
        TOKENS[VRC Tokens]
    end
    
    subgraph "External Services"
        VC[VeryChat API]
        IPFS[IPFS Storage]
        ORACLES[Price Oracles]
    end
    
    UI --> API
    WC --> WALLET
    AI --> VC
    RT --> WS
    API --> AUTH
    API --> DB
    WS --> DB
    API --> SC
    SC --> TOKENS
    SC --> IPFS
    API --> ORACLES
```

### Technology Stack

#### Frontend (`/frontend`)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation
- **Ethers.js** for Web3 integration
- **Socket.io-client** for real-time features

#### Backend (`/backend`)
- **Node.js** with **Express.js**
- **Prisma ORM** with SQLite (development)
- **JWT** authentication
- **Socket.io** for real-time features
- **Multer** for file uploads

#### Smart Contracts (`/contracts`)
- **Solidity** smart contracts
- **Hardhat** development environment
- **OpenZeppelin** for security standards
- **Ethers.js** for contract interaction

## Project Structure

```
vpay/
├── frontend/                 # React + Vite frontend
├── backend/                  # Node.js + Express backend
├── contracts/                # Solidity smart contracts
├── shared/                   # Shared types and utilities
├── docs/                     # Documentation
└── scripts/                  # Development scripts
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd VeryPay
```

2. **Install dependencies**
```bash
# Frontend dependencies
cd frontend
npm install --legacy-peer-deps

# Backend dependencies  
cd ../backend
npm install

# Return to root
cd ..
```

3. **Setup environment variables**

**Frontend Environment** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your VeryChat API key and configuration
```

**Backend Environment** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your database and JWT configuration
```

4. **Initialize database**
```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Start development servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- VeryChat AI Assistant: Integrated in frontend

## Development Commands

```bash
# Install all dependencies
npm run install:all

# Start all development servers
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Database operations
npm run db:setup
npm run db:migrate
npm run db:reset

# Smart contract operations
npm run contracts:compile
npm run contracts:deploy:local
npm run contracts:deploy:testnet
npm run contracts:verify

# Linting and formatting
npm run lint
npm run format
```

## Environment Variables

### Backend Environment (`.env` in `/backend`)

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Authentication
JWT_SECRET="your-secure-jwt-secret-key"

# Server Configuration
PORT=3001
NODE_ENV=development

# Blockchain Configuration
PRIVATE_KEY="your-private-key"
INFURA_PROJECT_ID="your-infura-project-id"

# API Keys
PINATA_API_KEY="your-pinata-api-key"
PINATA_SECRET_KEY="your-pinata-secret-key"
```

### Frontend Environment (`.env` in `/frontend`)

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001
VITE_BACKEND_URL=http://localhost:3001

# Blockchain Configuration
VITE_CHAIN_ID=31337
VITE_CHAIN_NAME=Localhost
VITE_RPC_URL=http://127.0.0.1:8545

# Smart Contract Addresses (Update after deployment)
VITE_VPAY_TOKEN_ADDRESS=
VITE_VPAY_PAYMENTS_ADDRESS=
VITE_VPAY_ESCROW_ADDRESS=
VITE_VPAY_REWARDS_ADDRESS=

# App Configuration
VITE_APP_NAME=VPay
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DEBUG=true

# VeryChat AI Assistant Configuration
VITE_VERYCHAT_API_URL=https://api.verychat.ai/v1
VITE_VERYCHAT_API_KEY=your_verychat_api_key_here
```


#### **Cost-Effective Features**
- **Message Persistence**: Chat history saved to localStorage to avoid re-asking
- **Smart Caching**: Frequently asked questions cached locally
- **Fallback System**: Mock responses when API key is missing (development)
- **Rate Limiting**: Built-in request throttling to prevent API overuse

#### **VPay Context Enhancement**
```typescript
const enhanceWithVPayContext = (message: string) => {
  const context = `
    You are VeryChat AI assistant for VPay, a Web3 micro-economy platform.
    Current context: ${getCurrentPageContext()}
    User wallet: ${isWalletConnected() ? 'Connected' : 'Not connected'}
    Available features: Payments, Tasks, Rewards, Wallet, Profile
    
    User question: ${message}
  `;
  return context;
};
```

#### **Quick Suggestions System**
Pre-configured quick questions for common VPay tasks:
- "How do I connect my wallet?"
- "How to send a payment?"
- "What are VPay rewards?"
- "How to complete tasks?"
- "Wallet security tips"

#### **Mobile-Optimized Experience**
- **Responsive Design**: Full-screen chat on mobile devices
- **Touch Optimization**: Swipe gestures and touch-friendly interface
- **Minimize/Maximize**: Floating window that doesn't interfere with app usage

### VeryChat Integration Benefits

1. **Reduced Support Load**: AI handles 80%+ of common questions
2. **Improved UX**: Instant help without leaving the app
3. **Contextual Assistance**: Knows exactly what users are trying to do
4. **24/7 Availability**: Always-on support for global users
5. **Cost Efficient**: Streaming responses and smart caching minimize API costs

### Development vs Production

**Development Mode** (no API key):
- Uses mock responses for testing
- Full UI functionality without API costs
- Simulated streaming for development

**Production Mode** (with API key):
- Real VeryChat AI responses
- Streaming support for real-time interaction
- Full context awareness and personalization

## 📊 Workflow Diagrams

### User Onboarding Flow

```mermaid
flowchart TD
    A[User Visits VPay] --> B{First Time User?}
    B -->|Yes| C[Registration Form]
    B -->|No| D[Login Form]
    
    C --> E[4-Step Onboarding]
    E --> F[Step 1: Welcome]
    F --> G[Step 2: Connect Wallet]
    G --> H[Step 3: Verify Identity]
    H --> I[Step 4: Complete Profile]
    
    I --> J[Dashboard Access]
    D --> K{Valid Credentials?}
    K -->|Yes| J
    K -->|No| L[Error Message] --> D
    
    J --> M[VeryChat AI Greeting]
    M --> N[Platform Ready]
```

### Payment Processing Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant W as Wallet
    participant SC as Smart Contract
    participant AI as VeryChat AI
    
    U->>F: Initiate Payment
    F->>AI: Get Payment Assistance
    AI->>F: Provide Guidance
    F->>W: Request Wallet Connection
    W->>F: Wallet Connected
    F->>B: Validate Payment Details
    B->>F: Validation Success
    F->>SC: Execute Payment Transaction
    SC->>F: Transaction Hash
    F->>B: Update Payment Status
    B->>F: Real-time Notification
    F->>U: Payment Confirmation
    F->>AI: Log Successful Payment
```

### Task Marketplace Workflow

```mermaid
graph LR
    subgraph "Task Creation"
        A[User Posts Task] --> B[AI Validation]
        B --> C[Smart Contract Escrow]
        C --> D[Task Listed]
    end
    
    subgraph "Task Discovery"
        E[Browse Tasks] --> F[AI Recommendations]
        F --> G[Filter & Search]
        G --> H[Task Details]
    end
    
    subgraph "Task Completion"
        I[Apply for Task] --> J[Approval Process]
        J --> K[Work Submission]
        K --> L[Review & Approval]
        L --> M[Payment Release]
        M --> N[Reputation Update]
    end
    
    D --> E
    H --> I
    N --> O[VeryChat AI Feedback]
```

### Rewards & Gamification System

```mermaid
flowchart TB
    subgraph "Activity Tracking"
        A[User Actions] --> B[Login Streak]
        A --> C[Payment Activity]
        A --> D[Task Completion]
        A --> E[Social Engagement]
    end
    
    subgraph "Reward Engine"
        B --> F[Streak Rewards]
        C --> G[Payment Milestones]
        D --> H[Task Achievements]
        E --> I[Social Badges]
    end
    
    subgraph "AI Personalization"
        F --> J[VeryChat Analysis]
        G --> J
        H --> J
        I --> J
        J --> K[Personalized Rewards]
    end
    
    subgraph "Reward Distribution"
        K --> L[Points & Tokens]
        K --> M[NFT Badges]
        K --> N[Exclusive Access]
        K --> O[Cashback Offers]
    end
    
    L --> P[Leaderboard Update]
    M --> Q[SBT Minting]
    N --> R[Premium Features]
    O --> S[Wallet Credit]
```

### VeryChat AI Integration Flow

```mermaid
graph TD
    subgraph "User Interaction"
        A[User Opens Chat] --> B[VeryChat Widget]
        B --> C{New Conversation?}
        C -->|Yes| D[Load Quick Suggestions]
        C -->|No| E[Load Chat History]
    end
    
    subgraph "Context Enhancement"
        F[User Message] --> G[Detect Intent]
        G --> H[Add VPay Context]
        H --> I[Current Page Context]
        I --> J[Wallet Status]
        J --> K[User Activity History]
    end
    
    subgraph "AI Processing"
        K --> L{API Key Available?}
        L -->|Yes| M[VeryChat API Call]
        L -->|No| N[Mock Response]
        M --> O[Streaming Response]
        N --> P[Static Response]
    end
    
    subgraph "Response Delivery"
        O --> Q[Real-time Display]
        P --> Q
        Q --> R[Save to LocalStorage]
        R --> S[Update Chat History]
        S --> T[User Feedback Loop]
    end
    
    D --> F
    E --> F
    T --> F
```

### Smart Contract Interaction Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant W as Wallet
    participant SC as Smart Contracts
    participant B as Backend
    participant DB as Database
    
    F->>W: Connect Wallet
    W->>F: Wallet Address
    F->>SC: Check Contract State
    SC->>F: Current State
    
    alt Payment Transaction
        F->>W: Request Transaction Signature
        W->>F: Signed Transaction
        F->>SC: Execute Payment
        SC->>F: Transaction Receipt
        F->>B: Update Payment Status
        B->>DB: Store Transaction Data
    end
    
    alt Task Escrow
        F->>SC: Create Escrow
        SC->>F: Escrow Created
        F->>B: Update Task Status
        B->>DB: Store Escrow Data
    end
    
    alt Reward Distribution
        F->>SC: Claim Rewards
        SC->>F: Rewards Distributed
        F->>B: Update User Points
        B->>DB: Update Rewards Balance
    end
```

## Features

- 💰 **Instant Payments** - Send/receive crypto payments in chat
- 💼 **Micro-Jobs** - Post and complete small tasks for tokens
- 🏆 **Loyalty Rewards** - Earn points for platform engagement
- 👥 **Group Payments** - Split bills and group transactions
- 🤖 **AI Matching** - Smart task recommendations
- 🔐 **Secure Wallet** - Non-custodial wallet integration
- 📱 **Mobile Ready** - Responsive design for all devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
