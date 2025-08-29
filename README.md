# VPay - Web3 Micro-Economy Platform

A comprehensive Web3 micro-economy layer for Verychat, enabling instant payments, micro-jobs marketplace, and loyalty rewards.

## Tech Stack

### Frontend
- **React 18** with **Vite** for fast development
- **TailwindCSS** for styling
- **shadcn/ui** for component library
- **React Router** for navigation
- **React Context** for state management
- **ethers.js** for Web3 wallet integration

### Backend
- **Node.js** with **Express.js**
- **Prisma ORM** with SQLite (development)
- **JWT** authentication
- **Socket.io** for real-time features
- **Multer** for file uploads

### Smart Contracts
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

1. Clone the repository
```bash
git clone <repository-url>
cd vpay
```

2. Install dependencies
```bash
npm run install:all
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize database
```bash
npm run db:setup
```

5. Deploy smart contracts (local)
```bash
npm run contracts:deploy:local
```

6. Start development servers
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Hardhat node: http://localhost:8545

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

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-jwt-secret"

# Blockchain
PRIVATE_KEY="your-private-key"
INFURA_PROJECT_ID="your-infura-project-id"

# API Keys
PINATA_API_KEY="your-pinata-api-key"
PINATA_SECRET_KEY="your-pinata-secret-key"
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
