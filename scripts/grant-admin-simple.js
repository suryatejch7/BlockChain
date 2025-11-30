async function main() {
    const { ethers } = require("hardhat");
    
    const crowdsaleAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
    const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    
    console.log("Granting DEFAULT_ADMIN_ROLE to", adminAddress);
    console.log("Crowdsale:", crowdsaleAddress);
    
    const [deployer] = await ethers.getSigners();
    const crowdsale = await ethers.getContractAt("ExampleCrowdSale", crowdsaleAddress);
    
    const adminRole = await crowdsale.DEFAULT_ADMIN_ROLE();
    const alreadyAdmin = await crowdsale.hasRole(adminRole, adminAddress);
    
    if (alreadyAdmin) {
        console.log("✅ Address already has admin role!");
        return;
    }
    
    console.log("Granting admin role...");
    const tx = await crowdsale.grantRole(adminRole, adminAddress);
    await tx.wait();
    
    console.log("✅ Admin role granted successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
