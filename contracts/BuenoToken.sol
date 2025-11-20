// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts@5.4.0/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@5.4.0/access/AccessControl.sol";
import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";

contract BuenoToken is ERC20, AccessControl, SelfVerificationRoot {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 public constant VERIFICATION_REWARD = 10000; // 100 tokens with 2 decimals
    mapping(uint256 => bool) public usedNullifiers; // Track used nullifiers (prevents same person verifying with different wallets)
    mapping(address => bool) public hasVerified; // Track verified addresses (for frontend checks)
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;

    constructor(
        address identityVerificationHub,
        string memory scopeSeed,
        SelfUtils.UnformattedVerificationConfigV2 memory _verificationConfig
    )
        ERC20("BuenoToken", "BTK")
        SelfVerificationRoot(identityVerificationHub, scopeSeed)
    {
    	_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    	_grantRole(MINTER_ROLE, msg.sender);
    	
    	// Set up verification config
    	verificationConfig = SelfUtils.formatVerificationConfigV2(_verificationConfig);
    	verificationConfigId = IIdentityVerificationHubV2(identityVerificationHub).setVerificationConfigV2(verificationConfig);
    }

	function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    	_mint(to, amount);
	}

	function decimals() public pure override returns (uint8) {
    	return 2;
	}
	
	/**
     * @notice Implementation of customVerificationHook from SelfVerificationRoot
     * @dev This function is called after successful verification
     * @param output The verification output from the hub
     * @param userData The user data passed through verification
     */
	function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        // Nullifier is derived from the identity document itself, not the wallet address.
        // This prevents the same person from verifying multiple times with different wallets.
        // The nullifier is unique per identity document verification and is designed specifically
        // to prevent double-spending/duplicate verifications.
        require(output.nullifier != 0, "Invalid nullifier");
        require(!usedNullifiers[output.nullifier], "Nullifier already used");
        require(output.userIdentifier != 0, "Invalid user identifier");
        
        // Get the user address from userIdentifier
        // As per Self Protocol docs: User's address can be derived from userIdentifier with address(uint160(output.userIdentifier))
        address verifiedUser = address(uint160(output.userIdentifier));
        require(verifiedUser != address(0), "Invalid user address");
        
        // Mark nullifier as used (prevents duplicate verifications for same identity document)
        usedNullifiers[output.nullifier] = true;
        
        // Also mark address as verified (for frontend checks)
        hasVerified[verifiedUser] = true;
        
        // Mint 100 tokens to the verified user (10000 = 100 tokens with 2 decimals)
        _mint(verifiedUser, VERIFICATION_REWARD);
    }
    
    /**
     * @notice Implementation of getConfigId from SelfVerificationRoot
     * @dev Returns the verification configuration ID for this contract
     * @return The verification configuration ID
     */
    function getConfigId(
        bytes32, /* destinationChainId */
        bytes32, /* userIdentifier */
        bytes memory /* userDefinedData */
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }
}
