const { ethers } = require("hardhat");

async function main() {
    // Your MetaMask address - CHANGE THIS!
    const newAdmin = "YOUR_METAMASK_ADDRESS_HERE";
    
    const crowdsaleAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";
    
    const [deployer] = await ethers.getSigners();
    console.log("Granting admin role from:", deployer.address);
    
    const crowdsale = await ethers.getContractAt("ExampleCrowdSale", crowdsaleAddress);
    
    const adminRole = await crowdsale.DEFAULT_ADMIN_ROLE();
    
    console.log("Granting admin role to:", newAdmin);
    const tx = await crowdsale.grantRole(adminRole, newAdmin);
    await tx.wait();
    
    console.log("✅ Admin role granted!");
    
    // Verify
    const hasRole = await crowdsale.hasRole(adminRole, newAdmin);
    console.log("Verification - Has admin role:", hasRole);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
