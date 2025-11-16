const hre = require("hardhat");

async function main() {
    // Contract addresses from deployment
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const crowdsaleAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
    const vestingVaultAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    
    const [deployer] = await hre.viem.getWalletClients();
    const vestingVault = await hre.viem.getContractAt("ExampleVestingVault", vestingVaultAddress);
    
    console.log("Fixing vesting vault permissions...");
    console.log("Deployer:", deployer.account.address);
    
    // Grant VAULT_CONTROLLER_ROLE to crowdsale contract
    console.log("\nGranting VAULT_CONTROLLER_ROLE to crowdsale...");
    const vaultControllerRole = await vestingVault.read.VAULT_CONTROLLER_ROLE();
    const grantHash = await vestingVault.write.grantRole([vaultControllerRole, crowdsaleAddress]);
    console.log("✅ Permission granted:", grantHash);
    
    // Verify
    const hasRole = await vestingVault.read.hasRole([vaultControllerRole, crowdsaleAddress]);
    console.log("Crowdsale has VAULT_CONTROLLER_ROLE:", hasRole);
    
    console.log("\n✅ Permissions fixed! You can now buy tokens!");
}

main().catch(console.error);
