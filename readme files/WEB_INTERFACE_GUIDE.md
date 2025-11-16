# 🌐 Web Interface Guide for Your Assignment

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Hardhat Node
```bash
# Terminal 1: Start local blockchain
npx hardhat node
```

### Step 3: Deploy Contracts
```bash
# Terminal 2: Deploy contracts
npx hardhat ignition deploy ignition/modules/main.ts --network localhost
```

### Step 4: Start Web Interface
```bash
# Terminal 3: Start web server
npm run web
```

### Step 5: Open Browser
```
http://localhost:3000
```

## 🎯 Features Included

### ✅ **User Features:**
- **Connect Wallet** - MetaMask integration
- **View Balances** - ETH and token balances
- **Buy Tokens** - Purchase tokens with ETH
- **Transaction History** - Track all transactions

### ✅ **Admin Features:**
- **Pause/Unpause** - Control crowdsale status
- **Whitelist Users** - Add users to whitelist
- **External Purchases** - Process off-chain payments
- **Contract Management** - Full admin control

### ✅ **Assignment Requirements:**
- **ERC-20 Token** - Full token functionality
- **Token Transfer** - Standard transfers
- **Crowdsale Mechanism** - ETH to token conversion
- **Fund Collection** - Automatic ETH forwarding
- **Access Control** - Whitelist system

## 🎮 How to Use for Your Assignment

### 1. **Demonstrate Token Creation**
- Open the web interface
- Connect your wallet
- View token details (name, symbol, supply)

### 2. **Show Token Purchases**
- Enter ETH amount
- Click "Buy Tokens"
- Watch transaction process
- See updated balances

### 3. **Test Access Control**
- Try buying without being whitelisted
- Show error message
- Add user to whitelist
- Show successful purchase

### 4. **Admin Functions**
- Pause the crowdsale
- Try buying (should fail)
- Unpause the crowdsale
- Show it works again

### 5. **External Purchases**
- Process off-chain payment
- Show tokens delivered
- Demonstrate admin capabilities

## 📱 Interface Sections

### **Connection Status**
- Shows wallet connection status
- Displays connected address
- Connection error handling

### **Contract Information**
- Token details (name, symbol, supply)
- Crowdsale stats (funds raised, tokens available)
- Real-time status updates

### **User Actions**
- Balance display (ETH and tokens)
- Token purchase form
- Transaction status

### **Admin Actions**
- Crowdsale control (pause/unpause)
- Whitelist management
- External purchase processing

### **Transaction History**
- All transactions displayed
- Transaction hashes
- Action descriptions

## 🔧 Configuration

### **Contract Addresses**
The web interface automatically detects contract addresses, but you can update them:

```javascript
// In browser console
setContractAddresses(
    "0x...", // Token address
    "0x...", // Crowdsale address
    "0x..."  // Vesting vault address
);
```

### **Network**
- Default: localhost (http://localhost:8545)
- Change in MetaMask network settings
- Add custom network if needed

## 🎥 Demo Script for Assignment

### **Step 1: Setup**
```bash
# Start everything
npx hardhat node &
npx hardhat ignition deploy ignition/modules/main.ts --network localhost &
npm run web
```

### **Step 2: Demo Flow**
1. **Open** http://localhost:3000
2. **Connect** MetaMask wallet
3. **Show** token details and balances
4. **Buy** tokens with ETH
5. **Test** access control (whitelist)
6. **Demonstrate** admin functions
7. **Process** external purchase
8. **Show** transaction history

### **Step 3: Assignment Points**
- ✅ **ERC-20 Token**: Working with full functionality
- ✅ **Crowdsale**: ETH to token conversion
- ✅ **Token Transfer**: Standard transfers
- ✅ **Access Control**: Whitelist system
- ✅ **Admin Functions**: Pause/unpause
- ✅ **Fund Collection**: ETH to project wallet

## 🚀 Advanced Features

### **Real-time Updates**
- Balances update automatically
- Contract status updates
- Transaction confirmations

### **Error Handling**
- Connection errors
- Transaction failures
- Contract errors

### **User Experience**
- Loading indicators
- Status messages
- Transaction history

## 🎓 Assignment Submission

### **What to Show:**
1. **Token Deployment** - Show token creation
2. **User Purchase** - Demonstrate token buying
3. **Access Control** - Test whitelist functionality
4. **Admin Functions** - Pause/unpause crowdsale
5. **Fund Collection** - Show ETH collection
6. **Transaction History** - Track all actions

### **Key Points:**
- **Professional Interface** - Clean, modern design
- **Full Functionality** - All assignment requirements met
- **Real-time Updates** - Live data updates
- **Error Handling** - Proper error messages
- **User Experience** - Intuitive interface

## 🎉 Success Criteria

Your assignment will be successful if you can demonstrate:
- ✅ **Web Interface** - Professional, functional UI
- ✅ **Token Operations** - Creation, transfer, purchase
- ✅ **Crowdsale** - ETH to token conversion
- ✅ **Access Control** - Whitelist functionality
- ✅ **Admin Functions** - Pause/unpause, external purchases
- ✅ **Real-time Updates** - Live data and transactions

This web interface provides a complete, professional demonstration of your ERC-20 token and crowdsale assignment! 🚀



