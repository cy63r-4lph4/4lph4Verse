// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * VerseScoreAggregator (UUPS Upgradeable)
 *
 * - Read-only aggregator that computes a user's global Verse score.
 * - Pulls app list + weights + scoreModel from VerseAppRegistry.
 * - Calls each app's IScoreModel to get raw score; applies weightBps; sums.
 * - Returns both total score and a per-app breakdown for UIs/analytics.
 *
 * Notes:
 * - If an app is inactive, has zero weight, or no scoreModel, it contributes 0.
 * - This contract holds no mutable scoring state; only the registry address is configurable.
 */

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "@verse/contracts/interfaces/IVerseAppRegistry.sol";
import "@verse/contracts/interfaces/IScoreModel.sol";

contract VerseScoreAggregator is Initializable, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IVerseAppRegistry public registry;

    event RegistrySet(address registry);

    struct AppPart {
        bytes32 appId;
        uint256 rawScore;      // score from the app's model
        uint16  weightBps;     // weighting from registry
        uint256 weightedScore; // rawScore * weightBps / 10000
        bool    active;        // registry flag
        address scoreModel;    // model used (0 if none)
    }

    function initialize(address admin, address registry_) external initializer {
        require(admin != address(0) && registry_ != address(0), "bad init");
        __UUPSUpgradeable_init();
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        registry = IVerseAppRegistry(registry_);
        emit RegistrySet(registry_);
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    // Admin: swap to a new registry if governance updates it
    function setRegistry(address newRegistry) external onlyRole(ADMIN_ROLE) {
        require(newRegistry != address(0), "zero");
        registry = IVerseAppRegistry(newRegistry);
        emit RegistrySet(newRegistry);
    }

    // -------- Views --------

    /// @notice Returns total weighted score + per-app breakdown for a verseId
    function fullScore(uint256 verseId) external view returns (uint256 total, AppPart[] memory parts) {
        bytes32[] memory ids = registry.allAppIds();
        parts = new AppPart[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            IVerseAppRegistry.App memory app = registry.getApp(ids[i]);

            uint256 raw = 0;
            if (app.active && app.scoreModel != address(0) && app.weightBps > 0) {
                raw = IScoreModel(app.scoreModel).scoreOf(verseId);
            }
            uint256 weighted = (raw * app.weightBps) / 10_000;

            parts[i] = AppPart({
                appId: ids[i],
                rawScore: raw,
                weightBps: app.weightBps,
                weightedScore: weighted,
                active: app.active,
                scoreModel: app.scoreModel
            });

            total += weighted;
        }
    }

    /// @notice Convenience: just the summed global score
    function globalScore(uint256 verseId) external view returns (uint256 total) {
        bytes32[] memory ids = registry.allAppIds();
        for (uint256 i = 0; i < ids.length; i++) {
            IVerseAppRegistry.App memory app = registry.getApp(ids[i]);
            if (!(app.active && app.scoreModel != address(0) && app.weightBps > 0)) continue;
            uint256 raw = IScoreModel(app.scoreModel).scoreOf(verseId);
            total += (raw * app.weightBps) / 10_000;
        }
    }

    /// @notice Per-app score preview (raw + weighted) for one appId
    function appScore(bytes32 appId, uint256 verseId) external view returns (uint256 raw, uint256 weighted, uint16 weightBps, bool active, address scoreModel) {
        IVerseAppRegistry.App memory app = registry.getApp(appId);
        active = app.active;
        scoreModel = app.scoreModel;
        weightBps = app.weightBps;

        if (active && scoreModel != address(0) && weightBps > 0) {
            raw = IScoreModel(scoreModel).scoreOf(verseId);
            weighted = (raw * weightBps) / 10_000;
        } else {
            raw = 0;
            weighted = 0;
        }
    }

    // storage gap
    uint256[45] private __gap;
}
