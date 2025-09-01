const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();
const { txLogger, kycCheck, rateLimiter } = require('./middleware/security');

// Import AI Rewards routes
const aiRewardsRoutes = require('./routes/aiRewards');
// Import DID routes
const didRoutes = require('./routes/did');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
// Security middlewares
app.use(txLogger); // log all requests
app.use('/api', rateLimiter, kycCheck); // rate limit + mock KYC on API routes

// Ethers.js setup for contract interaction
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

// Contract addresses (update these after deployment)
const CONTRACT_ADDRESSES = {
  VPayPayments: process.env.VPAY_PAYMENTS_ADDRESS || '',
  VPayEscrow: process.env.VPAY_ESCROW_ADDRESS || '',
  VPayRewards: process.env.VPAY_REWARDS_ADDRESS || ''
};

// Contract ABIs (simplified for demo)
const PAYMENT_ABI = [
  "function deposit() external payable",
  "function transfer(address to, uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function balances(address user) external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 amount, uint256 fee)"
];

const ESCROW_ABI = [
  "function createEscrow(address buyer, address seller, uint256 amount, string memory description) external returns (uint256)",
  "function completeEscrow(uint256 escrowId) external",
  "function getEscrow(uint256 escrowId) external view returns (tuple(address buyer, address seller, uint256 amount, string description, uint8 status))",
  "event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount)"
];

const REWARDS_ABI = [
  "function awardPoints(address user, uint256 points) external",
  "function redeemReward(uint256 rewardId) external",
  "function getUserPoints(address user) external view returns (uint256)",
  "function createReward(string memory name, string memory description, uint256 pointsCost, uint256 tokenReward, uint256 stock, uint256 tierRequired) external",
  "event PointsAwarded(address indexed user, uint256 points)",
  "event RewardRedeemed(address indexed user, uint256 rewardId, uint256 pointsCost)"
];

// Contract instances
let paymentsContract, escrowContract, rewardsContract;

// Initialize contracts
async function initializeContracts() {
  try {
    if (CONTRACT_ADDRESSES.VPayPayments) {
      paymentsContract = new ethers.Contract(CONTRACT_ADDRESSES.VPayPayments, PAYMENT_ABI, wallet);
    }
    if (CONTRACT_ADDRESSES.VPayEscrow) {
      escrowContract = new ethers.Contract(CONTRACT_ADDRESSES.VPayEscrow, ESCROW_ABI, wallet);
    }
    if (CONTRACT_ADDRESSES.VPayRewards) {
      rewardsContract = new ethers.Contract(CONTRACT_ADDRESSES.VPayRewards, REWARDS_ABI, wallet);
    }
    console.log('✅ Smart contracts initialized');
  } catch (error) {
    console.error('❌ Error initializing contracts:', error.message);
  }
}

// In-memory storage for demo (use database in production)
let users = [];
let tasks = [];
let rewards = [
  { id: 1, name: 'Welcome Bonus', description: 'Get 100 points for joining', pointsCost: 0, tokenReward: 100, stock: 1000 },
  { id: 2, name: 'Task Master', description: 'Complete 5 tasks', pointsCost: 500, tokenReward: 50, stock: 100 },
  { id: 3, name: 'Premium Access', description: '30 days premium features', pointsCost: 1000, tokenReward: 0, stock: 50 }
];

// =============================================================================
// API ROUTES
// =============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    contracts: {
      payments: !!paymentsContract,
      escrow: !!escrowContract,
      rewards: !!rewardsContract
    }
  });
});

// =============================================================================
// /api/users - Onboarding placeholder
// =============================================================================

app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    users: users.map(u => ({ id: u.id, address: u.address, username: u.username, points: u.points }))
  });
});

app.post('/api/users/onboard', async (req, res) => {
  try {
    const { address, username } = req.body;
    
    if (!address || !username) {
      return res.status(400).json({ error: 'Address and username required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.address.toLowerCase() === address.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
      id: users.length + 1,
      address: address.toLowerCase(),
      username,
      points: 0,
      tasksCompleted: 0,
      joinedAt: new Date().toISOString()
    };

    users.push(newUser);

    // Award welcome bonus points via smart contract
    if (rewardsContract) {
      try {
        const tx = await rewardsContract.awardPoints(address, 100);
        await tx.wait();
        newUser.points = 100;
        console.log(`✅ Awarded 100 welcome points to ${username}`);
      } catch (error) {
        console.error('❌ Error awarding welcome points:', error.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'User onboarded successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get latest points from smart contract
    if (rewardsContract) {
      try {
        const points = await rewardsContract.getUserPoints(address);
        user.points = parseInt(points.toString());
      } catch (error) {
        console.error('❌ Error fetching user points:', error.message);
      }
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// /api/tasks - Create, fetch, complete tasks
// =============================================================================

app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    tasks: tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      reward: t.reward,
      status: t.status,
      creator: t.creator,
      assignee: t.assignee,
      createdAt: t.createdAt
    }))
  });
});

app.post('/api/tasks/create', async (req, res) => {
  try {
    const { title, description, reward, creator } = req.body;
    
    if (!title || !description || !reward || !creator) {
      return res.status(400).json({ error: 'Title, description, reward, and creator required' });
    }

    const newTask = {
      id: tasks.length + 1,
      title,
      description,
      reward: parseFloat(reward),
      status: 'open',
      creator,
      assignee: null,
      escrowId: null,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    // Create escrow for task payment
    if (escrowContract) {
      try {
        const rewardWei = ethers.parseEther(reward.toString());
        const tx = await escrowContract.createEscrow(
          ethers.ZeroAddress, // Buyer (will be set when task is assigned)
          creator,
          rewardWei,
          `Task: ${title}`
        );
        const receipt = await tx.wait();
        
        // Extract escrow ID from event logs
        const escrowCreatedEvent = receipt.logs.find(log => 
          log.topics[0] === ethers.id("EscrowCreated(uint256,address,address,uint256)")
        );
        
        if (escrowCreatedEvent) {
          newTask.escrowId = parseInt(escrowCreatedEvent.topics[1]);
          console.log(`✅ Created escrow ${newTask.escrowId} for task ${newTask.id}`);
        }
      } catch (error) {
        console.error('❌ Error creating escrow:', error.message);
      }
    }

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignee } = req.body;
    
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status !== 'open') {
      return res.status(400).json({ error: 'Task is not available for assignment' });
    }

    task.assignee = assignee;
    task.status = 'in_progress';

    res.json({
      success: true,
      message: 'Task assigned successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status !== 'in_progress') {
      return res.status(400).json({ error: 'Task is not in progress' });
    }

    // Complete escrow to release payment
    if (escrowContract && task.escrowId) {
      try {
        const tx = await escrowContract.completeEscrow(task.escrowId);
        await tx.wait();
        console.log(`✅ Completed escrow ${task.escrowId} for task ${task.id}`);
      } catch (error) {
        console.error('❌ Error completing escrow:', error.message);
      }
    }

    // Award completion points
    if (rewardsContract && task.assignee) {
      try {
        const completionPoints = Math.floor(task.reward * 10); // 10 points per token
        const tx = await rewardsContract.awardPoints(task.assignee, completionPoints);
        await tx.wait();
        
        // Update user points
        const user = users.find(u => u.address.toLowerCase() === task.assignee.toLowerCase());
        if (user) {
          user.points += completionPoints;
          user.tasksCompleted += 1;
        }
        
        console.log(`✅ Awarded ${completionPoints} points to ${task.assignee}`);
      } catch (error) {
        console.error('❌ Error awarding completion points:', error.message);
      }
    }

    task.status = 'completed';
    task.completedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Task completed successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// /api/rewards - Earn, redeem points
// =============================================================================

app.get('/api/rewards', (req, res) => {
  res.json({
    success: true,
    rewards
  });
});

// Leaderboard - top 10 users by points
app.get('/api/rewards/leaderboard', (req, res) => {
  try {
    const top = [...users]
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 10)
      .map((u, idx) => ({
        rank: idx + 1,
        address: u.address,
        username: u.username,
        points: u.points || 0,
        tasksCompleted: u.tasksCompleted || 0,
      }));
    res.json({ success: true, leaderboard: top });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/rewards/earn', async (req, res) => {
  try {
    const { address, points, reason } = req.body;
    
    if (!address || !points) {
      return res.status(400).json({ error: 'Address and points required' });
    }

    // Award points via smart contract
    if (rewardsContract) {
      try {
        const tx = await rewardsContract.awardPoints(address, points);
        await tx.wait();
        
        // Update local user data
        const user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
        if (user) {
          user.points += parseInt(points);
        }
        
        console.log(`✅ Awarded ${points} points to ${address} for: ${reason || 'Manual award'}`);
        
        res.json({
          success: true,
          message: `Awarded ${points} points successfully`,
          reason: reason || 'Manual award'
        });
      } catch (error) {
        console.error('❌ Error awarding points:', error.message);
        res.status(500).json({ error: 'Failed to award points on blockchain' });
      }
    } else {
      // Fallback to local storage if contract not available
      const user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
      if (user) {
        user.points += parseInt(points);
        res.json({
          success: true,
          message: `Awarded ${points} points successfully (local)`,
          reason: reason || 'Manual award'
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/rewards/:id/redeem', async (req, res) => {
  try {
    const { id } = req.params;
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address required' });
    }

    const reward = rewards.find(r => r.id === parseInt(id));
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    const user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get current points from smart contract
    let currentPoints = user.points;
    if (rewardsContract) {
      try {
        const points = await rewardsContract.getUserPoints(address);
        currentPoints = parseInt(points.toString());
      } catch (error) {
        console.error('❌ Error fetching user points:', error.message);
      }
    }

    if (currentPoints < reward.pointsCost) {
      return res.status(400).json({ 
        error: 'Insufficient points',
        required: reward.pointsCost,
        current: currentPoints
      });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ error: 'Reward out of stock' });
    }

    // Redeem via smart contract
    if (rewardsContract) {
      try {
        const tx = await rewardsContract.redeemReward(reward.id);
        await tx.wait();
        console.log(`✅ Redeemed reward ${reward.id} for ${address}`);
      } catch (error) {
        console.error('❌ Error redeeming reward:', error.message);
        return res.status(500).json({ error: 'Failed to redeem reward on blockchain' });
      }
    }

    // Update local data
    user.points -= reward.pointsCost;
    reward.stock -= 1;

    res.json({
      success: true,
      message: `Successfully redeemed ${reward.name}`,
      reward,
      remainingPoints: user.points
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/rewards/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    let points = 0;
    if (rewardsContract) {
      try {
        const userPoints = await rewardsContract.getUserPoints(address);
        points = parseInt(userPoints.toString());
      } catch (error) {
        console.error('❌ Error fetching user points:', error.message);
        // Fallback to local data
        const user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
        points = user ? user.points : 0;
      }
    } else {
      const user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
      points = user ? user.points : 0;
    }

    res.json({
      success: true,
      address,
      points,
      availableRewards: rewards.filter(r => r.pointsCost <= points && r.stock > 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Rewards Routes
app.use('/api/rewards', aiRewardsRoutes);

// DID Routes
app.use('/api/did', didRoutes);

// =============================================================================
// SERVER STARTUP
// =============================================================================

app.listen(PORT, async () => {
  console.log(`🚀 VPay Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  
  // Initialize smart contracts
  await initializeContracts();
  
  console.log('\n📋 Available Routes:');
  console.log('GET  /api/health - Health check');
  console.log('GET  /api/users - List users');
  console.log('POST /api/users/onboard - Onboard new user');
  console.log('GET  /api/users/:address - Get user details');
  console.log('GET  /api/tasks - List tasks');
  console.log('POST /api/tasks/create - Create new task');
  console.log('POST /api/tasks/:id/assign - Assign task');
  console.log('POST /api/tasks/:id/complete - Complete task');
  console.log('GET  /api/rewards - List rewards');
  console.log('POST /api/rewards/earn - Award points');
  console.log('POST /api/rewards/:id/redeem - Redeem reward');
  console.log('GET  /api/rewards/user/:address - Get user rewards');
  console.log('GET  /api/rewards/recommend - Get AI recommendations');
  console.log('POST /api/rewards/recommend/:id/claim - Claim AI recommendation');
  console.log('GET  /api/rewards/analytics - Get user analytics');
  console.log('GET  /api/rewards/redemption/history - Get redemption history');
  console.log('POST /api/rewards/nft/mint - Mint reward NFT');
  console.log('POST /api/rewards/tokens/transfer - Transfer bonus tokens');
});

module.exports = app;
