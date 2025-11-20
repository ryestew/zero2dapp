// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./RobinHood.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId) external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

contract TokenShop is Ownable, ReentrancyGuard {
    RobinHood public token;
    AggregatorV3Interface public priceFeed;

    event Bought(address indexed buyer, uint256 celoAmount, uint256 tokenAmount);
    event PriceFetched(uint256 price);
    event Withdrawn(address indexed to, uint256 amount);
    event TokensSold(address indexed seller, uint256 btkAmount, uint256 celoAmount);

    constructor(address _RobinHood, address _priceFeed) Ownable(msg.sender) {
        token = RobinHood(_RobinHood);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function buy() external payable nonReentrant {
        require(msg.value > 0, "Must send CELO to buy tokens");
        (
            uint80 roundID,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        require(answer > 0, "Invalid price");
        require(block.timestamp - updatedAt < 3600, "Price is stale");
        uint8 decimals = priceFeed.decimals();
        uint256 exchangeRate = (uint256(answer) * 100 * 10**18) / (10 ** decimals);
        uint256 tokenAmount = (msg.value * exchangeRate) / 10**18;
        token.mint(msg.sender, tokenAmount);
        emit PriceFetched(uint256(answer));
        emit Bought(msg.sender, msg.value, tokenAmount);
    }

    function withdrawCELO(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner()).transfer(amount);
        emit Withdrawn(owner(), amount);
    }

    function sell(uint256 btkAmount) external {
        require(btkAmount > 0);
        (
            uint80 roundID,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        require(answer > 0, "Invalid price");
        require(block.timestamp - updatedAt < 3600, "Price is stale");
        uint8 decimals = priceFeed.decimals();
        uint256 exchangeRate = (uint256(answer) * 100 * 10**18) / (10 ** decimals);
        uint256 celoAmount = (btkAmount * 10**18) / exchangeRate;
        require(address(this).balance >= celoAmount, "Insufficient CELO balance");
        token.transferFrom(msg.sender, address(this), btkAmount);
        payable(msg.sender).transfer(celoAmount);
        emit PriceFetched(uint256(answer));
        emit TokensSold(msg.sender, btkAmount, celoAmount);
    }
}