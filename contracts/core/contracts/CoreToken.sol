// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CoreToken (CØRE)
 * @notice ERC20 with:
 *  - owner mint / burn
 *  - transfer fee (basis points) that goes to treasury or is burned
 *  - fee exemption list
 *  - adjustable treasury address
 *  - designed for testnet deployment first (Celo Alfajores)
 */
contract CoreToken is ERC20, Ownable {
    // fee is in basis points (bps). 10000 bps = 100%. Example: 50 bps = 0.5%
    uint256 public feeBps;
    address public treasury;
    bool public feeBurns; // if true, fee is burned; else fee sent to treasury

    mapping(address => bool) public isFeeExempt;

    event FeeBpsUpdated(uint256 oldBps, uint256 newBps);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    event FeeExemptUpdated(address account, bool exempt);
    event FeeBurnModeUpdated(bool oldMode, bool newMode);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        address treasury_,
        uint256 feeBps_, // e.g., 50 = 0.5%
        bool feeBurns_
    ) ERC20(name_, symbol_) {
        require(treasury_ != address(0), "treasury required");
        _mint(msg.sender, initialSupply_);
        treasury = treasury_;
        feeBps = feeBps_;
        feeBurns = feeBurns_;
        // owner and treasury exempt by default
        isFeeExempt[msg.sender] = true;
        isFeeExempt[treasury] = true;
    }

    // owner-only mint (treasury-controlled flows can call via multisig later)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // owner-only burn
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    // configure fee (bps)
    function setFeeBps(uint256 newBps) external onlyOwner {
        require(newBps <= 2000, "fee too high"); // guard: max 20%
        emit FeeBpsUpdated(feeBps, newBps);
        feeBps = newBps;
    }

    // configure treasury
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "zero address");
        emit TreasuryUpdated(treasury, newTreasury);
        treasury = newTreasury;
    }

    // enable/disable burning of fee
    function setFeeBurnMode(bool newMode) external onlyOwner {
        emit FeeBurnModeUpdated(feeBurns, newMode);
        feeBurns = newMode;
    }

    // fee exemption (for contracts, trusted addresses)
    function setFeeExempt(address account, bool exempt) external onlyOwner {
        isFeeExempt[account] = exempt;
        emit FeeExemptUpdated(account, exempt);
    }

    // override transfer behavior to take fee when applicable
    function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
        if (feeBps == 0 || isFeeExempt[sender] || isFeeExempt[recipient]) {
            super._transfer(sender, recipient, amount);
            return;
        }

        uint256 fee = (amount * feeBps) / 10000;
        uint256 after = amount - fee;
        // If feeBurns, burn from sender (reduces total supply), else send to treasury
        if (feeBurns) {
            // burn fee from sender, then transfer remainder
            // ensure sender has enough balance (ERC20 does this already)
            // burn uses internal _burn which reduces sender balance and totalSupply
            _burn(sender, fee);
            super._transfer(sender, recipient, after);
        } else {
            // transfer fee to treasury, remainder to recipient
            super._transfer(sender, treasury, fee);
            super._transfer(sender, recipient, after);
        }
    }
}
