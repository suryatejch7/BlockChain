const hre = require("hardhat");

async function main() {
  console.log("Setting up crowdsale with new deployment...\n");
  
  const [deployer] = await hre.viem.getWalletClients();
  console.log("Deployer:", deployer.account.address);

  // NEW contract addresses from latest deployment
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const crowdsaleAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const vestingVaultAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  
  // Get contract instances
  const token = await hre.viem.getContractAt("ExampleToken", tokenAddress);
  const crowdsale = await hre.viem.getContractAt("ExampleCrowdSale", crowdsaleAddress);
  const vestingVault = await hre.viem.getContractAt("ExampleVestingVault", vestingVaultAddress);
  
  // Step 1: Transfer tokens to crowdsale (450 tokens = 450 * 10^18 wei)
  console.log("\n1. Transferring 450 tokens to crowdsale...");
  const amountToTransfer = 450000000000000000000n; // 450 tokens
  const transferHash = await token.write.transfer([crowdsaleAddress, amountToTransfer]);
  console.log("✅ Transfer hash:", transferHash);
  
  const crowdsaleBalance = await token.read.balanceOf([crowdsaleAddress]);
  console.log("   Crowdsale balance:", Number(crowdsaleBalance) / 1e18, "tokens");
  
  // Step 2: Grant VAULT_CONTROLLER_ROLE to crowdsale
  console.log("\n2. Granting VAULT_CONTROLLER_ROLE to crowdsale...");
  const vaultControllerRole = await vestingVault.read.VAULT_CONTROLLER_ROLE();
  const roleHash = await vestingVault.write.grantRole([vaultControllerRole, crowdsaleAddress]);
  console.log("✅ Role granted:", roleHash);
  
  const hasRole = await vestingVault.read.hasRole([vaultControllerRole, crowdsaleAddress]);
  console.log("   Crowdsale has VAULT_CONTROLLER_ROLE:", hasRole);
  
  // Step 3: Whitelist deployer
  console.log("\n3. Whitelisting deployer account...");
  const whitelistRole = await crowdsale.read.WHITELISTED_ROLE();
  const whitelistHash = await crowdsale.write.grantRole([whitelistRole, deployer.account.address]);
  console.log("✅ Whitelist hash:", whitelistHash);
  
  const isWhitelisted = await crowdsale.read.hasRole([whitelistRole, deployer.account.address]);
  console.log("   Deployer is whitelisted:", isWhitelisted);
  
  console.log("\n✅ Setup complete!");
  console.log("\nContract Addresses:");
  console.log("Token:", tokenAddress);
  console.log("Crowdsale:", crowdsaleAddress);
  console.log("VestingVault:", vestingVaultAddress);
  console.log("\nUpdate these addresses in your web interface!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
