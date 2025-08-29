const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting VPay contracts deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  // Deploy VPayToken
  console.log("\n📄 Deploying VPayToken...");
  const VPayToken = await ethers.getContractFactory("VPayToken");
  const vrcToken = await VPayToken.deploy(deployer.address);
  await vrcToken.waitForDeployment();
  const vrcTokenAddress = await vrcToken.getAddress();
  console.log("✅ VPayToken deployed to:", vrcTokenAddress);
  
  // Deploy VPayEscrow
  console.log("\n📄 Deploying VPayEscrow...");
  const VPayEscrow = await ethers.getContractFactory("VPayEscrow");
  const escrow = await VPayEscrow.deploy(
    vrcTokenAddress,
    deployer.address, // Fee recipient
    deployer.address  // Initial owner
  );
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("✅ VPayEscrow deployed to:", escrowAddress);
  
  // Deploy VPayRewards
  console.log("\n📄 Deploying VPayRewards...");
  const VPayRewards = await ethers.getContractFactory("VPayRewards");
  const rewards = await VPayRewards.deploy(vrcTokenAddress, deployer.address);
  await rewards.waitForDeployment();
  const rewardsAddress = await rewards.getAddress();
  console.log("✅ VPayRewards deployed to:", rewardsAddress);
  
  // Setup initial configuration
  console.log("\n⚙️ Setting up initial configuration...");
  
  // Add escrow and rewards as minters for VRC token
  console.log("🔧 Adding minters to VPayToken...");
  await vrcToken.addMinter(escrowAddress, ethers.parseEther("10000")); // 10k daily limit
  await vrcToken.addMinter(rewardsAddress, ethers.parseEther("5000")); // 5k daily limit
  console.log("✅ Minters added successfully");
  
  // Add deployer as arbiter in escrow
  console.log("🔧 Adding arbiter to VPayEscrow...");
  await escrow.addArbiter(deployer.address);
  console.log("✅ Arbiter added successfully");
  
  // Add deployer as points manager in rewards
  console.log("🔧 Adding points manager to VPayRewards...");
  await rewards.addPointsManager(deployer.address);
  console.log("✅ Points manager added successfully");
  
  // Create some initial rewards
  console.log("🔧 Creating initial rewards...");
  await rewards.createReward(
    "Welcome Bonus",
    "Get 100 VRC for joining VPay",
    100, // 100 points
    ethers.parseEther("100"), // 100 VRC
    1000, // Stock
    0 // Bronze tier
  );
  
  await rewards.createReward(
    "Premium Features",
    "Unlock premium VPay features",
    500, // 500 points
    0, // No tokens
    0, // Unlimited
    2 // Gold tier
  );
  console.log("✅ Initial rewards created");
  
  // Fund rewards contract with tokens for rewards
  console.log("🔧 Funding rewards contract...");
  await vrcToken.transfer(rewardsAddress, ethers.parseEther("100000")); // 100k VRC
  console.log("✅ Rewards contract funded");
  
  // Save deployment addresses
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      VPayToken: vrcTokenAddress,
      VPayEscrow: escrowAddress,
      VPayRewards: rewardsAddress
    },
    deployedAt: new Date().toISOString()
  };
  
  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log(`Network: ${deploymentInfo.network} (${deploymentInfo.chainId})`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`VPayToken: ${vrcTokenAddress}`);
  console.log(`VPayEscrow: ${escrowAddress}`);
  console.log(`VPayRewards: ${rewardsAddress}`);
  console.log("========================");
  
  // Save to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${deploymentInfo.network}-${deploymentInfo.chainId}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
  console.log("\n🎉 VPay contracts deployed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
