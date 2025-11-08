// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CoreFaucet (Verse Ready)
 * @notice UUPS-upgradeable faucet for Alph4 CØRE.
 *  - EIP-712 signed claims for gasless faucet access
 *  - Cooldown & nonce tracking
 *  - Configurable claim amount & admin controls
 */
contract CoreFaucet is
    AccessControlUpgradeable,
    UUPSUpgradeable,
    EIP712Upgradeable
{
    using ECDSA for bytes32;

    IERC20 public core;
    uint256 public amountPerClaim;
    uint256 public cooldownSeconds;
    bool public paused;

    mapping(address => uint256) public lastClaimTimestamp;
    mapping(address => uint256) public nonces;

    bytes32 public constant CLAIM_TYPEHASH =
        keccak256("Claim(address to,uint256 nonce,uint256 deadline)");
    bytes32 public constant FAUCET_ADMIN_ROLE = keccak256("FAUCET_ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    event Claimed(address indexed who, uint256 amount, uint256 timestamp);
    event AmountPerClaimUpdated(uint256 oldAmount, uint256 newAmount);
    event CooldownUpdated(uint256 oldSeconds, uint256 newSeconds);
    event PausedUpdated(bool oldPaused, bool newPaused);
    event Drained(address to, uint256 amount);

    /// -----------------------------------------------------------------------
    /// Initializer (replaces constructor)
    /// -----------------------------------------------------------------------
    function initialize(
        address admin,
        address coreToken,
        uint256 amountPerClaim_,
        uint256 cooldownSeconds_
    ) external initializer {
        require(admin != address(0), "bad admin");
        require(coreToken != address(0), "bad token");

        __AccessControl_init();
        __UUPSUpgradeable_init();
        __EIP712_init("Alph4Verse Faucet", "1");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(FAUCET_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        core = IERC20(coreToken);
        amountPerClaim = amountPerClaim_;
        cooldownSeconds = cooldownSeconds_;
        paused = false;
    }

    /// -----------------------------------------------------------------------
    /// Public: direct claim (EOA)
    /// -----------------------------------------------------------------------
    function claim() external {
        require(!paused, "paused");
        require(tx.origin == msg.sender, "no contracts");
        require(
            block.timestamp >= lastClaimTimestamp[msg.sender] + cooldownSeconds,
            "cooldown"
        );
        _distribute(msg.sender);
    }

    /// -----------------------------------------------------------------------
    /// Public: meta claim (EIP-712)
    /// -----------------------------------------------------------------------
    function claimWithSig(
        address to,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external {
        require(!paused, "paused");
        require(block.timestamp <= deadline, "expired");
        require(nonce == nonces[to], "bad nonce");
        require(
            block.timestamp >= lastClaimTimestamp[to] + cooldownSeconds,
            "cooldown"
        );

        bytes32 structHash = keccak256(
            abi.encode(CLAIM_TYPEHASH, to, nonce, deadline)
        );
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);
        require(signer == to, "invalid sig");

        nonces[to] = nonce + 1;
        _distribute(to);
    }

    /// -----------------------------------------------------------------------
    /// Internal: shared distribution logic
    /// -----------------------------------------------------------------------
    function _distribute(address to) internal {
        uint256 balance = core.balanceOf(address(this));
        require(balance >= amountPerClaim, "empty");
        lastClaimTimestamp[to] = block.timestamp;
        require(core.transfer(to, amountPerClaim), "transfer failed");
        emit Claimed(to, amountPerClaim, block.timestamp);
    }

    /// -----------------------------------------------------------------------
    /// Admin Controls
    /// -----------------------------------------------------------------------
    function setAmountPerClaim(
        uint256 newAmount
    ) external onlyRole(FAUCET_ADMIN_ROLE) {
        emit AmountPerClaimUpdated(amountPerClaim, newAmount);
        amountPerClaim = newAmount;
    }

    function setCooldownSeconds(
        uint256 newSeconds
    ) external onlyRole(FAUCET_ADMIN_ROLE) {
        emit CooldownUpdated(cooldownSeconds, newSeconds);
        cooldownSeconds = newSeconds;
    }

    function setPaused(bool newPaused) external onlyRole(FAUCET_ADMIN_ROLE) {
        emit PausedUpdated(paused, newPaused);
        paused = newPaused;
    }

    function drain(
        address to,
        uint256 amount
    ) external onlyRole(FAUCET_ADMIN_ROLE) {
        require(to != address(0), "zero");
        require(core.transfer(to, amount), "transfer failed");
        emit Drained(to, amount);
    }

    /// -----------------------------------------------------------------------
    /// Upgrade Auth
    /// -----------------------------------------------------------------------
    function _authorizeUpgrade(
        address
    ) internal override onlyRole(UPGRADER_ROLE) {}
}
