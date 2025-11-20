import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  // Deploy RobinHood
  const RobinHood = await ethers.getContractFactory("RobinHood");
  const RobinHood = await RobinHood.deploy();
  await RobinHood.waitForDeployment();
  const RobinHoodAddress = await RobinHood.getAddress();
  console.log("RobinHood deployed at:", RobinHoodAddress);

  // Deploy MockAggregator
  const MockAggregator = await ethers.getContractFactory("MockAggregator");
  const mockAggregator = await MockAggregator.deploy();
  await mockAggregator.waitForDeployment();
  const mockAggregatorAddress = await mockAggregator.getAddress();
  console.log("MockAggregator deployed at:", mockAggregatorAddress);

  // Deploy TokenShop
  const TokenShop = await ethers.getContractFactory("TokenShop");
  const tokenShop = await TokenShop.deploy(RobinHoodAddress, mockAggregatorAddress);
  await tokenShop.waitForDeployment();
  const tokenShopAddress = await tokenShop.getAddress();
  console.log("TokenShop deployed at:", tokenShopAddress);

  // Grant MINTER_ROLE to TokenShop
  const minterRole = await RobinHood.MINTER_ROLE();
  await RobinHood.grantRole(minterRole, tokenShopAddress);
  console.log("Granted MINTER_ROLE to TokenShop");

  // Buy some tokens first
  console.log("Buying tokens...");
  const buyTx = await tokenShop.connect(signer).buy({ value: ethers.parseEther("0.02") });
  console.log("Buy tx hash:", buyTx.hash);
  await buyTx.wait();

  const tokenBalance = await RobinHood.balanceOf(signer.address);
  console.log("Token balance after buy:", ethers.formatEther(tokenBalance));

  const halfAmount = tokenBalance / 2n;
  console.log("Selling half:", ethers.formatEther(halfAmount));

  // Approve TokenShop to spend half
  const approveTx = await RobinHood.connect(signer).approve(tokenShopAddress, halfAmount);
  console.log("Approve tx hash:", approveTx.hash);
  await approveTx.wait();
  console.log("Approved TokenShop to spend tokens");

  const celoBalanceBefore = await ethers.provider.getBalance(signer.address);
  console.log("CELO balance before sell:", ethers.formatEther(celoBalanceBefore));

  const tokenBalanceBefore = await RobinHood.balanceOf(signer.address);
  console.log("Token balance before sell:", ethers.formatEther(tokenBalanceBefore));

  // Sell half
  const sellTx = await tokenShop.connect(signer).sell(halfAmount);
  console.log("Sell tx hash:", sellTx.hash);
  await sellTx.wait();

  const celoBalanceAfter = await ethers.provider.getBalance(signer.address);
  console.log("CELO balance after sell:", ethers.formatEther(celoBalanceAfter));

  const tokenBalanceAfter = await RobinHood.balanceOf(signer.address);
  console.log("Token balance after sell:", ethers.formatEther(tokenBalanceAfter));

  console.log("Sell test passed: CELO increased by", ethers.formatEther(celoBalanceAfter - celoBalanceBefore), "tokens decreased by", ethers.formatEther(tokenBalanceBefore - tokenBalanceAfter));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});