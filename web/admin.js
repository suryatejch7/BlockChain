// Admin Panel JavaScript
let provider, signer, tokenContract, crowdsaleContract;
let isConnected = false;
let isAdmin = false;

// ADMIN PASSWORD (Change this to your desired password)
const ADMIN_PASSWORD = "admin123";

// Contract addresses (will be loaded from localStorage or defaults)
const CONTRACT_ADDRESSES = {
    token: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    crowdsale: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    vestingVault: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
};

// Contract ABIs
const TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function supportsInterface(bytes4) view returns (bool)"
];

const CROWDSALE_ABI = [
    "function token() view returns (address)",
    "function wallet() view returns (address)",
    "function fundsRaised() view returns (uint256)",
    "function tokensAvailable() view returns (uint256)",
    "function paused() view returns (bool)",
    "function pause()",
    "function unpause()",
    "function grantRole(bytes32 role, address account)",
    "function hasRole(bytes32 role, address account) view returns (bool)",
    "function WHITELISTED_ROLE() view returns (bytes32)",
    "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
    "function externalBuyTokens(address beneficiary, uint256 tokenAmount)",
    "function supportsInterface(bytes4) view returns (bool)"
];

// Password verification
function verifyPassword() {
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        // Password correct - hide login modal and show admin panel
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        
        // Initialize the admin panel
        initializeAdmin();
    } else {
        // Show error
        errorDiv.style.display = 'block';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
        
        // Shake animation
        const modal = document.querySelector('.login-modal');
        modal.style.animation = 'shake 0.5s';
        setTimeout(() => {
            modal.style.animation = 'slideIn 0.3s ease-out';
        }, 500);
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Allow Enter key to submit password
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyPassword();
            }
        });
    }
});

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Initialize admin panel
async function initializeAdmin() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            showMessage('error', 'MetaMask not detected. Please install MetaMask.');
            return;
        }
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        isConnected = true;
        
        // Display address
        document.getElementById('adminAddress').textContent = 
            address.substring(0, 6) + '...' + address.substring(38);
        
        // Load contract addresses
        loadContractAddresses();
        
        // Initialize contracts
        await initializeContracts();
        
        // Check admin status
        await checkAdminStatus();
        
        // Update UI
        await updateUI();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showMessage('error', 'Failed to initialize: ' + error.message);
    }
}

// Load contract addresses from localStorage
function loadContractAddresses() {
    const saved = localStorage.getItem('contractAddresses');
    if (saved) {
        const addresses = JSON.parse(saved);
        CONTRACT_ADDRESSES.token = addresses.token;
        CONTRACT_ADDRESSES.crowdsale = addresses.crowdsale;
        CONTRACT_ADDRESSES.vestingVault = addresses.vestingVault;
    }
}

// Initialize contracts
async function initializeContracts() {
    try {
        if (CONTRACT_ADDRESSES.token) {
            tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.token, TOKEN_ABI, signer);
        }
        if (CONTRACT_ADDRESSES.crowdsale) {
            crowdsaleContract = new ethers.Contract(CONTRACT_ADDRESSES.crowdsale, CROWDSALE_ABI, signer);
        }
    } catch (error) {
        console.error('Contract initialization error:', error);
        showMessage('error', 'Failed to initialize contracts');
    }
}

// Check if user is admin
async function checkAdminStatus() {
    try {
        if (crowdsaleContract) {
            const address = await signer.getAddress();
            const adminRole = await crowdsaleContract.DEFAULT_ADMIN_ROLE();
            isAdmin = await crowdsaleContract.hasRole(adminRole, address);
            
            const statusElement = document.getElementById('adminStatus');
            if (isAdmin) {
                statusElement.textContent = '✅ Verified';
                statusElement.style.color = '#28a745';
            } else {
                statusElement.textContent = '❌ Not Admin';
                statusElement.style.color = '#dc3545';
                showMessage('error', 'Warning: Connected wallet does not have admin privileges on the contract.');
            }
        }
    } catch (error) {
        console.error('Admin check error:', error);
        document.getElementById('adminStatus').textContent = '⚠️ Error';
    }
}

// Update UI
async function updateUI() {
    try {
        if (crowdsaleContract) {
            const paused = await crowdsaleContract.paused();
            const fundsRaised = await crowdsaleContract.fundsRaised();
            
            document.getElementById('crowdsaleStatus').textContent = paused ? '⏸ Paused' : '▶ Active';
            document.getElementById('crowdsaleStatus').style.color = paused ? '#dc3545' : '#28a745';
            document.getElementById('fundsRaised').textContent = ethers.formatEther(fundsRaised) + ' ETH';
        }
    } catch (error) {
        console.error('UI update error:', error);
    }
}

// Pause crowdsale
async function pauseCrowdsale() {
    if (!isAdmin) {
        showStatusMessage('pauseStatus', 'error', '❌ Admin access required');
        return;
    }
    
    if (!crowdsaleContract) {
        showStatusMessage('pauseStatus', 'error', '❌ Contract not initialized');
        return;
    }
    
    try {
        showStatusMessage('pauseStatus', 'info', '<div class="loading"></div> Pausing crowdsale...');
        
        const tx = await crowdsaleContract.pause();
        showStatusMessage('pauseStatus', 'info', '⏳ Transaction sent: ' + tx.hash.substring(0, 20) + '...');
        
        await tx.wait();
        
        showStatusMessage('pauseStatus', 'success', '✅ Crowdsale paused successfully!');
        addTransaction('Pause Crowdsale', 'Crowdsale operations halted', tx.hash);
        
        await updateUI();
    } catch (error) {
        console.error('Pause error:', error);
        showStatusMessage('pauseStatus', 'error', '❌ Failed to pause: ' + error.message);
    }
}

// Unpause crowdsale
async function unpauseCrowdsale() {
    if (!isAdmin) {
        showStatusMessage('unpauseStatus', 'error', '❌ Admin access required');
        return;
    }
    
    if (!crowdsaleContract) {
        showStatusMessage('unpauseStatus', 'error', '❌ Contract not initialized');
        return;
    }
    
    try {
        showStatusMessage('unpauseStatus', 'info', '<div class="loading"></div> Unpausing crowdsale...');
        
        const tx = await crowdsaleContract.unpause();
        showStatusMessage('unpauseStatus', 'info', '⏳ Transaction sent: ' + tx.hash.substring(0, 20) + '...');
        
        await tx.wait();
        
        showStatusMessage('unpauseStatus', 'success', '✅ Crowdsale unpaused successfully!');
        addTransaction('Unpause Crowdsale', 'Crowdsale operations resumed', tx.hash);
        
        await updateUI();
    } catch (error) {
        console.error('Unpause error:', error);
        showStatusMessage('unpauseStatus', 'error', '❌ Failed to unpause: ' + error.message);
    }
}

// Whitelist user
async function whitelistUser() {
    if (!isAdmin) {
        showStatusMessage('whitelistStatus', 'error', '❌ Admin access required');
        return;
    }
    
    try {
        const address = document.getElementById('whitelistAddress').value.trim();
        
        if (!address || !ethers.isAddress(address)) {
            showStatusMessage('whitelistStatus', 'error', '❌ Please enter a valid Ethereum address');
            return;
        }
        
        showStatusMessage('whitelistStatus', 'info', '<div class="loading"></div> Adding to whitelist...');
        
        const whitelistRole = await crowdsaleContract.WHITELISTED_ROLE();
        const tx = await crowdsaleContract.grantRole(whitelistRole, address);
        
        showStatusMessage('whitelistStatus', 'info', '⏳ Transaction sent: ' + tx.hash);
        
        await tx.wait();
        
        showStatusMessage('whitelistStatus', 'success', '✅ Address whitelisted successfully!');
        addTransaction('Whitelist User', 'Added ' + address.substring(0, 10) + '...', tx.hash);
        
        document.getElementById('whitelistAddress').value = '';
        
    } catch (error) {
        console.error('Whitelist error:', error);
        showStatusMessage('whitelistStatus', 'error', '❌ Failed to whitelist: ' + error.message);
    }
}

// Batch whitelist
async function batchWhitelist() {
    if (!isAdmin) {
        showStatusMessage('batchStatus', 'error', '❌ Admin access required');
        return;
    }
    
    try {
        const addresses = document.getElementById('batchWhitelist').value
            .split('\n')
            .map(addr => addr.trim())
            .filter(addr => addr.length > 0);
        
        if (addresses.length === 0) {
            showStatusMessage('batchStatus', 'error', '❌ Please enter at least one address');
            return;
        }
        
        // Validate all addresses
        for (const addr of addresses) {
            if (!ethers.isAddress(addr)) {
                showStatusMessage('batchStatus', 'error', `❌ Invalid address: ${addr}`);
                return;
            }
        }
        
        showStatusMessage('batchStatus', 'info', `<div class="loading"></div> Adding ${addresses.length} addresses...`);
        
        const whitelistRole = await crowdsaleContract.WHITELISTED_ROLE();
        let successCount = 0;
        
        for (const address of addresses) {
            try {
                const tx = await crowdsaleContract.grantRole(whitelistRole, address);
                await tx.wait();
                successCount++;
                showStatusMessage('batchStatus', 'info', `⏳ Progress: ${successCount}/${addresses.length}`);
            } catch (err) {
                console.error('Failed for address:', address, err);
            }
        }
        
        showStatusMessage('batchStatus', 'success', `✅ Successfully whitelisted ${successCount}/${addresses.length} addresses!`);
        addTransaction('Batch Whitelist', `Added ${successCount} addresses`, 'batch');
        
        document.getElementById('batchWhitelist').value = '';
        
    } catch (error) {
        console.error('Batch whitelist error:', error);
        showStatusMessage('batchStatus', 'error', '❌ Failed: ' + error.message);
    }
}

// External purchase
async function externalPurchase() {
    if (!isAdmin) {
        showStatusMessage('externalStatus', 'error', '❌ Admin access required');
        return;
    }
    
    if (!crowdsaleContract) {
        showStatusMessage('externalStatus', 'error', '❌ Contract not initialized');
        return;
    }
    
    try {
        const beneficiary = document.getElementById('externalAddress').value.trim();
        const ethAmount = document.getElementById('externalAmount').value;
        
        if (!beneficiary || !ethers.isAddress(beneficiary)) {
            showStatusMessage('externalStatus', 'error', '❌ Please enter a valid beneficiary address');
            return;
        }
        
        if (!ethAmount || ethAmount <= 0) {
            showStatusMessage('externalStatus', 'error', '❌ Please enter a valid ETH amount');
            return;
        }
        
        showStatusMessage('externalStatus', 'info', '<div class="loading"></div> Processing external purchase...');
        
        // Convert ETH to token amount (assuming getTokenAmount function exists)
        const weiAmount = ethers.parseEther(ethAmount);
        const tokenAmount = await crowdsaleContract.getTokenAmount(weiAmount);
        
        const tx = await crowdsaleContract.externalBuyTokens(beneficiary, tokenAmount);
        
        showStatusMessage('externalStatus', 'info', '⏳ Transaction sent: ' + tx.hash.substring(0, 20) + '...');
        
        await tx.wait();
        
        showStatusMessage('externalStatus', 'success', `✅ Allocated tokens to ${beneficiary.substring(0, 10)}...`);
        addTransaction('External Purchase', `${ethAmount} ETH to ${beneficiary.substring(0, 10)}...`, tx.hash);
        
        // Clear inputs
        document.getElementById('externalAddress').value = '';
        document.getElementById('externalAmount').value = '';
        
        await updateUI();
        
    } catch (error) {
        console.error('External purchase error:', error);
        showStatusMessage('externalStatus', 'error', '❌ Failed: ' + error.message);
    }
}

// Show status message in specific element
function showStatusMessage(elementId, type, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.className = `status-message ${type}`;
        element.innerHTML = message;
        element.style.display = 'block';
    }
}

// Show global message
function showMessage(type, message) {
    // You can implement a toast notification here
    alert(message);
}

// Add transaction to log
function addTransaction(type, description, hash) {
    const logDiv = document.getElementById('transactionLog');
    
    // Remove "no transactions" message if it exists
    if (logDiv.querySelector('p')) {
        logDiv.innerHTML = '';
    }
    
    const transactionDiv = document.createElement('div');
    transactionDiv.className = 'transaction-item';
    
    const timestamp = new Date().toLocaleTimeString();
    const hashDisplay = hash === 'batch' ? 'Multiple transactions' : `Tx: ${hash.substring(0, 20)}...`;
    
    transactionDiv.innerHTML = `
        <strong>${type}</strong>: ${description}<br>
        <small>${timestamp} - ${hashDisplay}</small>
    `;
    
    logDiv.insertBefore(transactionDiv, logDiv.firstChild);
}

// Initialize on page load
window.addEventListener('load', () => {
    // Show login modal on load
    const loginOverlay = document.getElementById('loginOverlay');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginOverlay && adminPanel) {
        loginOverlay.style.display = 'flex';
        adminPanel.style.display = 'none';
    }
});
