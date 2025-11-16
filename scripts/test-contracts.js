const hre = require("hardhat");

async function testContracts() {
    console.log("🧪 TESTING CONTRACTS");
    console.log("=" .repeat(40));
    
    try {
        // Contract addresses
        const tokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
        const crowdsaleAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
        
        console.log("📋 Contract Addresses:");
        console.log("Token:", tokenAddress);
        console.log("Crowdsale:", crowdsaleAddress);
        
        // Get contract instances
        const token = await hre.ethers.getContractAt("ExampleToken", tokenAddress);
        const crowdsale = await hre.ethers.getContractAt("ExampleCrowdSale", crowdsaleAddress);
        
        console.log("\n1️⃣ TESTING TOKEN CONTRACT:");
        try {
            const name = await token.name();
            console.log("✅ Token name:", name);
        } catch (error) {
            console.log("❌ Token name error:", error.message);
        }
        
        try {
            const symbol = await token.symbol();
            console.log("✅ Token symbol:", symbol);
        } catch (error) {
            console.log("❌ Token symbol error:", error.message);
        }
        
        try {
            const totalSupply = await token.totalSupply();
            console.log("✅ Total supply:", hre.ethers.formatEther(totalSupply));
        } catch (error) {
            console.log("❌ Total supply error:", error.message);
        }
        
        console.log("\n2️⃣ TESTING CROWDSALE CONTRACT:");
        try {
            const fundsRaised = await crowdsale.fundsRaised();
            console.log("✅ Funds raised:", hre.ethers.formatEther(fundsRaised), "ETH");
        } catch (error) {
            console.log("❌ Funds raised error:", error.message);
        }
        
        try {
            const tokensAvailable = await crowdsale.tokensAvailable();
            console.log("✅ Tokens available:", hre.ethers.formatEther(tokensAvailable));
        } catch (error) {
            console.log("❌ Tokens available error:", error.message);
        }
        
        try {
            const paused = await crowdsale.paused();
            console.log("✅ Crowdsale paused:", paused);
        } catch (error) {
            console.log("❌ Paused check error:", error.message);
        }
        
        console.log("\n🎯 CONTRACT TEST COMPLETE!");
        
    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
}

testContracts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });




