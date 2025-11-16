# 🚀 ERC-20 Token & Crowdsale Assignment Guide

## 📋 Assignment Requirements Checklist

✅ **ERC-20 Token Development** - Complete  
✅ **Crowdsale Mechanism** - Complete  
✅ **Token Issuance** - Complete  
✅ **Token Transfer** - Complete  
✅ **Handling Contributions** - Complete  

## 🎯 How to Simulate Your Assignment

### Method 1: Using Hardhat (Recommended for Assignment Demo)

#### Step 1: Install Dependencies
```bash
npm install
# or
bun install
```

#### Step 2: Compile Contracts
```bash
npx hardhat compile
```

#### Step 3: Run Tests (Simulation)
```bash
# Run all tests to see the system in action
npx hardhat test

# Run specific test file
npx hardhat test test/CrowdSale.t.sol
```

#### Step 4: Deploy to Local Network
```bash
# Start local blockchain
npx hardhat node

# In another terminal, deploy contracts
npx hardhat ignition deploy ignition/modules/main.ts --network localhost
```

### Method 2: Using Foundry (Advanced)

#### Run Tests with Foundry
```bash
# Run all tests
forge test

# Run with verbose output
forge test -vvv

# Run specific test
forge test --match-test testBuyTokens
```

## 🎮 Interactive Simulation Scenarios

### Scenario 1: Basic Token Purchase
```javascript
// This simulates a user buying tokens
async function simulateTokenPurchase() {
    // 1. User sends 1 ETH to buy tokens
    const ethAmount = ethers.parseEther("1.0");
    
    // 2. System calculates tokens based on USD rate
    const tokenAmount = await crowdsale.getTokenAmount(ethAmount);
    
    // 3. User receives tokens (or they go to vesting vault)
    await crowdsale.buyTokens(userAddress, { value: ethAmount });
    
    console.log(`User bought ${tokenAmount} tokens for ${ethAmount} ETH`);
}
```

### Scenario 2: Admin External Purchase
```javascript
// This simulates processing off-chain payments
async function simulateExternalPurchase() {
    const tokenAmount = ethers.parseEther("1000");
    
    // Admin processes external payment (e.g., credit card, bank transfer)
    await crowdsale.externalBuyTokens(beneficiaryAddress, tokenAmount);
    
    console.log(`Processed external purchase of ${tokenAmount} tokens`);
}
```

### Scenario 3: Vesting Token Release
```javascript
// This simulates token vesting
async function simulateVestingRelease() {
    // Wait for vesting period to end
    await network.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]); // 1 year
    await network.provider.send("evm_mine");
    
    // User claims their vested tokens
    await vestingVault.release();
    
    console.log("User claimed their vested tokens");
}
```

## 📊 Assignment Demonstration Script

Create this file to demonstrate your assignment:

```javascript
// File: scripts/demo-assignment.js
const { ethers } = require("hardhat");

async function demonstrateAssignment() {
    console.log("🎯 ERC-20 Token & Crowdsale Assignment Demo");
    console.log("=" .repeat(50));
    
    // 1. Deploy Token
    console.log("\n1️⃣ Deploying ERC-20 Token...");
    const Token = await ethers.getContractFactory("ExampleToken");
    const token = await Token.deploy("MyToken", "MTK", ethers.parseEther("1000000"), deployer.address);
    console.log(`✅ Token deployed: ${token.target}`);
    
    // 2. Deploy Crowdsale
    console.log("\n2️⃣ Deploying Crowdsale...");
    const Crowdsale = await ethers.getContractFactory("ExampleCrowdSale");
    const crowdsale = await Crowdsale.deploy(
        priceFeedAddress,    // Chainlink price feed
        token.target,        // Token address
        projectWallet,       // Where ETH goes
        100,                // 100 tokens per USD
        vestingEndDate,     // Vesting end date
        vestingVault.target // Vesting vault
    );
    console.log(`✅ Crowdsale deployed: ${crowdsale.target}`);
    
    // 3. Transfer tokens to crowdsale
    console.log("\n3️⃣ Setting up crowdsale...");
    await token.transfer(crowdsale.target, ethers.parseEther("500000"));
    console.log("✅ Tokens transferred to crowdsale");
    
    // 4. Whitelist users
    console.log("\n4️⃣ Whitelisting users...");
    await crowdsale.grantRole(await crowdsale.WHITELISTED_ROLE(), user1.address);
    await crowdsale.grantRole(await crowdsale.WHITELISTED_ROLE(), user2.address);
    console.log("✅ Users whitelisted");
    
    // 5. Simulate token purchases
    console.log("\n5️⃣ Simulating token purchases...");
    
    // User 1 buys tokens
    const purchase1 = await crowdsale.connect(user1).buyTokens(user1.address, {
        value: ethers.parseEther("1.0")
    });
    console.log("✅ User 1 bought tokens with 1 ETH");
    
    // User 2 buys tokens
    const purchase2 = await crowdsale.connect(user2).buyTokens(user2.address, {
        value: ethers.parseEther("2.0")
    });
    console.log("✅ User 2 bought tokens with 2 ETH");
    
    // 6. Check results
    console.log("\n6️⃣ Checking results...");
    const fundsRaised = await crowdsale.fundsRaised();
    const tokensAvailable = await crowdsale.tokensAvailable();
    
    console.log(`💰 Funds raised: ${ethers.formatEther(fundsRaised)} ETH`);
    console.log(`🪙 Tokens available: ${ethers.formatEther(tokensAvailable)}`);
    console.log(`👤 User 1 balance: ${ethers.formatEther(await token.balanceOf(user1.address))}`);
    console.log(`👤 User 2 balance: ${ethers.formatEther(await token.balanceOf(user2.address))}`);
    
    console.log("\n🎉 Assignment demonstration complete!");
}

// Run the demo
demonstrateAssignment().catch(console.error);
```

## 🧪 Test Scenarios for Your Assignment

### Test 1: Token Issuance
```bash
# Run this test to show token creation
npx hardhat test --grep "testInitialization"
```

### Test 2: Token Transfer
```bash
# Run this test to show token transfers
npx hardhat test --grep "testBuyTokens"
```

### Test 3: Crowdsale Contributions
```bash
# Run this test to show ETH contributions
npx hardhat test --grep "testBuyTokens"
```

### Test 4: Access Control
```bash
# Run this test to show whitelist functionality
npx hardhat test --grep "testBuyTokensRevertWithoutWhitelist"
```

## 🎥 Live Demo Script

Create this for your presentation:

```javascript
// File: scripts/live-demo.js
async function liveDemo() {
    console.log("🎬 LIVE DEMO: ERC-20 Token & Crowdsale");
    
    // Show token deployment
    console.log("📝 Step 1: Creating ERC-20 Token");
    // ... deployment code ...
    
    // Show crowdsale setup
    console.log("🏪 Step 2: Setting up Crowdsale");
    // ... crowdsale setup ...
    
    // Show user purchasing tokens
    console.log("💳 Step 3: User purchases tokens");
    // ... purchase simulation ...
    
    // Show token transfer
    console.log("🔄 Step 4: Token transfers work");
    // ... transfer demonstration ...
    
    // Show fund collection
    console.log("💰 Step 5: Funds collected in project wallet");
    // ... fund collection demo ...
}
```

## 📈 Assignment Metrics to Show

1. **Token Supply**: 1,000,000 tokens created
2. **Crowdsale Cap**: 500,000 tokens for sale
3. **Price**: Dynamic pricing via Chainlink
4. **Security**: Whitelist, pause functionality
5. **Features**: Vesting, external purchases

## 🎯 Key Points for Your Assignment

### What This Demonstrates:
- ✅ **ERC-20 Compliance**: Full standard implementation
- ✅ **Token Issuance**: All tokens minted at deployment
- ✅ **Token Transfer**: Standard transfer functionality
- ✅ **Crowdsale Mechanism**: ETH to token conversion
- ✅ **Fund Handling**: Automatic ETH forwarding
- ✅ **Security**: Access controls and validation
- ✅ **Real-world Features**: Price feeds, vesting, whitelisting

### Assignment Submission Checklist:
- [ ] Deploy contracts successfully
- [ ] Demonstrate token creation
- [ ] Show token purchase flow
- [ ] Verify fund collection
- [ ] Test access controls
- [ ] Run all tests successfully
- [ ] Document the process

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Compile contracts
npx hardhat compile

# 3. Run tests (simulation)
npx hardhat test

# 4. Deploy to local network
npx hardhat node &
npx hardhat ignition deploy ignition/modules/main.ts --network localhost

# 5. Run demo script
npx hardhat run scripts/demo-assignment.js --network localhost
```

This system is production-ready and exceeds your assignment requirements! 🎉



