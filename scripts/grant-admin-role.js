const hre = require("hardhat");

async function main() {
    // Get address from command line argument
    const newAdminAddress = process.argv[2];
    
    if (!newAdminAddress) {
        console.error("❌ Error: Please provide an address as an argument");
        console.log("\nUsage:");
        console.log("  npx hardhat run scripts/grant-admin-role.js --network localhost YOUR_METAMASK_ADDRESS");
        console.log("\nExample:");
        console.log("  npx hardhat run scripts/grant-admin-role.js --network localhost 0x1234567890abcdef1234567890abcdef12345678");
        process.exit(1);
    }
    
    const crowdsaleAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";
    
    console.log("\n════════════════════════════════════════════════════════");
    console.log("  Granting Admin Role");
    console.log("════════════════════════════════════════════════════════\n");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer account:", deployer.address);
    console.log("Target address:  ", newAdminAddress);
    console.log("Crowdsale:       ", crowdsaleAddress);
    
    // Get contract instance
    const crowdsale = await hre.ethers.getContractAt("ExampleCrowdSale", crowdsaleAddress);
    
    // Get the admin role bytes32
    const adminRole = await crowdsale.DEFAULT_ADMIN_ROLE();
    console.log("\nAdmin Role (bytes32):", adminRole);
    
    // Check if deployer has admin role
    const deployerIsAdmin = await crowdsale.hasRole(adminRole, deployer.address);
    console.log("Deployer has admin role:", deployerIsAdmin);
    
    if (!deployerIsAdmin) {
        console.error("\n❌ Error: Deployer does not have admin role!");
        console.error("Cannot grant admin role to others.");
        process.exit(1);
    }
    
    // Check if target already has admin role
    const alreadyAdmin = await crowdsale.hasRole(adminRole, newAdminAddress);
    if (alreadyAdmin) {
        console.log("\n✅ Address already has admin role!");
        process.exit(0);
    }
    
    // Grant admin role
    console.log("\nGranting admin role...");
    const tx = await crowdsale.grantRole(adminRole, newAdminAddress);
    console.log("Transaction hash:", tx.hash);
    
    console.log("Waiting for confirmation...");
    await tx.wait();
    
    // Verify
    const hasRole = await crowdsale.hasRole(adminRole, newAdminAddress);
    
    console.log("\n════════════════════════════════════════════════════════");
    if (hasRole) {
        console.log("  ✅ SUCCESS! Admin role granted to:");
        console.log("  ", newAdminAddress);
    } else {
        console.log("  ❌ FAILED! Role not granted");
    }
    console.log("════════════════════════════════════════════════════════\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Error:", error.message);
        process.exit(1);
    });
