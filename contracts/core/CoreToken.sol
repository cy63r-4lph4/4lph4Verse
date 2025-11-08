// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CoreToken (CØRE)
 * @notice ERC20 with:
 *  - UUPS upgradeability
 *  - EIP-2612 permit approvals (gasless)
 *  - role-based mint/burn
 *  - transfer fee (bps) routed to treasury or burned
 *  - fee exemption list
 *  - adjustable treasury + fee mode
 *  - pausability for emergency controls
 *
 * Designed to be the native token of the 4lph4Verse.
 */

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

contract CoreToken is
    Initializable,
    ERC20Upgradeable,
    ERC20PermitUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    // -------------------- Roles --------------------

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // -------------------- Fee State --------------------

    /// @notice Transfer fee in basis points (e.g. 50 = 0.5%).
    uint256 public feeBps;

    /// @notice Treasury address that receives fees (when not burning).
    address public treasury;

    /// @notice If true, fees are burned instead of sent to treasury.
    bool public feeBurns;

    /// @notice Accounts that are exempt from paying (or receiving) fees.
    mapping(address => bool) public isFeeExempt;

    // -------------------- Events --------------------

    event FeeBpsUpdated(uint256 oldBps, uint256 newBps);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    event FeeExemptUpdated(address account, bool exempt);
    event FeeBurnModeUpdated(bool oldMode, bool newMode);
    event FeeTaken(
        address indexed from,
        address indexed to,
        uint256 fee,
        bool burned
    );

    // -------------------- Initializer / Constructor --------------------

    /// @dev Disable initializers on the implementation contract.
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initialize the CØRE token behind a UUPS proxy.
     * @param admin          Address that receives DEFAULT_ADMIN_ROLE and all core roles.
     * @param treasury_      Initial treasury address for fee collection.
     * @param initialSupply_ Initial supply (18 decimals) minted to admin.
     * @param feeBps_        Initial fee in basis points (max 20% i.e. 2000 bps).
     * @param feeBurns_      If true, fee is burned instead of going to treasury.
     */
    function initialize(
        address admin,
        address treasury_,
        uint256 initialSupply_,
        uint256 feeBps_,
        bool feeBurns_
    ) external initializer {
        require(admin != address(0), "CoreToken: bad admin");
        require(treasury_ != address(0), "CoreToken: treasury required");
        require(feeBps_ <= 2000, "CoreToken: fee too high"); // max 20%

        // Name + symbol define the EIP-712 domain for permit()
        __ERC20_init(unicode"Alph4 CØRE", unicode"CØRE");
        __ERC20Permit_init(unicode"Alph4 CØRE");

        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        // Roles
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(FEE_MANAGER_ROLE, admin);
        _grantRole(TREASURY_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        // Fee config
        feeBps = feeBps_;
        treasury = treasury_;
        feeBurns = feeBurns_;

        // Exempt admin + treasury from fees by default
        isFeeExempt[admin] = true;
        isFeeExempt[treasury_] = true;

        // Initial mint
        if (initialSupply_ > 0) {
            _mint(admin, initialSupply_);
        }
    }

    // -------------------- Public / User functions --------------------

    /**
     * @notice Burn tokens from caller's balance.
     */
    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }

    // -------------------- Admin: Mint / Burn --------------------

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /**
     * @notice Burn tokens from an arbitrary address (e.g. treasury ops).
     * @dev Restricted to MINTER_ROLE to mirror privileged mint/burn rights.
     */
    function burnFrom(
        address from,
        uint256 amount
    ) external onlyRole(MINTER_ROLE) {
        _burn(from, amount);
    }

    // -------------------- Admin: Fees & Treasury --------------------

    function setFeeBps(uint256 newBps) external onlyRole(FEE_MANAGER_ROLE) {
        require(newBps <= 2000, "CoreToken: fee too high"); // max 20%
        emit FeeBpsUpdated(feeBps, newBps);
        feeBps = newBps;
    }

    function setTreasury(address newTreasury) external onlyRole(TREASURY_ROLE) {
        require(newTreasury != address(0), "CoreToken: zero treasury");
        emit TreasuryUpdated(treasury, newTreasury);
        treasury = newTreasury;
    }

    function setFeeBurnMode(bool newMode) external onlyRole(FEE_MANAGER_ROLE) {
        emit FeeBurnModeUpdated(feeBurns, newMode);
        feeBurns = newMode;
    }

    function setFeeExempt(
        address account,
        bool exempt
    ) external onlyRole(FEE_MANAGER_ROLE) {
        isFeeExempt[account] = exempt;
        emit FeeExemptUpdated(account, exempt);
    }

    // -------------------- Pause controls --------------------

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // -------------------- Core transfer logic (with fee) --------------------

    /**
     * @dev Internal transfer hook with fee logic + pause enforcement.
     *      Uses ERC20's new _update(...) pattern.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20Upgradeable) {
        // When paused, block all transfers except mints/burns if you wish.
        require(!paused(), "CoreToken: token transfer while paused");

        // Mint or burn (from or to zero): no fee.
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }

        // No fee applied if feeBps is 0 or either side is exempt.
        if (feeBps == 0 || isFeeExempt[from] || isFeeExempt[to]) {
            super._update(from, to, value);
            return;
        }

        uint256 fee = (value * feeBps) / 10_000;
        uint256 afterFee = value - fee;

        if (fee > 0) {
            if (feeBurns) {
                // Burn the fee
                super._update(from, address(0), fee);
                emit FeeTaken(from, address(0), fee, true);
            } else {
                // Send fee to treasury
                super._update(from, treasury, fee);
                emit FeeTaken(from, treasury, fee, false);
            }
        }

        // Transfer the remainder to the recipient
        super._update(from, to, afterFee);
    }

    // -------------------- UUPS upgrade auth --------------------

    function _authorizeUpgrade(
        address
    ) internal override onlyRole(UPGRADER_ROLE) {}

    // -------------------- ERC165 / AccessControl --------------------

    function supportsInterface(
        bytes4 iid
    ) public view override(AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(iid);
    }

    // -------------------- Storage gap --------------------
    uint256[44] private __gap;
}
