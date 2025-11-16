const hre = require("hardhat");

async function main() {
    console.log("Deploying MockAggregatorV3...");
    
    const MockAggregator = await hre.viem.deployContract("MockAggregatorV3", [
        8, // decimals
        200000000000n // $2000 per ETH (with 8 decimals: 2000 * 10^8)
    ]);
    
    console.log("✅ MockAggregatorV3 deployed to:", MockAggregator.address);
    console.log("\nNow redeploy your crowdsale with this price feed address!");
    console.log("\nOr use the 'Process External Purchase' admin function instead.");
}

main().catch(console.error);
