require('dotenv').config();
import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const RobinHood = await ethers.getContractFactory("RobinHood");
  const token = await RobinHood.deploy();
  console.log("RobinHood deployed to:", token.target);

  const TokenShop = await ethers.getContractFactory("TokenShop");
  const shop = await TokenShop.deploy(token.target, "0x2f6d6cB9e01d63e1a1873BACc5BfD4e7d4e461d1");
  console.log("TokenShop deployed to:", shop.target);

  await token.grantRole(await token.MINTER_ROLE(), shop.target);
  console.log("MINTER_ROLE granted to TokenShop");

  const deploymentDetails = {
    RobinHood: token.target,
    TokenShop: shop.target,
    network: "celo",
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync("latest.json", JSON.stringify(deploymentDetails, null, 2));
  console.log("Deployment details saved to latest.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});