// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * VerseReputationHub (UUPS Upgradeable)
 *
 * - Central hub for reputation across all 4lph4Verse apps.
 * - Apps don’t need to pass their appId; hub auto-detects via VerseAppRegistry.
 * - Only registered app.writer contracts can write.
 * - Tracks per-app and per-token activity for each Verse profile.
 * - Delegates scoring logic to pluggable score models per app.
 */

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "@verse/contracts/interfaces/IVerseAppRegistry.sol";

contract VerseReputationHub is Initializable, UUPSUpgradeable, AccessControlUpgradeable {
    // ---------- Roles ----------
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // ---------- Types ----------
    struct Activity {
        uint64 completedCount;
        uint64 cancelledCount;
        mapping(address => uint256) tokenEarned; // token => amount earned
    }

    // ---------- Storage ----------
    IVerseAppRegistry public appRegistry;

    // verseId => appId => Activity
    mapping(uint256 => mapping(bytes32 => Activity)) private activities;

    // ---------- Events ----------
    event ActivityLogged(
        uint256 indexed verseId,
        bytes32 indexed appId,
        string action,          // "completed", "cancelled", "earned"
        uint256 amount,
        address token
    );

    event RegistrySet(address registry);

    // ---------- Init ----------
    function initialize(address admin, address appRegistry_) external initializer {
        require(admin != address(0), "bad admin");
        require(appRegistry_ != address(0), "bad registry");

        __UUPSUpgradeable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        appRegistry = IVerseAppRegistry(appRegistry_);
        emit RegistrySet(appRegistry_);
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    // ---------- Internals ----------
    /// @notice Find the appId that matches msg.sender as writer
    function _resolveAppId() internal view returns (bytes32 appId) {
        bytes32[] memory ids = appRegistry.allAppIds();
        for (uint256 i = 0; i < ids.length; i++) {
            IVerseAppRegistry.App memory app = appRegistry.getApp(ids[i]);
            if (app.active && app.writer == msg.sender) {
                return ids[i];
            }
        }
        revert("caller not registered writer");
    }

    // ---------- Core: Write ----------
    function logCompleted(uint256 verseId, address token, uint256 amount) external {
        bytes32 appId = _resolveAppId();
        Activity storage a = activities[verseId][appId];
        a.completedCount += 1;
        if (token != address(0) && amount > 0) {
            a.tokenEarned[token] += amount;
        }
        emit ActivityLogged(verseId, appId, "completed", amount, token);
    }

    function logCancelled(uint256 verseId) external {
        bytes32 appId = _resolveAppId();
        Activity storage a = activities[verseId][appId];
        a.cancelledCount += 1;
        emit ActivityLogged(verseId, appId, "cancelled", 0, address(0));
    }

    // ---------- Views ----------
    function getActivity(uint256 verseId, bytes32 appId, address token)
        external view
        returns (uint64 completed, uint64 cancelled, uint256 earned)
    {
        Activity storage a = activities[verseId][appId];
        return (a.completedCount, a.cancelledCount, a.tokenEarned[token]);
    }

    function getRawCounts(uint256 verseId, bytes32 appId)
        external view
        returns (uint64 completed, uint64 cancelled)
    {
        Activity storage a = activities[verseId][appId];
        return (a.completedCount, a.cancelledCount);
    }

    // ---------- Admin ----------
    function setAppRegistry(address newRegistry) external onlyRole(ADMIN_ROLE) {
        require(newRegistry != address(0), "zero");
        appRegistry = IVerseAppRegistry(newRegistry);
        emit RegistrySet(newRegistry);
    }

    // ---------- Storage gap ----------
    uint256[45] private __gap;
}
