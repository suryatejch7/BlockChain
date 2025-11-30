#!/bin/bash

echo "🔍 COMPREHENSIVE SYSTEM CHECK"
echo "=============================="
echo ""

# Check if Hardhat node is running
echo "1️⃣ Checking Hardhat Node..."
if curl -s -X POST http://127.0.0.1:8545 -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"net_version","id":1}' > /dev/null 2>&1; then
    echo "   ✅ Hardhat node is running on http://127.0.0.1:8545"
else
    echo "   ❌ Hardhat node is NOT running!"
    echo "   Run: npx hardhat node"
    exit 1
fi

# Check web server
echo ""
echo "2️⃣ Checking Web Server..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Web server is running on http://localhost:3000"
else
    echo "   ❌ Web server is NOT running!"
    echo "   Run: node web/server.js"
    exit 1
fi

# Check contract addresses in frontend
echo ""
echo "3️⃣ Checking Frontend Contract Addresses..."
TOKEN_ADDR=$(grep -A 3 "CONTRACT_ADDRESSES" web/app.js | grep "token:" | cut -d'"' -f2)
CROWDSALE_ADDR=$(grep -A 3 "CONTRACT_ADDRESSES" web/app.js | grep "crowdsale:" | cut -d'"' -f2)
echo "   Token:     $TOKEN_ADDR"
echo "   Crowdsale: $CROWDSALE_ADDR"

# Check deployed addresses
echo ""
echo "4️⃣ Checking Deployed Contract Addresses..."
DEPLOYED_TOKEN=$(cat ignition/deployments/chain-31337/deployed_addresses.json | grep ExampleToken | cut -d'"' -f4)
DEPLOYED_CROWDSALE=$(cat ignition/deployments/chain-31337/deployed_addresses.json | grep ExampleCrowdSale | cut -d'"' -f4)
echo "   Token:     $DEPLOYED_TOKEN"
echo "   Crowdsale: $DEPLOYED_CROWDSALE"

# Compare addresses
echo ""
echo "5️⃣ Verifying Address Match..."
if [ "$TOKEN_ADDR" = "$DEPLOYED_TOKEN" ]; then
    echo "   ✅ Token addresses MATCH"
else
    echo "   ❌ Token addresses DON'T MATCH!"
    echo "   Frontend: $TOKEN_ADDR"
    echo "   Deployed: $DEPLOYED_TOKEN"
fi

if [ "$CROWDSALE_ADDR" = "$DEPLOYED_CROWDSALE" ]; then
    echo "   ✅ Crowdsale addresses MATCH"
else
    echo "   ❌ Crowdsale addresses DON'T MATCH!"
    echo "   Frontend: $CROWDSALE_ADDR"
    echo "   Deployed: $DEPLOYED_CROWDSALE"
fi

# Check if contracts exist on blockchain
echo ""
echo "6️⃣ Checking Contracts on Blockchain..."
TOKEN_CODE=$(curl -s -X POST http://127.0.0.1:8545 -H "Content-Type: application/json" --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getCode\",\"params\":[\"$DEPLOYED_TOKEN\", \"latest\"],\"id\":1}" | jq -r .result)
if [ "$TOKEN_CODE" != "0x" ] && [ ${#TOKEN_CODE} -gt 10 ]; then
    echo "   ✅ Token contract exists (${#TOKEN_CODE} bytes)"
else
    echo "   ❌ Token contract NOT found!"
fi

CROWDSALE_CODE=$(curl -s -X POST http://127.0.0.1:8545 -H "Content-Type: application/json" --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getCode\",\"params\":[\"$DEPLOYED_CROWDSALE\", \"latest\"],\"id\":1}" | jq -r .result)
if [ "$CROWDSALE_CODE" != "0x" ] && [ ${#CROWDSALE_CODE} -gt 10 ]; then
    echo "   ✅ Crowdsale contract exists (${#CROWDSALE_CODE} bytes)"
else
    echo "   ❌ Crowdsale contract NOT found!"
fi

# Check Account #0 balances
echo ""
echo "7️⃣ Checking Account #0 Balances..."
ACCOUNT="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

# ETH Balance
ETH_BALANCE_HEX=$(curl -s -X POST http://127.0.0.1:8545 -H "Content-Type: application/json" --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"$ACCOUNT\", \"latest\"],\"id\":1}" | jq -r .result)
ETH_BALANCE=$(node -e "console.log((parseInt('$ETH_BALANCE_HEX', 16) / 1e18).toFixed(4))")
echo "   ETH Balance: $ETH_BALANCE ETH"

# Token Balance
TOKEN_BALANCE_HEX=$(curl -s -X POST http://127.0.0.1:8545 -H "Content-Type: application/json" --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_call\",\"params\":[{\"to\":\"$DEPLOYED_TOKEN\",\"data\":\"0x70a08231000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266\"},\"latest\"],\"id\":1}" | jq -r .result)
TOKEN_BALANCE=$(node -e "console.log((parseInt('$TOKEN_BALANCE_HEX', 16) / 1e18).toFixed(2))")
echo "   Token Balance: $TOKEN_BALANCE tokens"

echo ""
echo "=============================="
echo "✅ SYSTEM CHECK COMPLETE"
echo ""
echo "📝 Next Steps:"
echo "1. Open browser: http://localhost:3000/clear-cache.html"
echo "2. This will clear old cached addresses"
echo "3. Then go to: http://localhost:3000"
echo "4. Connect MetaMask"
echo "5. Check browser console (F12) for debug logs"
echo ""
