require("@nomicfoundation/hardhat-ethers");
require('dotenv').config();

module.exports = {
  solidity: "0.8.27",
  networks: {
    celo: {
      url: process.env.CELO_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};