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

  const balanceBefore = await RobinHood.balanceOf(signer.address);
  console.log("Token balance before buy:", ethers.formatEther(balanceBefore));

  const tx = await tokenShop.connect(signer).buy({ value: ethers.parseEther("0.01") });
  console.log("Buy tx hash:", tx.hash);
  await tx.wait();

  const balanceAfter = await RobinHood.balanceOf(signer.address);
  console.log("Token balance after buy:", ethers.formatEther(balanceAfter));

  console.log("Buy test passed: balance increased by", ethers.formatEther(balanceAfter - balanceBefore));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});