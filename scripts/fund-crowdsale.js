const hre = require("hardhat");

async function main() {
  console.log("Funding crowdsale with more tokens...");
  
  const [deployer] = await hre.viem.getWalletClients();
  console.log("Deployer:", deployer.account.address);

  // Contract addresses
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const crowdsaleAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  // Get contract instances
  const token = await hre.viem.getContractAt("ExampleToken", tokenAddress);
  
  // Check current balances
  const deployerBalance = await token.read.balanceOf([deployer.account.address]);
  const crowdsaleBalance = await token.read.balanceOf([crowdsaleAddress]);
  
  console.log("\nCurrent balances:");
  console.log("Deployer:", hre.ethers.formatEther(deployerBalance), "tokens");
  console.log("Crowdsale:", hre.ethers.formatEther(crowdsaleBalance), "tokens");
  
  // Transfer 2000 more tokens (we already have 2500, this gives us 4500 total)
  const amountToTransfer = hre.ethers.parseEther("2000");
  console.log("\nTransferring", hre.ethers.formatEther(amountToTransfer), "tokens to crowdsale...");
  
  const hash = await token.write.transfer([crowdsaleAddress, amountToTransfer]);
  console.log("✅ Transfer transaction:", hash);
  
  // Check new balances
  const newCrowdsaleBalance = await token.read.balanceOf([crowdsaleAddress]);
  console.log("\nNew crowdsale balance:", hre.ethers.formatEther(newCrowdsaleBalance), "tokens");
  console.log("✅ Crowdsale is now funded!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
