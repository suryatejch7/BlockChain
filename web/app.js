// Web3 Integration for Crowdsale Demo
let provider, signer, tokenContract, crowdsaleContract, vestingVaultContract;
let isConnected = false;

// Contract addresses (updated with latest deployment - FIXED FORMULA)
const CONTRACT_ADDRESSES = {
    token: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    crowdsale: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    vestingVault: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
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
    // ALWAYS use the hardcoded addresses from the file
    // Don't load from localStorage to avoid stale addresses
    console.log("📍 Using contract addresses:", CONTRACT_ADDRESSES);
    
    // Save current addresses to localStorage for reference
    localStorage.setItem('contractAddresses', JSON.stringify(CONTRACT_ADDRESSES));
}

// Initialize contracts
async function initializeContracts() {
    try {
        console.log("🔗 Initializing contracts with addresses:", CONTRACT_ADDRESSES);
        
        if (CONTRACT_ADDRESSES.token) {
            tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.token, TOKEN_ABI, signer);
            console.log("✅ Token contract initialized");
        }
        if (CONTRACT_ADDRESSES.crowdsale) {
            crowdsaleContract = new ethers.Contract(CONTRACT_ADDRESSES.crowdsale, CROWDSALE_ABI, signer);
            console.log("✅ Crowdsale contract initialized");
        }
        if (CONTRACT_ADDRESSES.vestingVault) {
            vestingVaultContract = new ethers.Contract(CONTRACT_ADDRESSES.vestingVault, VESTING_VAULT_ABI, signer);
            console.log("✅ Vesting vault contract initialized");
        }
    } catch (error) {
        console.error('❌ Contract initialization error:', error);
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
        
    } catch (error) {
        console.error('UI update error:', error);
        showStatus('error', 'Failed to update UI: ' + error.message);
    }
}

// Update user balances
async function updateBalances() {
    try {
        const address = await signer.getAddress();
        console.log("💰 Updating balances for:", address);
        
        // ETH balance
        const ethBalance = await provider.getBalance(address);
        console.log("ETH Balance:", ethers.formatEther(ethBalance));
        document.getElementById('ethBalance').textContent = ethers.formatEther(ethBalance) + ' ETH';
        
        // Token balance
        if (tokenContract) {
            const tokenBalance = await tokenContract.balanceOf(address);
            console.log("Token Balance:", ethers.formatEther(tokenBalance));
            document.getElementById('tokenBalance').textContent = ethers.formatEther(tokenBalance) + ' ATK';
        }
        
    } catch (error) {
        console.error('❌ Balance update error:', error);
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

// Buy tokens
async function buyTokens() {
    if (!isConnected || !crowdsaleContract) {
        const buyStatus = document.getElementById('buyStatus');
        buyStatus.className = 'status error';
        buyStatus.textContent = '❌ Please connect wallet first';
        return;
    }
    
    try {
        const ethAmount = document.getElementById('ethAmount').value;
        if (!ethAmount || ethAmount <= 0) {
            const buyStatus = document.getElementById('buyStatus');
            buyStatus.className = 'status error';
            buyStatus.textContent = '❌ Please enter a valid ETH amount';
            return;
        }
        
        const buyBtn = document.getElementById('buyBtn');
        const buyStatus = document.getElementById('buyStatus');
        
        buyBtn.disabled = true;
        buyBtn.textContent = 'Processing...';
        buyStatus.className = 'status info';
        buyStatus.innerHTML = '<div class="loading"></div> Processing transaction...';
        
        const address = await signer.getAddress();
        const tx = await crowdsaleContract.buyTokens(address, {
            value: ethers.parseEther(ethAmount)
        });
        
        buyStatus.className = 'status info';
        buyStatus.textContent = '⏳ Transaction sent: ' + tx.hash.substring(0, 20) + '...';
        
        await tx.wait();
        
        buyStatus.className = 'status success';
        buyStatus.textContent = '✅ Tokens purchased successfully!';
        addTransaction('Token Purchase', ethAmount + ' ETH', tx.hash);
        
        // Clear input
        document.getElementById('ethAmount').value = '';
        
        // Update UI
        await updateUI();
        
    } catch (error) {
        console.error('Buy tokens error:', error);
        const buyStatus = document.getElementById('buyStatus');
        buyStatus.className = 'status error';
        buyStatus.textContent = '❌ Failed to buy tokens: ' + error.message;
    } finally {
        const buyBtn = document.getElementById('buyBtn');
        if (buyBtn) {
            buyBtn.disabled = false;
            buyBtn.textContent = 'Purchase Tokens';
        }
    }
}

// Transfer tokens
async function transferTokens() {
    if (!isConnected || !tokenContract) {
        const transferStatus = document.getElementById('transferStatus');
        transferStatus.className = 'status error';
        transferStatus.textContent = '❌ Please connect your wallet first';
        return;
    }
    
    try {
        const recipient = document.getElementById('transferTo').value;
        const amount = document.getElementById('transferAmount').value;
        
        if (!recipient || !ethers.isAddress(recipient)) {
            const transferStatus = document.getElementById('transferStatus');
            transferStatus.className = 'status error';
            transferStatus.textContent = '❌ Please enter a valid recipient address';
            return;
        }
        
        if (!amount || amount <= 0) {
            const transferStatus = document.getElementById('transferStatus');
            transferStatus.className = 'status error';
            transferStatus.textContent = '❌ Please enter a valid token amount';
            return;
        }
        
        const transferBtn = document.getElementById('transferBtn');
        const transferStatus = document.getElementById('transferStatus');
        
        transferBtn.disabled = true;
        transferBtn.textContent = 'Processing...';
        transferStatus.className = 'status info';
        transferStatus.innerHTML = '<div class="loading"></div> Processing transfer...';
        
        const tx = await tokenContract.transfer(recipient, ethers.parseEther(amount));
        
        transferStatus.className = 'status info';
        transferStatus.textContent = '⏳ Transaction sent: ' + tx.hash.substring(0, 20) + '...';
        
        await tx.wait();
        
        transferStatus.className = 'status success';
        transferStatus.textContent = '✅ Tokens transferred successfully!';
        addTransaction('Token Transfer', amount + ' tokens to ' + recipient.substring(0, 6) + '...', tx.hash);
        
        // Clear inputs
        document.getElementById('transferTo').value = '';
        document.getElementById('transferAmount').value = '';
        
        // Update UI
        await updateUI();
        
    } catch (error) {
        console.error('Transfer error:', error);
        const transferStatus = document.getElementById('transferStatus');
        transferStatus.className = 'status error';
        transferStatus.textContent = '❌ Failed to transfer: ' + error.message;
    } finally {
        const transferBtn = document.getElementById('transferBtn');
        if (transferBtn) {
            transferBtn.disabled = false;
            transferBtn.textContent = 'Send Tokens';
        }
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
    
    // Remove "no transactions" message if it exists
    const noTransMsg = historyDiv.querySelector('p');
    if (noTransMsg) {
        historyDiv.innerHTML = '';
    }
    
    const transactionDiv = document.createElement('div');
    transactionDiv.className = 'status info';
    transactionDiv.style.marginBottom = '10px';
    transactionDiv.innerHTML = `
        <strong>${type}:</strong> ${description}<br>
        <small>Tx: ${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}</small>
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



