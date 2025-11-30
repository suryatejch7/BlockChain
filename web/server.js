const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// API endpoint to get contract addresses
app.get('/api/contracts', (req, res) => {
    res.json({
        token: process.env.TOKEN_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        crowdsale: process.env.CROWDSALE_ADDRESS || "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
        vestingVault: process.env.VESTING_VAULT_ADDRESS || "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    });
});

// API endpoint to update contract addresses
app.post('/api/contracts', express.json(), (req, res) => {
    const { token, crowdsale, vestingVault } = req.body;
    
    if (token) process.env.TOKEN_ADDRESS = token;
    if (crowdsale) process.env.CROWDSALE_ADDRESS = crowdsale;
    if (vestingVault) process.env.VESTING_VAULT_ADDRESS = vestingVault;
    
    res.json({ success: true, message: 'Contract addresses updated' });
});

// Serve the login page as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Web interface running at http://localhost:${PORT}`);
    console.log(`📱 Open this URL in your browser to access the crowdsale demo`);
    console.log(`🔗 Make sure your Hardhat node is running on http://localhost:8545`);
});



