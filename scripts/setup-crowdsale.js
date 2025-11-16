const hre = require("hardhat");

async function main() {
    // Contract addresses from deployment
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const crowdsaleAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
    
    const [deployer] = await hre.viem.getWalletClients();
    const token = await hre.viem.getContractAt("ExampleToken", tokenAddress);
    const crowdsale = await hre.viem.getContractAt("ExampleCrowdSale", crowdsaleAddress);
    
    console.log("Setting up crowdsale...");
    console.log("Deployer:", deployer.account.address);
    
    // 1. Transfer tokens to crowdsale
    console.log("\n1. Transferring 2500 tokens to crowdsale...");
    const transferHash = await token.write.transfer([
        crowdsaleAddress,
        2500000000000000000000n
    ]);
    console.log("✅ Transfer complete:", transferHash);
    
    // 2. Whitelist deployer
    console.log("\n2. Whitelisting deployer...");
    const whitelistRole = await crowdsale.read.WHITELISTED_ROLE();
    const whitelistHash = await crowdsale.write.grantRole([whitelistRole, deployer.account.address]);
    console.log("✅ Whitelist complete:", whitelistHash);
    
    // 3. Check balances
    console.log("\n3. Checking status...");
    const crowdsaleBalance = await token.read.balanceOf([crowdsaleAddress]);
    console.log("Crowdsale token balance:", crowdsaleBalance.toString());
    const isWhitelisted = await crowdsale.read.hasRole([whitelistRole, deployer.account.address]);
    console.log("Deployer whitelisted:", isWhitelisted);
    
    console.log("\n✅ Setup complete! You can now buy tokens!");
}

main().catch(console.error);
