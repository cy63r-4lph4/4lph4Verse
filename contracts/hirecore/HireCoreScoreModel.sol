// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * HireCoreScoreModel
 *
 * - Implements IScoreModel for HireCore jobs.
 * - Reads completed/cancelled activity from VerseReputationHub.
 * - Computes a raw score = completed * COMPLETED_WEIGHT - cancelled * CANCELLED_PENALTY
 * - Future-proof: weights are configurable by ADMIN_ROLE.
 *
 * Example scoring:
 * - Each completed job = +100 points
 * - Each cancelled job = -50 points
 * - Earned tokens can also be included later as multipliers.
 */

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

interface IReputationHub {
    function getRawCounts(uint256 verseId, bytes32 appId)
        external
        view
        returns (uint64 completed, uint64 cancelled);
}

interface IScoreModel {
    function scoreOf(uint256 verseId) external view returns (uint256);
}

contract HireCoreScoreModel is Initializable, UUPSUpgradeable, AccessControlUpgradeable, IScoreModel {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IReputationHub public hub;
    bytes32 public constant APP_ID = keccak256("HireCore");

    // scoring parameters
    uint256 public completedWeight;
    uint256 public cancelledPenalty;

    event HubSet(address hub);
    event WeightsUpdated(uint256 completedWeight, uint256 cancelledPenalty);

    function initialize(address admin, address hub_) external initializer {
        require(admin != address(0) && hub_ != address(0), "bad init");
        __UUPSUpgradeable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        hub = IReputationHub(hub_);
        completedWeight = 100;   // default: +100 points per completed
        cancelledPenalty = 50;   // default: -50 points per cancelled

        emit HubSet(hub_);
        emit WeightsUpdated(completedWeight, cancelledPenalty);
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    // --- Admin controls ---
    function setHub(address hub_) external onlyRole(ADMIN_ROLE) {
        require(hub_ != address(0), "zero");
        hub = IReputationHub(hub_);
        emit HubSet(hub_);
    }

    function setWeights(uint256 completedWeight_, uint256 cancelledPenalty_)
        external
        onlyRole(ADMIN_ROLE)
    {
        completedWeight = completedWeight_;
        cancelledPenalty = cancelledPenalty_;
        emit WeightsUpdated(completedWeight_, cancelledPenalty_);
    }

    // --- Score calculation ---
    function scoreOf(uint256 verseId) external view override returns (uint256) {
        (uint64 completed, uint64 cancelled) = hub.getRawCounts(verseId, APP_ID);

        // safe math: cancellation penalty cannot underflow
        uint256 score = (completed * completedWeight);
        uint256 penalty = (cancelled * cancelledPenalty);

        if (penalty >= score) {
            return 0; // floor at zero
        }
        return score - penalty;
    }

    // storage gap for upgrades
    uint256[45] private __gap;
}
