import { ethers } from "hardhat";

async function main() {
  // Deploy MockAggregator
  const MockAggregator = await ethers.getContractFactory("MockAggregator");
  const mockAggregator = await MockAggregator.deploy();
  await mockAggregator.waitForDeployment();
  const mockAggregatorAddress = await mockAggregator.getAddress();
  console.log("MockAggregator deployed at:", mockAggregatorAddress);

  // Get latest round data
  const latestRoundData = await mockAggregator.latestRoundData();
  console.log("Latest round data:", latestRoundData);

  const decimals = await mockAggregator.decimals();
  console.log("Decimals:", decimals);

  const price = Number(latestRoundData[1]) / (10 ** Number(decimals));
  console.log("Price (USD/CELO):", price);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});