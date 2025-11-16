# How to Refresh the Web Interface

## The Problem
Your browser has cached the old `app.js` file with the old contract addresses. A simple F5 refresh won't work because of browser caching.

## Solution: Hard Refresh

### Option 1: Hard Refresh (RECOMMENDED)
Press one of these key combinations in your browser:

- **Chrome/Firefox on Linux:** `Ctrl + Shift + R`
- **OR:** `Ctrl + F5`
- **OR:** Hold `Shift` and click the refresh button

### Option 2: Clear Cache & Hard Reload
1. Open Developer Tools (`F12` or `Ctrl + Shift + I`)
2. **Right-click** on the refresh button (next to address bar)
3. Select **"Empty Cache and Hard Reload"**

### Option 3: Force Server Restart (if above doesn't work)
If caching still persists, restart the web server:

```bash
# Find and kill the server process
pkill -f "node.*server.js"

# Start it again
cd /media/surya/Shared/Code/solidity-token-erc20-crowdsale
npm run web
```

Then do a hard refresh in your browser.

## Verify It Worked

After hard refreshing, open the browser console (`F12`) and type:
```javascript
CONTRACT_ADDRESSES
```

You should see:
```javascript
{
  token: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
  crowdsale: "0x9A676e781A523b5d0C0e43731313A708CB607508",
  vestingVault: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0"
}
```

**NOT the old addresses:**
```javascript
{
  token: "0x5FbDB2315678afecb367f032d93F642f64180aa3",  // OLD ❌
  crowdsale: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", // OLD ❌
  ...
}
```

## Then Test the Purchase
Once you see the new addresses, try buying tokens again with 0.1 ETH!
