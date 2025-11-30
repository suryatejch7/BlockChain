# Deploy with Commit 805a904 Addresses

## Important Note
Hardhat generates **deterministic** contract addresses based on:
- The deployer account (always Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
- The deployment order and nonce

To get the EXACT addresses from commit 805a904, follow these steps:

## Step 1: Stop Current Hardhat Node
In Terminal 1, press `Ctrl+C` to stop the running Hardhat node.

## Step 2: Start Fresh Hardhat Node
```bash
npx hardhat node
```

This will create Account #0 with 10000 ETH at address:
`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

## Step 3: Deploy Contracts
In a new terminal:
```bash
npx hardhat ignition deploy ignition/modules/localhost.ts --network localhost
```

## Expected Deployment Addresses
If everything is correct, you should see:
- **ExampleToken**: `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318`
- **ExampleCrowdSale**: `0x9A676e781A523b5d0C0e43731313A708CB607508`
- **ExampleVestingVault**: `0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0`

## Step 4: Grant Admin Role
```bash
npx hardhat run scripts/grant-admin-role.js --network localhost 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

## Step 5: MetaMask Setup
1. **Delete** the existing "Hardhat Local" network from MetaMask
2. **Add Network Manually**:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`
3. **Import Account #0**:
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
4. **Reset Account** (Settings → Advanced → Reset Account)

## Step 6: Start Web Server
```bash
node web/server.js
```

## Step 7: Access Application
Open browser: `http://localhost:3000`

## Frontend Configuration
The frontend is already configured with the correct addresses:
```javascript
const CONTRACT_ADDRESSES = {
    token: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    crowdsale: "0x9A676e781A523b5d0C0e43731313A708CB607508",
    vestingVault: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0"
};
```

## Verification
After deployment, verify the addresses match by running:
```bash
cat ignition/deployments/chain-31337/deployed_addresses.json
```

Should output:
```json
{
  "LocalCrowdsaleModule#ExampleToken": "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
  "LocalCrowdsaleModule#ExampleVestingWallet": "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
  "LocalCrowdsaleModule#MockAggregatorV3": "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
  "LocalCrowdsaleModule#ExampleVestingVault": "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
  "LocalCrowdsaleModule#ExampleCrowdSale": "0x9A676e781A523b5d0C0e43731313A708CB607508"
}
```

## Troubleshooting
If addresses don't match:
1. Make sure you're using `ignition/modules/localhost.ts` (not `main.ts`)
2. Ensure fresh Hardhat node (no previous state)
3. Check that deployment cache was restored from commit 805a904
4. The deployment order matters - don't modify the deployment script

## Note on Deterministic Addresses
Hardhat **always** generates the same addresses when:
- Starting from a fresh node
- Using the same deployer account (Account #0)
- Deploying contracts in the same order

This is why the addresses from commit 805a904 can be reproduced.
