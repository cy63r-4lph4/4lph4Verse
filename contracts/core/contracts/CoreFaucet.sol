// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * CoreFaucetMeta — Faucet with EIP-712 signed claims (meta-tx style).
 * - Users sign a typed message off-chain: (to, nonce, deadline)
 * - Relayer submits claimWithSig(to, nonce, deadline, signature) and pays CELO gas
 * - Nonces and deadline prevent replay
 * - Keeps simple claim() for direct EOA calls (useful for dev)
 */
contract CoreFaucet is Ownable, EIP712 {
    using ECDSA for bytes32;

    IERC20 public core;
    uint256 public amountPerClaim;
    uint256 public cooldownSeconds;
    bool public paused;

    mapping(address => uint256) public lastClaimTimestamp;
    mapping(address => uint256) public nonces;

    // keccak256("Claim(address to,uint256 nonce,uint256 deadline)")
    bytes32 public constant CLAIM_TYPEHASH =
        keccak256("Claim(address to,uint256 nonce,uint256 deadline)");

    event Claimed(address indexed who, uint256 amount, uint256 timestamp);
    event AmountPerClaimUpdated(uint256 oldAmount, uint256 newAmount);
    event CooldownUpdated(uint256 oldSeconds, uint256 newSeconds);
    event PausedUpdated(bool oldPaused, bool newPaused);
    event Drain(address to, uint256 amount);

    constructor(
        IERC20 core_,
        uint256 amountPerClaim_,
        uint256 cooldownSeconds_
    ) EIP712("CoreFaucet", "1") {
        require(address(core_) != address(0), "zero token");
        core = core_;
        amountPerClaim = amountPerClaim_;
        cooldownSeconds = cooldownSeconds_;
        paused = false;
    }

    // ----------------------------
    // Direct claim (EOA)
    // ----------------------------
    function claim() external {
        require(!paused, "faucet paused");
        // simple EOA-only guard for direct claim
        require(tx.origin == msg.sender, "no contracts");
        require(
            block.timestamp >= lastClaimTimestamp[msg.sender] + cooldownSeconds,
            "cooldown"
        );
        uint256 balance = core.balanceOf(address(this));
        require(balance >= amountPerClaim, "faucet empty");

        lastClaimTimestamp[msg.sender] = block.timestamp;
        require(core.transfer(msg.sender, amountPerClaim), "transfer failed");
        emit Claimed(msg.sender, amountPerClaim, block.timestamp);
    }

    // ----------------------------
    // Meta-claim: relayer submits user-signed typed-data
    // ----------------------------
    // Anyone can call this (typically your relayer) but signature must be from `to`
    function claimWithSig(
        address to,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external {
        require(!paused, "faucet paused");
        require(block.timestamp <= deadline, "expired signature");
        require(nonce == nonces[to], "bad nonce");
        require(
            block.timestamp >= lastClaimTimestamp[to] + cooldownSeconds,
            "cooldown"
        );
        uint256 balance = core.balanceOf(address(this));
        require(balance >= amountPerClaim, "faucet empty");

        bytes32 structHash = keccak256(
            abi.encode(CLAIM_TYPEHASH, to, nonce, deadline)
        );
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(digest, signature);
        require(signer == to, "invalid signature");

        // consume nonce + update timestamp
        nonces[to] = nonces[to] + 1;
        lastClaimTimestamp[to] = block.timestamp;

        require(core.transfer(to, amountPerClaim), "transfer failed");
        emit Claimed(to, amountPerClaim, block.timestamp);
    }

    // ----------------------------
    // Owner controls
    // ----------------------------
    function setAmountPerClaim(uint256 newAmount) external onlyOwner {
        emit AmountPerClaimUpdated(amountPerClaim, newAmount);
        amountPerClaim = newAmount;
    }

    function setCooldownSeconds(uint256 newSeconds) external onlyOwner {
        emit CooldownUpdated(cooldownSeconds, newSeconds);
        cooldownSeconds = newSeconds;
    }

    function setPaused(bool newPaused) external onlyOwner {
        emit PausedUpdated(paused, newPaused);
        paused = newPaused;
    }

    function drain(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "zero");
        require(core.transfer(to, amount), "transfer failed");
        emit Drain(to, amount);
    }
}
