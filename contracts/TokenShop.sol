// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BuenoToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenShop is Ownable, ReentrancyGuard {
    BuenoToken public buenoToken;
    uint256 public exchangeRate;

    event Bought(address indexed buyer, uint256 celoAmount, uint256 tokenAmount);
    event ExchangeRateChanged(uint256 newRate);
    event Withdrawn(address indexed to, uint256 amount);
    event TokensSold(address indexed seller, uint256 btkAmount, uint256 celoAmount);

    constructor(address _buenoToken, uint256 _initialRate) Ownable(msg.sender) {
        buenoToken = BuenoToken(_buenoToken);
        exchangeRate = _initialRate;
    }

    function buy() external payable nonReentrant {
        require(msg.value > 0, "Must send CELO to buy tokens");
        uint256 tokenAmount = msg.value * exchangeRate;
        buenoToken.mint(msg.sender, tokenAmount);
        emit Bought(msg.sender, msg.value, tokenAmount);
    }

    function setExchangeRate(uint256 _rate) external onlyOwner {
        exchangeRate = _rate;
        emit ExchangeRateChanged(_rate);
    }

    function withdrawCELO(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner()).transfer(amount);
        emit Withdrawn(owner(), amount);
    }

    function sell(uint256 btkAmount) external {
        require(btkAmount > 0);
        uint256 celoAmount = btkAmount / exchangeRate;
        require(address(this).balance >= celoAmount, "Insufficient CELO balance");
        buenoToken.transferFrom(msg.sender, address(this), btkAmount);
        payable(msg.sender).transfer(celoAmount);
        emit TokensSold(msg.sender, btkAmount, celoAmount);
    }
}