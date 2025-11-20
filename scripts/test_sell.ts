require('dotenv').config();
import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.CELO_RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const tokenShopAddress = "0x560E90cB8E377c6CD14f299F503b72E33988162C";
  const buenoTokenAddress = "0x0b5dAf3Af94b52BDE1850e14255d9CC5877017E4";

  const tokenShop = await ethers.getContractAt("TokenShop", tokenShopAddress, signer);
  const buenoToken = await ethers.getContractAt("BuenoToken", buenoTokenAddress, signer);

  // Buy some tokens first
  console.log("Buying tokens...");
  const buyTx = await tokenShop.buy({ value: ethers.parseEther("0.02") });
  console.log("Buy tx hash:", buyTx.hash);
  await buyTx.wait();

  const tokenBalance = await buenoToken.balanceOf(signer.address);
  console.log("Token balance after buy:", ethers.formatEther(tokenBalance));

  const halfAmount = tokenBalance / 2n;
  console.log("Selling half:", ethers.formatEther(halfAmount));

  // Approve TokenShop to spend half
  const approveTx = await buenoToken.approve(tokenShopAddress, halfAmount);
  console.log("Approve tx hash:", approveTx.hash);
  await approveTx.wait();
  console.log("Approved TokenShop to spend tokens");

  const celoBalanceBefore = await provider.getBalance(signer.address);
  console.log("CELO balance before sell:", ethers.formatEther(celoBalanceBefore));

  const tokenBalanceBefore = await buenoToken.balanceOf(signer.address);
  console.log("Token balance before sell:", ethers.formatEther(tokenBalanceBefore));

  // Sell half
  const sellTx = await tokenShop.sell(halfAmount);
  console.log("Sell tx hash:", sellTx.hash);
  await sellTx.wait();

  const celoBalanceAfter = await provider.getBalance(signer.address);
  console.log("CELO balance after sell:", ethers.formatEther(celoBalanceAfter));

  const tokenBalanceAfter = await buenoToken.balanceOf(signer.address);
  console.log("Token balance after sell:", ethers.formatEther(tokenBalanceAfter));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});