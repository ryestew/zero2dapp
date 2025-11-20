require('dotenv').config();
import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.CELO_RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const tokenShopAddress = "0x560E90cB8E377c6CD14f299F503b72E33988162C";
  const buenoTokenAddress = "0x0b5dAf3Af94b52BDE1850e14255d9CC5877017E4";

  const tokenShop = await ethers.getContractAt("TokenShop", tokenShopAddress, signer);
  const buenoToken = await ethers.getContractAt("BuenoToken", buenoTokenAddress, signer);

  const balanceBefore = await buenoToken.balanceOf(signer.address);
  console.log("Token balance before buy:", ethers.formatEther(balanceBefore));

  const tx = await tokenShop.buy({ value: ethers.parseEther("0.01") });
  console.log("Buy tx hash:", tx.hash);
  await tx.wait();

  const balanceAfter = await buenoToken.balanceOf(signer.address);
  console.log("Token balance after buy:", ethers.formatEther(balanceAfter));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});