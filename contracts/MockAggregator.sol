// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

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

contract MockAggregator is AggregatorV3Interface {
    uint8 private constant _decimals = 8;
    string private constant _description = "Mock CELO/USD";
    uint256 private constant _version = 1;

    function decimals() external pure override returns (uint8) {
        return _decimals;
    }

    function description() external pure override returns (string memory) {
        return _description;
    }

    function version() external pure override returns (uint256) {
        return _version;
    }

    function latestRoundData() external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        // Dynamic price: 0.70950164 USD/CELO = 70950164 (with 8 decimals)
        return (18446744073709633380, 70950164, 1763659205, 1763659205, 18446744073709633380);
    }

    function getRoundData(uint80 _roundId) external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        // Dynamic price: 0.70950164 USD/CELO = 70950164 (with 8 decimals)
        return (18446744073709633380, 70950164, 1763659205, 1763659205, 18446744073709633380);
    }
}