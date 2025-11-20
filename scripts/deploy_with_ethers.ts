require('dotenv').config();
import { ethers } from "hardhat";

async function main() {
  const BuenoToken = await ethers.getContractFactory("BuenoToken");
  const token = await BuenoToken.deploy();
  console.log("BuenoToken deployed to:", token.target);

  const TokenShop = await ethers.getContractFactory("TokenShop");
  const shop = await TokenShop.deploy(token.target, 100);
  console.log("TokenShop deployed to:", shop.target);

  await token.grantRole(await token.MINTER_ROLE(), shop.target);
  console.log("MINTER_ROLE granted to TokenShop");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});