import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const LocalCrowdsaleModule = buildModule('LocalCrowdsaleModule', (m) => {
  const owner = m.getAccount(0);
  
  // Deploy mock price feed for localhost (no constructor args)
  const mockPriceFeed = m.contract('MockAggregatorV3');
  
  // Set price data: $2000 per ETH (with 8 decimals: 2000 * 10^8 = 200000000000)
  m.call(mockPriceFeed, 'setLatestRoundData', [
    1, // roundId
    BigInt(200000000000), // answer: $2000 per ETH
    Math.floor(Date.now() / 1000), // startedAt
    Math.floor(Date.now() / 1000), // updatedAt
    1, // answeredInRound
  ]);
  
  // Deploy token
  const token = m.contract('ExampleToken', [
    'ExampleToken',
    'ET',
    BigInt(5000_000000000000000000),
    owner,
  ]);

  const duration = 60 * 60 * 24 * 365;
  const timestamp = Date.now();
  const vestingWallet = m.contract('ExampleVestingWallet', [
    owner,
    timestamp,
    duration,
  ]);

  const vestingvault = m.contract('ExampleVestingVault', [token]);

  const daysToAdd = 30;
  const resultDate = new Date(timestamp + daysToAdd * 24 * 60 * 60 * 1000);

  // Use mock price feed for localhost
  const crowdsale = m.contract('ExampleCrowdSale', [
    mockPriceFeed,
    token,
    owner,
    250, // 250 tokens per USD
    resultDate.getTime(),
    vestingvault,
  ]);
  
  return { mockPriceFeed, token, vestingWallet, vestingvault, crowdsale };
});

export default LocalCrowdsaleModule;
