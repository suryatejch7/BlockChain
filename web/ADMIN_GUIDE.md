# 🔐 Admin Panel - Setup & Usage Guide

## ✨ What's New

The admin functionality has been separated into a **secure, password-protected admin panel** with a modern interface.

---

## 📁 New Files

- **`web/admin.html`** - Admin panel interface
- **`web/admin.js`** - Admin panel JavaScript logic

## 🔑 Admin Password

**Default Password:** `admin123`

To change the password, edit line 9 in `web/admin.js`:

```javascript
const ADMIN_PASSWORD = "admin123";  // Change this
```

---

## 🚀 How to Access Admin Panel

### Method 1: Click the Admin Button
1. Open `http://localhost:3000` in your browser
2. Click the **"⚙️ Admin Panel"** button in the top-right corner
3. Enter the password: `admin123`
4. Access granted!

### Method 2: Direct URL
1. Navigate directly to `http://localhost:3000/admin.html`
2. Enter the password
3. You're in!

---

## 🎨 Features

### 🔐 Security
- **Password Protection** - Must enter password before accessing
- **Session Storage** - Stays logged in during browser session
- **Wallet Verification** - Checks if connected wallet has admin role on contract

### ⚙️ Admin Functions

#### 1. **Crowdsale Control**
- ⏸ **Pause Crowdsale** - Halt all token purchases
- ▶ **Unpause Crowdsale** - Resume operations

#### 2. **Whitelist Management**
- ✅ **Add Single Address** - Whitelist individual users
- 📋 **Batch Whitelist** - Add multiple addresses at once

#### 3. **External Purchase**
- 💰 **Process Off-Chain Purchases** - Allocate tokens for external payments

#### 4. **Real-Time Dashboard**
- View wallet address
- Check admin status
- Monitor crowdsale status
- Track funds raised

#### 5. **Transaction Log**
- Complete history of all admin actions
- Transaction hashes for verification

---

## 🎯 User Interface Changes

### Main Page (`index.html`)
- ✅ **Added:** Floating admin button (top-right)
- ❌ **Removed:** Admin section from main page
- 🎨 **Cleaner:** User-focused interface

### Admin Page (`admin.html`)
- 🔒 **Password modal** on entry
- 📊 **Status dashboard** with real-time stats
- 🎛️ **Organized sections** for each admin function
- 📜 **Transaction log** for audit trail
- 🎨 **Modern design** matching the main page theme

---

## 🛡️ Security Notes

### Important Wallet Security

1. **Password ≠ Blockchain Permission**
   - The password only controls access to the admin UI
   - Actual admin actions require:
     - Connected MetaMask wallet
     - Wallet must have `DEFAULT_ADMIN_ROLE` on the contract

2. **Smart Contract Admin**
   - Check admin status in the dashboard
   - If wallet doesn't have admin role, operations will fail
   - Deploy contracts with your wallet as admin

3. **Production Deployment**
   - Change the default password
   - Use environment variables for sensitive data
   - Consider implementing proper backend authentication

---

## 🧪 Testing the Admin Panel

### 1. Start Local Environment

```bash
# Terminal 1: Start Hardhat node
cd /Users/abhilashpodisetty/Downloads/Crypto/BlockChain
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat ignition deploy ignition/modules/main.ts --network localhost

# Terminal 3: Start web server
npm run web
```

### 2. Setup MetaMask

1. Install MetaMask extension
2. Add Localhost network (Chain ID: 31337)
3. Import test account from Hardhat node output
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### 3. Access Admin Panel

1. Go to `http://localhost:3000`
2. Click **"⚙️ Admin Panel"**
3. Enter password: `admin123`
4. Connect MetaMask when prompted
5. Verify admin status shows ✅

### 4. Test Functions

- Try pausing/unpausing the crowdsale
- Whitelist an address
- Process an external purchase
- Check the transaction log

---

## 🎨 Theme & Design

The admin panel matches the main interface:

- **Colors:** Purple/blue gradients (`#667eea`, `#764ba2`, `#4facfe`)
- **Style:** Modern glassmorphism with smooth animations
- **Responsive:** Works on desktop and mobile
- **Icons:** Emoji-based for clarity

---

## 🐛 Troubleshooting

### "Not Admin" Status
- **Issue:** Wallet doesn't have admin role on contract
- **Solution:** Use the wallet that deployed the contracts

### Password Incorrect
- **Issue:** Wrong password entered
- **Solution:** Check `admin.js` line 9 for correct password

### MetaMask Not Detected
- **Issue:** MetaMask extension not installed
- **Solution:** Install from https://metamask.io

### Functions Failing
- **Issue:** Not connected to localhost network
- **Solution:** 
  1. Check Hardhat node is running
  2. MetaMask is on Localhost 8545 network
  3. Contracts are deployed

---

## 📝 Customization

### Change Password
Edit `web/admin.js`:
```javascript
const ADMIN_PASSWORD = "your-new-password";
```

### Add More Admin Functions
1. Add new section in `admin.html`
2. Create function in `admin.js`
3. Use existing patterns for consistency

### Modify Design
All styles are in `<style>` tag of `admin.html`

---

## ✅ Summary

- ✨ **Clean separation** - Admin functions isolated from user interface
- 🔒 **Password protected** - Secure access to admin panel
- 🎨 **Modern UI** - Beautiful, intuitive interface
- 📊 **Real-time data** - Live updates from blockchain
- 📜 **Audit trail** - Transaction log for all actions
- 🛡️ **Wallet verification** - Double security layer

Enjoy your new admin panel! 🚀
