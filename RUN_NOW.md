# ✅ CORRECT PROCESS FOR YOUR SITUATION - RUN NOW

## 🎯 Your Current State

✅ **Deployment cache**: Restored from commit 805a904  
✅ **Frontend addresses**: Already configured correctly  
✅ **Contract addresses**: Match commit 805a904  
❌ **Hardhat node**: NOT running  
❌ **Web server**: NOT running  

## 🚀 STEP-BY-STEP PROCESS (Follow This Exactly)

### **TERMINAL 1: Start Hardhat Node**

```bash
cd /media/surya/Shared/Code/solidity-token-erc20-crowdsale
npx hardhat node
```

**✅ Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**⚠️ IMPORTANT:** 
- **LEAVE THIS TERMINAL RUNNING!** Don't close it.
- This account (0xf39F...) will be used for everything

---

### **TERMINAL 2: Deploy Contracts (Use Existing Cache)**

**Open a NEW terminal and run:**

```bash
cd /media/surya/Shared/Code/solidity-token-erc20-crowdsale

# Deploy using the cached deployment from commit 805a904
npx hardhat ignition deploy ignition/modules/localhost.ts --network localhost
```

**✅ Expected Output:**
```
✔ Confirm deploy to network localhost (31337)? … yes

Hardhat Ignition 🚀

Deploying [ LocalCrowdsaleModule ]

Batch #1
  Executed LocalCrowdsaleModule#MockAggregatorV3
  Executed LocalCrowdsaleModule#ExampleToken
  ...

✅ LocalCrowdsaleModule#ExampleToken deployed to: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
✅ LocalCrowdsaleModule#ExampleCrowdSale deployed to: 0x9A676e781A523b5d0C0e43731313A708CB607508
✅ LocalCrowdsaleModule#ExampleVestingVault deployed to: 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0
```

**🎯 CRITICAL CHECK:**
The addresses **MUST** match these exact values:
- Token: `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318`
- Crowdsale: `0x9A676e781A523b5d0C0e43731313A708CB607508`
- VestingVault: `0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0`

**❌ If addresses are DIFFERENT:**
```bash
# Something went wrong - the deployment cache didn't work
# You need to either:
# 1. Update frontend addresses to match new deployment, OR
# 2. Figure out why addresses changed (deployment script changed?)
```

**✅ If addresses MATCH:** Continue to next step!

---

### **TERMINAL 2: Grant Admin Role**

**In the SAME Terminal 2, run:**

```bash
npx hardhat run scripts/grant-admin-role.js --network localhost 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**✅ Expected Output:**
```
Granting DEFAULT_ADMIN_ROLE to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266...
✅ Admin role granted successfully!
```

**What this does:** Makes Account #0 (your MetaMask account) an admin so you can pause/unpause the crowdsale.

---

### **TERMINAL 3: Start Web Server**

**Open a NEW terminal (Terminal 3) and run:**

```bash
cd /media/surya/Shared/Code/solidity-token-erc20-crowdsale
node web/server.js
```

**✅ Expected Output:**
```
Server running at http://localhost:3000
```

**⚠️ IMPORTANT:** 
- **LEAVE THIS TERMINAL RUNNING!** Don't close it.
- Web interface is now accessible

---

### **BROWSER: Setup MetaMask**

#### 1️⃣ **Delete Old Network (If Exists)**
- Open MetaMask
- Click network dropdown
- If "Hardhat Local" exists, click ⚙️ next to it → Delete

#### 2️⃣ **Add Fresh Network**
- Click "Add Network" → "Add a network manually"
- Enter:
  - **Network Name:** `Hardhat Local`
  - **RPC URL:** `http://127.0.0.1:8545`
  - **Chain ID:** `31337`
  - **Currency Symbol:** `ETH`
- Click "Save"

#### 3️⃣ **Import Account #0**
- Click account icon (top right) → "Import Account"
- Select "Private Key"
- Paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Click "Import"

#### 4️⃣ **Reset Account (CRITICAL!)**
- MetaMask → Settings → Advanced
- Scroll down → Click **"Reset Account"**
- Confirm
- **Why?** Clears old blockchain cache from previous Hardhat sessions

#### 5️⃣ **Verify Balance**
- You should see **~10000 ETH** (not 9999.xxx)
- If you see 9999.xxx, MetaMask is still cached - try switching networks and back

---

### **BROWSER: Open Application**

1. **Open browser:** http://localhost:3000
2. **Click "Connect Wallet"**
3. **Approve MetaMask connection**
4. **Check Status:**
   - ✅ Wallet address should show: `0xf39F...2266`
   - ✅ Token balance should load (might be 0 initially)
   - ✅ Contract info should show token name/symbol

---

### **BROWSER: Test Functionality**

#### Test 1: Buy Tokens
1. **Go to "User Actions" → "Buy Tokens"**
2. **Enter:** `0.1` (0.1 ETH)
3. **Click "Buy Tokens"**
4. **Confirm in MetaMask**
5. **Wait for success message**
6. **Expected:** Balance increases by ~50 tokens

**❌ If Error "could not decode result data":**
- MetaMask is still cached
- Try: MetaMask → Reset Account again
- Try: Switch to Ethereum Mainnet, then back to Hardhat Local
- Try: Close browser completely and reopen

#### Test 2: Admin Panel Access
1. **Scroll to "Admin Actions"**
2. **Enter password:** `admin123`
3. **Click "Login"**
4. **Expected:** Admin panel opens, shows "✅ Verified" status

#### Test 3: Pause/Unpause (Admin Only)
1. **In Admin Panel, click "Pause Crowdsale"**
2. **Confirm in MetaMask**
3. **Expected:** Status changes to "⏸ Paused"
4. **Try to buy tokens** → Should fail with "Pausable: paused"
5. **Click "Unpause Crowdsale"**
6. **Expected:** Status changes to "▶ Active"
7. **Try to buy tokens again** → Should work!

---

## 🎯 Summary of What's Different from HOW_TO_RUN.md

### ❌ DON'T Do This (from old HOW_TO_RUN.md):
```bash
# DON'T use --reset flag (this generates NEW addresses)
npx hardhat ignition deploy --network localhost --reset  # ❌ WRONG
```

### ✅ DO This Instead:
```bash
# DO use existing deployment cache (preserves commit 805a904 addresses)
npx hardhat ignition deploy ignition/modules/localhost.ts --network localhost  # ✅ CORRECT
```

### Why?
- The deployment cache in `ignition/deployments/chain-31337/` was restored from commit 805a904
- Using `--reset` would delete this cache and generate **new random addresses**
- Your frontend is hardcoded to the **old addresses from commit 805a904**
- Without `--reset`, Hardhat Ignition **reuses the cached deployment**

---

## 📋 Quick Checklist

Before you start:
- [ ] No Hardhat node running (`ps aux | grep hardhat`)
- [ ] No web server running (`lsof -ti:3000`)
- [ ] Deployment cache exists at `ignition/deployments/chain-31337/deployed_addresses.json`
- [ ] Frontend has correct addresses in `web/app.js` and `web/admin.js`

Terminal 1:
- [ ] Hardhat node started (`npx hardhat node`)
- [ ] Shows Account #0: 0xf39F...2266 with 10000 ETH

Terminal 2:
- [ ] Contracts deployed (without --reset!)
- [ ] Addresses match commit 805a904
- [ ] Admin role granted to 0xf39F...2266

Terminal 3:
- [ ] Web server running on port 3000

MetaMask:
- [ ] Hardhat Local network added (fresh)
- [ ] Account #0 imported (0xf39F...2266)
- [ ] Account reset (cleared cache)
- [ ] Shows ~10000 ETH (not 9999.xxx)

Browser:
- [ ] http://localhost:3000 loads
- [ ] Wallet connected
- [ ] Can buy tokens
- [ ] Admin panel works (password: admin123)

---

## 🐛 Troubleshooting

### Issue: Deployed addresses don't match commit 805a904

**Cause:** Deployment cache got corrupted or --reset was used

**Solution:**
```bash
# Restore deployment cache again
git checkout 805a904 -- ignition/deployments/chain-31337

# Restart Hardhat node (Terminal 1: Ctrl+C, then restart)
npx hardhat node

# Redeploy WITHOUT --reset
npx hardhat ignition deploy ignition/modules/localhost.ts --network localhost
```

### Issue: "could not decode result data" error

**Cause:** MetaMask caching old blockchain state

**Solution:**
1. MetaMask → Settings → Advanced → Reset Account
2. Close browser completely
3. Reopen browser
4. Reconnect wallet

### Issue: Shows 9999.xxx ETH instead of 10000 ETH

**Cause:** MetaMask connected to old Hardhat session

**Solution:**
1. Delete Hardhat Local network from MetaMask
2. Re-add it (RPC: http://127.0.0.1:8545, Chain ID: 31337)
3. Reset Account
4. Switch away and back to Hardhat Local

### Issue: Admin panel shows "❌ Not Admin"

**Cause:** Admin role not granted

**Solution:**
```bash
npx hardhat run scripts/grant-admin-role.js --network localhost 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

## 🎉 Success Criteria

You've succeeded when:
1. ✅ All 3 terminals running without errors
2. ✅ http://localhost:3000 loads and connects to MetaMask
3. ✅ Can buy tokens with ETH (0.1 ETH → ~50 tokens)
4. ✅ Admin panel accessible (password: admin123)
5. ✅ Can pause/unpause crowdsale
6. ✅ No "could not decode" errors in browser console
7. ✅ Balance updates correctly after purchases

---

## 📝 Key Difference from HOW_TO_RUN.md

**HOW_TO_RUN.md** assumes you want to deploy fresh contracts with NEW addresses each time.

**THIS GUIDE** uses the specific deployment from commit 805a904 with FIXED addresses.

The critical difference:
- Old way: `--reset` flag → new addresses every time
- Your way: No `--reset` flag → reuses cached addresses from commit 805a904

Both are valid, but YOUR frontend is hardcoded to commit 805a904 addresses, so you MUST use this approach.

---

**Ready? Start with Terminal 1! 🚀**
