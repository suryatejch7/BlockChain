// Web3 Integration for Crowdsale Demo
let provider, signer, tokenContract, crowdsaleContract, vestingVaultContract;
let isConnected = false;
let isAdmin = false;

// Contract addresses (updated with latest deployment - FIXED FORMULA)
const CONTRACT_ADDRESSES = {
    token: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    crowdsale: "0x9A676e781A523b5d0C0e43731313A708CB607508",
    vestingVault: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0"
};

// ABI for contracts (complete)
const TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)", 
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function supportsInterface(bytes4) view returns (bool)"
];

const CROWDSALE_ABI = [
    "function token() view returns (address)",
    "function wallet() view returns (address)",
    "function fundsRaised() view returns (uint256)",
    "function tokensAvailable() view returns (uint256)",
    "function paused() view returns (bool)",
    "function buyTokens(address beneficiary) payable",
    "function externalBuyTokens(address beneficiary, uint256 tokenAmount)",
    "function pause()",
    "function unpause()",
    "function grantRole(bytes32 role, address account)",
    "function hasRole(bytes32 role, address account) view returns (bool)",
    "function WHITELISTED_ROLE() view returns (bytes32)",
    "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
    "function getTokenAmount(uint256 weiAmount) view returns (uint256)",
    "function getWeiAmount(uint256 tokenAmount) view returns (uint256)",
    "function supportsInterface(bytes4) view returns (bool)"
];

const VESTING_VAULT_ABI = [
    "function token() view returns (address)",
    "function vestingFor(address) view returns (tuple(address beneficiary, uint256 releaseTime, uint256 tokenAmount)[])",
    "function release()"
];

// Initialize the application
async function init() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            provider = new ethers.BrowserProvider(window.ethereum);
            await connectWallet();
        } else {
            showStatus('error', 'MetaMask not detected. Please install MetaMask to use this application.');
            return;
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showStatus('error', 'Failed to initialize application: ' + error.message);
    }
}

// Connect wallet
async function connectWallet() {
    try {
        showStatus('info', 'Connecting to wallet...');
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        isConnected = true;
        showStatus('success', `Connected to wallet: ${address.substring(0, 6)}...${address.substring(38)}`);
        
        // Load contract addresses from localStorage or use defaults
        loadContractAddresses();
        
        // Initialize contracts
        await initializeContracts();
        
        // Update UI
        await updateUI();
        
    } catch (error) {
        console.error('Connection error:', error);
        showStatus('error', 'Failed to connect wallet: ' + error.message);
    }
}

// Load contract addresses
function loadContractAddresses() {
    const saved = localStorage.getItem('contractAddresses');
    if (saved) {
        const addresses = JSON.parse(saved);
        CONTRACT_ADDRESSES.token = addresses.token;
        CONTRACT_ADDRESSES.crowdsale = addresses.crowdsale;
        CONTRACT_ADDRESSES.vestingVault = addresses.vestingVault;
    }
    // CONTRACT_ADDRESSES already has the correct defaults from the top of the file
    // No need to override with old addresses
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
        if (CONTRACT_ADDRESSES.vestingVault) {
            vestingVaultContract = new ethers.Contract(CONTRACT_ADDRESSES.vestingVault, VESTING_VAULT_ABI, signer);
        }
    } catch (error) {
        console.error('Contract initialization error:', error);
        showStatus('error', 'Failed to initialize contracts: ' + error.message);
    }
}

// Update UI with current data
async function updateUI() {
    if (!isConnected) return;
    
    try {
        // Update balances
        await updateBalances();
        
        // Update contract info
        await updateContractInfo();
        
        // Check admin status
        await checkAdminStatus();
        
    } catch (error) {
        console.error('UI update error:', error);
        showStatus('error', 'Failed to update UI: ' + error.message);
    }
}

// Update user balances
async function updateBalances() {
    try {
        const address = await signer.getAddress();
        
        // ETH balance
        const ethBalance = await provider.getBalance(address);
        document.getElementById('ethBalance').textContent = ethers.formatEther(ethBalance) + ' ETH';
        
        // Token balance
        if (tokenContract) {
            const tokenBalance = await tokenContract.balanceOf(address);
            document.getElementById('tokenBalance').textContent = ethers.formatEther(tokenBalance) + ' ATK';
        }
        
    } catch (error) {
        console.error('Balance update error:', error);
    }
}

// Update contract information
async function updateContractInfo() {
    try {
        if (tokenContract) {
            const name = await tokenContract.name();
            const symbol = await tokenContract.symbol();
            const totalSupply = await tokenContract.totalSupply();
            
            document.getElementById('tokenName').textContent = name;
            document.getElementById('tokenSymbol').textContent = symbol;
            document.getElementById('totalSupply').textContent = ethers.formatEther(totalSupply) + ' ' + symbol;
        }
        
        if (crowdsaleContract) {
            const fundsRaised = await crowdsaleContract.fundsRaised();
            const tokensAvailable = await crowdsaleContract.tokensAvailable();
            const paused = await crowdsaleContract.paused();
            
            document.getElementById('fundsRaised').textContent = ethers.formatEther(fundsRaised);
            document.getElementById('tokensAvailable').textContent = ethers.formatEther(tokensAvailable);
            document.getElementById('crowdsaleStatus').textContent = paused ? 'Paused' : 'Active';
        }
        
    } catch (error) {
        console.error('Contract info update error:', error);
    }
}

// Check if user is admin
async function checkAdminStatus() {
    try {
        if (crowdsaleContract) {
            const address = await signer.getAddress();
            const adminRole = await crowdsaleContract.DEFAULT_ADMIN_ROLE();
            isAdmin = await crowdsaleContract.hasRole(adminRole, address);
            
            // Show/hide admin sections
            const adminSections = document.querySelectorAll('.admin-section');
            adminSections.forEach(section => {
                section.style.display = isAdmin ? 'block' : 'none';
            });
        }
    } catch (error) {
        console.error('Admin check error:', error);
    }
}

// Buy tokens
async function buyTokens() {
    if (!isConnected || !crowdsaleContract) {
        showStatus('error', 'Please connect wallet and ensure contracts are deployed');
        return;
    }
    
    try {
        const ethAmount = document.getElementById('ethAmount').value;
        if (!ethAmount || ethAmount <= 0) {
            showStatus('error', 'Please enter a valid ETH amount');
            return;
        }
        
        const buyBtn = document.getElementById('buyBtn');
        const buyStatus = document.getElementById('buyStatus');
        
        buyBtn.disabled = true;
        buyBtn.textContent = 'Processing...';
        buyStatus.innerHTML = '<div class="loading"></div> Processing transaction...';
        
        const address = await signer.getAddress();
        const tx = await crowdsaleContract.buyTokens(address, {
            value: ethers.parseEther(ethAmount)
        });
        
        buyStatus.innerHTML = '<div class="status info">Transaction sent: ' + tx.hash + '</div>';
        
        await tx.wait();
        
        buyStatus.innerHTML = '<div class="status success">✅ Tokens purchased successfully!</div>';
        addTransaction('Token Purchase', ethAmount + ' ETH', tx.hash);
        
        // Update UI
        await updateUI();
        
    } catch (error) {
        console.error('Buy tokens error:', error);
        showStatus('error', 'Failed to buy tokens: ' + error.message);
        document.getElementById('buyStatus').innerHTML = '<div class="status error">❌ Purchase failed</div>';
    } finally {
        const buyBtn = document.getElementById('buyBtn');
        buyBtn.disabled = false;
        buyBtn.textContent = 'Buy Tokens';
    }
}

// Transfer tokens
async function transferTokens() {
    if (!isConnected || !tokenContract) {
        showStatus('error', 'Please connect your wallet first');
        return;
    }
    
    try {
        const recipient = document.getElementById('transferTo').value;
        const amount = document.getElementById('transferAmount').value;
        
        if (!recipient || !ethers.isAddress(recipient)) {
            showStatus('error', 'Please enter a valid recipient address');
            return;
        }
        
        if (!amount || amount <= 0) {
            showStatus('error', 'Please enter a valid token amount');
            return;
        }
        
        const transferBtn = document.getElementById('transferBtn');
        const transferStatus = document.getElementById('transferStatus');
        
        transferBtn.disabled = true;
        transferBtn.textContent = 'Processing...';
        transferStatus.innerHTML = '<div class="loading"></div> Processing transfer...';
        
        const tx = await tokenContract.transfer(recipient, ethers.parseEther(amount));
        
        transferStatus.innerHTML = '<div class="status info">Transaction sent: ' + tx.hash + '</div>';
        
        await tx.wait();
        
        transferStatus.innerHTML = '<div class="status success">✅ Tokens transferred successfully!</div>';
        addTransaction('Token Transfer', amount + ' tokens to ' + recipient.substring(0, 6) + '...', tx.hash);
        
        // Clear inputs
        document.getElementById('transferTo').value = '';
        document.getElementById('transferAmount').value = '';
        
        // Update UI
        await updateUI();
        
    } catch (error) {
        console.error('Transfer error:', error);
        showStatus('error', 'Failed to transfer tokens: ' + error.message);
        document.getElementById('transferStatus').innerHTML = '<div class="status error">❌ Transfer failed</div>';
    } finally {
        const transferBtn = document.getElementById('transferBtn');
        transferBtn.disabled = false;
        transferBtn.textContent = 'Send Tokens';
    }
}

// Pause crowdsale
async function pauseCrowdsale() {
    if (!isAdmin || !crowdsaleContract) {
        showStatus('error', 'Admin access required');
        return;
    }
    
    try {
        const tx = await crowdsaleContract.pause();
        await tx.wait();
        showStatus('success', 'Crowdsale paused successfully');
        addTransaction('Admin Action', 'Paused Crowdsale', tx.hash);
        await updateUI();
    } catch (error) {
        console.error('Pause error:', error);
        showStatus('error', 'Failed to pause crowdsale: ' + error.message);
    }
}

// Unpause crowdsale
async function unpauseCrowdsale() {
    if (!isAdmin || !crowdsaleContract) {
        showStatus('error', 'Admin access required');
        return;
    }
    
    try {
        const tx = await crowdsaleContract.unpause();
        await tx.wait();
        showStatus('success', 'Crowdsale unpaused successfully');
        addTransaction('Admin Action', 'Unpaused Crowdsale', tx.hash);
        await updateUI();
    } catch (error) {
        console.error('Unpause error:', error);
        showStatus('error', 'Failed to unpause crowdsale: ' + error.message);
    }
}

// Whitelist user
async function whitelistUser() {
    if (!isAdmin || !crowdsaleContract) {
        showStatus('error', 'Admin access required');
        return;
    }
    
    try {
        const address = document.getElementById('whitelistAddress').value;
        if (!address) {
            showStatus('error', 'Please enter an address');
            return;
        }
        
        const whitelistRole = await crowdsaleContract.WHITELISTED_ROLE();
        const tx = await crowdsaleContract.grantRole(whitelistRole, address);
        await tx.wait();
        
        showStatus('success', 'User whitelisted successfully');
        addTransaction('Admin Action', 'Whitelisted User', tx.hash);
        
    } catch (error) {
        console.error('Whitelist error:', error);
        showStatus('error', 'Failed to whitelist user: ' + error.message);
    }
}

// External purchase
async function externalPurchase() {
    if (!isAdmin || !crowdsaleContract) {
        showStatus('error', 'Admin access required');
        return;
    }
    
    try {
        const beneficiary = document.getElementById('externalAddress').value;
        const amount = document.getElementById('externalAmount').value;
        
        if (!beneficiary || !amount) {
            showStatus('error', 'Please enter beneficiary address and amount');
            return;
        }
        
        const tx = await crowdsaleContract.externalBuyTokens(beneficiary, ethers.parseEther(amount));
        await tx.wait();
        
        showStatus('success', 'External purchase processed successfully');
        addTransaction('External Purchase', amount + ' tokens', tx.hash);
        await updateUI();
        
    } catch (error) {
        console.error('External purchase error:', error);
        showStatus('error', 'Failed to process external purchase: ' + error.message);
    }
}

// Show status message
function showStatus(type, message) {
    const statusDiv = document.getElementById('connectionStatus');
    statusDiv.className = `status ${type}`;
    statusDiv.innerHTML = message;
}

// Add transaction to history
function addTransaction(type, description, hash) {
    const historyDiv = document.getElementById('transactionHistory');
    const transactionDiv = document.createElement('div');
    transactionDiv.className = 'status info';
    transactionDiv.innerHTML = `
        <strong>${type}:</strong> ${description}<br>
        <small>Tx: ${hash}</small>
    `;
    historyDiv.insertBefore(transactionDiv, historyDiv.firstChild);
}

// Set contract addresses (for deployment)
function setContractAddresses(token, crowdsale, vestingVault) {
    CONTRACT_ADDRESSES.token = token;
    CONTRACT_ADDRESSES.crowdsale = crowdsale;
    CONTRACT_ADDRESSES.vestingVault = vestingVault;
    
    localStorage.setItem('contractAddresses', JSON.stringify(CONTRACT_ADDRESSES));
    showStatus('success', 'Contract addresses updated');
}

// Initialize when page loads
window.addEventListener('load', init);



