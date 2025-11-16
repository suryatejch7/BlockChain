# 🚀 Deployment Guide for Your Assignment

## 📋 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
# Install all required packages
npm install
# or
bun install
```

### Step 2: Compile Contracts
```bash
npx hardhat compile
```

### Step 3: Run Tests (Simulation)
```bash
# Run all tests to verify everything works
npx hardhat test

# Run specific test file
npx hardhat test test/CrowdSale.t.sol
```

### Step 4: Run Demo Script
```bash
# Run the comprehensive demo
npx hardhat run scripts/assignment-demo.js

# Or run the quick test
npx hardhat run scripts/quick-test.js
```

## 🎯 Assignment Demonstration Methods

### Method 1: Using Hardhat Tests (Recommended)
```bash
# This runs the existing test suite
npx hardhat test

# Run with verbose output
npx hardhat test --verbose

# Run specific test
npx hardhat test --grep "testBuyTokens"
```

### Method 2: Using Demo Scripts
```bash
# Full demonstration
npx hardhat run scripts/assignment-demo.js

# Quick test
npx hardhat run scripts/quick-test.js
```

### Method 3: Deploy to Local Network
```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat ignition deploy ignition/modules/main.ts --network localhost
```

## 🧪 Test Scenarios for Your Assignment

### Scenario 1: Basic Functionality
```bash
# Test token creation and transfer
npx hardhat test --grep "testInitialization"
npx hardhat test --grep "testTokensAvailable"
```

### Scenario 2: Crowdsale Purchases
```bash
# Test token purchases
npx hardhat test --grep "testBuyTokens"
npx hardhat test --grep "testExternalBuyTokens"
```

### Scenario 3: Access Control
```bash
# Test whitelist functionality
npx hardhat test --grep "testBuyTokensRevertWithoutWhitelist"
npx hardhat test --grep "testExternalBuyTokensRevertWithoutAdmin"
```

### Scenario 4: Admin Functions
```bash
# Test pause/unpause
npx hardhat test --grep "testPause"
npx hardhat test --grep "testUnpause"
npx hardhat test --grep "testBuyTokensWhilePaused"
```

## 📊 What Each Test Demonstrates

### `testInitialization`
- ✅ **Token Deployment**: Shows ERC-20 token creation
- ✅ **Crowdsale Setup**: Demonstrates crowdsale initialization
- ✅ **Fund Tracking**: Shows funds raised tracking

### `testBuyTokens`
- ✅ **Token Purchase**: User buys tokens with ETH
- ✅ **Price Calculation**: Dynamic pricing via price feed
- ✅ **Fund Collection**: ETH forwarded to project wallet
- ✅ **Token Delivery**: Tokens sent to user or vesting vault

### `testBuyTokensRevertWithoutWhitelist`
- ✅ **Access Control**: Only whitelisted users can buy
- ✅ **Security**: Prevents unauthorized purchases

### `testPause` / `testUnpause`
- ✅ **Admin Control**: Owner can pause/unpause crowdsale
- ✅ **Emergency Stop**: Can halt operations if needed

### `testExternalBuyTokens`
- ✅ **Off-chain Payments**: Process credit card, bank transfers
- ✅ **Admin Functions**: Owner can process external purchases

## 🎥 Live Demo Script

Create this file for your presentation:

```javascript
// File: scripts/live-demo.js
const { ethers } = require("hardhat");

async function liveDemo() {
    console.log("🎬 LIVE DEMO: ERC-20 Token & Crowdsale");
    console.log("=" .repeat(50));
    
    // Step 1: Deploy Token
    console.log("\n📝 Step 1: Creating ERC-20 Token");
    const Token = await ethers.getContractFactory("ExampleToken");
    const token = await Token.deploy("DemoToken", "DEMO", ethers.parseEther("1000000"), deployer.address);
    console.log(`✅ Token deployed: ${token.target}`);
    
    // Step 2: Deploy Crowdsale
    console.log("\n🏪 Step 2: Setting up Crowdsale");
    // ... crowdsale deployment code ...
    
    // Step 3: User Purchase
    console.log("\n💳 Step 3: User purchases tokens");
    // ... purchase simulation ...
    
    // Step 4: Show Results
    console.log("\n📊 Step 4: Results");
    // ... show balances and funds raised ...
}

liveDemo().catch(console.error);
```

## 🎯 Assignment Checklist

### ✅ Requirements Met:
- [ ] **ERC-20 Token**: Deployed and functional
- [ ] **Token Issuance**: All tokens minted at deployment
- [ ] **Token Transfer**: Standard transfers working
- [ ] **Crowdsale Mechanism**: ETH to token conversion
- [ ] **Fund Handling**: ETH collected in project wallet
- [ ] **Access Control**: Whitelist system working
- [ ] **Admin Functions**: Pause/unpause functionality
- [ ] **Testing**: All tests passing

### 🎓 Assignment Submission:
1. **Code**: All contracts deployed successfully
2. **Demo**: Run `npx hardhat test` to show functionality
3. **Documentation**: Explain the system architecture
4. **Features**: Highlight advanced features (vesting, price feeds)

## 🚀 Quick Commands for Assignment

```bash
# 1. Setup
npm install
npx hardhat compile

# 2. Test everything
npx hardhat test

# 3. Run demo
npx hardhat run scripts/assignment-demo.js

# 4. Deploy to local network
npx hardhat node &
npx hardhat ignition deploy ignition/modules/main.ts --network localhost
```

## 📈 Assignment Metrics

- **Token Supply**: 1,000,000 tokens
- **Crowdsale Cap**: 500,000 tokens for sale
- **Price**: Dynamic (100 tokens per USD)
- **Security**: Whitelist + pause functionality
- **Features**: Vesting, external purchases, price feeds

## 🎉 Success Criteria

Your assignment will be successful if you can demonstrate:
1. ✅ Token deployment and functionality
2. ✅ Crowdsale purchases working
3. ✅ Access control preventing unauthorized purchases
4. ✅ Admin functions (pause/unpause) working
5. ✅ Fund collection to project wallet
6. ✅ All tests passing

This system exceeds your assignment requirements and provides a production-ready implementation! 🚀



