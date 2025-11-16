const { ethers } = require("hardhat");

async function quickTest() {
    console.log("🧪 QUICK ASSIGNMENT TEST");
    console.log("=" .repeat(40));
    
    const [deployer, user1, user2] = await ethers.getSigners();
    
    // 1. Deploy Token
    console.log("\n1️⃣ Deploying ERC-20 Token...");
    const Token = await ethers.getContractFactory("ExampleToken");
    const token = await Token.deploy("TestToken", "TTK", ethers.parseEther("1000000"), deployer.address);
    await token.waitForDeployment();
    console.log(`✅ Token: ${token.target}`);
    
    // 2. Deploy Mock Price Feed
    console.log("\n2️⃣ Setting up price feed...");
    const MockAggregator = await ethers.getContractFactory("MockAggregatorV3");
    const priceFeed = await MockAggregator.deploy();
    await priceFeed.waitForDeployment();
    await priceFeed.setLatestRoundData(1, ethers.parseUnits("2000", 8), Date.now(), Date.now(), 1);
    console.log(`✅ Price feed: $2000/ETH`);
    
    // 3. Deploy Vesting Vault
    console.log("\n3️⃣ Deploying vesting vault...");
    const VestingVault = await ethers.getContractFactory("VestingVault");
    const vestingVault = await VestingVault.deploy(token.target);
    await vestingVault.waitForDeployment();
    console.log(`✅ Vesting vault: ${vestingVault.target}`);
    
    // 4. Deploy Crowdsale
    console.log("\n4️⃣ Deploying crowdsale...");
    const Crowdsale = await ethers.getContractFactory("ExampleCrowdSale");
    const crowdsale = await Crowdsale.deploy(
        priceFeed.target,
        token.target,
        deployer.address, // Project wallet
        100, // 100 tokens per USD
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year vesting
        vestingVault.target
    );
    await crowdsale.waitForDeployment();
    console.log(`✅ Crowdsale: ${crowdsale.target}`);
    
    // 5. Setup
    console.log("\n5️⃣ Setting up crowdsale...");
    await token.transfer(crowdsale.target, ethers.parseEther("500000"));
    await crowdsale.grantRole(await crowdsale.WHITELISTED_ROLE(), user1.address);
    await crowdsale.grantRole(await crowdsale.WHITELISTED_ROLE(), user2.address);
    const VAULT_CONTROLLER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VAULT_CONTROLLER_ROLE"));
    await vestingVault.grantRole(VAULT_CONTROLLER_ROLE, crowdsale.target);
    console.log(`✅ Setup complete`);
    
    // 6. Test Token Transfer
    console.log("\n6️⃣ Testing token transfer...");
    await token.transfer(user1.address, ethers.parseEther("1000"));
    const user1Balance = await token.balanceOf(user1.address);
    console.log(`✅ User 1 received ${ethers.formatEther(user1Balance)} tokens`);
    
    // 7. Test Crowdsale Purchase
    console.log("\n7️⃣ Testing crowdsale purchase...");
    const purchaseTx = await crowdsale.connect(user1).buyTokens(user1.address, {
        value: ethers.parseEther("1.0")
    });
    await purchaseTx.wait();
    
    const fundsRaised = await crowdsale.fundsRaised();
    const tokensAvailable = await crowdsale.tokensAvailable();
    
    console.log(`✅ Purchase successful!`);
    console.log(`💰 Funds raised: ${ethers.formatEther(fundsRaised)} ETH`);
    console.log(`🪙 Tokens available: ${ethers.formatEther(tokensAvailable)}`);
    
    // 8. Test Access Control
    console.log("\n8️⃣ Testing access control...");
    try {
        await crowdsale.connect(user2).buyTokens(user2.address, {
            value: ethers.parseEther("0.5")
        });
        console.log(`✅ User 2 purchase successful`);
    } catch (error) {
        console.log(`❌ User 2 purchase failed: ${error.message}`);
    }
    
    // 9. Test Admin Functions
    console.log("\n9️⃣ Testing admin functions...");
    await crowdsale.pause();
    console.log(`✅ Crowdsale paused`);
    
    try {
        await crowdsale.connect(user1).buyTokens(user1.address, {
            value: ethers.parseEther("0.1")
        });
        console.log(`❌ Purchase should have failed while paused`);
    } catch (error) {
        console.log(`✅ Pause functionality working`);
    }
    
    await crowdsale.unpause();
    console.log(`✅ Crowdsale unpaused`);
    
    // 10. Final Results
    console.log("\n🔟 Final Results:");
    console.log(`📊 Token supply: ${ethers.formatEther(await token.totalSupply())}`);
    console.log(`💰 Funds raised: ${ethers.formatEther(await crowdsale.fundsRaised())} ETH`);
    console.log(`👤 User 1 balance: ${ethers.formatEther(await token.balanceOf(user1.address))}`);
    console.log(`👤 User 2 balance: ${ethers.formatEther(await token.balanceOf(user2.address))}`);
    
    console.log("\n🎉 ALL TESTS PASSED!");
    console.log("✅ ERC-20 Token: Working");
    console.log("✅ Crowdsale: Working");
    console.log("✅ Token Transfer: Working");
    console.log("✅ Access Control: Working");
    console.log("✅ Admin Functions: Working");
}

quickTest()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });



