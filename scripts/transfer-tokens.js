const hre = require("hardhat");

async function main() {
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const crowdsaleAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    
    const [deployer] = await hre.ethers.getSigners();
    const token = await hre.ethers.getContractAt("ExampleToken", tokenAddress);
    
    console.log("Transferring 2500 tokens to crowdsale...");
    const tx = await token.transfer(crowdsaleAddress, hre.ethers.parseEther("2500"));
    await tx.wait();
    
    console.log("✅ Transfer complete!");
    console.log("Transaction hash:", tx.hash);
}

main().catch(console.error);
