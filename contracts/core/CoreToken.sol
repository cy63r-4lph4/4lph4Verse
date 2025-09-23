// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CoreToken (CØRE)
 * @notice ERC20 with:
 *  - owner mint / burn
 *  - transfer fee (bps) that goes to treasury or is burned
 *  - fee exemption list
 *  - adjustable treasury address
 */
contract CoreToken is ERC20, Ownable {
    uint256 public feeBps; // e.g. 50 = 0.5%
    address public treasury;
    bool public feeBurns;

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
        uint256 feeBps_,
        bool feeBurns_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        require(treasury_ != address(0), "treasury required");
        _mint(msg.sender, initialSupply_);
        treasury = treasury_;
        feeBps = feeBps_;
        feeBurns = feeBurns_;
        isFeeExempt[msg.sender] = true;
        isFeeExempt[treasury_] = true;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    function setFeeBps(uint256 newBps) external onlyOwner {
        require(newBps <= 2000, "fee too high"); // max 20%
        emit FeeBpsUpdated(feeBps, newBps);
        feeBps = newBps;
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "zero address");
        emit TreasuryUpdated(treasury, newTreasury);
        treasury = newTreasury;
    }

    function setFeeBurnMode(bool newMode) external onlyOwner {
        emit FeeBurnModeUpdated(feeBurns, newMode);
        feeBurns = newMode;
    }

    function setFeeExempt(address account, bool exempt) external onlyOwner {
        isFeeExempt[account] = exempt;
        emit FeeExemptUpdated(account, exempt);
    }

    /**
     * @dev Override OZ v5 _update which is called by mint, burn, and transfers.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        // Minting (from == 0) or Burning (to == 0) => no fee
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }

        // Normal transfer with potential fee
        if (feeBps == 0 || isFeeExempt[from] || isFeeExempt[to]) {
            super._update(from, to, value);
            return;
        }

        uint256 fee = (value * feeBps) / 10000;
        uint256 afterFee = value - fee;

        if (feeBurns) {
            // burn fee directly
            super._update(from, address(0), fee);
            super._update(from, to, afterFee);
        } else {
            super._update(from, treasury, fee);
            super._update(from, to, afterFee);
        }
    }
}