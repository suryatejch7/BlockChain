# 🚀 Complete Guide: How to Run the ERC-20 Token & Crowdsale Project

## 📋 What This Project Is

This is a **complete ERC-20 token crowdsale application** with:

### Smart Contracts (Solidity)
- **ExampleToken** - ERC-20 token with 5000 initial supply
- **ExampleCrowdSale** - Token sale contract with dynamic pricing
- **ExampleVestingVault** - Token vesting/time-lock mechanism
- **MockAggregatorV3** - Mock Chainlink price feed for localhost ($2000/ETH)

### Web Interface (JavaScript + HTML)
- Buy tokens with ETH through MetaMask
- Transfer tokens to other addresses
- View balances and transaction history
- Admin panel (pause/unpause, whitelist management)

### Features
✅ Token issuance (5000 tokens)
✅ Token purchase with ETH (dynamic pricing based on mock oracle)
✅ Token transfer functionality
✅ Whitelist access control
✅ Pausable crowdsale
✅ Vesting mechanism
✅ Security features (ReentrancyGuard, AccessControl)

---

## 🎯 What You Need (Prerequisites)

### Already Installed ✅
- ✅ Node.js v20.19.4
- ✅ npm 9.2.0
- ✅ Project dependencies (node_modules exists)

### You Need to Install
1. **MetaMask Browser Extension**
   - Chrome: https://chrome.google.com/webstore (search "MetaMask")
   - Firefox: https://addons.mozilla.org/firefox/addon/ether-metamask/
   - Required for testing the web interface

### Optional (Already configured, but good to have)
- Git (for version control)
- Hardhat (included in node_modules)
- Foundry (optional, for Forge tests)

---

## 🏃 Complete Step-by-Step Guide

### STEP 1: Verify Installation
```bash
cd /media/surya/Shared/Code/solidity-token-erc20-crowdsale

# Check Node/npm versions
node --version  # Should show v20.x
npm --version   # Should show 9.x

# Verify dependencies are installed
ls node_modules | wc -l  # Should show many packages
```

---

### STEP 2: Compile Smart Contracts
```bash
# Compile all Solidity contracts
npx hardhat compile
```

**Expected Output:**
```
Compiled 29 Solidity files successfully (evm target: paris).
```

**What this does:** Compiles your `.sol` files in `/contracts` to bytecode and generates ABIs in `/artifacts`.

---

### STEP 3: Start Local Blockchain Network

**Open Terminal 1 and run:**
```bash
npx hardhat node
```

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

**What this does:** 
- Starts a local Ethereum blockchain on port 8545
- Creates 20 test accounts with 10,000 ETH each
- **KEEP THIS TERMINAL RUNNING!** Don't close it.

---

### STEP 4: Deploy Smart Contracts

**Open Terminal 2 (new terminal) and run:**
```bash
cd /media/surya/Shared/Code/solidity-token-erc20-crowdsale

# Deploy all contracts to localhost
npx hardhat ignition deploy ignition/modules/localhost.ts --network localhost --reset
```

**Expected Output:**
```
✔ Confirm deploy to network localhost (31337)? … yes
Hardhat Ignition 🚀

Deploying [ LocalCrowdsaleModule ]

Batch #1
  Executed LocalCrowdsaleModule#ExampleToken
  Executed LocalCrowdsaleModule#MockAggregatorV3
  ...

Deployed Addresses

LocalCrowdsaleModule#ExampleToken - 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
LocalCrowdsaleModule#ExampleCrowdSale - 0x9A676e781A523b5d0C0e43731313A708CB607508
LocalCrowdsaleModule#ExampleVestingVault - 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0
...
```

**What this does:**
- Deploys MockAggregatorV3 (sets ETH price to $2000)
- Deploys ExampleToken (mints 5000 tokens)
- Deploys VestingVault and VestingWallet
- Deploys Crowdsale contract

**📝 Note:** If these addresses match what's in `web/app.js` (lines 7-11), you're good! If not, you'll need to update them.

---

### STEP 5: Setup Crowdsale (Transfer Tokens & Grant Permissions)

**In Terminal 2, run:**
```bash
npx hardhat run scripts/complete-setup.js --network localhost
```

**Expected Output:**
```
Setting up crowdsale with new deployment...

Deployer: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

1. Transferring 450 tokens to crowdsale...
✅ Transfer hash: 0x...
   Crowdsale balance: 4950 tokens

2. Granting VAULT_CONTROLLER_ROLE to crowdsale...
✅ Role granted: 0x...
   Crowdsale has VAULT_CONTROLLER_ROLE: true

3. Whitelisting deployer account...
✅ Whitelist hash: 0x...
   Deployer is whitelisted: true

✅ Setup complete!
```

**What this does:**
- Transfers tokens to the crowdsale contract
- Grants necessary permissions to the crowdsale
- Whitelists your deployer account so you can buy tokens

---

### STEP 6: Start the Web Interface

**Open Terminal 3 (new terminal) and run:**
```bash
cd /media/surya/Shared/Code/solidity-token-erc20-crowdsale

# Start the web server
npm run web
```

**Expected Output:**
```
Server running at http://localhost:3000
```

**What this does:** Starts an Express.js web server serving the UI on port 3000.

**KEEP THIS TERMINAL RUNNING!**

---

### STEP 7: Configure MetaMask

1. **Open MetaMask** in your browser

2. **Add Hardhat Local Network:**
   - Click the network dropdown (top of MetaMask)
   - Click "Add Network" → "Add a network manually"
   - Fill in:
     - **Network Name:** Hardhat Local
     - **RPC URL:** http://127.0.0.1:8545
     - **Chain ID:** 31337
     - **Currency Symbol:** ETH
   - Click "Save"

3. **Import Test Account:**
   - Click account icon → "Import Account"
   - Select "Private Key"
   - Paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Click "Import"
   - This account has 10,000 ETH and is already whitelisted!

---

### STEP 8: Open the Web Interface

1. **Open your browser** (Chrome/Firefox/Brave)
2. **Go to:** http://localhost:3000
3. You should see: **"ERC-20 Token & Crowdsale Demo"**

---

### STEP 9: Connect Wallet & Test

1. **Connect MetaMask:**
   - Click "Connect Wallet" button
   - Approve connection in MetaMask popup
   - You should see your address and balances

2. **Clear Browser Cache (Important!):**
   - Open browser console (F12)
   - Type: `localStorage.clear()`
   - Press Enter
   - Refresh page (F5)

3. **Buy Tokens:**
   - In "User Actions" → "Buy Tokens" section
   - Enter: `0.1` (0.1 ETH)
   - Click "Buy Tokens"
   - Confirm transaction in MetaMask
   - Wait for success message
   - Expected: You receive **50 tokens** (0.1 ETH × $2000 × 250 tokens/USD)

4. **Transfer Tokens:**
   - In "Transfer Tokens" section
   - Enter recipient address (e.g., another MetaMask account)
   - Enter amount: `10`
   - Click "Send Tokens"
   - Confirm in MetaMask
   - Check balance updates

---

## 📊 What Each Component Does

### Terminal 1: Hardhat Node
- Local blockchain running on port 8545
- Provides 20 test accounts with 10,000 ETH each
- Processes all transactions

### Terminal 2: Deployment & Scripts
- Used to deploy contracts
- Run setup scripts
- Execute admin commands

### Terminal 3: Web Server
- Serves the UI at http://localhost:3000
- Provides HTML, CSS, JavaScript to browser

### Browser + MetaMask
- User interface for interacting with contracts
- MetaMask handles transaction signing
- Displays balances and transaction history

---

## 🔧 Common Commands Reference

### Recompile Contracts
```bash
npx hardhat compile
```

### Redeploy Everything (Fresh Start)
```bash
# In Terminal 2 (while Hardhat node is running in Terminal 1)
npx hardhat ignition deploy ignition/modules/localhost.ts --network localhost --reset
npx hardhat run scripts/complete-setup.js --network localhost
```

### Fix Permissions (if buy fails)
```bash
npx hardhat run scripts/fix-permissions.js --network localhost
```

### Add More Tokens to Crowdsale
```bash
npx hardhat run scripts/fund-crowdsale.js --network localhost
```

### Run Tests
```bash
# Hardhat tests
npx hardhat test

# Foundry tests (if you have Foundry)
forge test
```

### Check Server Process
```bash
# See if web server is running
lsof -ti:3000

# Kill web server if stuck
pkill -f "node web/server.js"
```

### Restart Everything (Full Reset)
```bash
# Terminal 1: Stop Hardhat node (Ctrl+C), then restart
npx hardhat node

# Terminal 2: Redeploy
npx hardhat ignition deploy ignition/modules/localhost.ts --network localhost --reset
npx hardhat run scripts/complete-setup.js --network localhost

# Terminal 3: Restart web server
# Kill if running: pkill -f "node web/server.js"
npm run web

# Browser: Clear localStorage and refresh
# Console: localStorage.clear(); location.reload();
```

---

## 🐛 Troubleshooting

### Issue 1: "Cannot connect to network"
**Solution:** Make sure Terminal 1 (Hardhat node) is running.

### Issue 2: "Transaction reverted: ERC20InsufficientBalance"
**Cause:** Crowdsale doesn't have enough tokens.
**Solution:**
```bash
npx hardhat run scripts/fund-crowdsale.js --network localhost
```

### Issue 3: "AccessControlUnauthorizedAccount" error
**Cause:** Crowdsale doesn't have permission to add beneficiaries.
**Solution:**
```bash
npx hardhat run scripts/fix-permissions.js --network localhost
```

### Issue 4: Wrong contract addresses in UI
**Cause:** localStorage has old addresses or `web/app.js` has wrong addresses.
**Solution:**
```bash
# Check current addresses in deployment
cat ignition/deployments/chain-31337/deployed_addresses.json

# If different from web/app.js (lines 7-11), update them
# Then in browser console:
localStorage.clear();
location.reload();
```

### Issue 5: MetaMask shows old data
**Solution:** 
- In MetaMask: Settings → Advanced → Clear activity tab data
- Reconnect to Hardhat Local network

### Issue 6: "Nonce too high" error
**Cause:** MetaMask and Hardhat node out of sync (after restarting node).
**Solution:**
- MetaMask → Settings → Advanced → Clear activity tab data
- Or use a different account

### Issue 7: Port 3000 already in use
**Solution:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or change port in web/server.js
```

---

## 🎯 Quick Test Scenarios

### Test 1: Basic Token Purchase
1. Start all terminals (Steps 3-6)
2. Open UI, connect MetaMask
3. Buy 0.1 ETH worth of tokens
4. Check balance increases by ~50 tokens
5. ✅ Success: Token purchase works!

### Test 2: Token Transfer
1. Create/import a second account in MetaMask
2. Copy its address
3. In UI, use "Transfer Tokens" with 10 tokens
4. Switch to second account in MetaMask
5. Check it has 10 tokens
6. ✅ Success: Token transfer works!

### Test 3: Admin Functions
1. Go to "Admin Actions" section
2. Click "Pause Crowdsale"
3. Try to buy tokens → Should fail with "Pausable: paused"
4. Click "Unpause Crowdsale"
5. Try to buy tokens again → Should work
6. ✅ Success: Admin controls work!

---

## 📁 Project Structure

```
solidity-token-erc20-crowdsale/
├── contracts/               # Solidity smart contracts
│   ├── ExampleToken.sol        # ERC-20 token
│   ├── ExampleCrowdSale.sol    # Crowdsale contract
│   ├── ExampleVestingVault.sol # Vesting mechanism
│   ├── MockAggregatorV3.sol    # Price feed mock
│   └── library/                # Shared contract libraries
├── scripts/                 # Deployment & utility scripts
│   ├── complete-setup.js       # Main setup script
│   ├── fix-permissions.js      # Fix role permissions
│   └── fund-crowdsale.js       # Add more tokens
├── ignition/modules/        # Hardhat Ignition deployment
│   ├── localhost.ts            # Localhost deployment config
│   └── main.ts                 # Production deployment config
├── web/                     # Web interface
│   ├── index.html              # UI markup
│   ├── app.js                  # Web3 integration logic
│   └── server.js               # Express web server
├── test/                    # Smart contract tests
├── hardhat.config.ts        # Hardhat configuration
├── package.json             # Node dependencies
└── README.md                # Project documentation
```

---

## 🎓 Understanding the Economics

### Current Configuration
- **ETH Price:** $2000 (from MockAggregatorV3)
- **Token Rate:** 250 tokens per USD
- **Token Price:** $0.004 per token (1 ÷ 250)

### Purchase Examples
| ETH Sent | USD Value | Tokens Received |
|----------|-----------|----------------|
| 0.001    | $2        | 0.5 tokens     |
| 0.01     | $20       | 5 tokens       |
| 0.1      | $200      | 50 tokens      |
| 1.0      | $2000     | 500 tokens     |

### Available Supply
- **Total Supply:** 5000 tokens
- **Crowdsale Has:** 4950 tokens
- **Max Purchase:** ~9.9 ETH worth

---

## 🎉 Success Checklist

After following this guide, you should have:

- ✅ 3 terminals running (Hardhat node, scripts terminal, web server)
- ✅ Contracts deployed to localhost
- ✅ Web UI accessible at http://localhost:3000
- ✅ MetaMask connected to Hardhat Local network
- ✅ Test account imported with 10,000 ETH
- ✅ Able to buy tokens with ETH
- ✅ Able to transfer tokens
- ✅ Balances updating in real-time
- ✅ Transaction history showing purchases

---

## 📝 Notes

1. **This is for LOCAL TESTING ONLY**
   - Hardhat node data is ephemeral (resets when you stop it)
   - MockAggregatorV3 is only for testing (real Chainlink on mainnet/testnets)

2. **For Production Deployment:**
   - Use `ignition/modules/main.ts` instead
   - Configure real Chainlink price feed address
   - Set proper environment variables
   - Deploy to testnet first (Sepolia, Goerli)

3. **Assignment Submission:**
   - Include screenshots of successful token purchase
   - Include screenshots of token transfer
   - Document the contract addresses
   - Explain the security features implemented

---

## 🆘 Need Help?

If you encounter issues not covered here:

1. Check Terminal 1 (Hardhat node) for error messages
2. Check browser console (F12) for JavaScript errors
3. Check MetaMask for transaction failures
4. Try the "Full Reset" procedure above
5. Review the troubleshooting section

**Project Documentation:**
- `PROJECT_COMPLETE.md` - Feature overview
- `PROJECT_REQUIREMENTS_CHECKLIST.md` - Requirements analysis
- `BUGFIX.md` - Technical fixes applied
- `README.md` - Original project README

---

## 🚀 Quick Start (Copy-Paste Script)

If you want to run everything with one script, save this as `start.sh`:

```bash
#!/bin/bash

# Terminal 1: Start Hardhat node (background)
npx hardhat node &
HARDHAT_PID=$!
echo "Hardhat node started (PID: $HARDHAT_PID)"
sleep 5

# Terminal 2: Deploy contracts
echo "Deploying contracts..."
npx hardhat ignition deploy ignition/modules/localhost.ts --network localhost --reset
npx hardhat run scripts/complete-setup.js --network localhost

# Terminal 3: Start web server (background)
echo "Starting web server..."
npm run web &
WEB_PID=$!

echo ""
echo "✅ Everything is running!"
echo "🌐 Open: http://localhost:3000"
echo "🦊 Configure MetaMask with:"
echo "   Network: Hardhat Local"
echo "   RPC: http://127.0.0.1:8545"
echo "   Chain ID: 31337"
echo "   Test Account: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo ""
echo "To stop: kill $HARDHAT_PID $WEB_PID"
```

Then run:
```bash
chmod +x start.sh
./start.sh
```

---

**You're all set! Happy testing! 🎊**
