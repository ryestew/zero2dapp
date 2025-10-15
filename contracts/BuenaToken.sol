// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts@5.4.0/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts@5.4.0/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts@5.4.0/access/Ownable.sol";

contract MyToken is ERC20, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("BuenaToken", "BTK")
        Ownable(initialOwner)
        ERC20Permit("BuenaToken")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
