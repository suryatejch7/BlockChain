const hre = require("hardhat");

async function main() {
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const crowdsaleAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    
    const [deployer] = await hre.viem.getWalletClients();
    const token = await hre.viem.getContractAt("ExampleToken", tokenAddress);
    
    console.log("Transferring 2500 tokens to crowdsale...");
    console.log("From:", deployer.account.address);
    console.log("To:", crowdsaleAddress);
    
    const hash = await token.write.transfer([
        crowdsaleAddress,
        5000000000000000000000n // 2500 tokens with 18 decimals
    ]);
    
    console.log("✅ Transfer complete!");
    console.log("Transaction hash:", hash);
    
    // Check balance
    const balance = await token.read.balanceOf([crowdsaleAddress]);
    console.log("Crowdsale token balance:", balance.toString());
}

main().catch(console.error);
